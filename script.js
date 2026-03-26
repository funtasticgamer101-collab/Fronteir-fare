// The Master Recipe Database (Added emojis and a few extra recipes for swapping!)
const recipeDatabase = [
    { type: "Lunch", name: "Smoked Gouda Grilled Cheese 🧀", prepTime: "15 mins", ingredients: [ { name: "Sourdough Bread", amount: 2, unit: "slices" }, { name: "Smoked Gouda", amount: 2, unit: "slices" }, { name: "Butter", amount: 1, unit: "tbsp" }, { name: "Crushed Tomatoes", amount: 1, unit: "cup" }, { name: "Vegetable Broth", amount: 0.5, unit: "cup" }, { name: "Heavy Cream", amount: 2, unit: "tbsp" } ], instructions: [ "Simmer crushed tomatoes and vegetable broth for 10 mins.", "Stir heavy cream into the soup and season. Keep warm.", "Butter one side of each bread slice. Place gouda between unbuttered sides.", "Grill sandwich in a skillet over medium heat until golden (3-4 mins per side).", "Serve sandwich alongside the warm tomato bisque." ] },
    { type: "Lunch", name: "Frontier BBQ Chicken Wrap 🌯", prepTime: "15 mins", ingredients: [ { name: "Flour Tortilla", amount: 1, unit: "piece" }, { name: "Chicken Breast", amount: 4, unit: "oz" }, { name: "BBQ Sauce", amount: 2, unit: "tbsp" }, { name: "Canned Corn", amount: 0.25, unit: "cup" }, { name: "Red Onion", amount: 0.25, unit: "cup" }, { name: "Mixed Greens", amount: 1, unit: "cup" } ], instructions: [ "Slice chicken breast into strips. Sauté in a pan until cooked (6-8 mins).", "Toss cooked chicken in BBQ sauce.", "Dice the red onion.", "Lay tortilla flat. Layer mixed greens, BBQ chicken, corn, and red onion.", "Fold the sides and roll tightly into a wrap. Slice in half." ] },
    { type: "Lunch", name: "Sweet Potato & Black Bean Bowl 🍠", prepTime: "25 mins", ingredients: [ { name: "Sweet Potato", amount: 1, unit: "medium" }, { name: "Black Beans", amount: 0.5, unit: "cup" }, { name: "White Rice", amount: 0.25, unit: "cup" }, { name: "Olive Oil", amount: 1, unit: "tbsp" }, { name: "Chili Powder", amount: 1, unit: "tsp" }, { name: "Lime", amount: 0.5, unit: "piece" } ], instructions: [ "Cook white rice according to package instructions.", "Dice sweet potato, toss with olive oil and chili powder. Roast at 400°F for 20 mins.", "Rinse and warm the black beans.", "Assemble bowl: rice base, topped with sweet potatoes and black beans.", "Squeeze fresh lime juice over the top before eating." ] },
    { type: "Lunch", name: "Pulled Pork Sliders 🍔", prepTime: "15 mins", ingredients: [ { name: "Pulled Pork", amount: 5, unit: "oz" }, { name: "Slider Buns", amount: 2, unit: "pieces" }, { name: "BBQ Sauce", amount: 2, unit: "tbsp" }, { name: "Shredded Cabbage", amount: 0.5, unit: "cup" }, { name: "Green Apple", amount: 0.5, unit: "piece" }, { name: "Apple Cider Vinegar", amount: 1, unit: "tbsp" } ], instructions: [ "Julienne the green apple. Toss with shredded cabbage and apple cider vinegar.", "Warm the pulled pork in a pan and mix with BBQ sauce.", "Toast the slider buns lightly.", "Assemble sliders: bottom bun, BBQ pork, apple slaw, top bun." ] },
    { type: "Lunch", name: "Grilled Chicken Corn Salad 🥗", prepTime: "15 mins", ingredients: [ { name: "Chicken Breast", amount: 4, unit: "oz" }, { name: "Mixed Greens", amount: 2, unit: "cups" }, { name: "Canned Corn", amount: 0.25, unit: "cup" }, { name: "Red Onion", amount: 0.25, unit: "cup" }, { name: "Olive Oil", amount: 1, unit: "tbsp" }, { name: "Lime", amount: 0.5, unit: "piece" } ], instructions: [ "Season chicken breast. Grill or pan-sear until cooked (6-8 mins per side). Slice.", "Dice red onion and mix with corn, olive oil, and lime juice.", "Place mixed greens in a bowl.", "Top with sliced chicken and the corn salsa." ] },
    { type: "Lunch", name: "Western Omelet 🍳", prepTime: "15 mins", ingredients: [ { name: "Eggs", amount: 3, unit: "pieces" }, { name: "Bell Pepper", amount: 0.25, unit: "piece" }, { name: "Red Onion", amount: 0.25, unit: "cup" }, { name: "Pulled Pork", amount: 2, unit: "oz" }, { name: "Pepper Jack", amount: 1, unit: "slice" }, { name: "Butter", amount: 1, unit: "tbsp" } ], instructions: [ "Dice the bell pepper and red onion.", "Melt butter in a skillet. Sauté peppers, onions, and pulled pork until warm.", "Whisk eggs and pour over the mixture.", "Cook undisturbed until edges set, then lift edges to let uncooked egg flow underneath.", "Place pepper jack slice on one half, fold the omelet over, and serve." ] },
    { type: "Lunch", name: "Turkey Sausage Hash 🥔", prepTime: "20 mins", ingredients: [ { name: "Turkey Sausage", amount: 1, unit: "link" }, { name: "Yukon Gold Potato", amount: 1, unit: "medium" }, { name: "Red Onion", amount: 0.25, unit: "cup" }, { name: "Eggs", amount: 1, unit: "piece" }, { name: "Olive Oil", amount: 1, unit: "tbsp" } ], instructions: [ "Dice the potato and red onion. Slice the turkey sausage.", "Heat olive oil in a skillet. Add potatoes and cook until crispy (10 mins).", "Add sausage and onions. Cook until onions are soft and sausage is browned.", "Create a small well in the center of the hash and crack the egg into it.", "Cover skillet and cook for 3-4 mins until egg white is set." ] },
    { type: "Lunch", name: "Avocado BLT Wrap 🥓", prepTime: "10 mins", ingredients: [ { name: "Flour Tortilla", amount: 1, unit: "piece" }, { name: "Bacon", amount: 3, unit: "slices" }, { name: "Avocado", amount: 0.5, unit: "piece" }, { name: "Tomato", amount: 0.5, unit: "piece" }, { name: "Mixed Greens", amount: 1, unit: "cup" }, { name: "Mayo", amount: 1, unit: "tbsp" } ], instructions: [ "Cook bacon until crispy. Slice tomato and avocado.", "Spread mayo on the tortilla.", "Layer greens, tomato, avocado, and bacon.", "Roll tightly and slice in half." ] },
    
    { type: "Dinner", name: "Cast Iron Ribeye 🥩", prepTime: "30 mins", ingredients: [ { name: "Ribeye Steak", amount: 8, unit: "oz" }, { name: "Yukon Gold Potato", amount: 2, unit: "medium" }, { name: "Garlic", amount: 2, unit: "cloves" }, { name: "Butter", amount: 2, unit: "tbsp" }, { name: "Milk", amount: 2, unit: "tbsp" }, { name: "Olive Oil", amount: 1, unit: "tbsp" } ], instructions: [ "Dice potatoes and boil in salted water until tender (15 mins). Drain.", "Mash potatoes with 1 tbsp butter, milk, and 1 minced garlic clove.", "Rub steak with olive oil, salt, and pepper.", "Heat a cast iron skillet over high heat. Sear steak for 4 mins per side.", "Baste steak with remaining 1 tbsp butter and 1 crushed garlic clove.", "Rest steak for 5 mins before slicing. Serve with mash." ] },
    { type: "Dinner", name: "Bison Shepherd's Pie 🥧", prepTime: "35 mins", ingredients: [ { name: "Ground Bison", amount: 6, unit: "oz" }, { name: "Yukon Gold Potato", amount: 2, unit: "medium" }, { name: "Frozen Peas & Carrots", amount: 0.5, unit: "cup" }, { name: "Beef Broth", amount: 0.25, unit: "cup" }, { name: "Tomato Paste", amount: 1, unit: "tbsp" }, { name: "Butter", amount: 1, unit: "tbsp" }, { name: "Milk", amount: 2, unit: "tbsp" } ], instructions: [ "Boil and mash potatoes with butter and milk. Set aside.", "In an oven-safe skillet, brown the ground bison over medium-high heat.", "Stir in tomato paste, peas & carrots, and beef broth. Simmer 5 mins.", "Spread mashed potatoes evenly over the meat mixture.", "Broil in the oven for 3-5 minutes until golden brown." ] },
    { type: "Dinner", name: "Honey Bourbon Salmon 🐟", prepTime: "20 mins", ingredients: [ { name: "Salmon Fillet", amount: 6, unit: "oz" }, { name: "Honey", amount: 1, unit: "tbsp" }, { name: "Bourbon", amount: 1, unit: "tbsp" }, { name: "Soy Sauce", amount: 1, unit: "tbsp" }, { name: "Broccoli", amount: 1, unit: "cup" }, { name: "Olive Oil", amount: 1, unit: "tbsp" } ], instructions: [ "Whisk honey, bourbon, and soy sauce in a small bowl.", "Toss broccoli with olive oil, salt, and pepper. Roast at 400°F for 15 mins.", "Heat a skillet over medium-high. Sear salmon skin-side down for 4 mins.", "Flip salmon, pour glaze over it, and cook for 3 more mins, basting continuously.", "Serve salmon alongside roasted broccoli." ] },
    { type: "Dinner", name: "Campfire Chili Mac 🏕️", prepTime: "25 mins", ingredients: [ { name: "Ground Beef", amount: 6, unit: "oz" }, { name: "Macaroni", amount: 0.5, unit: "cup" }, { name: "Crushed Tomatoes", amount: 0.5, unit: "cup" }, { name: "Kidney Beans", amount: 0.25, unit: "cup" }, { name: "Chili Powder", amount: 1, unit: "tbsp" }, { name: "Cheddar Cheese", amount: 0.25, unit: "cup" } ], instructions: [ "Boil macaroni until al dente. Drain and set aside.", "In a skillet, brown the ground beef. Drain excess fat.", "Add chili powder, crushed tomatoes, and kidney beans to the beef. Simmer 10 mins.", "Stir the cooked macaroni into the chili mixture.", "Top with cheddar cheese and cover until melted. Serve hot." ] },
    { type: "Dinner", name: "Maple Glazed Pork Chop 🍖", prepTime: "25 mins", ingredients: [ { name: "Pork Chop", amount: 1, unit: "piece" }, { name: "Maple Syrup", amount: 1, unit: "tbsp" }, { name: "Dijon Mustard", amount: 1, unit: "tsp" }, { name: "Green Beans", amount: 1, unit: "cup" }, { name: "Olive Oil", amount: 1, unit: "tbsp" }, { name: "Butter", amount: 1, unit: "tbsp" } ], instructions: [ "Mix maple syrup and Dijon mustard in a small bowl.", "Season pork chop. Heat olive oil in a skillet over medium-high.", "Sear pork chop for 4-5 mins per side until golden.", "Brush maple glaze over the pork chop during the last minute. Remove and rest.", "In the same skillet, melt butter and sauté green beans until tender-crisp. Serve." ] },
    { type: "Dinner", name: "Braised Short Rib Ragout 🍝", prepTime: "45 mins", ingredients: [ { name: "Beef Short Rib", amount: 6, unit: "oz" }, { name: "Beef Broth", amount: 1, unit: "cup" }, { name: "Crushed Tomatoes", amount: 0.5, unit: "cup" }, { name: "Carrot", amount: 1, unit: "medium" }, { name: "Pappardelle Pasta", amount: 2, unit: "oz" }, { name: "Olive Oil", amount: 1, unit: "tbsp" } ], instructions: [ "Dice the carrot. Season short rib with salt and pepper.", "Heat olive oil in a pot. Sear short rib on all sides until brown. Remove meat.", "Sauté carrots in the pot for 2 mins. Return meat, add broth and crushed tomatoes.", "Cover and simmer on low for 35 mins until meat is tender enough to shred.", "Boil pasta. Shred the beef into the sauce, toss with pasta, and serve." ] },
    { type: "Dinner", name: "Rustic Chicken Pot Pie 🥘", prepTime: "30 mins", ingredients: [ { name: "Chicken Breast", amount: 4, unit: "oz" }, { name: "Frozen Peas & Carrots", amount: 0.5, unit: "cup" }, { name: "Chicken Broth", amount: 0.5, unit: "cup" }, { name: "Heavy Cream", amount: 2, unit: "tbsp" }, { name: "Flour", amount: 1, unit: "tbsp" }, { name: "Biscuit Dough", amount: 1, unit: "piece" }, { name: "Butter", amount: 1, unit: "tbsp" } ], instructions: [ "Dice chicken breast. Melt butter in an oven-safe skillet and cook chicken.", "Sprinkle flour over chicken and stir for 1 minute.", "Slowly whisk in chicken broth and heavy cream. Simmer until thickened.", "Stir in peas and carrots. Season with salt and pepper.", "Place the biscuit dough on top. Bake at 400°F for 12-15 mins until golden." ] },
    { type: "Dinner", name: "Garlic Butter Shrimp 🍤", prepTime: "15 mins", ingredients: [ { name: "Shrimp", amount: 6, unit: "oz" }, { name: "Linguine", amount: 2, unit: "oz" }, { name: "Butter", amount: 2, unit: "tbsp" }, { name: "Garlic", amount: 3, unit: "cloves" }, { name: "Lemon", amount: 0.5, unit: "piece" }, { name: "Parsley", amount: 1, unit: "tbsp" } ], instructions: [ "Boil pasta in salted water until al dente. Drain.", "Melt butter in a skillet. Sauté minced garlic for 1 minute.", "Add shrimp and cook until pink (2-3 mins per side).", "Toss pasta into the skillet with a squeeze of lemon juice and parsley.", "Serve immediately." ] }
];

