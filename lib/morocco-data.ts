export interface Province {
  name: string;
  region: string;
}

export interface Region {
  name: string;
  provinces: string[];
}

export const regions: Region[] = [
  {
    name: "طنجة - تطوان - الحسيمة",
    provinces: [
      "طنجة - أصيلة",
      "المضيق - الفنيدق",
      "تطوان",
      "الفحص - أنجرة",
      "العرائش",
      "الحسيمة",
      "شفشاون",
      "وزان"
    ]
  },
  {
    name: "الشرق",
    provinces: [
      "وجدة - أنجاد",
      "الناظور",
      "الدريوش",
      "جرادة",
      "بركان",
      "تاوريرت",
      "جرسيف",
      "فجيج"
    ]
  },
  {
    name: "فاس - مكناس",
    provinces: [
      "فاس",
      "مكناس",
      "الحاجب",
      "إفران",
      "مولاي يعقوب",
      "صفرو",
      "بولمان",
      "تاونات",
      "تازة"
    ]
  },
  {
    name: "الرباط - سلا - القنيطرة",
    provinces: [
      "الرباط",
      "سلا",
      "الصخيرات - تمارة",
      "القنيطرة",
      "الخميسات",
      "سيدي قاسم",
      "سيدي سليمان"
    ]
  },
  {
    name: "بني ملال - خنيفرة",
    provinces: [
      "بني ملال",
      "أزيلال",
      "الفقيه بن صالح",
      "خنيفرة",
      "خريبكة"
    ]
  },
  {
    name: "الدار البيضاء - سطات",
    provinces: [
      "الدار البيضاء",
      "المحمدية",
      "الجديدة",
      "النواصر",
      "مديونة",
      "بنسليمان",
      "برشيد",
      "سطات",
      "سيدي بنور"
    ]
  },
  {
    name: "مراكش - آسفي",
    provinces: [
      "مراكش",
      "شيشاوة",
      "الحوز",
      "قلعة السراغنة",
      "الصويرة",
      "الرحامنة",
      "آسفي",
      "اليوسفية"
    ]
  },
  {
    name: "درعة - تافيلالت",
    provinces: [
      "الرشيدية",
      "ميدلت",
      "تنغير",
      "ورزازات",
      "زاكورة"
    ]
  },
  {
    name: "سوس - ماسة",
    provinces: [
      "أكادير - إداوتنان",
      "إنزكان - آيت ملول",
      "شتوكة آيت باها",
      "تارودانت",
      "تيزنيت",
      "طاطا"
    ]
  },
  {
    name: "كلميم - واد نون",
    provinces: [
      "كلميم",
      "آسا - الزاك",
      "طانطان",
      "سيدي إفني"
    ]
  },
  {
    name: "العيون - الساقية الحمراء",
    provinces: [
      "العيون",
      "بوجدور",
      "طرفاية",
      "السمارة"
    ]
  },
  {
    name: "الداخلة - وادي الذهب",
    provinces: [
      "وادي الذهب",
      "أوسرد"
    ]
  }
];

export const getAllProvinces = (): Province[] => {
  const provinces: Province[] = [];
  regions.forEach(region => {
    region.provinces.forEach(province => {
      provinces.push({
        name: province,
        region: region.name
      });
    });
  });
  return provinces;
};

export const getProvincesByRegion = (regionName: string): string[] => {
  const region = regions.find(r => r.name === regionName);
  return region ? region.provinces : [];
};

export const getRegionByProvince = (provinceName: string): string | null => {
  for (const region of regions) {
    if (region.provinces.includes(provinceName)) {
      return region.name;
    }
  }
  return null;
};
