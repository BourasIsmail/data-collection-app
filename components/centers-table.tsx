"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Center } from "@/types/center";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CenterForm } from "./center-form";
import { Search, Trash2, Edit, Eye, Building, MapPin, FileText } from "lucide-react";

export function CentersTable() {
  const { userData } = useAuth();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Center | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!userData) return;

    const q = query(collection(db, "centers"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let centersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Center[];
      
      // Filter by province for non-admin users
      if (userData.role !== "admin" && userData.province) {
        centersData = centersData.filter(c => c.province === userData.province);
      }
      
      // Sort by createdAt descending
      centersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setCenters(centersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching centers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  const filteredCenters = centers.filter(center => {
    const matchesSearch = 
      center.centerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.socialProgram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.territorialCommunity?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleDelete = async () => {
    if (!deleteConfirm?.id) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "centers", deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting center:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <Spinner className="h-8 w-8 mx-auto text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">قائمة البنايات</CardTitle>
                <CardDescription>
                  {userData?.role === "admin" 
                    ? `جميع البنايات المسجلة`
                    : `البنايات في إقليم ${userData?.province}`
                  }
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-primary bg-primary/10">
              {filteredCenters.length} بناية
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البرنامج أو الإقليم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {filteredCenters.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">لا توجد بنايات مسجلة</p>
              <p className="text-sm text-muted-foreground/70 mt-1">قم بإضافة بناية جديدة للبدء</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                      <TableHead className="text-right font-semibold text-foreground">اسم البناية</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">الإقليم</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">الجماعة الترابية</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">الوضعية الحالية</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">الحالة العامة</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCenters.map((center) => (
                      <TableRow key={center.id} className="border-border/50 hover:bg-secondary/20">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {center.centerName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {center.province}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{center.territorialCommunity}</TableCell>
                        <TableCell>
                          {center.currentStatus && (
                            <Badge 
                              variant="outline"
                              className={
                                center.currentStatus === "مستغل" 
                                  ? "border-green-500/50 text-green-400 bg-green-500/10" 
                                  : center.currentStatus === "متوقف" 
                                    ? "border-red-500/50 text-red-400 bg-red-500/10" 
                                    : "border-yellow-500/50 text-yellow-400 bg-yellow-500/10"
                              }
                            >
                              {center.currentStatus}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {center.generalCondition && (
                            <Badge 
                              variant="outline"
                              className={
                                center.generalCondition === "جيدة" 
                                  ? "border-green-500/50 text-green-400 bg-green-500/10" 
                                  : center.generalCondition === "متدهورة" 
                                    ? "border-red-500/50 text-red-400 bg-red-500/10" 
                                    : "border-yellow-500/50 text-yellow-400 bg-yellow-500/10"
                              }
                            >
                              {center.generalCondition}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedCenter(center)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingCenter(center)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {userData?.role === "admin" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteConfirm(center)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!selectedCenter} onOpenChange={() => setSelectedCenter(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border/50">
          <DialogHeader className="border-b border-border/50 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              تفاصيل البناية
            </DialogTitle>
            <DialogDescription>{selectedCenter?.centerName}</DialogDescription>
          </DialogHeader>
          {selectedCenter && (
            <div className="space-y-6 pt-2">
              {/* أولًا - البيانات التعريفية */}
              <SectionCard title="أولًا - البيانات التعريفية">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="اسم البناية أو المركز" value={selectedCenter.centerName} />
                  <DetailItem label="البرنامج الاجتماعي الموجود بالمركز" value={selectedCenter.socialProgram} />
                  <DetailItem label="العنوان الكامل" value={selectedCenter.fullAddress} className="md:col-span-2" />
                  <DetailItem label="الجماعة الترابية" value={selectedCenter.territorialCommunity} />
                  <DetailItem label="القيادة / الدائرة" value={selectedCenter.circle} />
                  <DetailItem label="الإقليم أو العمالة" value={selectedCenter.province} />
                </div>
              </SectionCard>

              {/* ثانيًا - المعطيات الإدارية والقانونية */}
              <SectionCard title="ثانيًا - المعطيات الإدارية والقانونية">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="هل البناية موضوع رهن إشارة التعاون الوطني من طرف INDH" value={selectedCenter.indhMortgage} className="md:col-span-2" />
                  <DetailItem label="الشريك أو الجمعية المتواجدة بالمركز الاجتماعي" value={selectedCenter.partnerAssociation} className="md:col-span-2" />
                  <DetailItem label="تدبير المركز الاجتماعي" value={selectedCenter.centerManagement} />
                  <DetailItem label="الوضعية القانونية للعقار" value={selectedCenter.legalStatus} />
                  <DetailItem label="مراجع الرسم العقاري إن وجد" value={selectedCenter.propertyReference} className="md:col-span-2" />
                  <DetailItem label="طبيعة الخدمات والأنشطة المقدمة" value={selectedCenter.servicesNature} className="md:col-span-2" />
                  <DetailItem label="الفئات المستفيدة" value={selectedCenter.beneficiaryCategories} className="md:col-span-2" />
                  <DetailItem label="العدد التقريبي للمستفيدين شهريًا" value={selectedCenter.monthlyBeneficiaries} />
                  <DetailItem label="الوثائق القانونية المتوفرة" value={selectedCenter.availableLegalDocuments} className="md:col-span-2" />
                </div>
              </SectionCard>

              {/* ثالثًا - معطيات الإنجاز */}
              <SectionCard title="ثالثًا - معطيات الإنجاز">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DetailItem label="سنة إنجاز المشروع" value={selectedCenter.completionYear} />
                  <DetailItem label="تاريخ الشروع في الاستغلال الفعلي" value={selectedCenter.operationStartDate} />
                  <DetailItem label="الوضعية الحالية" value={selectedCenter.currentStatus} />
                </div>
              </SectionCard>

              {/* رابعًا - الوضعية التقنية للبناية */}
              <SectionCard title="رابعًا - الوضعية التقنية للبناية">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="المساحة الإجمالية (متر مربع)" value={selectedCenter.totalArea} />
                  <DetailItem label="الحالة العامة" value={selectedCenter.generalCondition} />
                  <DetailItem label="القاعات والمرافق المتوفرة" value={selectedCenter.availableRooms} className="md:col-span-2" />
                  <DetailItem label="توفر الماء الصالح للشرب" value={selectedCenter.hasWater ? "نعم" : "لا"} />
                  <DetailItem label="توفر الكهرباء" value={selectedCenter.hasElectricity ? "نعم" : "لا"} />
                  <DetailItem label="توفر شبكة التطهير" value={selectedCenter.hasSanitation ? "نعم" : "لا"} />
                  <DetailItem label="الولوجيات للأشخاص في وضعية إعاقة" value={selectedCenter.hasAccessibility ? "نعم" : "لا"} />
                  <DetailItem label="ملاحظات تقنية وأشغال التأهيل المطلوبة" value={selectedCenter.technicalNotes} className="md:col-span-2" />
                </div>
              </SectionCard>

              {/* سادسًا - وضعية التسليم إلى مؤسسة التعاون الوطني */}
              <SectionCard title="سادسًا - وضعية التسليم إلى مؤسسة التعاون الوطني">
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="هل تم اقتراح البناية للتسليم" value={selectedCenter.proposedForHandover ? "نعم" : "لا"} />
                  <DetailItem label="مبررات وأهداف التسليم" value={selectedCenter.handoverJustification} />
                  <DetailItem label="الوثائق المتوفرة قصد التسليم" value={selectedCenter.handoverDocuments} />
                  <DetailItem label="النواقص أو الإكراهات المسجلة" value={selectedCenter.handoverConstraints} />
                </div>
              </SectionCard>

              {/* سابعًا - ملاحظات وتوصيات */}
              <SectionCard title="سابعًا - ملاحظات وتوصيات">
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="ملاحظات وتوصيات" value={selectedCenter.observations} />
                </div>
              </SectionCard>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingCenter} onOpenChange={() => setEditingCenter(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border/50">
          <DialogHeader className="border-b border-border/50 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              تعديل البناية
            </DialogTitle>
            <DialogDescription>قم بتعديل بيانات البناية {editingCenter?.centerName}</DialogDescription>
          </DialogHeader>
          <CenterForm 
            editCenter={editingCenter} 
            onSuccess={() => setEditingCenter(null)} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-destructive">تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف البناية "{deleteConfirm?.centerName}"؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="border-border/50">
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Spinner className="h-4 w-4" /> : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border/30">
      <h4 className="font-semibold mb-4 text-primary text-sm">{title}</h4>
      {children}
    </div>
  );
}

function DetailItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value || "-"}</p>
    </div>
  );
}
