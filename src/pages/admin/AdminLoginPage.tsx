"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider";
import AdminAuthHero from "@/components/admin/AdminAuthHero";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { resetPassword } from "@/utils/auth-helpers";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  useEffect(() => {
    console.log("AdminLoginPage: useEffect triggered. Loading:", loading, "Session:", !!session);
    if (!loading) {
      if (session) {
        console.log("AdminLoginPage: Session is true, redirecting to /admin.");
        navigate("/admin", { replace: true });
      }
    }
  }, [session, loading, navigate]);

  const handleAuthSuccess = () => {
    // The useEffect above will now handle the redirect if a session is established.
    // No specific profile check needed here.
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    const success = await resetPassword(forgotPasswordEmail);
    if (success) {
      setIsForgotPasswordDialogOpen(false);
      setForgotPasswordEmail("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-4 sm:px-6 lg:px-8">
        <p className="text-brand-700">Loading authentication state...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | KWASU Students' Union</title>
        <meta name="description" content="Administrator login page for KWASU Students' Union dashboard." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-6xl w-full bg-white shadow-lg rounded-2xl overflow-hidden min-h-[600px]">
          {/* Left Section: AdminAuthHero (Hidden on small screens) */}
          <div className="hidden lg:flex">
            <AdminAuthHero />
          </div>

          {/* Right Section: Login Form */}
          <Card className="p-8 space-y-6 shadow-none rounded-none lg:rounded-r-2xl flex flex-col justify-center">
            <CardHeader className="text-center pb-4">
              {/* Logo */}
              <Link to="/" className="flex items-center justify-center focus-visible:ring-brand-500 rounded-md outline-none mb-4">
                <img src="/kwasu-su-logo-new.png" alt="KWASU SU Logo" className="h-12 w-12" />
              </Link>
              <CardTitle className="text-3xl font-bold text-brand-700">
                Admin Login
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to manage the KWASU SU website content.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <AdminLoginForm
                onSuccess={handleAuthSuccess}
                onForgotPassword={() => setIsForgotPasswordDialogOpen(true)}
              />
            </CardContent>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/" className="font-medium text-brand-500 hover:text-brand-600 hover:underline">
                Return to public site
              </Link>
            </p>
          </Card>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={isForgotPasswordDialogOpen} onOpenChange={setIsForgotPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader> {/* Corrected: Removed duplicate </DialogDescription> and added closing </DialogHeader> */}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@example.com"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="focus-visible:ring-brand-gold"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsForgotPasswordDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleForgotPasswordSubmit} className="bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold">
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminLoginPage;