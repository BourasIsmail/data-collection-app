import { Center } from "@/types/center";

// Convert centers data to CSV format
export function exportToCSV(centers: Center[], filename: string = "centers-data") {
  const headers = [
    "اسم المركز",
    "الإقليم أو العمالة",
    "الجماعة الترابية",
    "العنوان الكامل",
    "المساحة الإجمالية (م²)",
    "حالة البناية",
    "طبيعة الخدمات والأنشطة",
    "تدبير المركز",
    "الوضعية القانونية",
    "الشريك أو الجمعية",
    "الفئات المستفيدة",
    "عدد المستفيدين شهرياً",
    "ملاحظات"
  ];

  const rows = centers.map(center => [
    center.centerName || "",
    center.province || "",
    center.territorialCommunity || "",
    center.fullAddress || "",
    center.totalArea || "",
    center.buildingCondition || "",
    Array.isArray(center.servicesNature) ? center.servicesNature.join(" | ") : "",
    center.centerManagement || "",
    center.legalStatus || "",
    center.partnerAssociation || "",
    center.beneficiaryCategories || "",
    center.monthlyBeneficiaries || "",
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
  URL.revokeObjectURL(url);
}

// Convert centers data to Excel format (semicolon-separated CSV)
export function exportToExcel(centers: Center[], filename: string = "centers-data") {
  const headers = [
    "اسم المركز",
    "الإقليم أو العمالة",
    "الجماعة الترابية",
    "العنوان الكامل",
    "المساحة الإجمالية (م²)",
    "حالة البناية",
    "طبيعة الخدمات والأنشطة",
    "تدبير المركز",
    "الوضعية القانونية",
    "الشريك أو الجمعية",
    "الفئات المستفيدة",
    "عدد المستفيدين شهرياً",
    "ملاحظات"
  ];

  const rows = centers.map(center => [
    center.centerName || "",
    center.province || "",
    center.territorialCommunity || "",
    center.fullAddress || "",
    center.totalArea || "",
    center.buildingCondition || "",
    Array.isArray(center.servicesNature) ? center.servicesNature.join(" | ") : "",
    center.centerManagement || "",
    center.legalStatus || "",
    center.partnerAssociation || "",
    center.beneficiaryCategories || "",
    center.monthlyBeneficiaries || "",
    center.observations || ""
  ]);

  // Escape and quote cells for proper CSV handling
  const escapeCell = (cell: string) => {
    const str = String(cell);
    if (str.includes(';') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Use BOM for UTF-8 and semicolon as delimiter
  const BOM = "\uFEFF";
  const csvContent = BOM + [
    headers.map(escapeCell).join(';'),
    ...rows.map(row => row.map(escapeCell).join(';'))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
