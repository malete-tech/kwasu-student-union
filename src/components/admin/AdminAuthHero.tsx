"use client";

import React from "react";
import { Settings, ShieldCheck, TrendingUp } from "lucide-react";

const AdminAuthHero: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-brand-700 to-brand-900 text-white text-center lg:text-left lg:items-start">
      <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url(/public/E-learning.jpg)" }}></div>
      <div className="relative z-10 space-y-6">
        <h2 className="text-4xl font-bold leading-tight text-brand-gold">
          Manage Your <br /> KWASU SU Platform
        </h2>
        <p className="text-lg text-brand-100 max-w-md">
          Empower your student community by efficiently managing news, events, executives, and student services.
        </p>
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-brand-gold" />
            <span className="text-brand-50 font-medium">Streamlined Content Management</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-brand-gold" />
            <span className="text-brand-50 font-medium">Secure Administrative Access</span>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-brand-gold" />
            <span className="text-brand-50 font-medium">Enhance Student Engagement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthHero;