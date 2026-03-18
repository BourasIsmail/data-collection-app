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
import { Search, Trash2, Edit, Eye } from "lucide-react";

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
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>قائمة البنايات</CardTitle>
          <CardDescription>
            {userData?.role === "admin" 
              ? `جميع البنايات المسجلة (${filteredCenters.length} بناية)`
              : `البنايات في إقليم ${userData?.province} (${filteredCenters.length} بناية)`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البرنامج أو الإقليم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {filteredCenters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد بنايات مسجلة
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم البناية</TableHead>
                      <TableHead className="text-right">الإقليم</TableHead>
                      <TableHead className="text-right">الجماعة الترابية</TableHead>
                      <TableHead className="text-right">الوضعية الحالية</TableHead>
                      <TableHead className="text-right">الحالة العامة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCenters.map((center) => (
                      <TableRow key={center.id}>
                        <TableCell className="font-medium">{center.centerName}</TableCell>
                        <TableCell>{center.province}</TableCell>
                        <TableCell>{center.territorialCommunity}</TableCell>
                        <TableCell>
                          {center.currentStatus && (
                            <Badge variant={
                              center.currentStatus === "مستغل" ? "default" : 
                              center.currentStatus === "متوقف" ? "destructive" : 
                              "secondary"
                            }>
                              {center.currentStatus}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {center.generalCondition && (
                            <Badge variant={
                              center.generalCondition === "جيدة" ? "default" : 
                              center.generalCondition === "متدهورة" ? "destructive" : 
                              "secondary"
                            }>
                              {center.generalCondition}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedCenter(center)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingCenter(center)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {userData?.role === "admin" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteConfirm(center)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل البناية</DialogTitle>
            <DialogDescription>{selectedCenter?.centerName}</DialogDescription>
          </DialogHeader>
          {selectedCenter && (
            <div className="space-y-6">
              {/* أولًا - البيانات التعريفية */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2 text-primary">أولًا - البيانات التعريفية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="اسم البناية أو المركز" value={selectedCenter.centerName} />
                  <DetailItem label="البرنامج الاجتماعي الموجود بالمركز" value={selectedCenter.socialProgram} />
                  <DetailItem label="العنوان الكامل" value={selectedCenter.fullAddress} className="md:col-span-2" />
                  <DetailItem label="الجماعة الترابية" value={selectedCenter.territorialCommunity} />
                  <DetailItem label="القيادة / الدائرة" value={selectedCenter.circle} />
                  <DetailItem label="الإقليم أو العمالة" value={selectedCenter.province} />
                </div>
              </div>

              {/* ثانيًا - المعطيات الإدارية والقانونية */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2 text-primary">ثانيًا - المعطيات الإدارية والقانونية</h4>
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
              </div>

              {/* ثالثًا - معطيات الإنجاز */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2 text-primary">ثالثًا - معطيات الإنجاز</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DetailItem label="سنة إنجاز المشروع" value={selectedCenter.completionYear} />
                  <DetailItem label="تاريخ الشروع في الاستغلال الفعلي" value={selectedCenter.operationStartDate} />
                  <DetailItem label="الوضعية الحالية" value={selectedCenter.currentStatus} />
                </div>
              </div>

              {/* رابعًا - الوضعية التقنية للبناية */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2 text-primary">رابعًا - الوضعية التقنية للبناية</h4>
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
              </div>

              {/* سادسًا - وضعية التسليم إلى مؤسسة التعاون الوطني */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2 text-primary">سادسًا - وضعية التسليم إلى مؤسسة التعاون الوطني</h4>
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="هل تم اقتراح البناية للتسليم" value={selectedCenter.proposedForHandover ? "نعم" : "لا"} />
                  <DetailItem label="مبررات وأهداف التسليم" value={selectedCenter.handoverJustification} />
                  <DetailItem label="الوثائق المتوفرة قصد التسليم" value={selectedCenter.handoverDocuments} />
                  <DetailItem label="النواقص أو الإكراهات المسجلة" value={selectedCenter.handoverConstraints} />
                </div>
              </div>

              {/* سابعًا - ملاحظات وتوصيات */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2 text-primary">سابعًا - ملاحظات وتوصيات</h4>
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="ملاحظات وتوصيات" value={selectedCenter.observations} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingCenter} onOpenChange={() => setEditingCenter(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل البناية</DialogTitle>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف البناية "{deleteConfirm?.centerName}"؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
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

function DetailItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value || "-"}</p>
    </div>
  );
}
