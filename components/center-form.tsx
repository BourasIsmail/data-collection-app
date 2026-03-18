"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { regions, getProvincesByRegion, getRegionByProvince } from "@/lib/morocco-data";
import { Center } from "@/types/center";
import { useAuth } from "@/contexts/auth-context";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle } from "lucide-react";

interface CenterFormProps {
  onSuccess?: () => void;
  editCenter?: Center | null;
}

const initialFormData = {
  region: "",
  province: "",
  centerName: "",
  program: "",
  licenseNumber: "",
  environment: "",
  address: "",
  phone: "",
  email: "",
  coordinates: "",
  propertyOwnership: "",
  tenant: "",
  exploitationStatus: "",
  structuralCondition: "",
  numberOfFloors: "",
  buildingArea: "",
  landArea: "",
  numberOfFacilities: "",
  waterConnection: false,
  electricityConnection: false,
  sanitationConnection: false,
  accessibilityForDisabled: false,
  indhPartnership: "",
  nationalCooperationMortgage: "",
  servicesProvided: "",
  equipmentAndSupplies: "",
  humanResources: "",
  managementIssues: "",
  notes: ""
};

export function CenterForm({ onSuccess, editCenter }: CenterFormProps) {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);
  
  const [formData, setFormData] = useState(initialFormData);
  const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);

  // Initialize form when editing or for user accounts
  useEffect(() => {
    if (editCenter) {
      setFormData({
        region: editCenter.region || "",
        province: editCenter.province || "",
        centerName: editCenter.centerName || "",
        program: editCenter.program || "",
        licenseNumber: editCenter.licenseNumber || "",
        environment: editCenter.environment || "",
        address: editCenter.address || "",
        phone: editCenter.phone || "",
        email: editCenter.email || "",
        coordinates: editCenter.coordinates || "",
        propertyOwnership: editCenter.propertyOwnership || "",
        tenant: editCenter.tenant || "",
        exploitationStatus: editCenter.exploitationStatus || "",
        structuralCondition: editCenter.structuralCondition || "",
        numberOfFloors: editCenter.numberOfFloors || "",
        buildingArea: editCenter.buildingArea || "",
        landArea: editCenter.landArea || "",
        numberOfFacilities: editCenter.numberOfFacilities || "",
        waterConnection: editCenter.waterConnection || false,
        electricityConnection: editCenter.electricityConnection || false,
        sanitationConnection: editCenter.sanitationConnection || false,
        accessibilityForDisabled: editCenter.accessibilityForDisabled || false,
        indhPartnership: editCenter.indhPartnership || "",
        nationalCooperationMortgage: editCenter.nationalCooperationMortgage || "",
        servicesProvided: editCenter.servicesProvided || "",
        equipmentAndSupplies: editCenter.equipmentAndSupplies || "",
        humanResources: editCenter.humanResources || "",
        managementIssues: editCenter.managementIssues || "",
        notes: editCenter.notes || ""
      });
      setAvailableProvinces(getProvincesByRegion(editCenter.region));
      setFormInitialized(true);
    } else if (userData?.role === "user" && userData.province) {
      const userRegion = getRegionByProvince(userData.province);
      if (userRegion) {
        setFormData(prev => ({
          ...prev,
          region: userRegion,
          province: userData.province
        }));
        setAvailableProvinces(getProvincesByRegion(userRegion));
        setFormInitialized(true);
      }
    } else if (userData?.role === "admin") {
      setFormInitialized(true);
    }
  }, [editCenter, userData]);
  
  if (!formInitialized && userData?.role === "user") {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  const handleRegionChange = (region: string) => {
    const provinces = getProvincesByRegion(region);
    setAvailableProvinces(provinces);
    setFormData(prev => ({
      ...prev,
      region,
      province: ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (editCenter?.id) {
        await updateDoc(doc(db, "centers", editCenter.id), {
          ...formData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, "centers"), {
          ...formData,
          createdAt: new Date(),
          createdBy: userData?.uid || ""
        });
      }
      
      setSuccess(true);
      
      if (!editCenter) {
        if (userData?.role === "user") {
          setFormData(prev => ({
            ...initialFormData,
            region: prev.region,
            province: prev.province
          }));
        } else {
          setFormData(initialFormData);
          setAvailableProvinces([]);
        }
      }
      
      setTimeout(() => setSuccess(false), 3000);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving center:", error);
    } finally {
      setLoading(false);
    }
  };

  const isUserMode = userData?.role === "user";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editCenter ? "تعديل بيانات المركز" : "إضافة مركز جديد"}</CardTitle>
        <CardDescription>
          {editCenter ? "قم بتعديل بيانات المركز" : "قم بملء جميع الحقول المطلوبة"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* القسم الأول: المعلومات الأساسية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">المعلومات الأساسية</h3>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>الجهة</FieldLabel>
                  <Select 
                    value={formData.region} 
                    onValueChange={handleRegionChange}
                    disabled={isUserMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجهة" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.name} value={region.name}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                
                <Field>
                  <FieldLabel>الإقليم</FieldLabel>
                  <Select 
                    value={formData.province} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, province: v }))}
                    disabled={isUserMode || !formData.region}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الإقليم" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProvinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>اسم المركز</FieldLabel>
                <Input
                  value={formData.centerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, centerName: e.target.value }))}
                  placeholder="أدخل اسم المركز"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>البرنامج</FieldLabel>
                  <Input
                    value={formData.program}
                    onChange={(e) => setFormData(prev => ({ ...prev, program: e.target.value }))}
                    placeholder="أدخل البرنامج"
                  />
                </Field>

                <Field>
                  <FieldLabel>رقم الرخصة</FieldLabel>
                  <Input
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="أدخل رقم الرخصة"
                    dir="ltr"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>الوسط</FieldLabel>
                  <Select 
                    value={formData.environment} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, environment: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوسط" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="حضري">حضري</SelectItem>
                      <SelectItem value="قروي">قروي</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>العنوان</FieldLabel>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="أدخل العنوان"
                  />
                </Field>
              </div>
            </FieldGroup>
          </div>

          {/* القسم الثاني: معلومات الاتصال */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">معلومات الاتصال</h3>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>الهاتف</FieldLabel>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="أدخل رقم الهاتف"
                    dir="ltr"
                  />
                </Field>

                <Field>
                  <FieldLabel>البريد الإلكتروني</FieldLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="أدخل البريد الإلكتروني"
                    dir="ltr"
                  />
                </Field>

                <Field>
                  <FieldLabel>الإحداثيات الجغرافية</FieldLabel>
                  <Input
                    value={formData.coordinates}
                    onChange={(e) => setFormData(prev => ({ ...prev, coordinates: e.target.value }))}
                    placeholder="أدخل الإحداثيات"
                    dir="ltr"
                  />
                </Field>
              </div>
            </FieldGroup>
          </div>

          {/* القسم الثالث: الملكية والاستغلال */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">الملكية والاستغلال</h3>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>الملكية العقارية</FieldLabel>
                  <Input
                    value={formData.propertyOwnership}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyOwnership: e.target.value }))}
                    placeholder="أدخل الملكية العقارية"
                  />
                </Field>

                <Field>
                  <FieldLabel>مكتري</FieldLabel>
                  <Input
                    value={formData.tenant}
                    onChange={(e) => setFormData(prev => ({ ...prev, tenant: e.target.value }))}
                    placeholder="أدخل معلومات المكتري"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>حالة الاستغلال</FieldLabel>
                <Select 
                  value={formData.exploitationStatus} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, exploitationStatus: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة الاستغلال" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مستغل">مستغل</SelectItem>
                    <SelectItem value="غير مستغل">غير مستغل</SelectItem>
                    <SelectItem value="في طور الإنجاز">في طور الإنجاز</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>

          {/* القسم الرابع: الحالة البنيوية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">الحالة البنيوية</h3>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>الحالة البنيوية</FieldLabel>
                  <Select 
                    value={formData.structuralCondition} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, structuralCondition: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة البنيوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جيدة">جيدة</SelectItem>
                      <SelectItem value="متوسطة">متوسطة</SelectItem>
                      <SelectItem value="رديئة">رديئة</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>عدد الطوابق</FieldLabel>
                  <Input
                    value={formData.numberOfFloors}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfFloors: e.target.value }))}
                    placeholder="أدخل عدد الطوابق"
                    dir="ltr"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>مساحة البناء (م²)</FieldLabel>
                  <Input
                    value={formData.buildingArea}
                    onChange={(e) => setFormData(prev => ({ ...prev, buildingArea: e.target.value }))}
                    placeholder="أدخل مساحة البناء"
                    dir="ltr"
                  />
                </Field>

                <Field>
                  <FieldLabel>مساحة الأرض (م²)</FieldLabel>
                  <Input
                    value={formData.landArea}
                    onChange={(e) => setFormData(prev => ({ ...prev, landArea: e.target.value }))}
                    placeholder="أدخل مساحة الأرض"
                    dir="ltr"
                  />
                </Field>

                <Field>
                  <FieldLabel>عدد المرافق</FieldLabel>
                  <Input
                    value={formData.numberOfFacilities}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfFacilities: e.target.value }))}
                    placeholder="أدخل عدد المرافق"
                    dir="ltr"
                  />
                </Field>
              </div>
            </FieldGroup>
          </div>

          {/* القسم الخامس: الربط بالشبكات */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">الربط بالشبكات</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="waterConnection"
                  checked={formData.waterConnection}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, waterConnection: checked as boolean }))}
                />
                <label htmlFor="waterConnection" className="text-sm cursor-pointer">شبكة الماء</label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="electricityConnection"
                  checked={formData.electricityConnection}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, electricityConnection: checked as boolean }))}
                />
                <label htmlFor="electricityConnection" className="text-sm cursor-pointer">شبكة الكهرباء</label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="sanitationConnection"
                  checked={formData.sanitationConnection}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sanitationConnection: checked as boolean }))}
                />
                <label htmlFor="sanitationConnection" className="text-sm cursor-pointer">شبكة التطهير</label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="accessibilityForDisabled"
                  checked={formData.accessibilityForDisabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, accessibilityForDisabled: checked as boolean }))}
                />
                <label htmlFor="accessibilityForDisabled" className="text-sm cursor-pointer">ولوجية ذوي الاحتياجات</label>
              </div>
            </div>
          </div>

          {/* القسم السادس: الشراكات */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">الشراكات</h3>
            <FieldGroup>
              <Field>
                <FieldLabel>موضوع الشراكة مع INDH</FieldLabel>
                <Textarea
                  value={formData.indhPartnership}
                  onChange={(e) => setFormData(prev => ({ ...prev, indhPartnership: e.target.value }))}
                  placeholder="أدخل موضوع الشراكة مع INDH"
                  rows={2}
                />
              </Field>

              <Field>
                <FieldLabel>موضوع رهن التعاون الوطني</FieldLabel>
                <Textarea
                  value={formData.nationalCooperationMortgage}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationalCooperationMortgage: e.target.value }))}
                  placeholder="أدخل موضوع رهن التعاون الوطني"
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </div>

          {/* القسم السابع: الخدمات والموارد */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">الخدمات والموارد</h3>
            <FieldGroup>
              <Field>
                <FieldLabel>الخدمات المقدمة</FieldLabel>
                <Textarea
                  value={formData.servicesProvided}
                  onChange={(e) => setFormData(prev => ({ ...prev, servicesProvided: e.target.value }))}
                  placeholder="أدخل الخدمات المقدمة"
                  rows={2}
                />
              </Field>

              <Field>
                <FieldLabel>التجهيزات والمعدات</FieldLabel>
                <Textarea
                  value={formData.equipmentAndSupplies}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipmentAndSupplies: e.target.value }))}
                  placeholder="أدخل التجهيزات والمعدات"
                  rows={2}
                />
              </Field>

              <Field>
                <FieldLabel>الموارد البشرية وأعدادها</FieldLabel>
                <Textarea
                  value={formData.humanResources}
                  onChange={(e) => setFormData(prev => ({ ...prev, humanResources: e.target.value }))}
                  placeholder="أدخل الموارد البشرية وأعدادها"
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </div>

          {/* القسم الثامن: ملاحظات */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">ملاحظات</h3>
            <FieldGroup>
              <Field>
                <FieldLabel>الإشكاليات المطروحة في تدبير المنشأة</FieldLabel>
                <Textarea
                  value={formData.managementIssues}
                  onChange={(e) => setFormData(prev => ({ ...prev, managementIssues: e.target.value }))}
                  placeholder="أدخل الإشكاليات المطروحة"
                  rows={2}
                />
              </Field>

              <Field>
                <FieldLabel>ملاحظات أخرى</FieldLabel>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="أدخل أي ملاحظات إضافية"
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </div>

          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span>{editCenter ? "تم تحديث البيانات بنجاح" : "تم حفظ البيانات بنجاح"}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : (editCenter ? "تحديث البيانات" : "حفظ البيانات")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
