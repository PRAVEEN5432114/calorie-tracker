/**
 * FitTrack Food Database (India-First)
 * Structured with Macros: calories, protein(g), carbs(g), fat(g), fiber(g)
 */

const foodDatabase = [
    // South Indian
    { name: "Idli", category: "South Indian", serving: "2 pieces", calories: 118, protein: 4, carbs: 24, fat: 0.5, fiber: 2 },
    { name: "Plain Dosa", category: "South Indian", serving: "1 medium", calories: 133, protein: 3, carbs: 25, fat: 2, fiber: 1 },
    { name: "Masala Dosa", category: "South Indian", serving: "1 medium", calories: 415, protein: 8, carbs: 62, fat: 15, fiber: 4 },
    { name: "Onion Dosa", category: "South Indian", serving: "1 medium", calories: 200, protein: 4, carbs: 30, fat: 7, fiber: 2 },
    { name: "Ragi Dosa", category: "South Indian", serving: "1 medium", calories: 130, protein: 3, carbs: 24, fat: 2.5, fiber: 3 },
    { name: "Ven Pongal", category: "South Indian", serving: "1 cup", calories: 212, protein: 6, carbs: 32, fat: 6, fiber: 3 },
    { name: "Upma", category: "South Indian", serving: "1 cup", calories: 192, protein: 5, carbs: 32, fat: 5, fiber: 2 },
    { name: "Lemon Rice", category: "South Indian", serving: "1 cup", calories: 250, protein: 4, carbs: 45, fat: 6, fiber: 2 },
    { name: "Curd Rice", category: "South Indian", serving: "1 cup", calories: 210, protein: 6, carbs: 32, fat: 6, fiber: 1 },
    { name: "Sambar", category: "South Indian", serving: "1 small bowl (150ml)", calories: 110, protein: 5, carbs: 18, fat: 2, fiber: 4 },
    { name: "Rasam", category: "South Indian", serving: "1 cup", calories: 60, protein: 1.5, carbs: 10, fat: 1.5, fiber: 2 },
    { name: "Appam", category: "Kerala", serving: "1 piece", calories: 120, protein: 2, carbs: 25, fat: 1, fiber: 1 },
    { name: "Puttu", category: "Kerala", serving: "1 piece (cylindrical)", calories: 150, protein: 3, carbs: 31, fat: 1.5, fiber: 2 },
    { name: "Parotta (Kerala/Tamil)", category: "South Indian", serving: "1 piece", calories: 260, protein: 4, carbs: 36, fat: 10, fiber: 1 },
    { name: "Bisi Bele Bath", category: "Karnataka", serving: "1 cup", calories: 300, protein: 8, carbs: 48, fat: 8, fiber: 6 },
    { name: "Hyderabadi Biryani (Chicken)", category: "Andhra/Telangana", serving: "1 portion (300g)", calories: 480, protein: 25, carbs: 60, fat: 15, fiber: 4 },

    // North Indian
    { name: "Chapati / Roti", category: "North Indian", serving: "1 piece", calories: 71, protein: 3, carbs: 15, fat: 0.4, fiber: 2 },
    { name: "Plain Paratha", category: "North Indian", serving: "1 piece", calories: 120, protein: 3, carbs: 18, fat: 4, fiber: 2 },
    { name: "Aloo Paratha", category: "North Indian", serving: "1 piece", calories: 220, protein: 5, carbs: 32, fat: 8, fiber: 3 },
    { name: "Naan (Butter)", category: "North Indian", serving: "1 piece", calories: 260, protein: 7, carbs: 40, fat: 8, fiber: 2 },
    { name: "Dal Makhani", category: "North Indian", serving: "1 bowl (150g)", calories: 280, protein: 12, carbs: 30, fat: 14, fiber: 8 },
    { name: "Yellow Dal / Toor Dal", category: "North Indian", serving: "1 bowl (150g)", calories: 150, protein: 9, carbs: 25, fat: 2, fiber: 6 },
    { name: "Rajma (Kidney Beans Curry)", category: "North Indian", serving: "1 bowl (150g)", calories: 200, protein: 10, carbs: 32, fat: 4, fiber: 8 },
    { name: "Chole (Chickpeas Curry)", category: "North Indian", serving: "1 bowl (150g)", calories: 240, protein: 10, carbs: 35, fat: 7, fiber: 7 },
    { name: "Paneer Butter Masala", category: "North Indian", serving: "1 bowl (150g)", calories: 320, protein: 12, carbs: 12, fat: 25, fiber: 2 },
    { name: "Palak Paneer", category: "North Indian", serving: "1 bowl (150g)", calories: 240, protein: 14, carbs: 10, fat: 16, fiber: 4 },
    { name: "Khichdi", category: "North Indian", serving: "1 cup (200g)", calories: 210, protein: 7, carbs: 40, fat: 2.5, fiber: 3 },
    
    // Snacks / Street Food
    { name: "Samosa", category: "Snacks", serving: "1 piece", calories: 260, protein: 3, carbs: 24, fat: 17, fiber: 2 },
    { name: "Onion Pakora / Bhajiya", category: "Snacks", serving: "50g", calories: 180, protein: 4, carbs: 18, fat: 10, fiber: 2 },
    { name: "Pani Puri / Golgappa", category: "Snacks", serving: "6 pieces", calories: 150, protein: 3, carbs: 25, fat: 4, fiber: 2 },
    { name: "Bhel Puri", category: "Snacks", serving: "1 plate", calories: 280, protein: 6, carbs: 55, fat: 4, fiber: 5 },
    { name: "Vada Pav", category: "Snacks", serving: "1 piece", calories: 300, protein: 6, carbs: 42, fat: 12, fiber: 4 },
    { name: "Dhokla (Khaman)", category: "Snacks", serving: "2 pieces", calories: 110, protein: 4, carbs: 18, fat: 2, fiber: 1 },
    { name: "Roasted Chana", category: "Snacks", serving: "30g", calories: 110, protein: 6, carbs: 18, fat: 2, fiber: 4 },
    { name: "Roasted Peanuts", category: "Snacks", serving: "30g", calories: 170, protein: 7, carbs: 6, fat: 14, fiber: 2 },
    { name: "Makhana (Roasted)", category: "Snacks", serving: "30g", calories: 105, protein: 3, carbs: 23, fat: 0.5, fiber: 4 },

    // Desserts
    { name: "Gulab Jamun", category: "Dessert", serving: "2 pieces", calories: 300, protein: 3, carbs: 55, fat: 8, fiber: 0 },
    { name: "Jalebi", category: "Dessert", serving: "50g", calories: 220, protein: 1, carbs: 45, fat: 4, fiber: 0 },
    { name: "Rasgulla", category: "Dessert", serving: "2 pieces", calories: 250, protein: 4, carbs: 50, fat: 2, fiber: 0 },
    { name: "Payasam / Kheer", category: "Dessert", serving: "1 small bowl (100g)", calories: 220, protein: 5, carbs: 35, fat: 6, fiber: 1 },
    { name: "Mysore Pak", category: "Dessert", serving: "1 piece", calories: 180, protein: 2, carbs: 18, fat: 11, fiber: 0 },
    
    // Protein Sources & Essentials
    { name: "Egg (Boiled)", category: "Protein", serving: "1 large", calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0 },
    { name: "Chicken Breast (Cooked)", category: "Protein", serving: "100g", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    { name: "Fish (Rohu / Katla) Curry", category: "Protein", serving: "1 piece + gravy", calories: 220, protein: 18, carbs: 8, fat: 12, fiber: 1 },
    { name: "Paneer (Raw)", category: "Protein", serving: "100g", calories: 296, protein: 14, carbs: 3, fat: 25, fiber: 0 },
    { name: "Tofu", category: "Protein", serving: "100g", calories: 76, protein: 8, carbs: 2, fat: 4.8, fiber: 0.3 },
    { name: "Soy Chunks (Nutrela) Cooked", category: "Protein", serving: "100g", calories: 345, protein: 52, carbs: 33, fat: 0.5, fiber: 13 },
    { name: "Curd / Dahi (Whole Milk)", category: "Dairy", serving: "1 bowl (150g)", calories: 90, protein: 5, carbs: 7, fat: 5, fiber: 0 },
    { name: "Milk (Full Cream)", category: "Dairy", serving: "1 cup (250ml)", calories: 150, protein: 8, carbs: 12, fat: 8, fiber: 0 },
    { name: "Whey Protein Scoop", category: "Protein", serving: "1 scoop (30g)", calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0 },

    // Common Fruits & Vegetables
    { name: "Banana", category: "Fruit", serving: "1 medium", calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1 },
    { name: "Apple", category: "Fruit", serving: "1 medium", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 },
    { name: "Mango", category: "Fruit", serving: "1 cup chopped", calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6 },
    { name: "Papaya", category: "Fruit", serving: "1 cup cubed", calories: 62, protein: 0.7, carbs: 16, fat: 0.4, fiber: 2.5 },
    { name: "Guava", category: "Fruit", serving: "1 medium", calories: 37, protein: 1.4, carbs: 8, fat: 0.5, fiber: 3 },
    { name: "Cucumber", category: "Vegetable", serving: "1 cup sliced", calories: 16, protein: 0.6, carbs: 4, fat: 0.1, fiber: 0.5 },
    { name: "Tomato", category: "Vegetable", serving: "1 medium", calories: 22, protein: 1, carbs: 5, fat: 0.2, fiber: 1.5 },
    { name: "Carrot", category: "Vegetable", serving: "1 medium", calories: 25, protein: 0.5, carbs: 6, fat: 0.1, fiber: 1.5 },
    
    // Cooked Vegetables (Dry Sabzi approx)
    { name: "Bhindi (Okra) Sabzi", category: "Vegetable", serving: "1 bowl (150g)", calories: 120, protein: 3, carbs: 12, fat: 8, fiber: 4 },
    { name: "Aloo Gobi (Potato Cauliflower)", category: "Vegetable", serving: "1 bowl (150g)", calories: 150, protein: 4, carbs: 20, fat: 7, fiber: 4 },
    { name: "Cabbage Poriyal", category: "Vegetable", serving: "1 bowl (100g)", calories: 90, protein: 2, carbs: 8, fat: 6, fiber: 3 }
];

window.foodDatabase = foodDatabase;
