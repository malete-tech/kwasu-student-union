"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const AdminLoginPage: React.FC = () => {
  // Placeholder for login logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would involve calling an authentication service (e.g., Supabase)
    console.log("Admin login attempt...");
    // On successful login, redirect to /admin
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | KWASU Students' Union</title>
        <meta name="description" content="Administrator login page for KWASU Students' Union dashboard." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-brand-700">Admin Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to manage the KWASU SU website content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@kwasusu.edu"
                  className="mt-1 focus-visible:ring-brand-gold"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="mt-1 focus-visible:ring-brand-gold"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-gold"
              >
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/" className="font-medium text-brand-500 hover:text-brand-600 hover:underline">
                Return to public site
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminLoginPage;