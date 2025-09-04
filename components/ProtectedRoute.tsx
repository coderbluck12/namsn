'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ 
  children,
  adminOnly = false 
}: { 
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { currentUser, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        // User is not logged in, redirect to login
        router.push('/login');
      } else if (adminOnly && !isAdmin) {
        // Check if user is admin (you'll need to implement this check)
        // For now, we'll just check a custom claim or user role in Firestore
        // This is a placeholder - implement your admin check logic here
        const checkAdminStatus = async () => {
          // Example: Check Firestore for admin status
          // const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          // setIsAdmin(userDoc.data()?.role === 'admin');
          // if (!userDoc.data()?.isAdmin) {
          //   router.push('/dashboard');
          // }
        };
        
        checkAdminStatus();
      }
    }
  }, [currentUser, loading, router, adminOnly, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return null; // or a loading spinner
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Unauthorized. You don't have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