// The active plan for the week
let weeklyPlan = [];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// --- Core Functions ---
function setWeekIndicator() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('week-indicator').innerHTML = `📅 Week of ${monday.toLocaleDateString('en-US', options)}`;
}

window.switchTab = function(tabId, element) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(`${tabId}-view`).classList.add('active');
};

// Initialize the week with default meals
function generateInitialPlan() {
    weeklyPlan = [];
    const lunches = recipeDatabase.filter(r => r.type === "Lunch");
    const dinners = recipeDatabase.filter(r => r.type === "Dinner");

    days.forEach((day, index) => {
        // Pick a lunch and dinner for each day (looping through available ones)
        let lunch = { ...lunches[index % lunches.length], day: day, id: `${day}-Lunch` };
        let dinner = { ...dinners[index % dinners.length], day: day, id: `${day}-Dinner` };
        weeklyPlan.push(lunch, dinner);
    });
}

// Swap a specific meal for a new one
window.swapMeal = function(mealId, type, event) {
    event.stopPropagation(); // Stops the card from expanding when clicking the button
    
    // Find all recipes of this type
    const availableRecipes = recipeDatabase.filter(r => r.type === type);
    
    // Find the current meal we are replacing
    const currentMealIndex = weeklyPlan.findIndex(m => m.id === mealId);
    const currentMealName = weeklyPlan[currentMealIndex].name;

    // Filter out the current meal so we don't pick it again
    const newOptions = availableRecipes.filter(r => r.name !== currentMealName);
    
    // Pick a random new recipe
    const randomRecipe = newOptions[Math.floor(Math.random() * newOptions.length)];
    
    // Replace it in the plan
    weeklyPlan[currentMealIndex] = { 
        ...randomRecipe, 
        day: weeklyPlan[currentMealIndex].day, 
        id: mealId 
    };

    // Re-render everything to update UI and Grocery List
    renderPlanner();
    renderGroceryList();
};

