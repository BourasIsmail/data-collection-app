import { Center } from "@/types/center";

// Convert centers data to CSV format
export function exportToCSV(centers: Center[], filename: string = "centers-data") {
  const headers = [
    "اسم المنشأة",
    "البرنامج الاجتماعي",
    "الإقليم أو العمالة",
    "القيادة / الدائرة",
    "الجماعة الترابية",
    "العنوان",
    "هل موضوع رهن INDH",
    "الشريك أو الجمعية",
    "تدبير المركز",
    "الوضعية القانونية",
    "المرجع العقاري",
    "طبيعة الخدمات",
    "الفئات المستهدفة",
    "المستفيدين شهرياً",
    "الوثائق القانونية",
    "سنة الإنجاز",
    "تاريخ بدء التشغيل",
    "الحالة الراهنة",
    "المساحة الإجمالية",
    "الغرف المتوفرة",
    "الحالة العامة",
    "شبكة الماء",
    "شبكة الكهرباء",
    "شبكة التطهير",
    "ولوجية ذوي الاحتياجات",
    "ملاحظات تقنية",
    "مقترح للتفويت",
    "مبررات التفويت",
    "وثائق التفويت",
    "إكراهات التفويت",
    "ملاحظات"
  ];

  const rows = centers.map(center => [
    center.centerName || "",
    center.socialProgram || "",
    center.province || "",
    center.circle || "",
    center.territorialCommunity || "",
    center.fullAddress || "",
    center.indhMortgage || "",
    center.partnerAssociation || "",
    center.centerManagement || "",
    center.legalStatus || "",
    center.propertyReference || "",
    center.servicesNature || "",
    center.beneficiaryCategories || "",
    center.monthlyBeneficiaries || "",
    center.availableLegalDocuments || "",
    center.completionYear || "",
    center.operationStartDate || "",
    center.currentStatus || "",
    center.totalArea || "",
    center.availableRooms || "",
    center.generalCondition || "",
    center.hasWater ? "نعم" : "لا",
    center.hasElectricity ? "نعم" : "لا",
    center.hasSanitation ? "نعم" : "لا",
    center.hasAccessibility ? "نعم" : "لا",
    center.technicalNotes || "",
    center.proposedForHandover ? "نعم" : "لا",
    center.handoverJustification || "",
    center.handoverDocuments || "",
    center.handoverConstraints || "",
    center.observations || ""
  ]);

  // Add BOM for UTF-8 Excel compatibility
  const BOM = "\uFEFF";
  const csvContent = BOM + [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Convert centers data to Excel format (using CSV with .xlsx extension for basic compatibility)
export function exportToExcel(centers: Center[], filename: string = "centers-data") {
  const headers = [
    "اسم المنشأة",
    "البرنامج الاجتماعي",
    "الإقليم أو العمالة",
    "القيادة / الدائرة",
    "الجماعة الترابية",
    "العنوان",
    "هل موضوع رهن INDH",
    "الشريك أو الجمعية",
    "تدبير المركز",
    "الوضعية القانونية",
    "المرجع العقاري",
    "طبيعة الخدمات",
    "الفئات المستهدفة",
    "المستفيدين شهرياً",
    "الوثائق القانونية",
    "سنة الإنجاز",
    "تاريخ بدء التشغيل",
    "الحالة الراهنة",
    "المساحة الإجمالية",
    "الغرف المتوفرة",
    "الحالة العامة",
    "شبكة الماء",
    "شبكة الكهرباء",
    "شبكة التطهير",
    "ولوجية ذوي الاحتياجات",
    "ملاحظات تقنية",
    "مقترح للتفويت",
    "مبررات التفويت",
    "وثائق التفويت",
    "إكراهات التفويت",
    "ملاحظات"
  ];

  const rows = centers.map(center => [
    center.centerName || "",
    center.socialProgram || "",
    center.province || "",
    center.circle || "",
    center.territorialCommunity || "",
    center.fullAddress || "",
    center.indhMortgage || "",
    center.partnerAssociation || "",
    center.centerManagement || "",
    center.legalStatus || "",
    center.propertyReference || "",
    center.servicesNature || "",
    center.beneficiaryCategories || "",
    center.monthlyBeneficiaries || "",
    center.availableLegalDocuments || "",
    center.completionYear || "",
    center.operationStartDate || "",
    center.currentStatus || "",
    center.totalArea || "",
    center.availableRooms || "",
    center.generalCondition || "",
    center.hasWater ? "نعم" : "لا",
    center.hasElectricity ? "نعم" : "لا",
    center.hasSanitation ? "نعم" : "لا",
    center.hasAccessibility ? "نعم" : "لا",
    center.technicalNotes || "",
    center.proposedForHandover ? "نعم" : "لا",
    center.handoverJustification || "",
    center.handoverDocuments || "",
    center.handoverConstraints || "",
    center.observations || ""
  ]);

  // Create tab-separated values for better Excel compatibility
  const BOM = "\uFEFF";
  const tsvContent = BOM + [
    headers.join("\t"),
    ...rows.map(row => row.map(cell => String(cell).replace(/\t/g, " ").replace(/\n/g, " ")).join("\t"))
  ].join("\n");

  const blob = new Blob([tsvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
