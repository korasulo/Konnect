import pool from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emailOrPhone, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM user WHERE (email = ? OR phonenumber = ?) AND password = ?",
      [emailOrPhone, emailOrPhone, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    if (user.role === "client") {
      const [clientRows] = await pool.query(
        "SELECT client_id FROM client WHERE user_id = ?",
        [user.user_id]
      );

      if (clientRows.length > 0) {
        user.client_id = clientRows[0].client_id;
      }
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error in login API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
