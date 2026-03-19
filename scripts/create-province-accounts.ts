/**
 * Script to create Firebase accounts for each Moroccan province
 * 
 * Usage:
 * 1. Install Firebase Admin SDK: npm install firebase-admin
 * 2. Download your Firebase service account key from:
 *    Firebase Console → Project Settings → Service Accounts → Generate new private key
 * 3. Save the key as "serviceAccountKey.json" in the scripts folder
 * 4. Run: npx ts-node scripts/create-province-accounts.ts
 */

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// List of all Moroccan provinces
const provinces = [
  // جهة طنجة - تطوان - الحسيمة
  "طنجة - أصيلة",
  "المضيق - الفنيدق",
  "تطوان",
  "الفحص - أنجرة",
  "العرائش",
  "الحسيمة",
  "شفشاون",
  "وزان",
  
  // جهة الشرق
  "وجدة - أنكاد",
  "الناظور",
  "الدريوش",
  "جرادة",
  "بركان",
  "تاوريرت",
  "كرسيف",
  "فكيك",
  
  // جهة فاس - مكناس
  "فاس",
  "مكناس",
  "الحاجب",
  "إفران",
  "مولاي يعقوب",
  "صفرو",
  "بولمان",
  "تاونات",
  "تازة",
  
  // جهة الرباط - سلا - القنيطرة
  "الرباط",
  "سلا",
  "الصخيرات - تمارة",
  "القنيطرة",
  "الخميسات",
  "سيدي قاسم",
  "سيدي سليمان",
  
  // جهة بني ملال - خنيفرة
  "بني ملال",
  "أزيلال",
  "الفقيه بن صالح",
  "خنيفرة",
  "خريبكة",
  
  // جهة الدار البيضاء - سطات
  "الدار البيضاء",
  "المحمدية",
  "الجديدة",
  "النواصر",
  "مديونة",
  "بنسليمان",
  "برشيد",
  "سطات",
  "سيدي بنور",
  
  // جهة مراكش - آسفي
  "مراكش",
  "شيشاوة",
  "الحوز",
  "قلعة السراغنة",
  "الصويرة",
  "الرحامنة",
  "آسفي",
  "اليوسفية",
  
  // جهة درعة - تافيلالت
  "الرشيدية",
  "ورزازات",
  "ميدلت",
  "تنغير",
  "زاكورة",
  
  // جهة سوس - ماسة
  "أكادير - إداوتنان",
  "إنزكان - آيت ملول",
  "شتوكة - آيت باها",
  "تارودانت",
  "تيزنيت",
  "طاطا",
  
  // جهة كلميم - واد نون
  "كلميم",
  "آسا - الزاك",
  "طانطان",
  "سيدي إفني",
  
  // جهة العيون - الساقية الحمراء
  "العيون",
  "بوجدور",
  "طرفاية",
  "السمارة",
  
  // جهة الداخلة - وادي الذهب
  "وادي الذهب",
  "أوسرد"
];

// Function to generate email from province name
function generateEmail(province: string): string {
  // Remove special characters and spaces, convert to lowercase
  const normalized = province
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  // Transliterate Arabic to Latin for email
  const translitMap: { [key: string]: string } = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a',
    'ب': 'b', 'ت': 't', 'ث': 'th',
    'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r',
    'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't',
    'ظ': 'z', 'ع': 'a', 'غ': 'gh',
    'ف': 'f', 'ق': 'q', 'ك': 'k',
    'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y',
    'ى': 'a', 'ة': 'a', 'ء': '',
    'ئ': 'e', 'ؤ': 'o', '-': '-'
  };
  
  let email = '';
  for (const char of normalized) {
    email += translitMap[char] || char;
  }
  
  // Clean up the email
  email = email
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${email}@entraide.ma`;
}

// Function to generate a secure password
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function createProvinceAccounts() {
  // Initialize Firebase Admin
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Service account key not found!');
    console.error('Please download it from Firebase Console and save as scripts/serviceAccountKey.json');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const authAdmin = admin.auth();
  const dbAdmin = admin.firestore();

  console.log('🚀 Starting province account creation...\n');

  const results: { province: string; email: string; password: string; status: string }[] = [];

  for (const province of provinces) {
    const email = generateEmail(province);
    const password = generatePassword();

    try {
      // Create user in Firebase Auth
      const userRecord = await authAdmin.createUser({
        email,
        password,
        displayName: province,
        emailVerified: true
      });

      // Create user document in Firestore
      await dbAdmin.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email,
        role: 'user',
        province,
        displayName: province,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      results.push({ province, email, password, status: '✅ Created' });
      console.log(`✅ ${province}: ${email}`);

    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        results.push({ province, email, password: '(existing)', status: '⚠️ Already exists' });
        console.log(`⚠️ ${province}: ${email} (already exists)`);
      } else {
        results.push({ province, email, password: '', status: `❌ Error: ${error.message}` });
        console.error(`❌ ${province}: ${error.message}`);
      }
    }
  }

  // Save results to CSV file
  const csvContent = [
    'Province,Email,Password,Status',
    ...results.map(r => `"${r.province}","${r.email}","${r.password}","${r.status}"`)
  ].join('\n');

  const outputPath = path.join(__dirname, 'province-accounts.csv');
  fs.writeFileSync(outputPath, '\uFEFF' + csvContent, 'utf8'); // BOM for Arabic support

  console.log('\n📄 Results saved to: scripts/province-accounts.csv');
  console.log(`\n✅ Created ${results.filter(r => r.status.includes('Created')).length} accounts`);
  console.log(`⚠️ Already existed: ${results.filter(r => r.status.includes('exists')).length}`);
  console.log(`❌ Errors: ${results.filter(r => r.status.includes('Error')).length}`);

  process.exit(0);
}

createProvinceAccounts();
