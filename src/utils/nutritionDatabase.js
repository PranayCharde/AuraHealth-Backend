// AuraHealth Backend Nutrition Engine & Natural Language Meal Parser

const FOOD_DATABASE = [
  // --- POULTRY, MEATS & SEAFOOD ---
  {
    id: 'chicken_breast',
    name: 'Chicken Breast (Boneless, Skinless)',
    aliases: ['chicken', 'chicken breast', 'grilled chicken', 'baked chicken', 'boiled chicken'],
    category: 'Poultry',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    fats: 3.6,
    fiber: 0.0,
    sodium: 74,
    potassium: 256,
  },
  {
    id: 'chicken_thigh',
    name: 'Chicken Thigh (Skinless)',
    aliases: ['chicken thigh', 'chicken thighs'],
    category: 'Poultry',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 209,
    protein: 26.0,
    carbs: 0.0,
    fats: 10.9,
    fiber: 0.0,
    sodium: 84,
    potassium: 240,
  },
  {
    id: 'lean_beef_93',
    name: 'Lean Ground Beef (93/7)',
    aliases: ['lean beef', 'ground beef', 'mince', 'lean mince', 'beef 93/7', 'beef'],
    category: 'Meat',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 172,
    protein: 24.2,
    carbs: 0.0,
    fats: 7.8,
    fiber: 0.0,
    sodium: 70,
    potassium: 340,
  },
  {
    id: 'sirloin_steak',
    name: 'Top Sirloin Steak (Trimmed)',
    aliases: ['steak', 'sirloin', 'beef steak', 'top sirloin'],
    category: 'Meat',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 183,
    protein: 30.3,
    carbs: 0.0,
    fats: 6.0,
    fiber: 0.0,
    sodium: 58,
    potassium: 370,
  },
  {
    id: 'salmon',
    name: 'Atlantic Salmon (Wild / Baked)',
    aliases: ['salmon', 'atlantic salmon', 'grilled salmon', 'baked salmon'],
    category: 'Seafood',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 208,
    protein: 20.4,
    carbs: 0.0,
    fats: 13.4,
    fiber: 0.0,
    sodium: 59,
    potassium: 363,
  },
  {
    id: 'canned_tuna',
    name: 'Canned Albacore Tuna in Water',
    aliases: ['tuna', 'canned tuna', 'tuna fish', 'albacore'],
    category: 'Seafood',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 110,
    protein: 25.5,
    carbs: 0.0,
    fats: 1.0,
    fiber: 0.0,
    sodium: 240,
    potassium: 237,
  },
  {
    id: 'tilapia',
    name: 'Tilapia / White Fish Fillet',
    aliases: ['tilapia', 'white fish', 'cod', 'haddock'],
    category: 'Seafood',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 96,
    protein: 20.1,
    carbs: 0.0,
    fats: 1.7,
    fiber: 0.0,
    sodium: 52,
    potassium: 302,
  },
  {
    id: 'shrimp',
    name: 'Jumbo Shrimp / Prawns (Steamed)',
    aliases: ['shrimp', 'prawns', 'prawn'],
    category: 'Seafood',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 99,
    protein: 24.0,
    carbs: 0.2,
    fats: 0.3,
    fiber: 0.0,
    sodium: 111,
    potassium: 259,
  },

  // --- EGGS & DAIRY ---
  {
    id: 'whole_egg',
    name: 'Whole Large Egg',
    aliases: ['egg', 'eggs', 'whole egg', 'boiled egg', 'fried egg', 'scrambled egg'],
    category: 'Eggs & Dairy',
    baseAmount: 1,
    baseUnit: 'piece',
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fats: 4.8,
    fiber: 0.0,
    sodium: 71,
    potassium: 69,
  },
  {
    id: 'egg_white',
    name: 'Liquid Egg Whites',
    aliases: ['egg white', 'egg whites', 'whites'],
    category: 'Eggs & Dairy',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 52,
    protein: 10.9,
    carbs: 0.7,
    fats: 0.2,
    fiber: 0.0,
    sodium: 166,
    potassium: 163,
  },
  {
    id: 'greek_yogurt_0',
    name: 'Non-Fat Greek Yogurt (Plain)',
    aliases: ['greek yogurt', 'yogurt', 'curd', 'dahi'],
    category: 'Eggs & Dairy',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 59,
    protein: 10.0,
    carbs: 3.6,
    fats: 0.4,
    fiber: 0.0,
    sodium: 36,
    potassium: 141,
  },
  {
    id: 'paneer',
    name: 'Indian Paneer (Cottage Cheese)',
    aliases: ['paneer', 'cottage cheese indian'],
    category: 'Eggs & Dairy',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 265,
    protein: 18.3,
    carbs: 3.4,
    fats: 20.8,
    fiber: 0.0,
    sodium: 18,
    potassium: 90,
  },
  {
    id: 'whole_milk',
    name: 'Whole Dairy Milk',
    aliases: ['milk', 'whole milk', 'glass of milk'],
    category: 'Eggs & Dairy',
    baseAmount: 250,
    baseUnit: 'ml',
    calories: 149,
    protein: 7.7,
    carbs: 11.7,
    fats: 8.0,
    fiber: 0.0,
    sodium: 105,
    potassium: 322,
  },

  // --- SUPPLEMENTS ---
  {
    id: 'whey_isolate',
    name: 'Whey Protein Isolate (100%)',
    aliases: ['whey', 'whey protein', 'protein powder', 'protein shake', 'whey isolate', 'isolate'],
    category: 'Supplements',
    baseAmount: 1,
    baseUnit: 'scoop',
    calories: 120,
    protein: 27.0,
    carbs: 1.5,
    fats: 0.5,
    fiber: 0.0,
    sodium: 130,
    potassium: 160,
  },
  {
    id: 'protein_bar',
    name: 'High-Protein Bar (Low Sugar)',
    aliases: ['protein bar', 'quest bar', 'snack bar'],
    category: 'Supplements',
    baseAmount: 1,
    baseUnit: 'piece',
    calories: 210,
    protein: 20.0,
    carbs: 22.0,
    fats: 7.0,
    fiber: 10.0,
    sodium: 210,
    potassium: 130,
  },

  // --- CARBOHYDRATES & GRAINS ---
  {
    id: 'jasmine_rice',
    name: 'Cooked Jasmine / White Rice',
    aliases: ['rice', 'white rice', 'jasmine rice', 'basmati rice', 'steamed rice', 'cooked rice'],
    category: 'Grains & Carbs',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    fats: 0.3,
    fiber: 0.4,
    sodium: 1,
    potassium: 35,
  },
  {
    id: 'rolled_oats',
    name: 'Rolled Oats (Dry)',
    aliases: ['oats', 'oatmeal', 'rolled oats', 'porridge', 'bowl of oats'],
    category: 'Grains & Carbs',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fats: 6.9,
    fiber: 10.6,
    sodium: 2,
    potassium: 429,
  },
  {
    id: 'sweet_potato',
    name: 'Baked Sweet Potato (Skin on)',
    aliases: ['sweet potato', 'sweet potatoes', 'yam'],
    category: 'Grains & Carbs',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 86,
    protein: 1.6,
    carbs: 20.1,
    fats: 0.1,
    fiber: 3.0,
    sodium: 55,
    potassium: 337,
  },
  {
    id: 'wheat_bread',
    name: '100% Whole Wheat Bread',
    aliases: ['bread', 'wheat bread', 'brown bread', 'toast', 'slice of bread'],
    category: 'Grains & Carbs',
    baseAmount: 1,
    baseUnit: 'slice',
    calories: 80,
    protein: 4.0,
    carbs: 14.0,
    fats: 1.0,
    fiber: 2.0,
    sodium: 130,
    potassium: 75,
  },
  {
    id: 'roti_chapati',
    name: 'Whole Wheat Roti / Chapati',
    aliases: ['roti', 'chapati', 'phulka', 'rotis'],
    category: 'Grains & Carbs',
    baseAmount: 1,
    baseUnit: 'piece',
    calories: 85,
    protein: 3.1,
    carbs: 16.0,
    fats: 1.2,
    fiber: 2.2,
    sodium: 90,
    potassium: 80,
  },
  {
    id: 'cooked_dal',
    name: 'Cooked Lentil Dal (Yellow / Tadka)',
    aliases: ['dal', 'daal', 'lentils', 'yellow dal', 'tadka dal', 'bowl of dal'],
    category: 'Grains & Carbs',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 116,
    protein: 9.0,
    carbs: 20.0,
    fats: 1.5,
    fiber: 5.5,
    sodium: 230,
    potassium: 310,
  },

  // --- HEALTHY FATS ---
  {
    id: 'peanut_butter',
    name: 'Natural Peanut Butter',
    aliases: ['peanut butter', 'pb', 'almond butter'],
    category: 'Healthy Fats',
    baseAmount: 1,
    baseUnit: 'tbsp',
    calories: 95,
    protein: 4.0,
    carbs: 3.5,
    fats: 8.0,
    fiber: 1.0,
    sodium: 70,
    potassium: 104,
  },
  {
    id: 'olive_oil',
    name: 'Extra Virgin Olive Oil',
    aliases: ['olive oil', 'oil', 'cooking oil'],
    category: 'Healthy Fats',
    baseAmount: 1,
    baseUnit: 'tbsp',
    calories: 119,
    protein: 0.0,
    carbs: 0.0,
    fats: 13.5,
    fiber: 0.0,
    sodium: 0,
    potassium: 0,
  },

  // --- FRUITS & VEGGIES ---
  {
    id: 'banana',
    name: 'Fresh Medium Banana',
    aliases: ['banana', 'bananas', 'kela'],
    category: 'Fruits',
    baseAmount: 1,
    baseUnit: 'piece',
    calories: 105,
    protein: 1.3,
    carbs: 27.0,
    fats: 0.3,
    fiber: 3.1,
    sodium: 1,
    potassium: 422,
  },
  {
    id: 'apple',
    name: 'Fresh Crisp Apple',
    aliases: ['apple', 'apples', 'seb'],
    category: 'Fruits',
    baseAmount: 1,
    baseUnit: 'piece',
    calories: 95,
    protein: 0.5,
    carbs: 25.0,
    fats: 0.3,
    fiber: 4.4,
    sodium: 2,
    potassium: 195,
  },
  {
    id: 'broccoli',
    name: 'Steamed Fresh Broccoli',
    aliases: ['broccoli', 'steamed broccoli'],
    category: 'Vegetables',
    baseAmount: 100,
    baseUnit: 'g',
    calories: 35,
    protein: 2.8,
    carbs: 7.2,
    fats: 0.4,
    fiber: 3.3,
    sodium: 33,
    potassium: 316,
  },
];

