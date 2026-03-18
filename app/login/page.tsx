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
import { AlertCircle } from "lucide-react";

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

  const allProvinces = getAllProvinces();

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
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">نظام إدارة المراكز</CardTitle>
          <CardDescription>قم بتسجيل الدخول أو إنشاء حساب جديد</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register">حساب جديد</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn}>
                <FieldGroup>
                  <Field>
                    <FieldLabel>البريد الإلكتروني</FieldLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                      dir="ltr"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>كلمة المرور</FieldLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      dir="ltr"
                    />
                  </Field>
                </FieldGroup>
                
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm mt-4 p-3 bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
                
                <Button type="submit" className="w-full mt-6" disabled={loading}>
                  {loading ? <Spinner className="h-4 w-4" /> : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp}>
                <FieldGroup>
                  <Field>
                    <FieldLabel>الاسم الكامل</FieldLabel>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>البريد الإلكتروني</FieldLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                      dir="ltr"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>كلمة المرور</FieldLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      dir="ltr"
                      minLength={6}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>نوع الحساب</FieldLabel>
                    <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as "admin" | "user")}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الحساب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">مستخدم</SelectItem>
                        <SelectItem value="admin">مدير</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  {selectedRole === "user" && (
                    <Field>
                      <FieldLabel>الإقليم</FieldLabel>
                      <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الإقليم" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <div key={region.name}>
                              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted">
                                {region.name}
                              </div>
                              {region.provinces.map((province) => (
                                <SelectItem key={province} value={province}>
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
                  <div className="flex items-center gap-2 text-destructive text-sm mt-4 p-3 bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
                
                <Button type="submit" className="w-full mt-6" disabled={loading}>
                  {loading ? <Spinner className="h-4 w-4" /> : "إنشاء حساب"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
