import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider";
import AdminAuthHero from "@/components/admin/AdminAuthHero";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { motion } from "framer-motion";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading } = useSession();

  useEffect(() => {
    if (!loading && session) {
      navigate("/", { replace: true });
    }
  }, [session, loading, navigate]);

  const handleAuthSuccess = () => {};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
        <p className="text-zinc-400 animate-pulse font-medium tracking-widest uppercase text-xs">Authenticating State...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Command Center | KWASU SU</title>
        <meta name="description" content="Secure portal for the KWASU SU digital ecosystem." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-6xl w-full bg-white/80 backdrop-blur-2xl shadow-2xl shadow-brand-900/10 border border-white rounded-2xl overflow-hidden min-h-[650px] ring-1 ring-zinc-200/50"
        >
          {/* Left Section: AdminAuthHero */}
          <div className="hidden lg:flex relative">
            <AdminAuthHero />
          </div>

          {/* Right Section: Login Form */}
          <Card className="p-10 space-y-8 bg-transparent shadow-none border-none rounded-none lg:rounded-r-2xl flex flex-col justify-center relative">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute top-8 right-8 w-32 h-32 bg-brand-200/40 rounded-full blur-3xl pointer-events-none"
            />
            
            <CardHeader className="text-center pb-2 pt-0 z-10 space-y-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Link to="/" className="inline-flex items-center justify-center focus-visible:ring-brand-500 rounded-2xl outline-none hover:scale-105 transition-transform bg-white shadow-xl shadow-brand-500/10 p-3 border border-zinc-100">
                  <img src="/logo.png" alt="KWASU SU Logo" className="h-16 w-16 object-contain" />
                </Link>
              </motion.div>
              <div className="space-y-1.5">
                <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900">
                  Authentication
                </CardTitle>
                <CardDescription className="text-zinc-500 text-sm font-medium">
                  Provide secure credentials to access the console
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow z-10 px-4 sm:px-8">
              <AdminLoginForm onSuccess={handleAuthSuccess} />
            </CardContent>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center text-xs font-semibold tracking-wide text-zinc-400 z-10"
            >
              <Link to="/" className="hover:text-brand-600 transition-colors inline-flex items-center gap-1 group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Public Network
              </Link>
            </motion.p>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLoginPage;
