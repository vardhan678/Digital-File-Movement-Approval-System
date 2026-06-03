import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = ({ darkMode, toggleDark }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
      <Navbar darkMode={darkMode} toggleDark={toggleDark} />
      <main className="flex-1 p-4 md:p-6 max-w-screen-2xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default MainLayout;
