const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const NutritionLog = require('../models/NutritionLog');
const VitalLog = require('../models/VitalLog');
const SleepLog = require('../models/SleepLog');
const ActivityLog = require('../models/ActivityLog');
const HydrationLog = require('../models/HydrationLog');

const ATHLETES_SEED = [
  {
    name: 'Elena Vance',
    email: 'elena.vance@aurahealth.io',
    password: 'Password123!',
    role: 'user',
    profile: {
      age: 28,
      gender: 'Female',
      height: '172 cm',
      weight: '64 kg',
      goal: 'Lean Hypertrophy & Autonomic Balance',
      notifications: true,
      haptics: true,
      exportFormat: 'PDF',
    },
    themeMode: 'dark',
    nutrition: {
      phase: 'LEAN HYPERTROPHY',
      targets: { calories: 2750, protein: 195, carbs: 280, fats: 65, fiber: 38, sodium: 2300 },
      meals: [
        {
          category: 'Breakfast',
          title: 'Morning Fuel',
          time: '07:30 AM',
          foods: [
            { name: 'Whole Eggs + Whites', quantity: '3 eggs + 100g whites', calories: 280, protein: 32, carbs: 2, fats: 15 },
            { name: 'Rolled Oats with Honey', quantity: '80g dry', calories: 310, protein: 11, carbs: 56, fats: 5 },
            { name: 'Fresh Banana', quantity: '1 medium', calories: 105, protein: 1.3, carbs: 27, fats: 0.3 },
          ],
        },
        {
          category: 'Post-Workout',
          title: 'Anabolic Surge',
          time: '11:00 AM',
          foods: [
            { name: 'Whey Protein Isolate', quantity: '35g scoop', calories: 130, protein: 30, carbs: 1, fats: 0.5 },
            { name: 'Steamed Jasmine Rice', quantity: '250g cooked', calories: 325, protein: 6, carbs: 72, fats: 0.5 },
          ],
        },
        {
          category: 'Lunch',
          title: 'Metabolic Support',
          time: '02:15 PM',
          foods: [
            { name: 'Grilled Chicken Breast', quantity: '200g', calories: 330, protein: 62, carbs: 0, fats: 7 },
            { name: 'Baked Sweet Potato', quantity: '180g', calories: 155, protein: 3.5, carbs: 36, fats: 0.3 },
            { name: 'Steamed Broccoli', quantity: '150g', calories: 50, protein: 4.2, carbs: 10, fats: 0.6 },
          ],
        },
        {
          category: 'Dinner',
          title: 'Recovery Dinner',
          time: '07:45 PM',
          foods: [
            { name: 'Wild Atlantic Salmon', quantity: '190g fillet', calories: 395, protein: 40, carbs: 0, fats: 24 },
            { name: 'Mixed Greens with Olive Oil', quantity: '1 bowl', calories: 140, protein: 2, carbs: 5, fats: 14 },
          ],
        },
      ],
      supplements: [
        { name: 'Creatine Monohydrate', dosage: '5g (Creapure)', taken: true, time: 'Post-Workout' },
        { name: 'Ultra Omega-3 EPA/DHA', dosage: '2000mg', taken: true, time: 'Morning' },
        { name: 'Vitamin D3 + K2', dosage: '5000 IU', taken: true, time: 'Morning' },
        { name: 'Magnesium Glycinate', dosage: '400mg', taken: false, time: 'Before Bed' },
      ],
    },
    vitals: {
      heartRate: { current: 64, resting: 58, hrv: 78, status: 'Normal Sinus Rhythm' },
      bloodPressure: { systolic: 118, diastolic: 76, map: 90, pulse: 62, category: 'Optimal' },
      bloodGlucose: { value: 94, unit: 'mg/dL', state: 'Fasting' },
      oxygen: { value: 99, unit: '%' },
      temperature: { value: 98.4, unit: '°F' },
      ecgRecords: [
        { title: 'Resting Clinical Baseline', bpm: 62, qtc: 408, rhythm: 'Normal Sinus Rhythm', time: '07:45 AM' },
        { title: 'Post-Workout Recovery Trace', bpm: 84, qtc: 412, rhythm: 'Normal Sinus Rhythm', time: '11:30 AM' },
      ],
    },
    sleep: {
      duration: '8h 12m',
      totalMinutes: 492,
      score: 89,
      status: 'Restful Deep State',
      bedtime: '10:45 PM',
      wakeTime: '06:57 AM',
      stages: {
        awake: '32m',
        awakePct: 6,
        light: '4h 10m',
        lightPct: 50,
        deep: '1h 58m',
        deepPct: 24,
        rem: '2h 10m',
        remPct: 26,
      },
    },
    activity: {
      strain: 14.8,
      strainTarget: 15.0,
      calories: 740,
      activeMinutes: 80,
      streak: 14,
      workouts: [
        { name: 'Hypertrophy - Anterior Chain', duration: '55 mins', calories: 420, avgHr: 138, maxHr: 168 },
        { name: 'Zone 2 Cardio Recovery', duration: '25 mins', calories: 180, avgHr: 124, maxHr: 135 },
      ],
    },
    hydration: {
      target: 2800,
      logs: [
        { amount: 500, time: '08:00 AM' },
        { amount: 500, time: '11:15 AM' },
        { amount: 500, time: '02:30 PM' },
        { amount: 800, time: '05:45 PM' },
      ],
    },
  },
  {
    name: 'Marcus Brody',
    email: 'marcus.brody@ironforge.com',
    password: 'Password123!',
    role: 'user',
    profile: {
      age: 32,
      gender: 'Male',
      height: '185 cm',
      weight: '96 kg',
      goal: 'Aggressive Lean Bulk & Glycogen Saturation',
      notifications: true,
      haptics: true,
      exportFormat: 'PDF',
    },
    themeMode: 'dark',
    nutrition: {
      phase: 'AGGRESSIVE BULK',
      targets: { calories: 3800, protein: 240, carbs: 490, fats: 85, fiber: 45, sodium: 3200 },
      meals: [
        {
          category: 'Breakfast',
          title: 'Meal 1',
          time: '06:30 AM',
          foods: [
            { name: 'Whole Eggs', quantity: '6 large', calories: 430, protein: 36, carbs: 3, fats: 30 },
            { name: 'Cream of Rice + Honey', quantity: '150g', calories: 540, protein: 10, carbs: 120, fats: 2 },
          ],
        },
        {
          category: 'Lunch',
          title: 'Meal 2 (Pre-Workout)',
          time: '10:00 AM',
          foods: [
            { name: '93% Lean Ground Beef', quantity: '220g', calories: 380, protein: 46, carbs: 0, fats: 18 },
            { name: 'Basmati Rice', quantity: '250g', calories: 325, protein: 7, carbs: 70, fats: 1 },
          ],
        },
        {
          category: 'Post-Workout',
          title: 'Post-Workout Hyperemia',
          time: '01:30 PM',
          foods: [
            { name: 'Hydrolyzed Whey', quantity: '50g', calories: 190, protein: 44, carbs: 2, fats: 1 },
            { name: 'Dextrose Cluster Powder', quantity: '100g', calories: 380, protein: 0, carbs: 95, fats: 0 },
          ],
        },
      ],
      supplements: [
        { name: 'Creatine Monohydrate', dosage: '10g', taken: true, time: 'Pre-Workout' },
        { name: 'L-Citrulline Malate', dosage: '8000mg', taken: true, time: 'Pre-Workout' },
      ],
    },
    vitals: {
      heartRate: { current: 72, resting: 54, hrv: 62, status: 'Normal Sinus Rhythm' },
      bloodPressure: { systolic: 124, diastolic: 80, map: 94, pulse: 68, category: 'Pre-Elevated' },
      bloodGlucose: { value: 102, unit: 'mg/dL', state: 'Post-Prandial' },
      oxygen: { value: 98, unit: '%' },
      temperature: { value: 98.6, unit: '°F' },
      ecgRecords: [
        { title: 'Pre-Workout Baseline', bpm: 58, qtc: 410, rhythm: 'Normal Sinus Rhythm', time: '09:15 AM' },
      ],
    },
    sleep: {
      duration: '7h 45m',
      totalMinutes: 465,
      score: 82,
      status: 'Restful State',
      bedtime: '11:15 PM',
      wakeTime: '07:00 AM',
      stages: { awake: '45m', awakePct: 9, light: '4h 28m', lightPct: 58, deep: '1h 32m', deepPct: 20, rem: '1h 45m', remPct: 22 },
    },
    activity: {
      strain: 17.4,
      strainTarget: 17.5,
      calories: 1120,
      activeMinutes: 95,
      streak: 21,
      workouts: [
        { name: 'Heavy Leg Day (Squat & RDL Focus)', duration: '75 mins', calories: 680, avgHr: 152, maxHr: 178 },
        { name: 'Incline Treadmill Walk', duration: '20 mins', calories: 150, avgHr: 115, maxHr: 125 },
      ],
    },
    hydration: {
      target: 4000,
      logs: [{ amount: 1000, time: '07:00 AM' }, { amount: 1000, time: '11:30 AM' }, { amount: 1650, time: '04:00 PM' }],
    },
  },
  {
    name: 'Dr. Samantha Chen',
    email: 's.chen@metaboliclab.org',
    password: 'Password123!',
    role: 'user',
    profile: {
      age: 35,
      gender: 'Female',
      height: '168 cm',
      weight: '58 kg',
      goal: 'Metabolic Optimization & Autonomic Stability',
      notifications: true,
      haptics: true,
      exportFormat: 'PDF',
    },
    themeMode: 'dark',
    nutrition: {
      phase: 'RECOMPOSITION',
      targets: { calories: 2100, protein: 145, carbs: 210, fats: 55, fiber: 35, sodium: 2000 },
      meals: [
        {
          category: 'Breakfast',
          title: 'Plant Protein & Fats',
          time: '08:00 AM',
          foods: [
            { name: 'Tofu & Spinach Scramble', quantity: '200g tofu', calories: 220, protein: 24, carbs: 6, fats: 12 },
            { name: 'Gluten-Free Sourdough', quantity: '2 slices', calories: 180, protein: 5, carbs: 36, fats: 1 },
          ],
        },
      ],
      supplements: [
        { name: 'Liposomal Glutathione', dosage: '500mg', taken: true, time: 'Morning' },
        { name: 'Ubiquinol CoQ10', dosage: '200mg', taken: true, time: 'Morning' },
      ],
    },
    vitals: {
      heartRate: { current: 58, resting: 51, hrv: 94, status: 'Normal Sinus Rhythm' },
      bloodPressure: { systolic: 110, diastolic: 70, map: 83, pulse: 56, category: 'Optimal' },
      bloodGlucose: { value: 88, unit: 'mg/dL', state: 'Fasting' },
      oxygen: { value: 99, unit: '%' },
      temperature: { value: 98.2, unit: '°F' },
      ecgRecords: [
        { title: 'Annual Medical Trace', bpm: 52, qtc: 402, rhythm: 'Normal Sinus Rhythm', time: '08:30 AM' },
      ],
    },
    sleep: {
      duration: '8h 45m',
      totalMinutes: 525,
      score: 94,
      status: 'Peak Restorative State',
      bedtime: '10:15 PM',
      wakeTime: '07:00 AM',
      stages: { awake: '20m', awakePct: 4, light: '4h 10m', lightPct: 47, deep: '2h 15m', deepPct: 26, rem: '2h 20m', remPct: 27 },
    },
    activity: {
      strain: 10.2,
      strainTarget: 12.0,
      calories: 480,
      activeMinutes: 45,
      streak: 9,
      workouts: [
        { name: 'Vinyasa Yoga & Breathwork', duration: '45 mins', calories: 210, avgHr: 108, maxHr: 122 },
      ],
    },
    hydration: {
      target: 2500,
      logs: [{ amount: 800, time: '08:30 AM' }, { amount: 800, time: '01:00 PM' }, { amount: 800, time: '06:00 PM' }],
    },
  },
  {
    name: 'Liam Gallagher',
    email: 'liam.g@endurancehyrox.uk',
    password: 'Password123!',
    role: 'user',
    profile: {
      age: 30,
      gender: 'Male',
      height: '180 cm',
      weight: '82 kg',
      goal: 'Hyrox Pro Division Endurance & VO2 Peak',
      notifications: true,
      haptics: true,
      exportFormat: 'PDF',
    },
    themeMode: 'dark',
    nutrition: {
      phase: 'CUTTING / VASCULARITY',
      targets: { calories: 3100, protein: 210, carbs: 380, fats: 60, fiber: 40, sodium: 3500 },
      meals: [],
      supplements: [{ name: 'Beta-Alanine', dosage: '4000mg', taken: true, time: 'Pre-Workout' }],
    },
    vitals: {
      heartRate: { current: 68, resting: 48, hrv: 86, status: 'Normal Sinus Rhythm' },
      bloodPressure: { systolic: 116, diastolic: 74, map: 88, pulse: 54, category: 'Optimal' },
      bloodGlucose: { value: 91, unit: 'mg/dL', state: 'Fasting' },
      oxygen: { value: 99, unit: '%' },
      temperature: { value: 98.4, unit: '°F' },
      ecgRecords: [],
    },
    sleep: {
      duration: '7h 15m',
      totalMinutes: 435,
      score: 79,
      status: 'Restful State',
      bedtime: '11:00 PM',
      wakeTime: '06:15 AM',
      stages: { awake: '40m', awakePct: 9, light: '4h 20m', lightPct: 60, deep: '1h 20m', deepPct: 18, rem: '1h 35m', remPct: 22 },
    },
    activity: {
      strain: 18.9,
      strainTarget: 19.0,
      calories: 1350,
      activeMinutes: 110,
      streak: 30,
      workouts: [
        { name: 'Hyrox Simulation (SkiErg + Sled)', duration: '65 mins', calories: 840, avgHr: 162, maxHr: 184 },
      ],
    },
    hydration: {
      target: 3500,
      logs: [{ amount: 1000, time: '06:30 AM' }, { amount: 1500, time: '11:00 AM' }, { amount: 800, time: '04:00 PM' }],
    },
  },
  {
    name: 'Chloe Bennett',
    email: 'chloe.bennett@zenflow.co',
    password: 'Password123!',
    role: 'user',
    profile: {
      age: 26,
      gender: 'Female',
      height: '165 cm',
      weight: '55 kg',
      goal: 'Consistent Sleep Schedule & Zone 2 Fitness',
      notifications: true,
      haptics: true,
      exportFormat: 'PDF',
    },
    themeMode: 'dark',
    nutrition: {
      phase: 'MAINTENANCE',
      targets: { calories: 1950, protein: 125, carbs: 215, fats: 55, fiber: 30, sodium: 1800 },
      meals: [],
      supplements: [{ name: 'Magnesium L-Threonate', dosage: '2000mg', taken: true, time: 'Night' }],
    },
    vitals: {
      heartRate: { current: 66, resting: 60, hrv: 74, status: 'Normal Sinus Rhythm' },
      bloodPressure: { systolic: 114, diastolic: 72, map: 86, pulse: 60, category: 'Optimal' },
      bloodGlucose: { value: 92, unit: 'mg/dL', state: 'Fasting' },
      oxygen: { value: 99, unit: '%' },
      temperature: { value: 98.3, unit: '°F' },
      ecgRecords: [],
    },
    sleep: {
      duration: '8h 30m',
      totalMinutes: 510,
      score: 91,
      status: 'Restful Deep State',
      bedtime: '10:30 PM',
      wakeTime: '07:00 AM',
      stages: { awake: '25m', awakePct: 5, light: '4h 35m', lightPct: 53, deep: '1h 50m', deepPct: 22, rem: '2h 05m', remPct: 25 },
    },
    activity: {
      strain: 8.6,
      strainTarget: 10.0,
      calories: 360,
      activeMinutes: 35,
      streak: 5,
      workouts: [{ name: 'Outdoor Tempo Walk', duration: '35 mins', calories: 175, avgHr: 112, maxHr: 124 }],
    },
    hydration: {
      target: 2500,
      logs: [{ amount: 500, time: '09:00 AM' }, { amount: 700, time: '01:30 PM' }, { amount: 750, time: '06:30 PM' }],
    },
  },
  {
    name: 'Vikram Patel',
    email: 'vikram.p@powerlifting.in',
    password: 'Password123!',
    role: 'user',
    profile: {
      age: 29,
      gender: 'Male',
      height: '178 cm',
      weight: '88 kg',
      goal: 'Maximal Strength (Deadlift & Squat Specialization)',
      notifications: true,
      haptics: true,
      exportFormat: 'PDF',
    },
    themeMode: 'dark',
    nutrition: {
      phase: 'LEAN HYPERTROPHY',
      targets: { calories: 3400, protein: 220, carbs: 420, fats: 80, fiber: 42, sodium: 3000 },
      meals: [],
      supplements: [{ name: 'Creatine Creapure', dosage: '5g', taken: true, time: 'Post-Workout' }],
    },
    vitals: {
      heartRate: { current: 74, resting: 62, hrv: 55, status: 'Normal Sinus Rhythm' },
      bloodPressure: { systolic: 128, diastolic: 82, map: 97, pulse: 70, category: 'Pre-Elevated' },
      bloodGlucose: { value: 98, unit: 'mg/dL', state: 'Fasting' },
      oxygen: { value: 98, unit: '%' },
      temperature: { value: 98.7, unit: '°F' },
      ecgRecords: [],
    },
    sleep: {
      duration: '6h 50m',
      totalMinutes: 410,
      score: 75,
      status: 'Light Sleep State',
      bedtime: '11:45 PM',
      wakeTime: '06:35 AM',
      stages: { awake: '50m', awakePct: 12, light: '4h 20m', lightPct: 63, deep: '1h 05m', deepPct: 16, rem: '1h 25m', remPct: 21 },
    },
    activity: {
      strain: 15.2,
      strainTarget: 16.0,
      calories: 820,
      activeMinutes: 80,
      streak: 18,
      workouts: [{ name: 'Heavy Deadlifts & Accessories', duration: '80 mins', calories: 590, avgHr: 142, maxHr: 175 }],
    },
    hydration: {
      target: 3200,
      logs: [{ amount: 800, time: '08:00 AM' }, { amount: 1000, time: '02:00 PM' }, { amount: 1000, time: '07:00 PM' }],
    },
  },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aurahealth';
  console.log(`[Database Seeder] Connecting to ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}...`);

  await mongoose.connect(mongoUri);
  console.log('[Database Seeder] Connected successfully!');

  const todayStr = new Date().toISOString().split('T')[0];

  for (const item of ATHLETES_SEED) {
    let user = await User.findOne({ email: item.email });
    if (!user) {
      console.log(`[Database Seeder] Creating user: ${item.name} (${item.email})...`);
      user = await User.create({
        name: item.name,
        email: item.email,
        password: item.password,
        role: item.role,
        profile: item.profile,
        themeMode: item.themeMode,
      });
    } else {
      console.log(`[Database Seeder] User already exists: ${item.name} (${user._id})`);
    }

    const userId = user._id;

    // Seed Nutrition Log
    const existingNutrition = await NutritionLog.findOne({ user: userId, date: todayStr });
    if (!existingNutrition) {
      await NutritionLog.create({
        user: userId,
        date: todayStr,
        phase: item.nutrition.phase,
        targets: item.nutrition.targets,
        meals: item.nutrition.meals || [],
        supplements: item.nutrition.supplements || [],
      });
    }

    // Seed Vitals Log
    const existingVitals = await VitalLog.findOne({ user: userId, date: todayStr });
    if (!existingVitals) {
      await VitalLog.create({
        user: userId,
        date: todayStr,
        heartRate: item.vitals.heartRate,
        bloodPressure: item.vitals.bloodPressure,
        bloodGlucose: item.vitals.bloodGlucose,
        oxygen: item.vitals.oxygen,
        temperature: item.vitals.temperature,
        ecgRecords: item.vitals.ecgRecords || [],
      });
    }

    // Seed Sleep Log
    const existingSleep = await SleepLog.findOne({ user: userId, date: todayStr });
    if (!existingSleep) {
      await SleepLog.create({
        user: userId,
        date: todayStr,
        duration: item.sleep.duration,
        totalMinutes: item.sleep.totalMinutes,
        score: item.sleep.score,
        status: item.sleep.status,
        bedtime: item.sleep.bedtime,
        wakeTime: item.sleep.wakeTime,
        stages: item.sleep.stages,
      });
    }

    // Seed Activity Log
    const existingActivity = await ActivityLog.findOne({ user: userId, date: todayStr });
    if (!existingActivity) {
      await ActivityLog.create({
        user: userId,
        date: todayStr,
        strain: item.activity.strain,
        strainTarget: item.activity.strainTarget,
        calories: item.activity.calories,
        activeMinutes: item.activity.activeMinutes,
        streak: item.activity.streak,
        workouts: item.activity.workouts || [],
      });
    }

    // Seed Hydration Log
    const existingHydration = await HydrationLog.findOne({ user: userId, date: todayStr });
    if (!existingHydration) {
      await HydrationLog.create({
        user: userId,
        date: todayStr,
        target: item.hydration.target,
        logs: item.hydration.logs || [],
      });
    }
  }

  const totalUsers = await User.countDocuments();
  const totalNutrition = await NutritionLog.countDocuments();
  const totalVitals = await VitalLog.countDocuments();
  const totalSleep = await SleepLog.countDocuments();
  const totalActivity = await ActivityLog.countDocuments();
  const totalHydration = await HydrationLog.countDocuments();

  console.log('======================================================');
  console.log('       DATABASE SEED COMPLETED SUCCESSFULLY!          ');
  console.log('======================================================');
  console.log(`Users in MongoDB:         ${totalUsers}`);
  console.log(`Nutrition Logs in DB:     ${totalNutrition}`);
  console.log(`Vital Logs in DB:         ${totalVitals}`);
  console.log(`Sleep Logs in DB:         ${totalSleep}`);
  console.log(`Activity Logs in DB:      ${totalActivity}`);
  console.log(`Hydration Logs in DB:     ${totalHydration}`);
  console.log('======================================================');

  await mongoose.disconnect();
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('[Database Seeder Error]:', err);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
