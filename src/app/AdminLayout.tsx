"use client";

import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Helmet } from "react-helmet-async";

const AdminLayout: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | KWASU Students' Union</title>
        <meta name="description" content="Administrator dashboard for managing KWASU Students' Union website content." />
      </Helmet>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="w-full bg-white shadow-sm h-16 flex items-center px-6">
            <h1 className="text-2xl font-semibold text-brand-700">Admin Dashboard</h1>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;