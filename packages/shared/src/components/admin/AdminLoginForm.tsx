"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signIn } from "@/utils/auth-helpers";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

interface AdminLoginFormProps {
  onSuccess: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const success = await signIn(values.email, values.password);
      if (success) {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider">Administrator Email</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-600 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input 
                      placeholder="admin@example.com" 
                      {...field} 
                      className="pl-10 h-12 bg-zinc-50 border-zinc-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:border-brand-500 transition-all rounded-xl shadow-sm text-md" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider">Access Token</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-600 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="pl-10 h-12 bg-zinc-50 border-zinc-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:border-brand-500 transition-all rounded-xl shadow-sm text-md" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-brand-700 hover:bg-brand-800 text-white font-medium tracking-wide rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Authenticating Protocol...
              </>
            ) : (
              "Initialize Session"
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};

export default AdminLoginForm;