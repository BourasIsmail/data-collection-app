import { Timestamp } from "firebase/firestore";

export interface Center {
  id?: string;
  
  // أولًا - البيانات التعريفية
  centerName: string; // اسم البناية أو المركز
  socialProgram: string; // البرنامج الاجتماعي الموجود بالمركز
  fullAddress: string; // العنوان الكامل
  territorialCommunity: string; // الجماعة الترابية
  circle: string; // القيادة / الدائرة
  province: string; // الإقليم أو العمالة
  
  // ثانيًا - المعطيات الإدارية والقانونية
  indhMortgage: string; // هل البناية موضوع رهن إشارة التعاون الوطني من طرف INDH
  partnerAssociation: string; // الشريك أو الجمعية المتواجدة بالمركز الاجتماعي
  centerManagement: string; // تدبير المركز الاجتماعي
  legalStatus: string; // الوضعية القانونية للعقار
  propertyReference: string; // مراجع الرسم العقاري إن وجد
  servicesNature: string; // طبيعة الخدمات والأنشطة المقدمة
  beneficiaryCategories: string; // الفئات المستفيدة
  monthlyBeneficiaries: string; // العدد التقريبي للمستفيدين شهريًا
  availableLegalDocuments: string; // الوثائق القانونية المتوفرة
  
  // ثالثًا - معطيات الإنجاز
  completionYear: string; // سنة إنجاز المشروع
  operationStartDate: string; // تاريخ الشروع في الاستغلال الفعلي
  currentStatus: string; // الوضعية الحالية
  
  // رابعًا - الوضعية التقنية للبناية
  totalArea: string; // المساحة الإجمالية متر مربع
  availableRooms: string; // القاعات والمرافق المتوفرة
  generalCondition: string; // الحالة العامة
  hasWater: boolean; // توفر الماء الصالح للشرب
  hasElectricity: boolean; // توفر الكهرباء
  hasSanitation: boolean; // توفر شبكة التطهير
  hasAccessibility: boolean; // الولوجيات للأشخاص في وضعية إعاقة
  technicalNotes: string; // ملاحظات تقنية وأشغال التأهيل المطلوبة
  
  // سادسًا - وضعية التسليم إلى مؤسسة التعاون الوطني
  proposedForHandover: boolean; // هل تم اقتراح البناية للتسليم
  handoverJustification: string; // مبررات وأهداف التسليم
  handoverDocuments: string; // الوثائق المتوفرة قصد التسليم
  handoverConstraints: string; // النواقص أو الإكراهات المسجلة
  
  // سابعًا - ملاحظات وتوصيات
  observations: string; // ملاحظات وتوصيات
  
  // Metadata
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
}