function renderPlanner() {
    const container = document.getElementById('planner-container');
    container.innerHTML = ''; // Clear existing
    
    days.forEach(day => {
        const dayMeals = weeklyPlan.filter(r => r.day === day);
        if (dayMeals.length === 0) return;

        const dayGroup = document.createElement('div');
        dayGroup.className = 'day-group';
        
        // Add day emojis
        const dayEmojis = { "Monday": "☕", "Tuesday": "🌮", "Wednesday": "🐪", "Thursday": "⚡", "Friday": "🍻", "Saturday": "🎉", "Sunday": "🛋️" };
        dayGroup.innerHTML = `<h2 class="day-title">${dayEmojis[day]} ${day}</h2>`;

        dayMeals.forEach((meal) => {
            const card = document.createElement('div');
            card.className = 'meal-card';
            
            const ingredientsHtml = meal.ingredients.map(ing => 
                `<li><span>${ing.name}</span> <span>${ing.amount} ${ing.unit}</span></li>`
            ).join('');

            const instructionsHtml = meal.instructions.map(inst => `<li>${inst}</li>`).join('');
            const mealIcon = meal.type === "Lunch" ? "🥪" : "🍽️";

            card.innerHTML = `
                <div class="meal-header" onclick="this.parentElement.classList.toggle('expanded')">
                    <div class="meal-info">
                        <div class="meal-type-row">
                            <div class="meal-type">${mealIcon} ${meal.type}</div>
                            <button class="btn-swap" onclick="swapMeal('${meal.id}', '${meal.type}', event)">🔄 Swap</button>
                        </div>
                        <div class="meal-name">${meal.name}</div>
                        <div class="meal-prep">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                            ${meal.prepTime}
                        </div>
                    </div>
                    <div class="expand-icon">▼</div>
                </div>
                <div class="meal-details">
                    <div class="detail-section-title">🛒 Ingredients (1 Portion)</div>
                    <ul class="ingredient-list">${ingredientsHtml}</ul>
                    <div class="detail-section-title">👨‍🍳 Instructions</div>
                    <ol class="instruction-list">${instructionsHtml}</ol>
                </div>
            `;
            dayGroup.appendChild(card);
        });
        container.appendChild(dayGroup);
    });
}