function scaleFood(food, amount, unit) {
  const targetUnit = unit || food.baseUnit;
  let mult = 1;

  if (targetUnit === food.baseUnit) {
    mult = amount / food.baseAmount;
  } else if (targetUnit === 'g' && food.baseUnit === 'piece') {
    const estGrams = food.id.includes('egg') ? 50 : 120;
    mult = amount / estGrams;
  } else if (targetUnit === 'cup') {
    mult = (amount * 200) / food.baseAmount;
  } else if (targetUnit === 'scoop') {
    mult = amount;
  } else if (targetUnit === 'tbsp') {
    mult = (amount * 15) / food.baseAmount;
  } else {
    mult = amount / (food.baseAmount || 1);
  }

  if (isNaN(mult) || mult <= 0) mult = 1;

  return {
    calories: Math.round(food.calories * mult),
    protein: Number((food.protein * mult).toFixed(1)),
    carbs: Number((food.carbs * mult).toFixed(1)),
    fats: Number((food.fats * mult).toFixed(1)),
    fiber: Number((food.fiber * mult).toFixed(1)),
    sodium: Math.round(food.sodium * mult),
    potassium: Math.round(food.potassium * mult),
    quantityLabel: `${amount} ${targetUnit}`,
  };
}

function findFood(query) {
  if (!query) return null;
  const clean = query.trim().toLowerCase();

  let match = FOOD_DATABASE.find(
    (f) => f.id.toLowerCase() === clean || f.name.toLowerCase() === clean
  );
  if (match) return match;

  match = FOOD_DATABASE.find((f) =>
    f.aliases.some((a) => a.toLowerCase() === clean)
  );
  if (match) return match;

  match = FOOD_DATABASE.find((f) =>
    f.aliases.some((a) => clean.includes(a.toLowerCase()) || a.toLowerCase().includes(clean))
  );
  if (match) return match;

  return null;
}

