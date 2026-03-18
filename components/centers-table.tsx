"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CenterForm } from "./center-form";
import { exportToCSV, exportToExcel } from "@/lib/export-utils";
import { Search, Trash2, Edit, Eye, Building, MapPin, FileText, Download, ChevronRight, ChevronLeft, FileSpreadsheet } from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function CentersTable() {
  const { userData } = useAuth();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Center | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");

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

  // Get unique provinces for filter
  const uniqueProvinces = useMemo(() => {
    const provinces = [...new Set(centers.map(c => c.province).filter(Boolean))];
    return provinces.sort();
  }, [centers]);

  // Filtered centers
  const filteredCenters = useMemo(() => {
    return centers.filter(center => {
      const matchesSearch = 
        center.centerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.socialProgram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.territorialCommunity?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || center.currentStatus === statusFilter;
      const matchesCondition = conditionFilter === "all" || center.generalCondition === conditionFilter;
      const matchesProvince = provinceFilter === "all" || center.province === provinceFilter;
      
      return matchesSearch && matchesStatus && matchesCondition && matchesProvince;
    });
  }, [centers, searchTerm, statusFilter, conditionFilter, provinceFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCenters = filteredCenters.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, conditionFilter, provinceFilter, itemsPerPage]);

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

  const handleExportCSV = () => {
    const dataToExport = filteredCenters.length > 0 ? filteredCenters : centers;
    if (dataToExport.length === 0) {
      alert("لا توجد بيانات للتصدير");
      return;
    }
    exportToCSV(dataToExport, `centers-data-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportExcel = () => {
    const dataToExport = filteredCenters.length > 0 ? filteredCenters : centers;
    if (dataToExport.length === 0) {
      alert("لا توجد بيانات للتصدير");
      return;
    }
    exportToExcel(dataToExport, `centers-data-${new Date().toISOString().split('T')[0]}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setConditionFilter("all");
    setProvinceFilter("all");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all" || conditionFilter !== "all" || provinceFilter !== "all";

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
          {/* Export Buttons */}
          {userData?.role === "admin" && filteredCenters.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                تصدير CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportExcel}
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                تصدير Excel
              </Button>
              {hasActiveFilters && (
                <span className="text-xs text-muted-foreground mr-2">
                  (سيتم تصدير {filteredCenters.length} من {centers.length} بناية حسب الفلاتر المطبقة)
                </span>
              )}
            </div>
          )}

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
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
            
            <div className="flex flex-wrap gap-3">
              {/* Province Filter - Admin only */}
              {userData?.role === "admin" && (
                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
                    <SelectValue placeholder="الإقليم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأقاليم</SelectItem>
                    {uniqueProvinces.map((province) => (
                      <SelectItem key={province} value={province}>{province}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] bg-secondary/50 border-border/50">
                  <SelectValue placeholder="الوضعية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الوضعيات</SelectItem>
                  <SelectItem value="مستغل">مستغل</SelectItem>
                  <SelectItem value="متوقف">متوقف</SelectItem>
                  <SelectItem value="في طور الإنجاز">في طور الإنجاز</SelectItem>
                </SelectContent>
              </Select>

              {/* Condition Filter */}
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger className="w-[160px] bg-secondary/50 border-border/50">
                  <SelectValue placeholder="الحالة العامة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  <SelectItem value="جيدة">جيدة</SelectItem>
                  <SelectItem value="متوسطة">متوسطة</SelectItem>
                  <SelectItem value="متدهورة">متدهورة</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  مسح الفلاتر
                </Button>
              )}
            </div>
          </div>

          {filteredCenters.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">لا توجد بنايات مسجلة</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {hasActiveFilters ? "جرب تغيير معايير البحث أو الفلاتر" : "قم بإضافة بناية جديدة للبدء"}
              </p>
            </div>
          ) : (
            <>
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
                      {paginatedCenters.map((center) => (
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
                              {center.province || "-"}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{center.territorialCommunity || "-"}</TableCell>
                          <TableCell>
                            {center.currentStatus && (
                              <Badge 
                                variant="outline"
                                className={
                                  center.currentStatus === "مستغل" 
                                    ? "border-green-500/50 text-green-600 bg-green-500/10" 
                                    : center.currentStatus === "متوقف" 
                                      ? "border-red-500/50 text-red-600 bg-red-500/10" 
                                      : "border-yellow-500/50 text-yellow-600 bg-yellow-500/10"
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
                                    ? "border-green-500/50 text-green-600 bg-green-500/10" 
                                    : center.generalCondition === "متدهورة" 
                                      ? "border-red-500/50 text-red-600 bg-red-500/10" 
                                      : "border-yellow-500/50 text-yellow-600 bg-yellow-500/10"
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

              {/* Pagination */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>عرض</span>
                  <Select 
                    value={itemsPerPage.toString()} 
                    onValueChange={(v) => setItemsPerPage(Number(v))}
                  >
                    <SelectTrigger className="w-[70px] h-8 bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>من {filteredCenters.length} بناية</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    صفحة {currentPage} من {totalPages || 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
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
