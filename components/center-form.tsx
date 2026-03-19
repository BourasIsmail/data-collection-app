"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Center, 
  SERVICE_TYPES, 
  BUILDING_CONDITIONS, 
  CENTER_MANAGEMENT_OPTIONS, 
  LEGAL_STATUS_OPTIONS 
} from "@/types/center";
import { useAuth } from "@/contexts/auth-context";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle } from "lucide-react";
import { 
  provinces as moroccoProvinces, 
  getCommunesByProvince 
} from "@/lib/morocco-admin-divisions";

interface CenterFormProps {
  onSuccess?: () => void;
  editCenter?: Center | null;
}

const initialFormData = {
  // البيانات الأساسية
  centerName: "",
  province: "",
  territorialCommunity: "",
  fullAddress: "",
  totalArea: "",
  
  // البيانات التصنيفية
  buildingCondition: "",
  servicesNature: [] as string[],
  centerManagement: "",
  legalStatus: "",
  
  // بيانات إضافية
  partnerAssociation: "",
  beneficiaryCategories: "",
  monthlyBeneficiaries: "",
  observations: ""
};

export function CenterForm({ onSuccess, editCenter }: CenterFormProps) {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);
  
  const [formData, setFormData] = useState(initialFormData);
  
  // Cascading dropdown state
  const [availableCommunes, setAvailableCommunes] = useState<string[]>([]);

  // Initialize form when editing or for user accounts
  useEffect(() => {
    if (editCenter) {
      setFormData({
        centerName: editCenter.centerName || "",
        province: editCenter.province || "",
        territorialCommunity: editCenter.territorialCommunity || "",
        fullAddress: editCenter.fullAddress || "",
        totalArea: editCenter.totalArea || "",
        buildingCondition: editCenter.buildingCondition || "",
        servicesNature: editCenter.servicesNature || [],
        centerManagement: editCenter.centerManagement || "",
        legalStatus: editCenter.legalStatus || "",
        partnerAssociation: editCenter.partnerAssociation || "",
        beneficiaryCategories: editCenter.beneficiaryCategories || "",
        monthlyBeneficiaries: editCenter.monthlyBeneficiaries || "",
        observations: editCenter.observations || ""
      });
      // Initialize communes for editing
      if (editCenter.province) {
        setAvailableCommunes(getCommunesByProvince(editCenter.province));
      }
      setFormInitialized(true);
    } else if (userData?.role === "user" && userData.province) {
      setFormData(prev => ({
        ...prev,
        province: userData.province
      }));
      // Initialize communes for user's province
      setAvailableCommunes(getCommunesByProvince(userData.province));
      setFormInitialized(true);
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

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesNature: prev.servicesNature.includes(service)
        ? prev.servicesNature.filter(s => s !== service)
        : [...prev.servicesNature, service]
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
            province: prev.province
          }));
        } else {
          setFormData(initialFormData);
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
    <Card className="w-full">
      <CardHeader className="text-right">
        <CardTitle>{editCenter ? "تعديل بيانات المركز" : "إضافة مركز جديد"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {editCenter ? "قم بتعديل بيانات المركز" : "قم بملء جميع الحقول المطلوبة"}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* البيانات الأساسية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary text-right">البيانات الأساسية</h3>
            
            <div className="space-y-2 text-right">
              <label className="block text-sm font-medium">اسم المركز أو المركب الاجتماعي <span className="text-destructive">*</span></label>
              <Input
                value={formData.centerName}
                onChange={(e) => setFormData(prev => ({ ...prev, centerName: e.target.value }))}
                placeholder="أدخل اسم المركز أو المركب الاجتماعي"
                className="text-right"
                dir="rtl"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
              {/* الجماعة الترابية - on the right */}
              <div className="space-y-2 text-right">
                <label className="block text-sm font-medium">الجماعة الترابية <span className="text-destructive">*</span></label>
                <Select 
                  value={formData.territorialCommunity} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, territorialCommunity: v }))}
                  disabled={!formData.province}
                  required
                >
                  <SelectTrigger className="w-full text-right" dir="rtl">
                    <SelectValue placeholder={formData.province ? "اختر الجماعة الترابية" : "اختر الإقليم أولاً"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {availableCommunes.map((commune) => (
                      <SelectItem key={commune} value={commune}>
                        {commune}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* الإقليم أو العمالة - on the left */}
              <div className="space-y-2 text-right">
                <label className="block text-sm font-medium">الإقليم أو العمالة <span className="text-destructive">*</span></label>
                <Select 
                  value={formData.province} 
                  onValueChange={(v) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      province: v,
                      territorialCommunity: "" // Reset commune
                    }));
                    setAvailableCommunes(getCommunesByProvince(v));
                  }}
                  disabled={isUserMode}
                  required
                >
                  <SelectTrigger className="w-full text-right" dir="rtl">
                    <SelectValue placeholder="اختر الإقليم أو العمالة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {moroccoProvinces.map((province) => (
                      <SelectItem key={province.name} value={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 text-right">
              <label className="block text-sm font-medium">العنوان الكامل</label>
              <Textarea
                value={formData.fullAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
                placeholder="أدخل العنوان الكامل"
                className="text-right"
                dir="rtl"
                rows={2}
              />
            </div>

            <div className="space-y-2 text-right">
              <label className="block text-sm font-medium">المساحة الإجمالية للمركز أو المركب الاجتماعي بمتر مربع</label>
              <Input
                type="number"
                value={formData.totalArea}
                onChange={(e) => setFormData(prev => ({ ...prev, totalArea: e.target.value }))}
                placeholder="أدخل المساحة بمتر مربع"
                className="text-right"
                dir="rtl"
              />
            </div>

            {/* Location summary */}
            {formData.province && formData.territorialCommunity && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-right">
                <p className="text-sm font-medium text-primary mb-2">الموقع المختار:</p>
                <p className="text-sm">
                  <span className="font-medium">الإقليم:</span> {formData.province} | 
                  <span className="font-medium"> الجماعة:</span> {formData.territorialCommunity}
                </p>
              </div>
            )}
          </div>

          {/* البيانات التصنيفية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary text-right">البيانات التصنيفية</h3>
            
            {/* حالة البناية - Radio */}
            <div className="space-y-3 text-right">
              <label className="block text-sm font-medium">حالة البناية <span className="text-destructive">*</span></label>
              <RadioGroup
                value={formData.buildingCondition}
                onValueChange={(v) => setFormData(prev => ({ ...prev, buildingCondition: v }))}
                className="flex flex-wrap gap-6 justify-end"
                dir="rtl"
              >
                {BUILDING_CONDITIONS.map((condition) => (
                  <div key={condition} className="flex items-center gap-2 flex-row-reverse">
                    <Label htmlFor={`condition-${condition}`} className="cursor-pointer">
                      {condition}
                    </Label>
                    <RadioGroupItem value={condition} id={`condition-${condition}`} />
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* طبيعة الخدمات والأنشطة - Multi-checkbox */}
            <div className="space-y-3 text-right">
              <label className="block text-sm font-medium">طبيعة الخدمات والأنشطة</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-lg bg-muted/20">
                {SERVICE_TYPES.map((service) => (
                  <div key={service} className="flex items-center gap-2 justify-end">
                    <Label htmlFor={`service-${service}`} className="cursor-pointer text-sm">
                      {service}
                    </Label>
                    <Checkbox
                      id={`service-${service}`}
                      checked={formData.servicesNature.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                  </div>
                ))}
              </div>
              {formData.servicesNature.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  تم اختيار {formData.servicesNature.length} خدمة/نشاط
                </p>
              )}
            </div>

            {/* الوضعية القانونية للعقار - Radio */}
            <div className="space-y-3 text-right">
              <label className="block text-sm font-medium">الوضعية القانونية للعقار <span className="text-destructive">*</span></label>
              <RadioGroup
                value={formData.legalStatus}
                onValueChange={(v) => setFormData(prev => ({ ...prev, legalStatus: v }))}
                className="flex flex-col gap-3 items-end"
                dir="rtl"
              >
                {LEGAL_STATUS_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2 flex-row-reverse">
                    <Label htmlFor={`legal-${option}`} className="cursor-pointer">
                      {option}
                    </Label>
                    <RadioGroupItem value={option} id={`legal-${option}`} />
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* تدبير المركز - Radio */}
            <div className="space-y-3 text-right">
              <label className="block text-sm font-medium">تدبير المركز <span className="text-destructive">*</span></label>
              <RadioGroup
                value={formData.centerManagement}
                onValueChange={(v) => setFormData(prev => ({ ...prev, centerManagement: v }))}
                className="flex flex-col gap-3 items-end"
                dir="rtl"
              >
                {CENTER_MANAGEMENT_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2 flex-row-reverse">
                    <Label htmlFor={`management-${option}`} className="cursor-pointer">
                      {option}
                    </Label>
                    <RadioGroupItem value={option} id={`management-${option}`} />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* بيانات إضافية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary text-right">بيانات إضافية</h3>
            
            <div className="space-y-2 text-right">
              <label className="block text-sm font-medium">الشريك أو الجمعية المتواجدة بالمركز الاجتماعي</label>
              <Input
                value={formData.partnerAssociation}
                onChange={(e) => setFormData(prev => ({ ...prev, partnerAssociation: e.target.value }))}
                placeholder="أدخل اسم الشريك أو الجمعية"
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-right">
                <label className="block text-sm font-medium">الفئات المستفيدة</label>
                <Input
                  value={formData.beneficiaryCategories}
                  onChange={(e) => setFormData(prev => ({ ...prev, beneficiaryCategories: e.target.value }))}
                  placeholder="أدخل الفئات المستفيدة"
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2 text-right">
                <label className="block text-sm font-medium">معدل عدد المستفيدين شهريًا</label>
                <Input
                  type="number"
                  value={formData.monthlyBeneficiaries}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyBeneficiaries: e.target.value }))}
                  placeholder="أدخل العدد التقريبي"
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2 text-right">
              <label className="block text-sm font-medium">ملاحظات</label>
              <Textarea
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="أدخل أي ملاحظات إضافية"
                className="text-right"
                dir="rtl"
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            {success && (
              <div className="flex items-center gap-2 text-green-600 animate-in fade-in">
                <CheckCircle className="h-5 w-5" />
                <span>تم الحفظ بنجاح</span>
              </div>
            )}
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? <Spinner className="h-4 w-4" /> : editCenter ? "تحديث البيانات" : "حفظ البيانات"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
