import { Timestamp } from "firebase/firestore";

export interface Center {
  id?: string;
  
  // المعلومات الأساسية
  region: string; // الجهة
  province: string; // الإقليم
  circle: string; // الدائرة/القيادة
  territorialCommunity: string; // الجماعة الترابية أو المقاطعة
  centerName: string; // اسم المنشأة أو المركز
  program: string; // البرنامج الذي أحدثت في إطاره المنشأة
  licenseNumber: string; // رقم الرخصة
  
  // العنوان ومعلومات الاتصال
  address: string; // العنوان
  phone: string; // رقم الهاتف
  email: string; // البريد الإلكتروني
  coordinates: string; // الإحداثيات الجغرافية
  
  // الوسط
  environment: string; // الوسط (حضري/قروي/شبه حضري)
  
  // الملكية والاستغلال
  propertyOwnership: string; // الملكية العقارية
  tenant: string; // مكتري
  exploitationStatus: string; // حالة الاستغلال (مستغلة/مغلقة/في طور الإنجاز)
  
  // الحالة البنيوية
  structuralCondition: string; // الحالة البنيوية (جيدة/متوسطة/متردية)
  numberOfFloors: string; // عدد الطوابق
  buildingArea: string; // المساحة المبنية م²
  landArea: string; // المساحة الإجمالية للأرض م²
  numberOfFacilities: string; // عدد المرافق
  
  // الربط بالشبكات
  waterConnection: boolean; // هل المنشأة مربوطة بشبكة الماء الصالح للشرب
  electricityConnection: boolean; // هل المنشأة مربوطة بشبكة الكهرباء
  sanitationConnection: boolean; // هل المنشأة مربوطة بشبكة التطهير
  accessibilityForDisabled: boolean; // هل للمنشأة ولوجية لذوي الاحتياجات الخاصة
  
  // الشراكات
  indhPartnership: string; // موضوع الشراكة مع INDH المبادرة الوطنية للتنمية البشرية
  nationalCooperationMortgage: string; // موضوع رهن إشارة التعاون الوطني
  
  // الخدمات والموارد
  servicesProvided: string; // الخدمات المقدمة حسب الفئات المستهدفة
  equipmentAndSupplies: string; // التجهيزات والمعدات
  humanResources: string; // الموارد البشرية وأعدادها
  
  // الإشكاليات
  managementIssues: string; // الإشكاليات المطروحة في تدبير المنشأة
  
  // Metadata
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
}
