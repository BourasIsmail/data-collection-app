/**
 * Script to create province user accounts in Firebase
 * 
 * Prerequisites:
 * 1. Install Firebase Admin SDK: npm install firebase-admin
 * 2. Download your service account key from Firebase Console:
 *    - Go to Project Settings > Service Accounts
 *    - Click "Generate new private key"
 *    - Save as "serviceAccountKey.json" in the scripts folder
 * 
 * Usage:
 * node scripts/create-province-users.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

// All Moroccan provinces with email format
const provinces = [
  // Tanger-Tétouan-Al Hoceïma
  { province: "طنجة-أصيلة", email: "tanger-assilah" },
  { province: "المضيق-الفنيدق", email: "mdiq-fnideq" },
  { province: "تطوان", email: "tetouan" },
  { province: "الفحص-أنجرة", email: "fahs-anjra" },
  { province: "العرائش", email: "larache" },
  { province: "الحسيمة", email: "alhoceima" },
  { province: "شفشاون", email: "chefchaouen" },
  { province: "وزان", email: "ouazzane" },
  
  // L'Oriental
  { province: "وجدة-أنكاد", email: "oujda-angad" },
  { province: "الناظور", email: "nador" },
  { province: "الدريوش", email: "driouch" },
  { province: "بركان", email: "berkane" },
  { province: "تاوريرت", email: "taourirt" },
  { province: "جرادة", email: "jerada" },
  { province: "فجيج", email: "figuig" },
  { province: "جرسيف", email: "guercif" },
  
  // Fès-Meknès
  { province: "فاس", email: "fes" },
  { province: "مكناس", email: "meknes" },
  { province: "الحاجب", email: "elhajeb" },
  { province: "إفران", email: "ifrane" },
  { province: "مولاي يعقوب", email: "moulayacoub" },
  { province: "صفرو", email: "sefrou" },
  { province: "بولمان", email: "boulemane" },
  { province: "تاونات", email: "taounate" },
  { province: "تازة", email: "taza" },
  
  // Rabat-Salé-Kénitra
  { province: "الرباط", email: "rabat" },
  { province: "سلا", email: "sale" },
  { province: "الصخيرات-تمارة", email: "skhirat-temara" },
  { province: "القنيطرة", email: "kenitra" },
  { province: "الخميسات", email: "khemisset" },
  { province: "سيدي قاسم", email: "sidikassem" },
  { province: "سيدي سليمان", email: "sidislimane" },
  
  // Béni Mellal-Khénifra
  { province: "بني ملال", email: "benimellal" },
  { province: "أزيلال", email: "azilal" },
  { province: "الفقيه بن صالح", email: "fquihbensalah" },
  { province: "خنيفرة", email: "khenifra" },
  { province: "خريبكة", email: "khouribga" },
  
  // Casablanca-Settat
  { province: "الدار البيضاء", email: "casablanca" },
  { province: "المحمدية", email: "mohammedia" },
  { province: "الجديدة", email: "eljadida" },
  { province: "النواصر", email: "nouaceur" },
  { province: "مديونة", email: "mediouna" },
  { province: "بنسليمان", email: "benslimane" },
  { province: "برشيد", email: "berrechid" },
  { province: "سطات", email: "settat" },
  { province: "سيدي بنور", email: "sidibennour" },
  
  // Marrakech-Safi
  { province: "مراكش", email: "marrakech" },
  { province: "شيشاوة", email: "chichaoua" },
  { province: "الحوز", email: "alhaouz" },
  { province: "قلعة السراغنة", email: "kelaat-sraghna" },
  { province: "الصويرة", email: "essaouira" },
  { province: "الرحامنة", email: "rhamna" },
  { province: "آسفي", email: "safi" },
  { province: "اليوسفية", email: "youssoufia" },
  
  // Drâa-Tafilalet
  { province: "الرشيدية", email: "errachidia" },
  { province: "ورزازات", email: "ouarzazate" },
  { province: "ميدلت", email: "midelt" },
  { province: "تنغير", email: "tinghir" },
  { province: "زاكورة", email: "zagora" },
  
  // Souss-Massa
  { province: "أكادير إداوتنان", email: "agadir" },
  { province: "إنزكان-آيت ملول", email: "inezgane-aitmelloul" },
  { province: "شتوكة-آيت باها", email: "chtouka-aitbaha" },
  { province: "تارودانت", email: "taroudant" },
  { province: "تيزنيت", email: "tiznit" },
  { province: "طاطا", email: "tata" },
  
  // Guelmim-Oued Noun
  { province: "كلميم", email: "guelmim" },
  { province: "آسا-الزاك", email: "assa-zag" },
  { province: "طانطان", email: "tantan" },
  { province: "سيدي إفني", email: "sidiifni" },
  
  // Laâyoune-Sakia El Hamra
  { province: "العيون", email: "laayoune" },
  { province: "بوجدور", email: "boujdour" },
  { province: "طرفاية", email: "tarfaya" },
  { province: "السمارة", email: "smara" },
  
  // Dakhla-Oued Ed-Dahab
  { province: "وادي الذهب", email: "ouededdahab" },
  { province: "أوسرد", email: "aousserd" },
];

// Default password - CHANGE THIS before running!
const DEFAULT_PASSWORD = "Entraide2024!";

async function createProvinceUsers() {
  console.log(`Creating ${provinces.length} province user accounts...\n`);
  
  const results = {
    created: [],
    failed: [],
    skipped: []
  };

  for (const { province, email } of provinces) {
    const fullEmail = `${email}@entraide.ma`;
    
    try {
      // Check if user already exists
      try {
        const existingUser = await auth.getUserByEmail(fullEmail);
        console.log(`⏭ Skipped: ${fullEmail} (already exists)`);
        results.skipped.push({ province, email: fullEmail });
        continue;
      } catch (error) {
        // User doesn't exist, continue to create
      }

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email: fullEmail,
        password: DEFAULT_PASSWORD,
        displayName: province,
        disabled: false
      });

      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email: fullEmail,
        role: 'user',
        province: province,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✓ Created: ${fullEmail} (${province})`);
      results.created.push({ province, email: fullEmail, uid: userRecord.uid });

    } catch (error) {
      console.error(`✗ Failed: ${fullEmail} - ${error.message}`);
      results.failed.push({ province, email: fullEmail, error: error.message });
    }
  }

  // Summary
  console.log('\n========== SUMMARY ==========');
  console.log(`Created: ${results.created.length}`);
  console.log(`Skipped: ${results.skipped.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed accounts:');
    results.failed.forEach(f => console.log(`  - ${f.email}: ${f.error}`));
  }

  console.log('\n========== CREDENTIALS ==========');
  console.log(`Default password for all accounts: ${DEFAULT_PASSWORD}`);
  console.log('Please share credentials securely with each province.');
  
  process.exit(0);
}

createProvinceUsers().catch(console.error);
