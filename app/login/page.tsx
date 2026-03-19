"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Building2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
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
          <h1 className="text-base font-bold text-foreground leading-relaxed max-w-md mx-auto">
            منصة رقمية موجهة لجرد وتتبع المراكز الاجتماعية المُنجزة ضمن برامج المبادرة الوطنية للتنمية البشرية، سواء الخاضعة للإشراف المباشر لمصالح التعاون الوطني، أو المُدبَّرة في إطار شراكات مع جمعيات المجتمع المدني
          </h1>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">مرحباً بك</CardTitle>
            <CardDescription>قم بتسجيل الدخول للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>
          <CardContent>
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
            
            <p className="text-center text-muted-foreground text-xs mt-4">
              للحصول على حساب، يرجى التواصل مع مدير النظام
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          التعاون الوطني
        </p>
      </div>
    </div>
  );
}
