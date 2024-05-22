// src/components/Layout/Sidebar.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { SlHome, SlBasket, SlOptions, SlDoc } from 'react-icons/sl';
import { FaTshirt, FaRedhat } from 'react-icons/fa';
import { BsInfoSquare, BsEnvelope, BsBoxArrowRight } from 'react-icons/bs';
import Image from 'next/image';

const Sidebar = ({ show, setter }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const className = "bg-black w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40";
  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

  const menuItems = [
    { role: 'client', name: 'Home', href: '/dashboard/client', icon: <SlHome /> },
    { role: 'client', name: 'Products & Services', href: '/dashboard/products-services', icon: <SlOptions /> },
    { role: 'client', name: 'Pay the Bill', href: '/dashboard/billing', icon: <SlDoc /> },
    { role: 'client', name: 'Offers & Services', href: '/dashboard/offers-rewards', icon: <SlBasket /> },
    { role: 'manager', name: 'Manager Dashboard', href: '/dashboard/manager', icon: <FaTshirt /> },
    { role: 'customer_service', name: 'Customer Service Dashboard', href: '/dashboard/clientservice', icon: <FaRedhat /> },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const ModalOverlay = () => (
    <div className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`} onClick={() => setter(false)} />
  );

  return (
    <>
      <div className={`${className}${appendClass}`}>
        <div className="p-6 flex">
          <Link href="/">
            <Image src="/logo.png" alt="Company Logo" width={250} height={100} priority />
          </Link>
        </div>
        <div className="flex flex-col">
          {menuItems.map(
            (item) =>
              session?.user.role === item.role && (
                <Link key={item.href} href={item.href} onClick={() => setter(false)} className="flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-white/10 text-white/50 hover:text-white">
                  <div className="text-xl flex [&>*]:mx-auto w-[30px]">{item.icon}</div>
                  <div>{item.name}</div>
                </Link>
              )
          )}
          <button onClick={handleLogout} className="flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-white/10 text-white/50 hover:text-white">
            <div className="text-xl flex [&>*]:mx-auto w-[30px]"><BsBoxArrowRight /></div>
            <div>Logout</div>
          </button>
        </div>
      </div>
      {show ? <ModalOverlay /> : null}
    </>
  );
};

export default Sidebar;