function renderGroceryList() {
    const container = document.getElementById('grocery-container');
    container.innerHTML = ''; // Clear existing
    const aggregated = {};

    // Calculate groceries based on the CURRENT weekly plan
    weeklyPlan.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            const key = `${ing.name.toLowerCase()}_${ing.unit.toLowerCase()}`;
            if (aggregated[key]) {
                aggregated[key].amount += ing.amount;
            } else {
                aggregated[key] = { name: ing.name, amount: ing.amount, unit: ing.unit };
            }
        });
    });

    const groceryList = Object.values(aggregated).sort((a, b) => a.name.localeCompare(b.name));

    groceryList.forEach((item) => {
        const cleanAmount = Math.round(item.amount * 100) / 100;
        const el = document.createElement('div');
        el.className = 'grocery-item';
        el.setAttribute('onclick', "this.classList.toggle('checked')");
        el.innerHTML = `
            <div class="checkbox"></div>
            <div class="grocery-name">${item.name}</div>
            <div class="grocery-amount">${cleanAmount} ${item.unit}</div>
        `;
        container.appendChild(el);
    });
}

// Boot up the app
document.addEventListener('DOMContentLoaded', () => {
    setWeekIndicator();
    generateInitialPlan();
    renderPlanner();
    renderGroceryList();
});
