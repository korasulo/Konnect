import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/ManageCustomerService.module.css';

const ManageCustomerService = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [customerServiceAgents, setCustomerServiceAgents] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phonenumber: '', password: '', role: 'customer_service', additionalInfo: {} });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  useEffect(() => {
    const fetchCustomerServiceAgents = async () => {
      const res = await fetch('/api/users?role=customer_service');
      const data = await res.json();
      setCustomerServiceAgents(data);
    };

    fetchCustomerServiceAgents();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (res.status === 200) {
      setCustomerServiceAgents(customerServiceAgents.filter((agent) => agent.user_id !== id));
    }
  };

  const handleEdit = (agent) => {
    setEditingUser(agent);
    setEditFormData({ name: agent.name, email: agent.email, phonenumber: agent.phonenumber, password: agent.password, role: 'customer_service', additionalInfo: agent.additionalInfo || {} });
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
      setCustomerServiceAgents(customerServiceAgents.map((agent) => (agent.user_id === editingUser.user_id ? { ...agent, ...editFormData } : agent)));
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
        <h1>Manage Customer Service Agents</h1>
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
              {customerServiceAgents.map((agent) => (
                <tr key={agent.user_id}>
                  <td>{agent.user_id}</td>
                  <td>{agent.phonenumber}</td>
                  <td>{agent.email}</td>
                  <td>{agent.password}</td>
                  <td>{agent.role}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(agent)}>Edit</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(agent.user_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <form className={styles.editForm} onSubmit={handleUpdate}>
            <h2>Edit Customer Service Agent</h2>
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

export default ManageCustomerService;
