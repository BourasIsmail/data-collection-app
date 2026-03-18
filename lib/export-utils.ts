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

// Convert centers data to Excel XML format for proper column separation
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

  // Escape XML special characters
  const escapeXml = (str: string) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Create Excel XML format
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1"/>
      <Alignment ss:Horizontal="Right"/>
      <Interior ss:Color="#E0E0E0" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="Data">
      <Alignment ss:Horizontal="Right"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="البنايات">
    <Table ss:DefaultColumnWidth="100" ss:RightToLeft="1">
      <Row>
        ${headers.map(h => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('\n        ')}
      </Row>
      ${rows.map(row => `<Row>
        ${row.map(cell => `<Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`).join('\n        ')}
      </Row>`).join('\n      ')}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
