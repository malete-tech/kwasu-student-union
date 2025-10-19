"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signUp } from "@/utils/auth-helpers";


const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

interface AdminRegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const AdminRegisterForm: React.FC<AdminRegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const success = await signUp(values.firstName, values.lastName, values.email, values.password);
    if (success) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} className="focus-visible:ring-brand-gold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} className="focus-visible:ring-brand-gold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@example.com" {...field} className="focus-visible:ring-brand-gold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="focus-visible:ring-brand-gold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold">
          Sign Up
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button type="button" variant="link" onClick={onSwitchToLogin} className="px-0 text-brand-500 hover:text-brand-600 focus-visible:ring-brand-gold">
            Sign In
          </Button>
        </p>
      </form>
    </Form>
  );
};

export default AdminRegisterForm;