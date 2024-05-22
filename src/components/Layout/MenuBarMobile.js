// src/components/Layout/MenuBarMobile.js
import React from 'react';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

export default function MenuBarMobile({ setter }) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="md:hidden z-20 fixed top-0 left-0 right-0 h-[80px] bg-black flex [&>*]:my-auto px-2">
      <button className="text-4xl flex text-white" onClick={() => setter(prev => !prev)}>
        <FiMenu />
      </button>
      <Link href="/" className="mx-auto">
        <Image src="/logo.svg" alt="Company Logo" width={250} height={100} priority />
      </Link>
      <Link className="text-3xl flex text-white" href="/login">
        <FaUser />
      </Link>
      <button onClick={handleLogout} className="text-3xl flex text-white">
        <FaSignOutAlt />
      </button>
    </nav>
  );
}
