import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    if (id) {
      try {
        const [user] = await pool.query(
          "SELECT * FROM user WHERE user_id = ?",
          [id]
        );
        if (user.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        let additionalInfo;
        switch (user[0].role) {
          case "manager":
            [additionalInfo] = await pool.query(
              "SELECT * FROM manager WHERE user_id = ?",
              [id]
            );
            break;
          case "customer_service":
            [additionalInfo] = await pool.query(
              "SELECT * FROM clientserviceagent WHERE user_id = ?",
              [id]
            );
            break;
          case "client":
            [additionalInfo] = await pool.query(
              "SELECT * FROM client WHERE user_id = ?",
              [id]
            );
            break;
        }
        res.status(200).json({ ...user[0], additionalInfo: additionalInfo[0] });
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      try {
        const [users] = await pool.query("SELECT * FROM user");
        res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  } else if (req.method === "DELETE") {
    try {
      await pool.query("START TRANSACTION");
      await pool.query(
        "DELETE FROM feedback WHERE client_id = (SELECT client_id FROM client WHERE user_id = ?)",
        [id]
      );
      await pool.query(
        "DELETE FROM client_packages WHERE client_id = (SELECT client_id FROM client WHERE user_id = ?)",
        [id]
      );
      await pool.query(
        "DELETE FROM bills WHERE client_id = (SELECT client_id FROM client WHERE user_id = ?)",
        [id]
      );
      await pool.query("DELETE FROM client WHERE user_id = ?", [id]);

      await pool.query("DELETE FROM user WHERE user_id = ?", [id]);

      await pool.query("COMMIT");
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    const { email, phonenumber, password, role, additionalInfo } = req.body;

    try {
      await pool.query(
        "UPDATE user SET email = ?, phonenumber = ?, password = ?, role = ? WHERE user_id = ?",
        [email, phonenumber, password, role, id]
      );
      switch (role) {
        case "manager":
          await pool.query(
            "UPDATE manager SET name = ?, lastname = ?, birthday = ? WHERE user_id = ?",
            [
              additionalInfo.name,
              additionalInfo.lastname,
              additionalInfo.birthday,
              id,
            ]
          );
          break;
        case "customer_service":
          await pool.query(
            "UPDATE clientserviceagent SET name = ?, lastname = ?, birthday = ? WHERE user_id = ?",
            [
              additionalInfo.name,
              additionalInfo.lastname,
              additionalInfo.birthday,
              id,
            ]
          );
          break;
        case "client":
          await pool.query(
            "UPDATE client SET name = ?, lastname = ?, birthday = ?, birthplace = ?, gender = ?, personalNr = ?, balance = ?, balanceCoins = ?, min = ?, sms = ?, internet = ? WHERE user_id = ?",
            [
              additionalInfo.name,
              additionalInfo.lastname,
              additionalInfo.birthday,
              additionalInfo.birthplace,
              additionalInfo.gender,
              additionalInfo.personalNr,
              additionalInfo.balance,
              additionalInfo.balanceCoins,
              additionalInfo.min,
              additionalInfo.sms,
              additionalInfo.internet,
              id,
            ]
          );
          break;
      }
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
