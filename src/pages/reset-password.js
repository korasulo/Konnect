import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        router.push('/login');
      }
    } catch (err) {
      setMessage('An error occurred while resetting the password.');
    }
  };

  return (
    <div className="reset-password-page">
      <form onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