function parseAndAnalyzeMeal(text) {
  if (!text || typeof text !== 'string') return { items: [], totals: {} };

  const segments = text
    .split(/,|\+|\band\b|\bwith\b|\n/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  const items = [];

  for (const seg of segments) {
    const m = seg.match(
      /^(\d+(?:\.\d+)?)\s*(g|grams|gm|kg|oz|ml|cup|cups|scoop|scoops|tbsp|slice|slices|piece|pieces)?\s*(?:of\s+)?(.*)$/i
    );

    let amt = 1;
    let unit = null;
    let query = seg;

    if (m) {
      amt = parseFloat(m[1]) || 1;
      const rawUnit = m[2] ? m[2].toLowerCase() : null;
      query = m[3] ? m[3].trim() : seg;

      if (rawUnit) {
        if (['g', 'grams', 'gm'].includes(rawUnit)) unit = 'g';
        else if (rawUnit === 'kg') { amt *= 1000; unit = 'g'; }
        else if (rawUnit === 'oz') { amt = Math.round(amt * 28.35); unit = 'g'; }
        else if (rawUnit === 'ml') unit = 'ml';
        else if (['cup', 'cups'].includes(rawUnit)) unit = 'cup';
        else if (['scoop', 'scoops'].includes(rawUnit)) unit = 'scoop';
        else if (['slice', 'slices'].includes(rawUnit)) unit = 'slice';
        else if (['tbsp'].includes(rawUnit)) unit = 'tbsp';
        else if (['piece', 'pieces'].includes(rawUnit)) unit = 'piece';
      }
    }

    const cleaned = query
      .replace(/\b(cooked|steamed|grilled|baked|boiled|fried|fresh|raw|large|medium|small)\b/gi, '')
      .trim();

    const food = findFood(cleaned || query);

    if (food) {
      const finalUnit = unit || food.baseUnit;
      const scaled = scaleFood(food, amt, finalUnit);
      items.push({
        name: food.name,
        quantity: scaled.quantityLabel,
        calories: scaled.calories,
        protein: scaled.protein,
        carbs: scaled.carbs,
        fats: scaled.fats,
        fiber: scaled.fiber,
        sodium: scaled.sodium,
        category: food.category,
      });
    } else {
      // General fallback estimation
      items.push({
        name: query.charAt(0).toUpperCase() + query.slice(1),
        quantity: `${amt} ${unit || 'serving'}`,
        calories: Math.round(180 * (amt > 10 ? amt / 100 : amt)),
        protein: Number((12 * (amt > 10 ? amt / 100 : amt)).toFixed(1)),
        carbs: Number((18 * (amt > 10 ? amt / 100 : amt)).toFixed(1)),
        fats: Number((6 * (amt > 10 ? amt / 100 : amt)).toFixed(1)),
        fiber: 2,
        sodium: 120,
        category: 'Custom Entry',
        isEstimated: true,
      });
    }
  }

  const totals = items.reduce(
    (acc, it) => {
      acc.calories += it.calories;
      acc.protein += it.protein;
      acc.carbs += it.carbs;
      acc.fats += it.fats;
      acc.fiber += it.fiber;
      acc.sodium += it.sodium;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sodium: 0 }
  );

  totals.protein = Number(totals.protein.toFixed(1));
  totals.carbs = Number(totals.carbs.toFixed(1));
  totals.fats = Number(totals.fats.toFixed(1));
  totals.fiber = Number(totals.fiber.toFixed(1));

  return { items, totals, count: items.length };
}

module.exports = {
  FOOD_DATABASE,
  findFood,
  scaleFood,
  parseAndAnalyzeMeal,
};

