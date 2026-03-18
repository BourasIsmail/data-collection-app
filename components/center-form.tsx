"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
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

export function CenterForm({ onSuccess, editCenter }: CenterFormProps) {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    region: "",
    province: "",
    centerName: "",
    program: "",
    licenseNumber: "",
    environment: "",
    address: "",
    propertyOwnership: "",
    tenant: "",
    indhPartnership: "",
    nationalCooperationMortgage: "",
    servicesProvided: ""
  });

  const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);

  useEffect(() => {
    if (editCenter) {
      setFormData({
        region: editCenter.region,
        province: editCenter.province,
        centerName: editCenter.centerName,
        program: editCenter.program,
        licenseNumber: editCenter.licenseNumber,
        environment: editCenter.environment,
        address: editCenter.address,
        propertyOwnership: editCenter.propertyOwnership,
        tenant: editCenter.tenant,
        indhPartnership: editCenter.indhPartnership,
        nationalCooperationMortgage: editCenter.nationalCooperationMortgage,
        servicesProvided: editCenter.servicesProvided
      });
      setAvailableProvinces(getProvincesByRegion(editCenter.region));
    } else if (userData?.role === "user" && userData.province) {
      const userRegion = getRegionByProvince(userData.province);
      if (userRegion) {
        setFormData(prev => ({
          ...prev,
          region: userRegion,
          province: userData.province
        }));
        setAvailableProvinces([userData.province]);
      }
    }
  }, [editCenter, userData]);

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
        // Reset form for new entries, but keep region/province for users
        if (userData?.role === "user") {
          setFormData(prev => ({
            region: prev.region,
            province: prev.province,
            centerName: "",
            program: "",
            licenseNumber: "",
            environment: "",
            address: "",
            propertyOwnership: "",
            tenant: "",
            indhPartnership: "",
            nationalCooperationMortgage: "",
            servicesProvided: ""
          }));
        } else {
          setFormData({
            region: "",
            province: "",
            centerName: "",
            program: "",
            licenseNumber: "",
            environment: "",
            address: "",
            propertyOwnership: "",
            tenant: "",
            indhPartnership: "",
            nationalCooperationMortgage: "",
            servicesProvided: ""
          });
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
        <form onSubmit={handleSubmit}>
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
                  required
                />
              </Field>

              <Field>
                <FieldLabel>رقم الرخصة</FieldLabel>
                <Input
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  placeholder="أدخل رقم الرخصة"
                  required
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
                <FieldLabel>الملكية العقارية</FieldLabel>
                <Input
                  value={formData.propertyOwnership}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyOwnership: e.target.value }))}
                  placeholder="أدخل الملكية العقارية"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>العنوان</FieldLabel>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="أدخل العنوان الكامل"
                rows={2}
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

            <Field>
              <FieldLabel>الخدمات المقدمة</FieldLabel>
              <Textarea
                value={formData.servicesProvided}
                onChange={(e) => setFormData(prev => ({ ...prev, servicesProvided: e.target.value }))}
                placeholder="أدخل الخدمات المقدمة"
                rows={3}
              />
            </Field>
          </FieldGroup>

          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm mt-4 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span>{editCenter ? "تم تحديث البيانات بنجاح" : "تم حفظ البيانات بنجاح"}</span>
            </div>
          )}

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : (editCenter ? "تحديث البيانات" : "حفظ البيانات")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
