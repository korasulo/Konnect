import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pool } from '@/lib/db';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const isEmail = credentials.emailOrPhone.includes('@');
          const query = isEmail 
            ? 'SELECT * FROM user WHERE email = ?' 
            : 'SELECT * FROM user WHERE phonenumber = ?';
          const [rows] = await pool.query(query, [credentials.emailOrPhone]);
          const user = rows[0];

          if (user && credentials.password === user.password) {
            return { id: user.user_id, name: user.email, email: user.email, role: user.role };
          }
          return null;
        } catch (error) {
          console.error('Database connection error:', error);
          throw new Error('Database connection error');
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
});
