"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { CenterForm } from "@/components/center-form";
import { CentersTable } from "@/components/centers-table";
import { StatsCards } from "@/components/stats-cards";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { LogOut, Building2, Plus, LayoutList, Users, Shield } from "lucide-react";

export default function DashboardPage() {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  const isAdmin = userData.role === "admin";

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">نظام إدارة المراكز</h1>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? "لوحة تحكم المدير" : `إقليم ${userData.province}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                {isAdmin ? (
                  <Shield className="h-4 w-4 text-primary" />
                ) : (
                  <Users className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium">{userData.displayName}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {isAdmin && <StatsCards />}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-6">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <LayoutList className="h-4 w-4" />
              قائمة المراكز
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة مركز
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <CentersTable />
          </TabsContent>
          
          <TabsContent value="add">
            <div className="max-w-3xl mx-auto">
              <CenterForm onSuccess={() => setActiveTab("list")} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
