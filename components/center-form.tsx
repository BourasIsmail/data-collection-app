"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { getRegionByProvince } from "@/lib/morocco-data";
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
  // أولًا - البيانات التعريفية
  centerName: "",
  socialProgram: "",
  fullAddress: "",
  territorialCommunity: "",
  circle: "",
  province: "",
  
  // ثانيًا - المعطيات الإدارية والقانونية
  indhMortgage: "",
  partnerAssociation: "",
  centerManagement: "",
  legalStatus: "",
  propertyReference: "",
  servicesNature: "",
  beneficiaryCategories: "",
  monthlyBeneficiaries: "",
  availableLegalDocuments: "",
  
  // ثالثًا - معطيات الإنجاز
  completionYear: "",
  operationStartDate: "",
  currentStatus: "",
  
  // رابعًا - الوضعية التقنية للبناية
  totalArea: "",
  availableRooms: "",
  generalCondition: "",
  hasWater: false,
  hasElectricity: false,
  hasSanitation: false,
  hasAccessibility: false,
  technicalNotes: "",
  
  // سادسًا - وضعية التسليم إلى مؤسسة التعاون الوطني
  proposedForHandover: false,
  handoverJustification: "",
  handoverDocuments: "",
  handoverConstraints: "",
  
  // سابعًا - ملاحظات وتوصيات
  observations: ""
};

