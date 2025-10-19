"use client";

import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider"; // Import useSession

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useSession(); // Use the session context

  useEffect(() => {
    if (!loading && session && isAdmin) {
      // If already logged in and is admin, redirect to admin dashboard
      navigate("/admin", { replace: true });
    } else if (!loading && session && !isAdmin) {
      // If logged in but not admin, maybe show an error or redirect to a non-admin page
      // For now, we'll just log it and keep them on the login page or redirect to home
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
        <Card className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-brand-700">Admin Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to manage the KWASU SU website content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              providers={[]} // No third-party providers unless specified
              view="sign_in" // Explicitly set the view to sign_in
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--brand-500))', // Main brand green for primary actions
                      brandAccent: 'hsl(var(--brand-gold))', // Gold accent for secondary actions/focus
                      
                      // Button styling
                      defaultButtonBackground: 'hsl(var(--brand-500))',
                      defaultButtonBackgroundHover: 'hsl(var(--brand-600))',
                      defaultButtonText: 'hsl(var(--primary-foreground))', // White
                      
                      // Input styling
                      inputBackground: 'hsl(var(--background))', // White
                      inputText: 'hsl(var(--foreground))', // Dark text
                      inputPlaceholder: 'hsl(var(--muted-foreground))', // Gray placeholder
                      inputBorder: 'hsl(var(--brand-300))', // More visible border
                      inputBorderHover: 'hsl(var(--brand-400))',
                      inputBorderFocus: 'hsl(var(--brand-500))', // Main brand green on focus
                      
                      // Link styling
                      anchorTextColor: 'hsl(var(--brand-700))', // Darker green for links
                      anchorTextHoverColor: 'hsl(var(--brand-800))', // Even darker on hover
                    },
                    space: {
                      buttonPadding: '10px 15px', // Explicit padding for buttons
                      inputPadding: '10px 15px',   // Explicit padding for inputs
                      labelBottomMargin: '8px', // Margin below labels
                    },
                    // Border radius properties directly under default
                    radius: '0.5rem', // Apply border radius to all elements that respect it
                    buttonBorderRadius: '0.5rem', // Explicit button border radius
                    inputBorderRadius: '0.5rem', // Explicit input border radius
                    font: {
                      size: '1rem', // Base font size
                      button: '1rem', // Button font size
                      input: '1rem', // Input font size
                      label: '0.875rem', // Label font size
                    }
                  },
                },
              }}
              theme="light"
              redirectTo={window.location.origin + '/admin'} // Redirect to admin dashboard on success
              className="w-full" // Ensure the Auth component takes full width
            />
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