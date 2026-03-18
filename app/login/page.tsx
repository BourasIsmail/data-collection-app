"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { regions, getAllProvinces } from "@/lib/morocco-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Building2, Shield, User } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "user">("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!selectedProvince && selectedRole === "user") {
      setError("يرجى اختيار الإقليم");
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, displayName, selectedProvince, selectedRole);
      router.push("/dashboard");
    } catch (err) {
      const error = err as Error;
      if (error.message.includes("Firestore")) {
        setError(error.message);
      } else if (error.message.includes("email-already-in-use")) {
        setError("البريد الإلكتروني مستخدم بالفعل.");
      } else {
        setError("فشل إنشاء الحساب. تحقق من البيانات أو حاول لاحقاً.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">نظام إدارة المراكز</h1>
          <p className="text-muted-foreground mt-2">المملكة المغربية</p>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">مرحباً بك</CardTitle>
            <CardDescription>قم بتسجيل الدخول للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  حساب جديد
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel className="text-foreground/80">البريد الإلكتروني</FieldLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        required
                        dir="ltr"
                        className="bg-secondary/50 border-border/50 focus:border-primary text-right"
                      />
                    </Field>
                    <Field>
                      <FieldLabel className="text-foreground/80">كلمة المرور</FieldLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        dir="ltr"
                        className="bg-secondary/50 border-border/50 focus:border-primary"
                      />
                    </Field>
                  </FieldGroup>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" disabled={loading}>
                    {loading ? <Spinner className="h-4 w-4" /> : "تسجيل الدخول"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel className="text-foreground/80">الاسم الكامل</FieldLabel>
                      <Input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                        required
                        className="bg-secondary/50 border-border/50 focus:border-primary"
                      />
                    </Field>
                    <Field>
                      <FieldLabel className="text-foreground/80">البريد الإلكتروني</FieldLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        required
                        dir="ltr"
                        className="bg-secondary/50 border-border/50 focus:border-primary text-right"
                      />
                    </Field>
                    <Field>
                      <FieldLabel className="text-foreground/80">كلمة المرور</FieldLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        dir="ltr"
                        minLength={6}
                        className="bg-secondary/50 border-border/50 focus:border-primary"
                      />
                    </Field>
                    <Field>
                      <FieldLabel className="text-foreground/80">نوع الحساب</FieldLabel>
                      <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as "admin" | "user")}>
                        <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-primary">
                          <SelectValue placeholder="اختر نوع الحساب" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>مستخدم</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              <span>مدير</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    {selectedRole === "user" && (
                      <Field>
                        <FieldLabel className="text-foreground/80">الإقليم أو العمالة</FieldLabel>
                        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                          <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-primary">
                            <SelectValue placeholder="اختر الإقليم" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border max-h-64">
                            {regions.map((region) => (
                              <div key={region.name}>
                                <div className="px-2 py-2 text-xs font-semibold text-primary bg-primary/10 sticky top-0">
                                  {region.name}
                                </div>
                                {region.provinces.map((province) => (
                                  <SelectItem key={province} value={province} className="pr-4">
                                    {province}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </FieldGroup>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" disabled={loading}>
                    {loading ? <Spinner className="h-4 w-4" /> : "إنشاء حساب"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          وزارة التضامن والإدماج الاجتماعي والأسرة
        </p>
      </div>
    </div>
  );
}
