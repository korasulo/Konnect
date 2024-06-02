import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/ManageClients.module.css';

const ManageClients = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phonenumber: '', password: '', role: 'client', additionalInfo: {} });
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [addClientFormData, setAddClientFormData] = useState({ name: '', email: '', phonenumber: '', password: '', role: 'client', additionalInfo: {} });
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  useEffect(() => {
    const fetchClients = async () => {
      const res = await fetch('/api/users?role=client');
      const data = await res.json();
      setClients(data);
    };

    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (res.status === 200) {
      setClients(clients.filter((client) => client.user_id !== id));
    }
  };

  const handleEdit = (client) => {
    setEditingUser(client);
    setEditFormData({ name: client.name, email: client.email, phonenumber: client.phonenumber, password: client.password, role: 'client', additionalInfo: client.additionalInfo || {} });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/users/${editingUser.user_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editFormData),
    });
    if (res.status === 200) {
      setClients(clients.map((client) => (client.user_id === editingUser.user_id ? { ...client, ...editFormData } : client)));
      setEditingUser(null);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addClientFormData),
      });

      if (res.status === 201) {
        const newClient = await res.json();
        setClients([...clients, newClient]);
        setShowAddClientForm(false);
        setAddClientFormData({ email: '', phonenumber: '', password: '', role: 'client', additionalInfo: {} });
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred while adding the client');
    }
  };

  const handleChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prevData) => ({ ...prevData, [name]: value }));
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar user={user} />
      <div className={styles.content}>
        <h1>Manage Clients</h1>
        <button onClick={() => setShowAddClientForm(true)} className={styles.addButton}>Add New Client</button>
        {showAddClientForm && (
          <form onSubmit={handleAddClient} className={styles.form}>
            <h2>Add New Client</h2>
            {error && <p className={styles.error}>{error}</p>}
            <label>
              Phone Number:
              <input type="text" name="phonenumber" value={addClientFormData.phonenumber} onChange={(e) => handleChange(e, setAddClientFormData)} required />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={addClientFormData.email} onChange={(e) => handleChange(e, setAddClientFormData)} />
            </label>
            <label>
              Password:
              <input type="text" name="password" value={addClientFormData.password} onChange={(e) => handleChange(e, setAddClientFormData)} required />
            </label>
            <button type="submit" className={styles.addButton}>Add Client</button>
            <button type="button" className={styles.cancelButton}  onClick={() => setShowAddClientForm(false)}>Cancel</button>
          </form>
        )}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.user_id}>
                  <td>{client.user_id}</td>
                  <td>{client.phonenumber}</td>
                  <td>{client.email}</td>
                  <td>{client.password}</td>
                  <td>{client.role}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(client)}>Edit</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(client.user_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <form className={styles.editForm} onSubmit={handleUpdate}>
            <h2>Edit Client</h2>
            <label>
              Phone Number:
              <input type="text" name="phonenumber" value={editFormData.phonenumber} onChange={handleChange} required />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={editFormData.email} onChange={handleChange} required />
            </label>
            <label>
              Password:
              <input type="text" name="password" value={editFormData.password} onChange={handleChange} required />
            </label>
            <label>
              Name:
              <input type="text" name="name" value={editFormData.additionalInfo.name} onChange={handleChange} required />
            </label>
            <label>
              Lastname:
              <input type="text" name="lastname" value={editFormData.additionalInfo.lastname} onChange={handleChange} required />
            </label>
            <label>
              Birthday:
              <input type="date" name="birthday" value={editFormData.additionalInfo.birthday} onChange={handleChange} required />
            </label>
            <label>
              Birthplace:
              <input type="text" name="birthplace" value={editFormData.additionalInfo.birthplace} onChange={handleChange} required />
            </label>
            <label>
              Gender:
              <input type="text" name="gender" value={editFormData.additionalInfo.gender} onChange={handleChange} required />
            </label>
            <label>
              PersonalNr:
              <input type="text" name="personalNr" value={editFormData.additionalInfo.personalNr} onChange={handleChange} required />
            </label>
            <label>
              Balance:
              <input type="number" name="balance" value={editFormData.additionalInfo.balance} onChange={handleChange} required />
            </label>
            <label>
              BalanceCoins:
              <input type="number" name="balanceCoins" value={editFormData.additionalInfo.balanceCoins} onChange={handleChange} required />
            </label>
            <label>
              Min:
              <input type="number" name="min" value={editFormData.additionalInfo.min} onChange={handleChange} required />
            </label>
            <label>
              SMS:
              <input type="number" name="sms" value={editFormData.additionalInfo.sms} onChange={handleChange} required />
            </label>
            <label>
              Internet:
              <input type="number" name="internet" value={editFormData.additionalInfo.internet} onChange={handleChange} required />
            </label>
            <div className={styles.formButtons}>
              <button type="submit" className={styles.updateButton}>Update</button>
              <button type="button" className={styles.cancelButton} onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageClients;
