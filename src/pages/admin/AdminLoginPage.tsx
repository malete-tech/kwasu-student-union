"use client";

import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider"; // Import useSession
import AdminAuthHero from "@/components/admin/AdminAuthHero"; // Import the new hero component

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useSession(); // Use the session context

  useEffect(() => {
    if (!loading && session && isAdmin) {
      // If already logged in and is admin, redirect to admin dashboard
      navigate("/admin", { replace: true });
    } else if (!loading && session && !isAdmin) {
      // If logged in but not admin, maybe show an error or redirect to a non-admin page
      console.warn("User is logged in but not an admin. Redirecting to home.");
      navigate("/", { replace: true });
    }
  }, [session, isAdmin, loading, navigate]);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full bg-white shadow-lg rounded-2xl overflow-hidden min-h-[600px]">
          {/* Left Section: AdminAuthHero (Hidden on small screens) */}
          <div className="hidden lg:flex">
            <AdminAuthHero />
          </div>

          {/* Right Section: Login Form */}
          <Card className="p-8 space-y-6 shadow-none rounded-none lg:rounded-r-2xl flex flex-col justify-center">
            <CardHeader className="text-center pb-4">
              {/* Logo */}
              <Link to="/" className="flex items-center justify-center text-lg font-bold text-brand-700 hover:text-brand-600 focus-visible:ring-brand-500 rounded-md outline-none mb-4">
                <img src="/imageu-removebg-preview.png" alt="KWASU SU Logo" className="h-10 w-10 mr-2" />
                <span className="text-2xl">Admin Panel</span>
              </Link>
              <CardTitle className="text-3xl font-bold text-brand-700">Admin Login</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to manage the KWASU SU website content.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Auth
                supabaseClient={supabase}
                providers={[]} // No social providers as requested
                view="sign_in" // Explicitly set the view to sign_in
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        // Primary brand color for buttons and main accents
                        brand: 'hsl(var(--brand-700))', // Dark Green for primary buttons
                        brandAccent: 'hsl(var(--brand-800))', // Even darker green on hover
                        
                        // Ensure text is white for primary buttons
                        defaultButtonText: 'hsl(var(--primary-foreground))', // White
                        
                        // Input styling
                        inputBackground: 'hsl(var(--background))', // White
                        inputText: 'hsl(var(--foreground))', // Dark text
                        inputPlaceholder: 'hsl(var(--muted-foreground))', // Gray placeholder
                        inputBorder: 'hsl(var(--border))', // Light gray border
                        inputBorderHover: 'hsl(var(--input))', // Slightly darker on hover
                        inputBorderFocus: 'hsl(var(--ring))', // Brand green on focus
                        
                        // Link styling
                        anchorTextColor: 'hsl(var(--brand-700))', // Darker green for links
                        anchorTextHoverColor: 'hsl(var(--brand-800))', // Even darker on hover
                      },
                      space: {
                        buttonPadding: '10px 15px', // Explicit padding for buttons
                        inputPadding: '10px 15px',   // Explicit padding for inputs
                        labelBottomMargin: '8px', // Margin below labels
                      },
                      radii: { 
                        buttonBorderRadius: '0.5rem',  // Button specific radius
                        inputBorderRadius: '0.5rem',   // Input specific radius
                      },
                      fonts: { 
                        // Font families can be set here, e.g., bodyFontFamily: 'Epunda Slab'
                      }
                    },
                  },
                }}
                theme="light"
                redirectTo={window.location.origin + '/admin'} // Redirect to admin dashboard on success
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
    </>
  );
};

export default AdminLoginPage;