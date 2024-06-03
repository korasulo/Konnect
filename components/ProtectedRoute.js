import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      signIn();
    } else if (!allowedRoles.includes(session.user.role)) {
      router.push('/');
    }
  }, [session, status]);

  if (status === 'loading' || !session || !allowedRoles.includes(session.user.role)) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
