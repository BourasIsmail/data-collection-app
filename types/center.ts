export interface Center {
  id?: string;
  region: string; // الجهة
  province: string; // الإقليم
  centerName: string; // اسم المركز
  program: string; // البرنامج
  licenseNumber: string; // رقم الرخصة
  environment: string; // الوسط (حضري/قروي)
  address: string; // العنوان
  propertyOwnership: string; // الملكية العقارية
  tenant: string; // مكتري
  indhPartnership: string; // موضوع الشراكة مع INDH
  nationalCooperationMortgage: string; // موضوع رهن التعاون الوطني
  servicesProvided: string; // الخدمات المقدمة
  createdAt: Date;
  createdBy: string;
}
