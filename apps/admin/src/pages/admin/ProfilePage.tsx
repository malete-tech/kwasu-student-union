"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Shield, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Camera,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/components/SessionContextProvider";
import { api } from "@/lib/api";
import { Profile } from "@/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage: React.FC = () => {
  const { user } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form stats
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const data = await api.profiles.getById(user.id);
        if (data) {
          setProfile(data);
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const updated = await api.profiles.update(user.id, {
        first_name: firstName,
        last_name: lastName,
      });
      setProfile(updated);
      toast.success("Profile updated successfully", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-64 rounded-2xl md:col-span-1" />
          <Skeleton className="h-[400px] rounded-2xl md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Profile | KWASU SU</title>
      </Helmet>
      
      <div className="max-w-5xl mx-auto space-y-8 pb-10">
        {/* Editorial Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
          <Button asChild variant="ghost" size="icon" className="h-12 w-12 text-slate-400 hover:text-brand-700 hover:bg-brand-50 rounded-2xl shrink-0 transition-all">
            <Link to="/">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-brand-900 uppercase tracking-tighter">My Account</h2>
            <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mt-1">Profile & Administrative Identity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Avatar & Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
              <div className="h-24 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />
              <CardContent className="pt-0 relative px-6 pb-8">
                <div className="flex flex-col items-center -mt-12">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-brand-50 text-brand-400 text-2xl font-black">
                        {firstName[0]}{lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-100 text-slate-400 hover:text-brand-600 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{profile?.role || "Administrator"}</p>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                    <Mail className="h-4 w-4 text-brand-500" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-semibold text-slate-700 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                    <Shield className="h-4 w-4 text-brand-500" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Role</p>
                      <p className="text-sm font-semibold text-slate-700">{profile?.role || "Global Admin"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
                <CardTitle className="text-xl font-bold text-slate-900">Personal Information</CardTitle>
                <CardDescription>Update your public-facing administrative name and details.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
                      <Input 
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="h-12 rounded-xl border-slate-200 focus:ring-brand-500 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                      <Input 
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="h-12 rounded-xl border-slate-200 focus:ring-brand-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Login Email</Label>
                    <Input 
                      value={user?.email || ""}
                      disabled
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 text-slate-400 italic cursor-not-allowed"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-brand-900 hover:bg-black text-white px-8 h-12 rounded-xl shadow-lg shadow-brand-900/20 transition-all font-bold"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
