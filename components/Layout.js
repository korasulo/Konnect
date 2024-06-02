import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MenuBarMobile from './MenuBarMobile';

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar show={showSidebar} setter={setShowSidebar} />
      <div className="flex-1">
        <MenuBarMobile setter={setShowSidebar} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}