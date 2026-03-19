import { Timestamp } from "firebase/firestore";

export interface Center {
  id?: string;
  
  // البيانات الأساسية
  centerName: string; // اسم المركز أو المركب الاجتماعي
  province: string; // الإقليم أو العمالة
  territorialCommunity: string; // الجماعة الترابية
  fullAddress: string; // العنوان الكامل
  totalArea: string; // المساحة الإجمالية للمركز أو المركب الاجتماعي بمتر مربع
  
  // البيانات التصنيفية
  buildingCondition: string; // حالة البناية - جيدة / متوسطة / متدهورة
  servicesNature: string[]; // طبيعة الخدمات والأنشطة - multi-checkbox
  centerManagement: string; // تدبير المركز
  legalStatus: string; // الوضعية القانونية للعقار
  
  // بيانات إضافية
  partnerAssociation: string; // الشريك أو الجمعية المتواجدة بالمركز الاجتماعي
  beneficiaryCategories: string; // الفئات المستفيدة
  monthlyBeneficiaries: string; // معدل عدد المستفيدين شهريًا
  observations: string; // ملاحظات
  
  // Metadata
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
}

// Service types for multi-checkbox
export const SERVICE_TYPES = [
  "مركز كبار السن والمتقاعدين",
  "مركز التوجيه والمساعدة للأشخاص في وضعية إعاقة",
  "مركز المساعدة الاجتماعية",
  "مركز تأهيل ومواكبة الأشخاص في وضعية إعاقة",
  "مركز مواكبة لحماية الطفولة",
  "دار المواطن",
  "مؤسسة متعددة الوظائف للنساء",
  "مركز التكوين المهني",
  "مركز التربية والتكوين",
  "حضانة رياض الأطفال",
  "دار طالب",
  "دار الطالبة"
] as const;

// Building condition options
export const BUILDING_CONDITIONS = [
  "جيدة",
  "متوسطة",
  "متدهورة"
] as const;

// Center management options
export const CENTER_MANAGEMENT_OPTIONS = [
  "تدبير مباشر من التعاون الوطني",
  "تدبير مفوض لجمعية",
  "تدبير مشترك مع الجمعية"
] as const;

// Legal status options
export const LEGAL_STATUS_OPTIONS = [
  "ملكية خاصة",
  "ملكية عمومية",
  "عقار مستأجر",
  "عقار موضوع نزاع قانوني",
  "عقار بدون وضعية قانونية واضحة"
] as const;
