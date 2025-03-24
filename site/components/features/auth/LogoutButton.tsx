'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      localStorage.clear();
      sessionStorage.clear();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
} 