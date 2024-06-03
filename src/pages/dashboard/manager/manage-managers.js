import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/ManageManagers.module.css';

const ManageManagers = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [managers, setManagers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phonenumber: '', password: '', role: 'manager', additionalInfo: {} });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  useEffect(() => {
    const fetchManagers = async () => {
      const res = await fetch('/api/users?role=manager');
      const data = await res.json();
      setManagers(data);
    };

    fetchManagers();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (res.status === 200) {
      setManagers(managers.filter((manager) => manager.user_id !== id));
    }
  };

  const handleEdit = (manager) => {
    setEditingUser(manager);
    setEditFormData({ name: manager.name, email: manager.email, phonenumber: manager.phonenumber, password: manager.password, role: 'manager', additionalInfo: manager.additionalInfo || {} });
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
      setManagers(managers.map((manager) => (manager.user_id === editingUser.user_id ? { ...manager, ...editFormData } : manager)));
      setEditingUser(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in editFormData) {
      setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setEditFormData((prevData) => ({ ...prevData, additionalInfo: { ...prevData.additionalInfo, [name]: value }}));
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar user={user} />
      <div className={styles.content}>
        <h1>Manage Managers</h1>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager) => (
                <tr key={manager.user_id}>
                  <td>{manager.user_id}</td>
                  <td>{manager.phonenumber}</td>
                  <td>{manager.email}</td>
                  <td>{manager.role}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(manager)}>Edit</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(manager.user_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <form className={styles.editForm} onSubmit={handleUpdate}>
            <h2>Edit Manager</h2>
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

export default ManageManagers;
