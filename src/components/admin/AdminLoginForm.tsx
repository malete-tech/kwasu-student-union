"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signIn } from "@/utils/auth-helpers";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

interface AdminLoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess, onForgotPassword }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const success = await signIn(values.email, values.password);
    if (success) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <div className="flex justify-end text-sm">
          <Button type="button" variant="link" onClick={onForgotPassword} className="px-0 text-brand-500 hover:text-brand-600 focus-visible:ring-brand-gold">
            Forgot password?
          </Button>
        </div>
        <Button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white focus-visible:ring-brand-gold">
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export default AdminLoginForm;