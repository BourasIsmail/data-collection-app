import { Center } from "@/types/center";
import { getRegionByProvince, regions } from "@/lib/morocco-data";

// Sort centers by region order
function sortCentersByRegion(centers: Center[]): Center[] {
  const regionOrder = regions.map(r => r.name);

  return [...centers].sort((a, b) => {
    const regionA = getRegionByProvince(a.province) || "";
    const regionB = getRegionByProvince(b.province) || "";

    const indexA = regionOrder.indexOf(regionA);
    const indexB = regionOrder.indexOf(regionB);

    // If same region, sort by province name
    if (indexA === indexB) {
      return (a.province || "").localeCompare(b.province || "", "ar");
    }

    return indexA - indexB;
  });
}

// Converts centers data to CSV format
export function exportToCSV(centers: Center[], filename: string = "centers-data") {
  const sortedCenters = sortCentersByRegion(centers);

  const headers = [
    "الجهة",
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

  const rows = sortedCenters.map(center => [
    getRegionByProvince(center.province) || "",
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

// Convert centers data to Excel XLSX format
export function exportToExcel(centers: Center[], filename: string = "centers-data") {
  const sortedCenters = sortCentersByRegion(centers);

  const headers = [
    "الجهة",
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

  const rows = sortedCenters.map(center => [
    getRegionByProvince(center.province) || "",
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

  // Escape XML special characters
  const escapeXml = (str: string) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Create Excel XML Spreadsheet format (compatible with .xlsx when opened)
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Title>بيانات المراكز الاجتماعية</Title>
    <Author>منصة جرد المراكز</Author>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Size="12"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
      <Font ss:Color="#FFFFFF" ss:Bold="1"/>
    </Style>
    <Style ss:ID="Data">
      <Alignment ss:Horizontal="Right" ss:Vertical="Center" ss:WrapText="1"/>
    </Style>
    <Style ss:ID="RegionGroup">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#D9E2F3" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="المراكز الاجتماعية" ss:RightToLeft="1">
    <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
      <Column ss:Width="150"/>
      <Column ss:Width="180"/>
      <Column ss:Width="120"/>
      <Column ss:Width="120"/>
      <Column ss:Width="200"/>
      <Column ss:Width="80"/>
      <Column ss:Width="80"/>
      <Column ss:Width="200"/>
      <Column ss:Width="150"/>
      <Column ss:Width="150"/>
      <Column ss:Width="150"/>
      <Column ss:Width="120"/>
      <Column ss:Width="80"/>
      <Column ss:Width="200"/>
      <Row ss:Height="30">
        ${headers.map(h => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('\n        ')}
      </Row>
      ${rows.map(row => `<Row>
        ${row.map((cell, idx) => `<Cell ss:StyleID="${idx === 0 ? 'RegionGroup' : 'Data'}"><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`).join('\n        ')}
      </Row>`).join('\n      ')}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xlsx`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
