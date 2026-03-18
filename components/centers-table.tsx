"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Center } from "@/types/center";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CenterForm } from "./center-form";
import { regions } from "@/lib/morocco-data";
import { Search, Trash2, Edit, Eye, X } from "lucide-react";

export function CentersTable() {
  const { userData } = useAuth();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterProvince, setFilterProvince] = useState<string>("all");
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Center | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!userData) return;

    // Always fetch all centers - filter client-side for users to avoid composite index requirement
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
      
      // Sort client-side by createdAt descending
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
      center.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.licenseNumber.includes(searchTerm) ||
      center.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = filterRegion === "all" || center.region === filterRegion;
    const matchesProvince = filterProvince === "all" || center.province === filterProvince;
    
    return matchesSearch && matchesRegion && matchesProvince;
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

  const availableProvinces = filterRegion !== "all" 
    ? regions.find(r => r.name === filterRegion)?.provinces || []
    : [];

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
          <CardTitle>قائمة المراكز</CardTitle>
          <CardDescription>
            {userData?.role === "admin" 
              ? `جميع المراكز المسجلة (${filteredCenters.length} مركز)`
              : `المراكز في إقليم ${userData?.province} (${filteredCenters.length} مركز)`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو رقم الرخصة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            {userData?.role === "admin" && (
              <>
                <Select value={filterRegion} onValueChange={(v) => {
                  setFilterRegion(v);
                  setFilterProvince("all");
                }}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="فلترة بالجهة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الجهات</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region.name} value={region.name}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {filterRegion !== "all" && (
                  <Select value={filterProvince} onValueChange={setFilterProvince}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="فلترة بالإقليم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقاليم</SelectItem>
                      {availableProvinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
          </div>

          {filteredCenters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد مراكز مسجلة
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم المركز</TableHead>
                      <TableHead className="text-right">الإقليم</TableHead>
                      <TableHead className="text-right">رقم الرخصة</TableHead>
                      <TableHead className="text-right">البرنامج</TableHead>
                      <TableHead className="text-right">الوسط</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCenters.map((center) => (
                      <TableRow key={center.id}>
                        <TableCell className="font-medium">{center.centerName}</TableCell>
                        <TableCell>{center.province}</TableCell>
                        <TableCell dir="ltr">{center.licenseNumber}</TableCell>
                        <TableCell>{center.program}</TableCell>
                        <TableCell>
                          <Badge variant={center.environment === "حضري" ? "default" : "secondary"}>
                            {center.environment}
                          </Badge>
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
            <DialogTitle>تفاصيل المركز</DialogTitle>
            <DialogDescription>{selectedCenter?.centerName}</DialogDescription>
          </DialogHeader>
          {selectedCenter && (
            <div className="space-y-6">
              {/* المعلومات الأساسية */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2">المعلومات الأساسية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="الجهة" value={selectedCenter.region} />
                  <DetailItem label="الإقليم" value={selectedCenter.province} />
                  <DetailItem label="الدائرة/القيادة" value={selectedCenter.circle} />
                  <DetailItem label="الجماعة الترابية أو المقاطعة" value={selectedCenter.territorialCommunity} />
                  <DetailItem label="اسم المنشأة أو المركز" value={selectedCenter.centerName} />
                  <DetailItem label="البرنامج الذي أحدثت في إطاره المنشأة" value={selectedCenter.program} />
                  <DetailItem label="رقم الرخصة" value={selectedCenter.licenseNumber} />
                </div>
              </div>

              {/* العنوان ومعلومات الاتصال */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2">العنوان ومعلومات الاتصال</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="العنوان" value={selectedCenter.address} className="md:col-span-2" />
                  <DetailItem label="رقم الهاتف" value={selectedCenter.phone} />
                  <DetailItem label="البريد الإلكتروني" value={selectedCenter.email} />
                  <DetailItem label="الإحداثيات الجغرافية" value={selectedCenter.coordinates} />
                </div>
              </div>

              {/* الوسط */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2">الوسط</h4>
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="الوسط" value={selectedCenter.environment} />
                </div>
              </div>

              {/* الملكية والاستغلال */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2">الملكية والاستغلال</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DetailItem label="الملكية العقارية" value={selectedCenter.propertyOwnership} />
                  <DetailItem label="مكتري" value={selectedCenter.tenant} />
                  <DetailItem label="حالة الاستغلال" value={selectedCenter.exploitationStatus} />
                </div>
              </div>

              {/* الحالة البنيوية */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2">الحالة البنيوية</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DetailItem label="الحالة البنيوية" value={selectedCenter.structuralCondition} />
                  <DetailItem label="عدد الطوابق" value={selectedCenter.numberOfFloors} />
                  <DetailItem label="المساحة المبنية" value={selectedCenter.buildingArea ? `${selectedCenter.buildingArea} م²` : ""} />
                  <DetailItem label="المساحة الإجمالية للأرض" value={selectedCenter.landArea ? `${selectedCenter.landArea} م²` : ""} />
                  <DetailItem label="عدد المرافق" value={selectedCenter.numberOfFacilities} />
                </div>
              </div>

              {/* الربط بالشبكات */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2">الربط بالشبكات</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="هل المنشأة مربوطة بشبكة الماء الصالح للشرب" value={selectedCenter.waterConnection ? "نعم" : "لا"} />
                  <DetailItem label="هل المنشأة مربوطة بشبكة الكهرباء" value={selectedCenter.electricityConnection ? "نعم" : "لا"} />
                  <DetailItem label="هل المنشأة مربوطة بشبكة التطهير" value={selectedCenter.sanitationConnection ? "نعم" : "لا"} />
                  <DetailItem label="هل للمنشأة ولوجية لذوي الاحتياجات الخاصة" value={selectedCenter.accessibilityForDisabled ? "نعم" : "لا"} />
                </div>
              </div>

              {/* الشراكات */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2">الشراكات</h4>
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="موضوع الشراكة مع INDH (المبادرة الوطنية للتنمية البشرية)" value={selectedCenter.indhPartnership} />
                  <DetailItem label="موضوع رهن إشارة التعاون الوطني" value={selectedCenter.nationalCooperationMortgage} />
                </div>
              </div>

              {/* الخدمات والموارد */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2">الخدمات والموارد</h4>
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="الخدمات المقدمة حسب الفئات المستهدفة" value={selectedCenter.servicesProvided} />
                  <DetailItem label="التجهيزات والمعدات" value={selectedCenter.equipmentAndSupplies} />
                  <DetailItem label="الموارد البشرية وأعدادها" value={selectedCenter.humanResources} />
                </div>
              </div>

              {/* الإشكاليات */}
              <div>
                <h4 className="font-semibold mb-3 border-b pb-2">الإشكاليات</h4>
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="الإشكاليات المطروحة في تدبير المنشأة" value={selectedCenter.managementIssues} />
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
            <DialogTitle>تعديل المركز</DialogTitle>
            <DialogDescription>قم بتعديل بيانات المركز {editingCenter?.centerName}</DialogDescription>
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
              هل أنت متأكد من حذف المركز "{deleteConfirm?.centerName}"؟ لا يمكن التراجع عن هذا الإجراء.
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
