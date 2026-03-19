"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, deleteDoc, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Trash2, Shield, User, AlertCircle, Users } from "lucide-react";
import { regions, getAllProvinces } from "@/lib/morocco-data";
import { Progress } from "@/components/ui/progress";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "user";
  province: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [bulkCreating, setBulkCreating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkStatus, setBulkStatus] = useState("");
  const [error, setError] = useState("");
  
  // New user form
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "user" as "admin" | "user",
    province: ""
  });

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserData[];
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    if (newUser.role === "user" && !newUser.province) {
      setError("يرجى اختيار الإقليم للمستخدم");
      setCreating(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
        province: newUser.role === "admin" ? "" : newUser.province
      });

      // Reset form and close dialog
      setNewUser({
        email: "",
        password: "",
        displayName: "",
        role: "user",
        province: ""
      });
      setIsDialogOpen(false);
    } catch (err) {
      const error = err as Error;
      if (error.message.includes("email-already-in-use")) {
        setError("البريد الإلكتروني مستخدم بالفعل");
      } else {
        setError("فشل إنشاء الحساب. حاول مرة أخرى.");
      }
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreateUsers = async () => {
    setBulkCreating(true);
    setBulkProgress(0);
    setBulkStatus("");
    setError("");

    const allProvinces = getAllProvinces();
    const existingProvinces = new Set(users.filter(u => u.province).map(u => u.province));
    const provincesToCreate = allProvinces.filter(p => !existingProvinces.has(p.name));

    if (provincesToCreate.length === 0) {
      setBulkStatus("جميع الأقاليم لديها حسابات بالفعل");
      setBulkCreating(false);
      return;
    }

    let created = 0;
    let failed = 0;

    for (let i = 0; i < provincesToCreate.length; i++) {
      const province = provincesToCreate[i];
      const email = `${province.name.replace(/\s+/g, "").replace(/-/g, "")}@entraide.ma`.toLowerCase();
      const password = "Entraide@2024";
      
      setBulkStatus(`جاري إنشاء حساب: ${province.name}`);
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email,
          displayName: province.name,
          role: "user",
          province: province.name
        });
        
        created++;
      } catch (err) {
        console.error(`Failed to create user for ${province.name}:`, err);
        failed++;
      }
      
      setBulkProgress(Math.round(((i + 1) / provincesToCreate.length) * 100));
    }

    setBulkStatus(`تم إنشاء ${created} حساب بنجاح${failed > 0 ? ` (${failed} فشل)` : ""}`);
    setBulkCreating(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      try {
        await deleteDoc(doc(db, "users", userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">إدارة المستخدمين</CardTitle>
        <div className="flex items-center gap-2">
          {/* Bulk Create Users Dialog */}
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                <Users className="h-4 w-4 ml-2" />
                إنشاء حسابات الأقاليم
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إنشاء حسابات لجميع الأقاليم</DialogTitle>
                <DialogDescription>
                  سيتم إنشاء حساب لكل إقليم لا يملك حساب بعد. كلمة المرور الافتراضية: Entraide@2024
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="text-sm text-muted-foreground text-right">
                  <p>عدد الأقاليم الإجمالي: {getAllProvinces().length}</p>
                  <p>الأقاليم التي لديها حسابات: {users.filter(u => u.province).length}</p>
                  <p>الأقاليم المتبقية: {getAllProvinces().filter(p => !users.some(u => u.province === p.name)).length}</p>
                </div>
                
                {bulkCreating && (
                  <div className="space-y-2">
                    <Progress value={bulkProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">{bulkProgress}%</p>
                  </div>
                )}
                
                {bulkStatus && (
                  <div className={`text-sm p-3 rounded-lg text-right ${
                    bulkStatus.includes("فشل") 
                      ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" 
                      : "bg-green-500/10 text-green-600 border border-green-500/20"
                  }`}>
                    {bulkStatus}
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsBulkDialogOpen(false)} disabled={bulkCreating}>
                  إغلاق
                </Button>
                <Button onClick={handleBulkCreateUsers} disabled={bulkCreating}>
                  {bulkCreating ? <Spinner className="h-4 w-4" /> : "بدء الإنشاء"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Single User Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 ml-2" />
                إضافة مستخدم
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
              <DialogDescription>قم بإدخال بيانات المستخدم الجديد</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>الاسم الكامل</FieldLabel>
                  <Input
                    value={newUser.displayName}
                    onChange={(e) => setNewUser(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="أدخل الاسم الكامل"
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </Field>
                <Field>
                  <FieldLabel>البريد الإلكتروني</FieldLabel>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    required
                    dir="ltr"
                    className="text-right"
                  />
                </Field>
                <Field>
                  <FieldLabel>كلمة المرور</FieldLabel>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    dir="ltr"
                  />
                </Field>
                <Field>
                  <FieldLabel>نوع الحساب</FieldLabel>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(v) => setNewUser(prev => ({ ...prev, role: v as "admin" | "user" }))}
                  >
                    <SelectTrigger className="w-full text-right" dir="rtl">
                      <SelectValue placeholder="اختر نوع الحساب" />
                    </SelectTrigger>
                    <SelectContent>
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
                {newUser.role === "user" && (
                  <Field>
                    <FieldLabel>الإقليم أو العمالة</FieldLabel>
                    <Select 
                      value={newUser.province} 
                      onValueChange={(v) => setNewUser(prev => ({ ...prev, province: v }))}
                    >
                      <SelectTrigger className="w-full text-right" dir="rtl">
                        <SelectValue placeholder="اختر الإقليم" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
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

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? <Spinner className="h-4 w-4" /> : "إنشاء الحساب"}
                </Button>
              </div>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الإقليم</TableHead>
                <TableHead className="text-right w-20">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا يوجد مستخدمين
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.displayName}</TableCell>
                    <TableCell dir="ltr" className="text-right">{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-secondary text-secondary-foreground"
                      }`}>
                        {user.role === "admin" ? (
                          <>
                            <Shield className="h-3 w-3" />
                            مدير
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3" />
                            مستخدم
                          </>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>{user.province || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteUser(user.uid)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
