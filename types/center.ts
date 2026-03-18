export interface Center {
  id?: string;
  // معلومات أساسية - Basic Information
  region: string; // الجهة
  province: string; // الإقليم
  centerName: string; // اسم المركز
  program: string; // البرنامج
  licenseNumber: string; // رقم الرخصة
  environment: string; // الوسط (حضري/قروي)
  address: string; // العنوان
  
  // معلومات الاتصال - Contact Information
  phone: string; // الهاتف
  email: string; // البريد الإلكتروني
  coordinates: string; // الإحداثيات الجغرافية
  
  // الملكية والاستغلال - Ownership & Exploitation
  propertyOwnership: string; // الملكية العقارية
  tenant: string; // مكتري
  exploitationStatus: string; // حالة الاستغلال (مستغل/غير مستغل/في طور الإنجاز)
  
  // الحالة البنيوية - Structural Condition
  structuralCondition: string; // الحالة البنيوية (جيدة/متوسطة/رديئة)
  numberOfFloors: string; // عدد الطوابق
  buildingArea: string; // مساحة البناء
  landArea: string; // مساحة الأرض
  numberOfFacilities: string; // عدد المرافق
  
  // الربط بالشبكات - Network Connections
  waterConnection: boolean; // الربط بشبكة الماء
  electricityConnection: boolean; // الربط بشبكة الكهرباء
  sanitationConnection: boolean; // الربط بشبكة التطهير
  accessibilityForDisabled: boolean; // الولوجية لذوي الاحتياجات الخاصة
  
  // الشراكات - Partnerships
  indhPartnership: string; // موضوع الشراكة مع INDH
  nationalCooperationMortgage: string; // موضوع رهن التعاون الوطني
  
  // الخدمات والموارد - Services & Resources
  servicesProvided: string; // الخدمات المقدمة
  equipmentAndSupplies: string; // التجهيزات والمعدات
  humanResources: string; // الموارد البشرية وأعدادها
  
  // ملاحظات - Notes
  managementIssues: string; // الإشكاليات المطروحة في تدبير المنشأة
  notes: string; // ملاحظات
  
  // Metadata
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}
