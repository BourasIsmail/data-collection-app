// Moroccan Administrative Divisions Data
// Source: DGLAI (Direction Générale des Collectivités Territoriales)
// Structure: Province/Prefecture -> District (Cercle/Caïdat) -> Commune

export interface Commune {
  name: string;
  type: "urban" | "rural"; // حضرية أو قروية
}

export interface District {
  name: string;
  communes: Commune[];
}

export interface Province {
  name: string;
  districts: District[];
}

export const provinces: Province[] = [
  // جهة طنجة - تطوان - الحسيمة
  {
    name: "طنجة - أصيلة",
    districts: [
      {
        name: "دائرة طنجة المدينة",
        communes: [
          { name: "طنجة", type: "urban" },
          { name: "بني مكادة", type: "urban" },
          { name: "الشرف مغوغة", type: "urban" },
          { name: "الشرف السواني", type: "urban" },
        ]
      },
      {
        name: "قيادة أصيلة",
        communes: [
          { name: "أصيلة", type: "urban" },
          { name: "الخلالفة", type: "rural" },
          { name: "السوحل", type: "rural" },
          { name: "الحجر", type: "rural" },
        ]
      },
      {
        name: "قيادة سيدي اليماني",
        communes: [
          { name: "سيدي اليماني", type: "rural" },
          { name: "دار الشاوي", type: "rural" },
          { name: "الحوافات", type: "rural" },
        ]
      },
      {
        name: "قيادة الساحل الشمالي",
        communes: [
          { name: "الغندوري", type: "rural" },
          { name: "مجاعلية", type: "rural" },
          { name: "اثنين أملو", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "تطوان",
    districts: [
      {
        name: "دائرة تطوان",
        communes: [
          { name: "تطوان", type: "urban" },
          { name: "مرتيل", type: "urban" },
          { name: "الأزهر", type: "urban" },
        ]
      },
      {
        name: "قيادة بني حسان",
        communes: [
          { name: "بني حسان", type: "rural" },
          { name: "الحمراء", type: "rural" },
          { name: "سمير", type: "rural" },
        ]
      },
      {
        name: "قيادة بني يدر",
        communes: [
          { name: "زعرورة", type: "rural" },
          { name: "بني سعيد", type: "rural" },
          { name: "الواد", type: "rural" },
        ]
      },
      {
        name: "قيادة جبل حبيب",
        communes: [
          { name: "الملاليين", type: "rural" },
          { name: "الخروب", type: "rural" },
          { name: "بني إيدر", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "المضيق - الفنيدق",
    districts: [
      {
        name: "دائرة المضيق",
        communes: [
          { name: "المضيق", type: "urban" },
          { name: "الفنيدق", type: "urban" },
        ]
      },
      {
        name: "قيادة علية",
        communes: [
          { name: "علية", type: "rural" },
          { name: "بليونش", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الفحص - أنجرة",
    districts: [
      {
        name: "قيادة الفحص",
        communes: [
          { name: "القصر الصغير", type: "urban" },
          { name: "الفحص", type: "rural" },
          { name: "تغرمت", type: "rural" },
        ]
      },
      {
        name: "قيادة أنجرة",
        communes: [
          { name: "أنجرة", type: "rural" },
          { name: "الكواسم", type: "rural" },
          { name: "ملوسة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "العرائش",
    districts: [
      {
        name: "دائرة العرائش",
        communes: [
          { name: "العرائش", type: "urban" },
          { name: "القصر الكبير", type: "urban" },
        ]
      },
      {
        name: "قيادة ساحل",
        communes: [
          { name: "ساحل", type: "rural" },
          { name: "الخميس الساحل", type: "rural" },
          { name: "مولاي بوسلهام", type: "rural" },
        ]
      },
      {
        name: "قيادة تطفت",
        communes: [
          { name: "تطفت", type: "rural" },
          { name: "بني عروس", type: "rural" },
          { name: "زعرورة", type: "rural" },
        ]
      },
      {
        name: "قيادة بني كرفط",
        communes: [
          { name: "بني كرفط", type: "rural" },
          { name: "سوق الطلبة", type: "rural" },
          { name: "عين الشكاك", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الحسيمة",
    districts: [
      {
        name: "دائرة الحسيمة",
        communes: [
          { name: "الحسيمة", type: "urban" },
          { name: "إمزورن", type: "urban" },
          { name: "بني بوعياش", type: "urban" },
        ]
      },
      {
        name: "قيادة بني عمارت",
        communes: [
          { name: "بني عمارت", type: "rural" },
          { name: "أيت يوسف وعلي", type: "rural" },
          { name: "بني بوفراح", type: "rural" },
        ]
      },
      {
        name: "قيادة تماسينت",
        communes: [
          { name: "تماسينت", type: "rural" },
          { name: "تارجيست", type: "urban" },
          { name: "إساكن", type: "rural" },
        ]
      },
      {
        name: "قيادة بني ورياغل",
        communes: [
          { name: "بني حذيفة", type: "rural" },
          { name: "سنادة", type: "rural" },
          { name: "أجدير", type: "urban" },
        ]
      }
    ]
  },
  {
    name: "شفشاون",
    districts: [
      {
        name: "دائرة شفشاون",
        communes: [
          { name: "شفشاون", type: "urban" },
        ]
      },
      {
        name: "قيادة بني دركول",
        communes: [
          { name: "بني دركول", type: "rural" },
          { name: "أقشور", type: "rural" },
          { name: "ستحة", type: "rural" },
        ]
      },
      {
        name: "قيادة غمارة",
        communes: [
          { name: "بني سلمان", type: "rural" },
          { name: "الحوز", type: "rural" },
          { name: "بني أحمد الغربية", type: "rural" },
        ]
      },
      {
        name: "قيادة بني فاغلوم",
        communes: [
          { name: "باب برد", type: "rural" },
          { name: "فيفي", type: "rural" },
          { name: "بني فاغلوم", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "وزان",
    districts: [
      {
        name: "دائرة وزان",
        communes: [
          { name: "وزان", type: "urban" },
        ]
      },
      {
        name: "قيادة مقريصات",
        communes: [
          { name: "مقريصات", type: "rural" },
          { name: "بني قلة", type: "rural" },
          { name: "عين بيضا", type: "rural" },
        ]
      },
      {
        name: "قيادة أسجن",
        communes: [
          { name: "أسجن", type: "rural" },
          { name: "بريكشة", type: "rural" },
          { name: "مصمودة", type: "rural" },
        ]
      }
    ]
  },
  // جهة الشرق
  {
    name: "وجدة - أنجاد",
    districts: [
      {
        name: "دائرة وجدة",
        communes: [
          { name: "وجدة", type: "urban" },
          { name: "سيدي يحيى زعير", type: "urban" },
        ]
      },
      {
        name: "قيادة أنجاد",
        communes: [
          { name: "بني درار", type: "rural" },
          { name: "عين الصفا", type: "rural" },
          { name: "مستفركي", type: "rural" },
        ]
      },
      {
        name: "قيادة إسلي",
        communes: [
          { name: "نعيمة", type: "rural" },
          { name: "بصارة", type: "rural" },
          { name: "سيدي بولنوار", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الناظور",
    districts: [
      {
        name: "دائرة الناظور",
        communes: [
          { name: "الناظور", type: "urban" },
          { name: "سلوان", type: "urban" },
          { name: "زايو", type: "urban" },
        ]
      },
      {
        name: "قيادة قرية أركمان",
        communes: [
          { name: "قرية أركمان", type: "rural" },
          { name: "أزغنغان", type: "urban" },
          { name: "بوعرك", type: "rural" },
        ]
      },
      {
        name: "قيادة بني شيكر",
        communes: [
          { name: "بني شيكر", type: "rural" },
          { name: "الركادي", type: "rural" },
          { name: "بني سيدال", type: "rural" },
        ]
      },
      {
        name: "قيادة تمسمان",
        communes: [
          { name: "اعزانن", type: "rural" },
          { name: "بني بويفرور", type: "rural" },
          { name: "إجرماوس", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الدريوش",
    districts: [
      {
        name: "دائرة الدريوش",
        communes: [
          { name: "الدريوش", type: "urban" },
          { name: "ميضار", type: "urban" },
        ]
      },
      {
        name: "قيادة تسافت",
        communes: [
          { name: "تسافت", type: "rural" },
          { name: "دار الكبداني", type: "rural" },
          { name: "أمجاو", type: "rural" },
        ]
      },
      {
        name: "قيادة بني توزين",
        communes: [
          { name: "بني توزين", type: "rural" },
          { name: "أفسو", type: "rural" },
          { name: "تمسمان", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "جرادة",
    districts: [
      {
        name: "دائرة جرادة",
        communes: [
          { name: "جرادة", type: "urban" },
          { name: "عين بني مطهر", type: "urban" },
        ]
      },
      {
        name: "قيادة لعوينات",
        communes: [
          { name: "لعوينات", type: "rural" },
          { name: "تويسيت", type: "rural" },
          { name: "كنفودة", type: "rural" },
        ]
      },
      {
        name: "قيادة راس عصفور",
        communes: [
          { name: "راس عصفور", type: "rural" },
          { name: "لمريجة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "بركان",
    districts: [
      {
        name: "دائرة بركان",
        communes: [
          { name: "بركان", type: "urban" },
          { name: "أحفير", type: "urban" },
          { name: "السعيدية", type: "urban" },
        ]
      },
      {
        name: "قيادة أولاد منصور",
        communes: [
          { name: "أولاد منصور", type: "rural" },
          { name: "مداغ", type: "rural" },
          { name: "رسلان", type: "rural" },
        ]
      },
      {
        name: "قيادة تافوغالت",
        communes: [
          { name: "تافوغالت", type: "rural" },
          { name: "زكزل", type: "rural" },
          { name: "عين الركادة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "تاوريرت",
    districts: [
      {
        name: "دائرة تاوريرت",
        communes: [
          { name: "تاوريرت", type: "urban" },
          { name: "العيون سيدي ملوك", type: "urban" },
        ]
      },
      {
        name: "قيادة مشرع حمادي",
        communes: [
          { name: "مشرع حمادي", type: "rural" },
          { name: "دبدو", type: "urban" },
          { name: "سيدي علي بلقاسم", type: "rural" },
        ]
      },
      {
        name: "قيادة ملقى الويدان",
        communes: [
          { name: "ملقى الويدان", type: "rural" },
          { name: "تنشرفي", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "جرسيف",
    districts: [
      {
        name: "دائرة جرسيف",
        communes: [
          { name: "جرسيف", type: "urban" },
        ]
      },
      {
        name: "قيادة تادرت",
        communes: [
          { name: "تادرت", type: "rural" },
          { name: "سكة", type: "rural" },
          { name: "هوارة أولاد رحو", type: "rural" },
        ]
      },
      {
        name: "قيادة المزكيطة",
        communes: [
          { name: "المزكيطة", type: "rural" },
          { name: "بركين", type: "rural" },
          { name: "راس لقصر", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "فجيج",
    districts: [
      {
        name: "دائرة فجيج",
        communes: [
          { name: "فجيج", type: "urban" },
          { name: "بوعرفة", type: "urban" },
        ]
      },
      {
        name: "قيادة بني تاجيت",
        communes: [
          { name: "بني تاجيت", type: "rural" },
          { name: "تلسينت", type: "rural" },
          { name: "عين الشعير", type: "rural" },
        ]
      },
      {
        name: "قيادة بوعنان",
        communes: [
          { name: "بوعنان", type: "rural" },
          { name: "عبو لكحل", type: "rural" },
        ]
      }
    ]
  },
  // جهة فاس - مكناس
  {
    name: "فاس",
    districts: [
      {
        name: "دائرة فاس المدينة",
        communes: [
          { name: "فاس", type: "urban" },
          { name: "المشور فاس الجديد", type: "urban" },
          { name: "جنان الورد", type: "urban" },
          { name: "زواغة", type: "urban" },
          { name: "سايس", type: "urban" },
          { name: "المرينيين", type: "urban" },
        ]
      },
      {
        name: "قيادة عين الشقف",
        communes: [
          { name: "عين الشقف", type: "rural" },
          { name: "سيدي حرازم", type: "rural" },
          { name: "أولاد الطيب", type: "rural" },
        ]
      },
      {
        name: "قيادة سبع رواضي",
        communes: [
          { name: "سبع رواضي", type: "rural" },
          { name: "عين بيضا", type: "rural" },
          { name: "المكنسية", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "مكناس",
    districts: [
      {
        name: "دائرة مكناس المنزه",
        communes: [
          { name: "مكناس", type: "urban" },
          { name: "تولال", type: "urban" },
          { name: "ويسلان", type: "urban" },
          { name: "المنزه", type: "urban" },
        ]
      },
      {
        name: "قيادة الدخيسة",
        communes: [
          { name: "الدخيسة", type: "rural" },
          { name: "سيدي سليمان مول الكيفان", type: "rural" },
          { name: "عين الأرمة", type: "rural" },
        ]
      },
      {
        name: "قيادة مجاط",
        communes: [
          { name: "مجاط", type: "rural" },
          { name: "عين جمعة", type: "rural" },
          { name: "سيدي عبد الله الخياط", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الحاجب",
    districts: [
      {
        name: "دائرة الحاجب",
        communes: [
          { name: "الحاجب", type: "urban" },
          { name: "عين تاوجطات", type: "urban" },
          { name: "صبا", type: "urban" },
        ]
      },
      {
        name: "قيادة آيت نعمان",
        communes: [
          { name: "آيت نعمان", type: "rural" },
          { name: "بطاط", type: "rural" },
          { name: "آيت حرزلله", type: "rural" },
        ]
      },
      {
        name: "قيادة آيت بوبيدمان",
        communes: [
          { name: "آيت بوبيدمان", type: "rural" },
          { name: "إقدار", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "إفران",
    districts: [
      {
        name: "دائرة إفران",
        communes: [
          { name: "إفران", type: "urban" },
          { name: "أزرو", type: "urban" },
        ]
      },
      {
        name: "قيادة تيمحضيت",
        communes: [
          { name: "تيمحضيت", type: "rural" },
          { name: "آيت يحيى أوسعيد", type: "rural" },
          { name: "ضايت عوا", type: "rural" },
        ]
      },
      {
        name: "قيادة بني مكيلد",
        communes: [
          { name: "بني مكيلد", type: "rural" },
          { name: "وادي إفران", type: "rural" },
          { name: "تيزكيت", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "مولاي يعقوب",
    districts: [
      {
        name: "دائرة مولاي يعقوب",
        communes: [
          { name: "مولاي يعقوب", type: "urban" },
        ]
      },
      {
        name: "قيادة عين الشكاك",
        communes: [
          { name: "عين الشكاك", type: "rural" },
          { name: "سبع عيون", type: "rural" },
          { name: "إيسي", type: "rural" },
        ]
      },
      {
        name: "قيادة مسيلة",
        communes: [
          { name: "مسيلة", type: "rural" },
          { name: "عين كنسرة", type: "rural" },
          { name: "لقطيطر", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "صفرو",
    districts: [
      {
        name: "دائرة صفرو",
        communes: [
          { name: "صفرو", type: "urban" },
          { name: "البهاليل", type: "urban" },
        ]
      },
      {
        name: "قيادة إموزار مرموشة",
        communes: [
          { name: "إموزار مرموشة", type: "urban" },
          { name: "سيدي يوسف بن أحمد", type: "rural" },
          { name: "تافجيغت", type: "rural" },
        ]
      },
      {
        name: "قيادة رباط الخير",
        communes: [
          { name: "رباط الخير", type: "urban" },
          { name: "عين تمكناي", type: "rural" },
          { name: "قنونة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "بولمان",
    districts: [
      {
        name: "دائرة بولمان",
        communes: [
          { name: "بولمان", type: "urban" },
          { name: "ميسور", type: "urban" },
        ]
      },
      {
        name: "قيادة أولاد علي يوسف",
        communes: [
          { name: "أولاد علي يوسف", type: "rural" },
          { name: "إنجيل", type: "rural" },
          { name: "سكورة مداز", type: "rural" },
        ]
      },
      {
        name: "قيادة كسابي",
        communes: [
          { name: "كسابي", type: "rural" },
          { name: "تالزمت", type: "rural" },
          { name: "سيدي بوترة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "تاونات",
    districts: [
      {
        name: "دائرة تاونات",
        communes: [
          { name: "تاونات", type: "urban" },
        ]
      },
      {
        name: "قيادة غفساي",
        communes: [
          { name: "غفساي", type: "urban" },
          { name: "جبل الهبري", type: "rural" },
          { name: "مولاي بوشتى الخمار", type: "rural" },
        ]
      },
      {
        name: "قيادة قرية با محمد",
        communes: [
          { name: "قرية با محمد", type: "urban" },
          { name: "زريزر", type: "rural" },
          { name: "رطبة", type: "rural" },
        ]
      },
      {
        name: "قيادة كزناية",
        communes: [
          { name: "كزناية", type: "urban" },
          { name: "تيسة", type: "urban" },
          { name: "بني وليد", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "تازة",
    districts: [
      {
        name: "دائرة تازة",
        communes: [
          { name: "تازة", type: "urban" },
        ]
      },
      {
        name: "قيادة واد أمليل",
        communes: [
          { name: "واد أمليل", type: "urban" },
          { name: "بوحلو", type: "rural" },
          { name: "تايناست", type: "rural" },
        ]
      },
      {
        name: "قيادة أكنول",
        communes: [
          { name: "أكنول", type: "urban" },
          { name: "بني لنت", type: "rural" },
          { name: "كلدمان", type: "rural" },
        ]
      },
      {
        name: "قيادة تاهلة",
        communes: [
          { name: "تاهلة", type: "urban" },
          { name: "ماطماطة", type: "rural" },
          { name: "مكناسة الشرقية", type: "rural" },
        ]
      }
    ]
  },
  // جهة الرباط - سلا - القنيطرة
  {
    name: "الرباط",
    districts: [
      {
        name: "دائرة الرباط",
        communes: [
          { name: "الرباط", type: "urban" },
          { name: "حسان", type: "urban" },
          { name: "أكدال الرياض", type: "urban" },
          { name: "اليوسفية", type: "urban" },
          { name: "السويسي", type: "urban" },
        ]
      },
      {
        name: "قيادة تواركة",
        communes: [
          { name: "تواركة", type: "rural" },
          { name: "شراعة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "سلا",
    districts: [
      {
        name: "دائرة سلا",
        communes: [
          { name: "سلا", type: "urban" },
          { name: "بطانة", type: "urban" },
          { name: "طابريكت", type: "urban" },
          { name: "لعيايدة", type: "urban" },
          { name: "حصين", type: "urban" },
        ]
      },
      {
        name: "قيادة بوقنادل",
        communes: [
          { name: "بوقنادل", type: "rural" },
          { name: "سيدي بوقنادل", type: "rural" },
          { name: "عامر", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الصخيرات - تمارة",
    districts: [
      {
        name: "دائرة تمارة",
        communes: [
          { name: "تمارة", type: "urban" },
          { name: "الصخيرات", type: "urban" },
          { name: "عين عتيق", type: "urban" },
        ]
      },
      {
        name: "قيادة الهرهورة",
        communes: [
          { name: "الهرهورة", type: "urban" },
          { name: "مرس الخير", type: "rural" },
          { name: "سيدي يحيى الزعير", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "القنيطرة",
    districts: [
      {
        name: "دائرة القنيطرة",
        communes: [
          { name: "القنيطرة", type: "urban" },
          { name: "المهدية", type: "urban" },
        ]
      },
      {
        name: "قيادة سوق الأربعاء",
        communes: [
          { name: "سوق الأربعاء", type: "urban" },
          { name: "علالا الطوالع", type: "rural" },
          { name: "موغران", type: "rural" },
        ]
      },
      {
        name: "قيادة سيدي الطيبي",
        communes: [
          { name: "سيدي الطيبي", type: "rural" },
          { name: "أمكراز", type: "rural" },
          { name: "حد الكرسيفات", type: "rural" },
        ]
      },
      {
        name: "قيادة الغرب",
        communes: [
          { name: "سيدي علال التازي", type: "urban" },
          { name: "بن منصور", type: "rural" },
          { name: "بئر الطالب", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الخميسات",
    districts: [
      {
        name: "دائرة الخميسات",
        communes: [
          { name: "الخميسات", type: "urban" },
          { name: "تيفلت", type: "urban" },
        ]
      },
      {
        name: "قيادة آيت إشو",
        communes: [
          { name: "آيت إشو", type: "rural" },
          { name: "آيت سيدي دحو", type: "rural" },
          { name: "مهدية", type: "rural" },
        ]
      },
      {
        name: "قيادة موليفان",
        communes: [
          { name: "موليفان", type: "rural" },
          { name: "سيدي علال البحراوي", type: "rural" },
          { name: "أولمس", type: "urban" },
        ]
      }
    ]
  },
  {
    name: "سيدي قاسم",
    districts: [
      {
        name: "دائرة سيدي قاسم",
        communes: [
          { name: "سيدي قاسم", type: "urban" },
        ]
      },
      {
        name: "قيادة جمعة سحيم",
        communes: [
          { name: "جمعة سحيم", type: "urban" },
          { name: "سيدي أحمد بناصر", type: "rural" },
          { name: "عرباوة", type: "rural" },
        ]
      },
      {
        name: "قيادة دار بلعامري",
        communes: [
          { name: "دار بلعامري", type: "rural" },
          { name: "سيدي رضوان", type: "rural" },
          { name: "عين الدفالي", type: "urban" },
        ]
      }
    ]
  },
  {
    name: "سيدي سليمان",
    districts: [
      {
        name: "دائرة سيدي سليمان",
        communes: [
          { name: "سيدي سليمان", type: "urban" },
        ]
      },
      {
        name: "قيادة القصيبية",
        communes: [
          { name: "القصيبية", type: "rural" },
          { name: "سيدي رضوان", type: "rural" },
          { name: "بوعلام", type: "rural" },
        ]
      },
      {
        name: "قيادة الدار الحمراء",
        communes: [
          { name: "الدار الحمراء", type: "rural" },
          { name: "المساعدة", type: "rural" },
          { name: "بوعزيب", type: "rural" },
        ]
      }
    ]
  },
  // جهة بني ملال - خنيفرة
  {
    name: "بني ملال",
    districts: [
      {
        name: "دائرة بني ملال",
        communes: [
          { name: "بني ملال", type: "urban" },
        ]
      },
      {
        name: "قيادة قصبة تادلة",
        communes: [
          { name: "قصبة تادلة", type: "urban" },
          { name: "أولاد عباس", type: "rural" },
          { name: "سيدي جابر", type: "rural" },
        ]
      },
      {
        name: "قيادة أولاد أيعيش",
        communes: [
          { name: "أولاد أيعيش", type: "rural" },
          { name: "تاكزيرت", type: "rural" },
          { name: "أغبالة", type: "urban" },
        ]
      }
    ]
  },
  {
    name: "أزيلال",
    districts: [
      {
        name: "دائرة أزيلال",
        communes: [
          { name: "أزيلال", type: "urban" },
        ]
      },
      {
        name: "قيادة دمنات",
        communes: [
          { name: "دمنات", type: "urban" },
          { name: "آيت تكلا", type: "rural" },
          { name: "سيدي بولخف", type: "rural" },
        ]
      },
      {
        name: "قيادة بن ياعيش",
        communes: [
          { name: "بن ياعيش", type: "rural" },
          { name: "آيت أومغار", type: "rural" },
          { name: "أيت مزال", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الفقيه بن صالح",
    districts: [
      {
        name: "دائرة الفقيه بن صالح",
        communes: [
          { name: "الفقيه بن صالح", type: "urban" },
        ]
      },
      {
        name: "قيادة أولاد زمام",
        communes: [
          { name: "أولاد زمام", type: "rural" },
          { name: "دار أولاد زيدوح", type: "rural" },
          { name: "سومعة", type: "rural" },
        ]
      },
      {
        name: "قيادة بني عمير",
        communes: [
          { name: "بني عمير", type: "rural" },
          { name: "السوالم", type: "rural" },
          { name: "أولاد عبد الله", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "خنيفرة",
    districts: [
      {
        name: "دائرة خنيفرة",
        communes: [
          { name: "خنيفرة", type: "urban" },
          { name: "مريرت", type: "urban" },
        ]
      },
      {
        name: "قيادة آيت إسحاق",
        communes: [
          { name: "آيت إسحاق", type: "rural" },
          { name: "تيغسالين", type: "rural" },
          { name: "أكلمام", type: "rural" },
        ]
      },
      {
        name: "قيادة الكبابات",
        communes: [
          { name: "الكبابات", type: "rural" },
          { name: "كلفات", type: "rural" },
          { name: "سيدي يحيى أوسعد", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "خريبكة",
    districts: [
      {
        name: "دائرة خريبكة",
        communes: [
          { name: "خريبكة", type: "urban" },
          { name: "واد زم", type: "urban" },
          { name: "بوجنيبة", type: "urban" },
        ]
      },
      {
        name: "قيادة أبي الجعد",
        communes: [
          { name: "أبي الجعد", type: "urban" },
          { name: "اثنين شراكة", type: "rural" },
          { name: "بني خلوق", type: "rural" },
        ]
      },
      {
        name: "قيادة بوراشد",
        communes: [
          { name: "بوراشد", type: "rural" },
          { name: "لبروج", type: "urban" },
          { name: "بني يخلف", type: "rural" },
        ]
      }
    ]
  },
  // جهة الدار البيضاء - سطات
  {
    name: "الدار البيضاء",
    districts: [
      {
        name: "عمالة الدار البيضاء",
        communes: [
          { name: "المعاريف", type: "urban" },
          { name: "الفداء مرس السلطان", type: "urban" },
          { name: "بن مسيك", type: "urban" },
          { name: "عين السبع الحي المحمدي", type: "urban" },
          { name: "سيدي بليوط", type: "urban" },
          { name: "عين الشق", type: "urban" },
          { name: "مولاي رشيد", type: "urban" },
          { name: "سباتة", type: "urban" },
          { name: "الحي الحسني", type: "urban" },
          { name: "أنفا", type: "urban" },
          { name: "سيدي برنوصي", type: "urban" },
          { name: "سيدي مومن", type: "urban" },
        ]
      }
    ]
  },
  {
    name: "المحمدية",
    districts: [
      {
        name: "دائرة المحمدية",
        communes: [
          { name: "المحمدية", type: "urban" },
          { name: "عين حرودة", type: "urban" },
          { name: "بني يخلف", type: "urban" },
        ]
      },
      {
        name: "قيادة السيبة",
        communes: [
          { name: "السيبة", type: "rural" },
          { name: "الشلالات", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الجديدة",
    districts: [
      {
        name: "دائرة الجديدة",
        communes: [
          { name: "الجديدة", type: "urban" },
          { name: "أزمور", type: "urban" },
        ]
      },
      {
        name: "قيادة سيدي بنور",
        communes: [
          { name: "سيدي بنور", type: "urban" },
          { name: "أولاد فرج", type: "rural" },
          { name: "لمهاية", type: "rural" },
        ]
      },
      {
        name: "قيادة مولاي عبد الله",
        communes: [
          { name: "مولاي عبد الله", type: "rural" },
          { name: "الحوزية", type: "rural" },
          { name: "أولاد غانم", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "النواصر",
    districts: [
      {
        name: "دائرة النواصر",
        communes: [
          { name: "دار بوعزة", type: "urban" },
          { name: "أولاد صالح", type: "urban" },
          { name: "البرنوصي", type: "urban" },
        ]
      },
      {
        name: "قيادة بوسكورة",
        communes: [
          { name: "بوسكورة", type: "rural" },
          { name: "أولاد حدو", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "مديونة",
    districts: [
      {
        name: "دائرة مديونة",
        communes: [
          { name: "مديونة", type: "urban" },
          { name: "مجاطية أولاد الطالب", type: "rural" },
          { name: "سيدي حجاج أولاد حسون", type: "rural" },
        ]
      },
      {
        name: "قيادة تيط ملال",
        communes: [
          { name: "تيط ملال", type: "urban" },
          { name: "لحراويين", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "بنسليمان",
    districts: [
      {
        name: "دائرة بنسليمان",
        communes: [
          { name: "بنسليمان", type: "urban" },
          { name: "بوزنيقة", type: "urban" },
        ]
      },
      {
        name: "قيادة فضالات",
        communes: [
          { name: "فضالات", type: "rural" },
          { name: "عين تيزغة", type: "rural" },
          { name: "الكورة", type: "rural" },
        ]
      },
      {
        name: "قيادة سيدي بطاش",
        communes: [
          { name: "سيدي بطاش", type: "rural" },
          { name: "موالين الغابة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "برشيد",
    districts: [
      {
        name: "دائرة برشيد",
        communes: [
          { name: "برشيد", type: "urban" },
        ]
      },
      {
        name: "قيادة أولاد حريز",
        communes: [
          { name: "أولاد حريز", type: "rural" },
          { name: "الزهيليكة", type: "rural" },
          { name: "خيايطة", type: "rural" },
        ]
      },
      {
        name: "قيادة سيدي رحال الشاطئ",
        communes: [
          { name: "سيدي رحال الشاطئ", type: "urban" },
          { name: "لخزازرة", type: "rural" },
          { name: "أولاد بوزيري", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "سطات",
    districts: [
      {
        name: "دائرة سطات",
        communes: [
          { name: "سطات", type: "urban" },
        ]
      },
      {
        name: "قيادة لبروج",
        communes: [
          { name: "لبروج", type: "urban" },
          { name: "أولاد سيدي بنداود", type: "rural" },
          { name: "المجاعرة", type: "rural" },
        ]
      },
      {
        name: "قيادة بن أحمد",
        communes: [
          { name: "بن أحمد", type: "urban" },
          { name: "أولاد سغير", type: "rural" },
          { name: "رأس العين الشاوية", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "سيدي بنور",
    districts: [
      {
        name: "دائرة سيدي بنور",
        communes: [
          { name: "سيدي بنور", type: "urban" },
        ]
      },
      {
        name: "قيادة أولاد بوعزيز",
        communes: [
          { name: "أولاد بوعزيز", type: "rural" },
          { name: "تلال", type: "rural" },
          { name: "سيدي إسماعيل", type: "urban" },
        ]
      },
      {
        name: "قيادة ثلاثاء بوكدرة",
        communes: [
          { name: "ثلاثاء بوكدرة", type: "rural" },
          { name: "الغربية", type: "rural" },
          { name: "زميمرة", type: "rural" },
        ]
      }
    ]
  },
  // جهة مراكش - آسفي
  {
    name: "مراكش",
    districts: [
      {
        name: "عمالة مراكش",
        communes: [
          { name: "المدينة", type: "urban" },
          { name: "كيليز", type: "urban" },
          { name: "منارة", type: "urban" },
          { name: "سيدي يوسف بن علي", type: "urban" },
          { name: "مشوار القصبة", type: "urban" },
          { name: "النخيل", type: "urban" },
        ]
      },
      {
        name: "قيادة تسلطانت",
        communes: [
          { name: "تسلطانت", type: "rural" },
          { name: "أولاد دليم", type: "rural" },
          { name: "السويهلة", type: "rural" },
        ]
      },
      {
        name: "قيادة العطاوية",
        communes: [
          { name: "العطاوية", type: "rural" },
          { name: "أغفور", type: "rural" },
          { name: "سعادة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "شيشاوة",
    districts: [
      {
        name: "دائرة شيشاوة",
        communes: [
          { name: "شيشاوة", type: "urban" },
        ]
      },
      {
        name: "قيادة إمنتانوت",
        communes: [
          { name: "إمنتانوت", type: "urban" },
          { name: "سيدي المختار", type: "rural" },
          { name: "مجاط", type: "rural" },
        ]
      },
      {
        name: "قيادة ايديل عمرو",
        communes: [
          { name: "ايديل عمرو", type: "rural" },
          { name: "أولاد إكضيم", type: "rural" },
          { name: "تمسيدة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الحوز",
    districts: [
      {
        name: "دائرة تحناوت",
        communes: [
          { name: "تحناوت", type: "urban" },
        ]
      },
      {
        name: "قيادة أسني",
        communes: [
          { name: "أسني", type: "rural" },
          { name: "مولاي إبراهيم", type: "rural" },
          { name: "إيمليل", type: "rural" },
          { name: "أوريكة", type: "rural" },
        ]
      },
      {
        name: "قيادة آيت أورير",
        communes: [
          { name: "آيت أورير", type: "urban" },
          { name: "آيت سيدي داود", type: "rural" },
          { name: "ستي فاضمة", type: "rural" },
        ]
      },
      {
        name: "قيادة أمزميز",
        communes: [
          { name: "أمزميز", type: "urban" },
          { name: "إيغرم", type: "rural" },
          { name: "مزيلات", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "قلعة السراغنة",
    districts: [
      {
        name: "دائرة قلعة السراغنة",
        communes: [
          { name: "قلعة السراغنة", type: "urban" },
        ]
      },
      {
        name: "قيادة اثنين أربعا",
        communes: [
          { name: "اثنين أربعا", type: "rural" },
          { name: "أولاد احسين", type: "rural" },
          { name: "سيدي بوعثمان", type: "rural" },
        ]
      },
      {
        name: "قيادة الطوال",
        communes: [
          { name: "الطوال", type: "rural" },
          { name: "لعبادلة", type: "rural" },
          { name: "سيدي رحال", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الصويرة",
    districts: [
      {
        name: "دائرة الصويرة",
        communes: [
          { name: "الصويرة", type: "urban" },
        ]
      },
      {
        name: "قيادة حاحا",
        communes: [
          { name: "سيدي الكاوكي", type: "rural" },
          { name: "تافضنا", type: "rural" },
          { name: "إدا أوكرد", type: "rural" },
        ]
      },
      {
        name: "قيادة تامانار",
        communes: [
          { name: "تامانار", type: "urban" },
          { name: "سميمو", type: "rural" },
          { name: "أقرض", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "الرحامنة",
    districts: [
      {
        name: "دائرة ابن جرير",
        communes: [
          { name: "ابن جرير", type: "urban" },
        ]
      },
      {
        name: "قيادة سيدي بوعثمان",
        communes: [
          { name: "سيدي بوعثمان", type: "rural" },
          { name: "سيدي عبد الله", type: "rural" },
          { name: "الكدية البيضاء", type: "rural" },
        ]
      },
      {
        name: "قيادة الجمعات",
        communes: [
          { name: "الجمعات", type: "rural" },
          { name: "أولاد حسون حمري", type: "rural" },
          { name: "لعكاكشة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "آسفي",
    districts: [
      {
        name: "دائرة آسفي",
        communes: [
          { name: "آسفي", type: "urban" },
        ]
      },
      {
        name: "قيادة جمعة سحيم",
        communes: [
          { name: "جمعة سحيم", type: "urban" },
          { name: "البدوزة", type: "rural" },
          { name: "اثنين أعشاش", type: "rural" },
        ]
      },
      {
        name: "قيادة الكراكرة",
        communes: [
          { name: "الكراكرة", type: "rural" },
          { name: "سيدي تيجي", type: "rural" },
          { name: "الغياط", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "اليوسفية",
    districts: [
      {
        name: "دائرة اليوسفية",
        communes: [
          { name: "اليوسفية", type: "urban" },
        ]
      },
      {
        name: "قيادة الكدية",
        communes: [
          { name: "الكدية", type: "rural" },
          { name: "جمعة أفين", type: "rural" },
          { name: "أسيف المال", type: "rural" },
        ]
      },
      {
        name: "قيادة أحمر",
        communes: [
          { name: "أحمر", type: "rural" },
          { name: "ركراكة المناغرة", type: "rural" },
        ]
      }
    ]
  },
  // جهة درعة - تافيلالت
  {
    name: "الرشيدية",
    districts: [
      {
        name: "دائرة الرشيدية",
        communes: [
          { name: "الرشيدية", type: "urban" },
          { name: "أرفود", type: "urban" },
        ]
      },
      {
        name: "قيادة كلميمة",
        communes: [
          { name: "كلميمة", type: "urban" },
          { name: "تيطاف", type: "rural" },
          { name: "جرف", type: "rural" },
        ]
      },
      {
        name: "قيادة الريصاني",
        communes: [
          { name: "الريصاني", type: "urban" },
          { name: "سيفا", type: "rural" },
          { name: "مولاي علي الشريف", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "ميدلت",
    districts: [
      {
        name: "دائرة ميدلت",
        communes: [
          { name: "ميدلت", type: "urban" },
        ]
      },
      {
        name: "قيادة الريش",
        communes: [
          { name: "الريش", type: "urban" },
          { name: "أيت عياش", type: "rural" },
          { name: "أمرصيد", type: "rural" },
        ]
      },
      {
        name: "قيادة إملشيل",
        communes: [
          { name: "إملشيل", type: "rural" },
          { name: "آيت يحيى أويسى", type: "rural" },
          { name: "بومية", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "تنغير",
    districts: [
      {
        name: "دائرة تنغير",
        communes: [
          { name: "تنغير", type: "urban" },
        ]
      },
      {
        name: "قيادة الناس",
        communes: [
          { name: "الناس", type: "rural" },
          { name: "تودغى العليا", type: "rural" },
          { name: "آيت تيزكي", type: "rural" },
        ]
      },
      {
        name: "قيادة بومالن دادس",
        communes: [
          { name: "بومالن دادس", type: "urban" },
          { name: "إمي ندونيت", type: "rural" },
          { name: "سوق الخميس دادس", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "ورزازات",
    districts: [
      {
        name: "دائرة ورزازات",
        communes: [
          { name: "ورزازات", type: "urban" },
        ]
      },
      {
        name: "قيادة زاكورة",
        communes: [
          { name: "تارميكت", type: "rural" },
          { name: "غسات", type: "rural" },
          { name: "آيت زينب", type: "rural" },
        ]
      },
      {
        name: "قيادة سكورة",
        communes: [
          { name: "سكورة", type: "rural" },
          { name: "إيدلسان", type: "rural" },
          { name: "تيفولتوت", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "زاكورة",
    districts: [
      {
        name: "دائرة زاكورة",
        communes: [
          { name: "زاكورة", type: "urban" },
        ]
      },
      {
        name: "قيادة أكدز",
        communes: [
          { name: "أكدز", type: "urban" },
          { name: "كتاوة", type: "rural" },
          { name: "تازارين", type: "urban" },
        ]
      },
      {
        name: "قيادة تاكونيت",
        communes: [
          { name: "تاكونيت", type: "rural" },
          { name: "تامزموط", type: "rural" },
          { name: "بني زولي", type: "rural" },
        ]
      }
    ]
  },
  // جهة سوس - ماسة
  {
    name: "أكادير - إداوتنان",
    districts: [
      {
        name: "عمالة أكادير إداوتنان",
        communes: [
          { name: "أكادير", type: "urban" },
          { name: "أنزا", type: "urban" },
          { name: "تيكوين", type: "urban" },
          { name: "بنسركاو", type: "urban" },
        ]
      },
      {
        name: "قيادة الدراركة",
        communes: [
          { name: "الدراركة", type: "rural" },
          { name: "تمسية", type: "rural" },
          { name: "أقسري", type: "rural" },
        ]
      },
      {
        name: "قيادة آزكار",
        communes: [
          { name: "أزكار", type: "rural" },
          { name: "تمري", type: "rural" },
          { name: "إموزار", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "إنزكان - آيت ملول",
    districts: [
      {
        name: "دائرة إنزكان",
        communes: [
          { name: "إنزكان", type: "urban" },
          { name: "آيت ملول", type: "urban" },
          { name: "الدشيرة الجهادية", type: "urban" },
        ]
      },
      {
        name: "قيادة أولاد داحو",
        communes: [
          { name: "أولاد داحو", type: "rural" },
          { name: "أولاد تيمة", type: "urban" },
          { name: "تملدكت", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "شتوكة آيت باها",
    districts: [
      {
        name: "دائرة بيوكرى",
        communes: [
          { name: "بيوكرى", type: "urban" },
          { name: "أيت باها", type: "urban" },
        ]
      },
      {
        name: "قيادة آيت عميرة",
        communes: [
          { name: "آيت عميرة", type: "rural" },
          { name: "سيدي بيبي", type: "rural" },
          { name: "ماسة", type: "urban" },
        ]
      },
      {
        name: "قيادة إنشادن",
        communes: [
          { name: "إنشادن", type: "rural" },
          { name: "بلفاع", type: "rural" },
          { name: "أيت مزال", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "تارودانت",
    districts: [
      {
        name: "دائرة تارودانت",
        communes: [
          { name: "تارودانت", type: "urban" },
        ]
      },
      {
        name: "قيادة أولاد برحيل",
        communes: [
          { name: "أولاد برحيل", type: "urban" },
          { name: "فريجة", type: "rural" },
          { name: "الكردان", type: "rural" },
        ]
      },
      {
        name: "قيادة إيغرم",
        communes: [
          { name: "إيغرم", type: "urban" },
          { name: "تالكجونت", type: "rural" },
          { name: "أونين", type: "rural" },
        ]
      },
      {
        name: "قيادة تاليوين",
        communes: [
          { name: "تاليوين", type: "urban" },
          { name: "أسكاون", type: "rural" },
          { name: "تيزكي", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "تيزنيت",
    districts: [
      {
        name: "دائرة تيزنيت",
        communes: [
          { name: "تيزنيت", type: "urban" },
        ]
      },
      {
        name: "قيادة أكلو",
        communes: [
          { name: "أكلو", type: "rural" },
          { name: "ركونة", type: "rural" },
          { name: "أربعاء رسموكة", type: "rural" },
        ]
      },
      {
        name: "قيادة أنزي",
        communes: [
          { name: "أنزي", type: "urban" },
          { name: "تافراوت", type: "urban" },
          { name: "أمالن", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "طاطا",
    districts: [
      {
        name: "دائرة طاطا",
        communes: [
          { name: "طاطا", type: "urban" },
        ]
      },
      {
        name: "قيادة فم زكيد",
        communes: [
          { name: "فم زكيد", type: "urban" },
          { name: "أقا", type: "urban" },
          { name: "تيسينت", type: "rural" },
        ]
      },
      {
        name: "قيادة إيسافن",
        communes: [
          { name: "إيسافن", type: "rural" },
          { name: "أدرج", type: "rural" },
          { name: "تاغموت", type: "rural" },
        ]
      }
    ]
  },
  // جهة كلميم - واد نون
  {
    name: "كلميم",
    districts: [
      {
        name: "دائرة كلميم",
        communes: [
          { name: "كلميم", type: "urban" },
        ]
      },
      {
        name: "قيادة أسرير",
        communes: [
          { name: "أسرير", type: "rural" },
          { name: "تكانت", type: "rural" },
          { name: "أداي", type: "rural" },
        ]
      },
      {
        name: "قيادة بويزكارن",
        communes: [
          { name: "بويزكارن", type: "urban" },
          { name: "تيمولاي", type: "rural" },
          { name: "إفران أطلس الصغير", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "آسا - الزاك",
    districts: [
      {
        name: "دائرة آسا",
        communes: [
          { name: "آسا", type: "urban" },
          { name: "الزاك", type: "urban" },
        ]
      },
      {
        name: "قيادة أوم لعشار",
        communes: [
          { name: "أوم لعشار", type: "rural" },
          { name: "العرجة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "طانطان",
    districts: [
      {
        name: "دائرة طانطان",
        communes: [
          { name: "طانطان", type: "urban" },
          { name: "الوطية", type: "urban" },
        ]
      },
      {
        name: "قيادة المسيد",
        communes: [
          { name: "المسيد", type: "rural" },
          { name: "الشبيكة", type: "rural" },
          { name: "بن خليل", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "سيدي إفني",
    districts: [
      {
        name: "دائرة سيدي إفني",
        communes: [
          { name: "سيدي إفني", type: "urban" },
          { name: "ميرلفت", type: "urban" },
        ]
      },
      {
        name: "قيادة لخصاص",
        communes: [
          { name: "لخصاص", type: "rural" },
          { name: "مستي", type: "rural" },
          { name: "سبت النابور", type: "rural" },
        ]
      }
    ]
  },
  // جهة العيون - الساقية الحمراء
  {
    name: "العيون",
    districts: [
      {
        name: "دائرة العيون",
        communes: [
          { name: "العيون", type: "urban" },
          { name: "المرسى", type: "urban" },
        ]
      },
      {
        name: "قيادة فم الواد",
        communes: [
          { name: "فم الواد", type: "rural" },
          { name: "الدشيرة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "بوجدور",
    districts: [
      {
        name: "دائرة بوجدور",
        communes: [
          { name: "بوجدور", type: "urban" },
        ]
      },
      {
        name: "قيادة جريفية",
        communes: [
          { name: "جريفية", type: "rural" },
          { name: "لمسيد", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "طرفاية",
    districts: [
      {
        name: "دائرة طرفاية",
        communes: [
          { name: "طرفاية", type: "urban" },
        ]
      },
      {
        name: "قيادة الطاح",
        communes: [
          { name: "الطاح", type: "rural" },
          { name: "أخفنير", type: "rural" },
          { name: "داورة", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "السمارة",
    districts: [
      {
        name: "دائرة السمارة",
        communes: [
          { name: "السمارة", type: "urban" },
        ]
      },
      {
        name: "قيادة حوزة",
        communes: [
          { name: "حوزة", type: "rural" },
          { name: "امكالة", type: "rural" },
          { name: "تيفاريتي", type: "rural" },
        ]
      }
    ]
  },
  // جهة الداخلة - وادي الذهب
  {
    name: "وادي الذهب",
    districts: [
      {
        name: "دائرة الداخلة",
        communes: [
          { name: "الداخلة", type: "urban" },
          { name: "الأركوب", type: "rural" },
          { name: "بئر كندوز", type: "rural" },
        ]
      },
      {
        name: "قيادة المحبس",
        communes: [
          { name: "المحبس", type: "rural" },
          { name: "إيمليلي", type: "rural" },
        ]
      }
    ]
  },
  {
    name: "أوسرد",
    districts: [
      {
        name: "دائرة أوسرد",
        communes: [
          { name: "أوسرد", type: "urban" },
          { name: "بئر أنزران", type: "rural" },
        ]
      },
      {
        name: "قيادة الكويرة",
        communes: [
          { name: "الكويرة", type: "rural" },
          { name: "أكطي الغازي", type: "rural" },
          { name: "زوك", type: "rural" },
        ]
      }
    ]
  }
];

// Helper functions
export const getAllProvinces = (): string[] => {
  return provinces.map(p => p.name);
};

export const getDistrictsByProvince = (provinceName: string): string[] => {
  const province = provinces.find(p => p.name === provinceName);
  return province ? province.districts.map(d => d.name) : [];
};

export const getCommunesByDistrict = (provinceName: string, districtName: string): Commune[] => {
  const province = provinces.find(p => p.name === provinceName);
  if (!province) return [];
  const district = province.districts.find(d => d.name === districtName);
  return district ? district.communes : [];
};

export const getCommuneNames = (provinceName: string, districtName: string): string[] => {
  return getCommunesByDistrict(provinceName, districtName).map(c => c.name);
};