export function CenterForm({ onSuccess, editCenter }: CenterFormProps) {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);
  
  const [formData, setFormData] = useState(initialFormData);

  // Initialize form when editing or for user accounts
  useEffect(() => {
    if (editCenter) {
      setFormData({
        centerName: editCenter.centerName || "",
        socialProgram: editCenter.socialProgram || "",
        fullAddress: editCenter.fullAddress || "",
        territorialCommunity: editCenter.territorialCommunity || "",
        circle: editCenter.circle || "",
        province: editCenter.province || "",
        indhMortgage: editCenter.indhMortgage || "",
        partnerAssociation: editCenter.partnerAssociation || "",
        centerManagement: editCenter.centerManagement || "",
        legalStatus: editCenter.legalStatus || "",
        propertyReference: editCenter.propertyReference || "",
        servicesNature: editCenter.servicesNature || "",
        beneficiaryCategories: editCenter.beneficiaryCategories || "",
        monthlyBeneficiaries: editCenter.monthlyBeneficiaries || "",
        availableLegalDocuments: editCenter.availableLegalDocuments || "",
        completionYear: editCenter.completionYear || "",
        operationStartDate: editCenter.operationStartDate || "",
        currentStatus: editCenter.currentStatus || "",
        totalArea: editCenter.totalArea || "",
        availableRooms: editCenter.availableRooms || "",
        generalCondition: editCenter.generalCondition || "",
        hasWater: editCenter.hasWater || false,
        hasElectricity: editCenter.hasElectricity || false,
        hasSanitation: editCenter.hasSanitation || false,
        hasAccessibility: editCenter.hasAccessibility || false,
        technicalNotes: editCenter.technicalNotes || "",
        proposedForHandover: editCenter.proposedForHandover || false,
        handoverJustification: editCenter.handoverJustification || "",
        handoverDocuments: editCenter.handoverDocuments || "",
        handoverConstraints: editCenter.handoverConstraints || "",
        observations: editCenter.observations || ""
      });
      setFormInitialized(true);
    } else if (userData?.role === "user" && userData.province) {
      setFormData(prev => ({
        ...prev,
        province: userData.province
      }));
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
    <Card>
      <CardHeader>
        <CardTitle>{editCenter ? "تعديل بيانات البناية" : "إضافة بناية جديدة"}</CardTitle>
        <CardDescription>
          {editCenter ? "قم بتعديل بيانات البناية" : "قم بملء جميع الحقول المطلوبة"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* أولًا - البيانات التعريفية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">أولًا - البيانات التعريفية</h3>
            <FieldGroup>
              <Field>
                <FieldLabel>اسم البناية أو المركز</FieldLabel>
                <Input
                  value={formData.centerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, centerName: e.target.value }))}
                  placeholder="أدخل اسم البناية أو المركز"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>البرنامج الاجتماعي الموجود بالمركز</FieldLabel>
                <Input
                  value={formData.socialProgram}
                  onChange={(e) => setFormData(prev => ({ ...prev, socialProgram: e.target.value }))}
                  placeholder="أدخل البرنامج الاجتماعي"
                />
              </Field>

              <Field>
                <FieldLabel>العنوان الكامل</FieldLabel>
                <Textarea
                  value={formData.fullAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
                  placeholder="أدخل العنوان الكامل"
                  rows={2}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>الجماعة الترابية</FieldLabel>
                  <Input
                    value={formData.territorialCommunity}
                    onChange={(e) => setFormData(prev => ({ ...prev, territorialCommunity: e.target.value }))}
                    placeholder="أدخل الجماعة الترابية"
                  />
                </Field>

                <Field>
                  <FieldLabel>القيادة / الدائرة</FieldLabel>
                  <Input
                    value={formData.circle}
                    onChange={(e) => setFormData(prev => ({ ...prev, circle: e.target.value }))}
                    placeholder="أدخل القيادة أو الدائرة"
                  />
                </Field>

                <Field>
                  <FieldLabel>الإقليم أو العمالة</FieldLabel>
                  <Input
                    value={formData.province}
                    onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                    placeholder="أدخل الإقليم أو العمالة"
                    disabled={isUserMode}
                  />
                </Field>
              </div>
            </FieldGroup>
          </div>

          {/* ثانيًا - المعطيات الإدارية والقانونية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">ثانيًا - المعطيات الإدارية والقانونية</h3>
            <FieldGroup>
              <Field>
                <FieldLabel>هل البناية موضوع رهن إشارة التعاون الوطني من طرف INDH</FieldLabel>
                <Input
                  value={formData.indhMortgage}
                  onChange={(e) => setFormData(prev => ({ ...prev, indhMortgage: e.target.value }))}
                  placeholder="أدخل المعلومات"
                />
              </Field>

              <Field>
                <FieldLabel>الشريك أو الجمعية المتواجدة بالمركز الاجتماعي</FieldLabel>
                <Input
                  value={formData.partnerAssociation}
                  onChange={(e) => setFormData(prev => ({ ...prev, partnerAssociation: e.target.value }))}
                  placeholder="أدخل اسم الشريك أو الجمعية"
                />
              </Field>

              <Field>
                <FieldLabel>تدبير المركز الاجتماعي</FieldLabel>
                <Select 
                  value={formData.centerManagement} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, centerManagement: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التدبير" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تدبير مباشر من التعاون الوطني">تدبير مباشر من التعاون الوطني</SelectItem>
                    <SelectItem value="تدبير مفوض لجمعية">تدبير مفوض لجمعية</SelectItem>
                    <SelectItem value="تدبير مشترك مع الجمعية">تدبير مشترك مع الجمعية</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>الوضعية القانونية للعقار</FieldLabel>
                <Select 
                  value={formData.legalStatus} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, legalStatus: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الوضعية القانونية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ملكية خاصة">ملكية خاصة</SelectItem>
                    <SelectItem value="ملكية عمومية">ملكية عمومية</SelectItem>
                    <SelectItem value="عقار مستأجر">عقار مستأجر</SelectItem>
                    <SelectItem value="عقار موضوع نزاع قانوني">عقار موضوع نزاع قانوني</SelectItem>
                    <SelectItem value="عقار موضوع تنازل أو هبة">عقار موضوع تنازل أو هبة</SelectItem>
                    <SelectItem value="عقار بدون وضعية قانونية واضحة">عقار بدون وضعية قانونية واضحة</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>مراجع الرسم العقاري إن وجد</FieldLabel>
                <Input
                  value={formData.propertyReference}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyReference: e.target.value }))}
                  placeholder="أدخل مراجع الرسم العقاري"
                />
              </Field>

              <Field>
                <FieldLabel>طبيعة الخدمات والأنشطة المقدمة</FieldLabel>
                <Textarea
                  value={formData.servicesNature}
                  onChange={(e) => setFormData(prev => ({ ...prev, servicesNature: e.target.value }))}
                  placeholder="أدخل طبيعة الخدمات والأنشطة المقدمة"
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel>الفئات المستفيدة</FieldLabel>
                <Textarea
                  value={formData.beneficiaryCategories}
                  onChange={(e) => setFormData(prev => ({ ...prev, beneficiaryCategories: e.target.value }))}
                  placeholder="أدخل الفئات المستفيدة"
                  rows={2}
                />
              </Field>

              <Field>
                <FieldLabel>العدد التقريبي للمستفيدين شهريًا</FieldLabel>
                <Input
                  value={formData.monthlyBeneficiaries}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyBeneficiaries: e.target.value }))}
                  placeholder="أدخل العدد التقريبي"
                  dir="ltr"
                />
              </Field>

              <Field>
                <FieldLabel>الوثائق القانونية المتوفرة</FieldLabel>
                <Textarea
                  value={formData.availableLegalDocuments}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableLegalDocuments: e.target.value }))}
                  placeholder="أدخل الوثائق القانونية المتوفرة"
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </div>

          {/* ثالثًا - معطيات الإنجاز */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">ثالثًا - معطيات الإنجاز</h3>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>سنة إنجاز المشروع</FieldLabel>
                  <Input
                    value={formData.completionYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, completionYear: e.target.value }))}
                    placeholder="أدخل سنة الإنجاز"
                    dir="ltr"
                  />
                </Field>

                <Field>
                  <FieldLabel>تاريخ الشروع في الاستغلال الفعلي</FieldLabel>
                  <Input
                    value={formData.operationStartDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, operationStartDate: e.target.value }))}
                    placeholder="أدخل تاريخ الشروع في الاستغلال"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>الوضعية الحالية</FieldLabel>
                <Select 
                  value={formData.currentStatus} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, currentStatus: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الوضعية الحالية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مستغل">مستغل</SelectItem>
                    <SelectItem value="متوقف">متوقف</SelectItem>
                    <SelectItem value="غير مستغل">غير مستغل</SelectItem>
                    <SelectItem value="يحتاج تأهيل">يحتاج تأهيل</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>

          {/* رابعًا - الوضعية التقنية للبناية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">رابعًا - الوضعية التقنية للبناية</h3>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>المساحة الإجمالية (متر مربع)</FieldLabel>
                  <Input
                    value={formData.totalArea}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalArea: e.target.value }))}
                    placeholder="أدخل المساحة الإجمالية"
                    dir="ltr"
                  />
                </Field>

                <Field>
                  <FieldLabel>الحالة العامة</FieldLabel>
                  <Select 
                    value={formData.generalCondition} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, generalCondition: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة العامة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جيدة">جيدة</SelectItem>
                      <SelectItem value="متوسطة">متوسطة</SelectItem>
                      <SelectItem value="متدهورة">متدهورة</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>القاعات والمرافق المتوفرة</FieldLabel>
                <Textarea
                  value={formData.availableRooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableRooms: e.target.value }))}
                  placeholder="أدخل القاعات والمرافق المتوفرة"
                  rows={3}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasWater"
                    checked={formData.hasWater}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasWater: checked as boolean }))}
                  />
                  <label htmlFor="hasWater" className="text-sm cursor-pointer">
                    توفر الماء الصالح للشرب
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasElectricity"
                    checked={formData.hasElectricity}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasElectricity: checked as boolean }))}
                  />
                  <label htmlFor="hasElectricity" className="text-sm cursor-pointer">
                    توفر الكهرباء
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasSanitation"
                    checked={formData.hasSanitation}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasSanitation: checked as boolean }))}
                  />
                  <label htmlFor="hasSanitation" className="text-sm cursor-pointer">
                    توفر شبكة التطهير
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasAccessibility"
                    checked={formData.hasAccessibility}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasAccessibility: checked as boolean }))}
                  />
                  <label htmlFor="hasAccessibility" className="text-sm cursor-pointer">
                    الولوجيات للأشخاص في وضعية إعاقة
                  </label>
                </div>
              </div>

              <Field>
                <FieldLabel>ملاحظات تقنية وأشغال التأهيل المطلوبة</FieldLabel>
                <Textarea
                  value={formData.technicalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicalNotes: e.target.value }))}
                  placeholder="أدخل الملاحظات التقنية وأشغال التأهيل المطلوبة"
                  rows={3}
                />
              </Field>
            </FieldGroup>
          </div>

          {/* سادسًا - وضعية التسليم إلى مؤسسة التعاون الوطني */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">سادسًا - وضعية التسليم إلى مؤسسة التعاون الوطني</h3>
            <FieldGroup>
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="proposedForHandover"
                  checked={formData.proposedForHandover}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, proposedForHandover: checked as boolean }))}
                />
                <label htmlFor="proposedForHandover" className="text-sm cursor-pointer font-medium">
                  هل تم اقتراح البناية للتسليم؟
                </label>
              </div>

              <Field>
                <FieldLabel>مبررات وأهداف التسليم</FieldLabel>
                <Textarea
                  value={formData.handoverJustification}
                  onChange={(e) => setFormData(prev => ({ ...prev, handoverJustification: e.target.value }))}
                  placeholder="أدخل مبررات وأهداف التسليم"
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel>الوثائق المتوفرة قصد التسليم</FieldLabel>
                <Textarea
                  value={formData.handoverDocuments}
                  onChange={(e) => setFormData(prev => ({ ...prev, handoverDocuments: e.target.value }))}
                  placeholder="أدخل الوثائق المتوفرة قصد التسليم"
                  rows={2}
                />
              </Field>

              <Field>
                <FieldLabel>النواقص أو الإكراهات المسجلة</FieldLabel>
                <Textarea
                  value={formData.handoverConstraints}
                  onChange={(e) => setFormData(prev => ({ ...prev, handoverConstraints: e.target.value }))}
                  placeholder="أدخل النواقص أو الإكراهات المسجلة"
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </div>

          {/* سابعًا - ملاحظات وتوصيات */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">سابعًا - ملاحظات وتوصيات</h3>
            <FieldGroup>
              <Field>
                <FieldLabel>ملاحظات وتوصيات</FieldLabel>
                <Textarea
                  value={formData.observations}
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="أدخل أي ملاحظات أو توصيات"
                  rows={5}
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading ? (
                <Spinner className="h-4 w-4" />
              ) : editCenter ? (
                "حفظ التعديلات"
              ) : (
                "إضافة البناية"
              )}
            </Button>
            
            {success && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>تم الحفظ بنجاح</span>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
