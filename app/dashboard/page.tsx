"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { CenterForm } from "@/components/center-form";
import { CentersTable } from "@/components/centers-table";
import { StatsCards } from "@/components/stats-cards";
import { UserManagement } from "@/components/user-management";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { LogOut, Building2, Plus, LayoutList, Shield, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Center } from "@/types/center";

export default function DashboardPage() {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("list");
  const [centers, setCenters] = useState<Center[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch centers for export
  useEffect(() => {
    if (!userData) return;
    
    const q = query(collection(db, "centers"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const centersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Center[];
      setCenters(centersData);
    }, (error) => {
      console.error("Error fetching centers for export:", error);
    });

    return () => unsubscribe();
  }, [userData]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner className="h-10 w-10 mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // If userData isn't loaded yet (Firestore not configured), show setup message
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-border/50">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 text-warning mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h2 className="font-bold text-lg text-foreground">إعداد قاعدة البيانات مطلوب</h2>
              <p className="text-sm text-muted-foreground mt-2">
                تم تسجيل الدخول بنجاح، لكن يجب إعداد Firestore في وحدة تحكم Firebase.
              </p>
            </div>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside bg-secondary/50 p-4 rounded-lg mb-4">
              <li>افتح وحدة تحكم Firebase</li>
              <li>اذهب إلى Firestore Database</li>
              <li>أنشئ قاعدة بيانات جديدة</li>
              <li>في قسم Rules، اختر Test Mode</li>
            </ol>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAdmin = userData.role === "admin";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 border border-primary/20 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground leading-tight max-w-xl">
                  منصة رقمية موجهة لجرد وتتبع المراكز الاجتماعية المُنجزة ضمن برامج المبادرة الوطنية للتنمية البشرية
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  {isAdmin ? (
                    <>
                      <Shield className="h-3 w-3 text-primary" />
                      <span>مدير النظام</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-3 w-3" />
                      <span>{userData.province}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push("/admin/users")}
                  className="hidden sm:flex"
                >
                  <Users className="h-4 w-4 ml-1.5" />
                  إدارة المستخدمين
                </Button>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">{userData.displayName}</p>
                <p className="text-xs text-muted-foreground">{userData.email}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <LogOut className="h-4 w-4 ml-1.5" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {isAdmin && <StatsCards />}
        
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="bg-secondary/50 border border-border/50 p-1">
                <TabsTrigger 
                  value="list" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
                >
                  <LayoutList className="h-4 w-4" />
                  قائمة المراكز
                </TabsTrigger>
                <TabsTrigger 
                  value="add" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
                >
                  <Plus className="h-4 w-4" />
                  إضافة مركز
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
                  >
                    <Users className="h-4 w-4" />
                    المستخدمين
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            
            <TabsContent value="list" className="mt-0">
              <CentersTable />
            </TabsContent>
            
            <TabsContent value="add" className="mt-0">
              <div className="max-w-6xl mx-auto">
                <CenterForm onSuccess={() => setActiveTab("list")} />
              </div>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="users" className="mt-0">
                <div className="max-w-4xl mx-auto">
                  <UserManagement />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          التعاون الوطني
        </div>
      </footer>
    </div>
  );
}
