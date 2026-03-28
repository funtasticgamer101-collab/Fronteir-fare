// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.error('SW registration failed:', err));
}

// PWA Install Prompt Logic
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
    }
});

// UI Elements
const tabPlan = document.getElementById('tab-plan');
const tabGroceries = document.getElementById('tab-groceries');
const viewPlan = document.getElementById('view-plan');
const viewGroceries = document.getElementById('view-groceries');
const loading = document.getElementById('loading');
const weekGrid = document.getElementById('week-grid');
const groceryListEl = document.getElementById('grocery-list');

// Modal Elements
const modal = document.getElementById('recipe-modal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalImg = document.getElementById('modal-img');
const modalIngredients = document.getElementById('modal-ingredients');
const modalInstructions = document.getElementById('modal-instructions');

// State
let mealPlan = []; // Will hold exactly 14 meals (7 days x 2)
let validRecipesPool = []; // Pool of all safe, fetched recipes
let consolidatedGroceries = {};

// Exclusions (Strictly enforced)
const forbiddenKeywords = [
    'seafood', 'shrimp', 'lobster', 'crab', 'peanut', 'tree nut', 
    'almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'macadamia', 
    'hazelnut', 'pine nut', 'caesar', 'scallop', 'mussel', 'clam', 'oyster'
];

// Custom Classic American Recipes (Written for 4 servings so the engine scales them to 1 perfectly)
const customComfortMeals = [
    {
        idMeal: "custom1",
        strMeal: "Classic Grilled Cheese Sandwich",
        strMealThumb: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80",
        strInstructions: "1. Heat a large skillet over medium-low heat.\n2. Spread butter generously on one side of every slice of bread.\n3. Place half the bread slices butter-side down in the skillet.\n4. Top each with an even layer of cheddar cheese.\n5. Place the remaining bread slices on top, butter-side up.\n6. Grill for 3-4 minutes until the bottom is golden brown and crispy.\n7. Carefully flip each sandwich and grill the other side until golden and the cheese is completely melted.\n8. Slice diagonally and serve hot.",
        strIngredient1: "White Bread", strMeasure1: "8 slices",
        strIngredient2: "Butter", strMeasure2: "4 tbs",
        strIngredient3: "Cheddar Cheese", strMeasure3: "8 slices"
    },
    {
        idMeal: "custom2",
        strMeal: "BBQ Chicken Wraps",
        strMealThumb: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80",
        strInstructions: "1. In a bowl, toss the shredded cooked chicken with the BBQ sauce until fully coated.\n2. Lay the flour tortillas flat on a clean surface.\n3. Distribute the BBQ chicken evenly down the center of each tortilla.\n4. Top with shredded lettuce, diced red onion, and shredded Monterey Jack cheese.\n5. Fold the sides of the tortilla inward, then roll tightly from the bottom up to form a wrap.\n6. Optional: Toast the wrap seam-side down in a skillet for 2 minutes to seal it and melt the cheese.",
        strIngredient1: "Flour Tortilla", strMeasure1: "4 large",
        strIngredient2: "Cooked Chicken", strMeasure2: "2 cups",
        strIngredient3: "BBQ Sauce", strMeasure3: "1 cup",
        strIngredient4: "Lettuce", strMeasure4: "2 cups",
        strIngredient5: "Red Onion", strMeasure5: "1 small",
        strIngredient6: "Monterey Jack Cheese", strMeasure6: "1 cup"
    },
    {
        idMeal: "custom3",
        strMeal: "Loaded Beef Nachos",
        strMealThumb: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80",
        strInstructions: "1. Preheat oven to 400°F (200°C).\n2. In a skillet, brown the ground beef over medium heat. Drain excess fat, then stir in taco seasoning and water as directed on the seasoning packet. Simmer until thickened.\n3. Spread tortilla chips in an even layer on a large baking sheet.\n4. Spoon the seasoned beef evenly over the chips.\n5. Drizzle generously with nacho cheese sauce and sprinkle shredded cheddar on top.\n6. Bake for 5-7 minutes until the shredded cheese is melted and bubbly.\n7. Remove from oven and top with diced tomatoes, jalapenos, and dollops of sour cream. Serve immediately.",
        strIngredient1: "Tortilla Chips", strMeasure1: "1 large bag",
        strIngredient2: "Ground Beef", strMeasure2: "1 lb",
        strIngredient3: "Taco Seasoning", strMeasure3: "1 packet",
        strIngredient4: "Nacho Cheese Sauce", strMeasure4: "1 cup",
        strIngredient5: "Cheddar Cheese", strMeasure5: "1 cup",
        strIngredient6: "Tomato", strMeasure6: "2 diced",
        strIngredient7: "Jalapenos", strMeasure7: "0.5 cup",
        strIngredient8: "Sour Cream", strMeasure8: "0.5 cup"
    },
    {
        idMeal: "custom4",
        strMeal: "Classic Beef Tacos",
        strMealThumb: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=400&q=80",
        strInstructions: "1. Heat a large skillet over medium-high heat. Add ground beef and cook until browned, breaking it apart with a spoon. Drain excess grease.\n2. Stir in the taco seasoning and water according to the packet instructions. Reduce heat and simmer for 5 minutes.\n3. Warm the taco shells in the oven or microwave as directed on their packaging.\n4. Assemble the tacos: Spoon the seasoned beef into the bottom of each shell.\n5. Top with shredded lettuce, diced tomatoes, and shredded cheddar cheese.\n6. Serve with optional salsa or sour cream on the side.",
        strIngredient1: "Ground Beef", strMeasure1: "1 lb",
        strIngredient2: "Taco Seasoning", strMeasure2: "1 packet",
        strIngredient3: "Hard Taco Shells", strMeasure3: "12 shells",
        strIngredient4: "Lettuce", strMeasure4: "2 cups",
        strIngredient5: "Tomato", strMeasure5: "2 diced",
        strIngredient6: "Cheddar Cheese", strMeasure6: "1.5 cups"
    },
    {
        idMeal: "custom5",
        strMeal: "Creamy Tomato Soup",
        strMealThumb: "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=400&q=80",
        strInstructions: "1. In a large pot, melt butter over medium heat. Add diced onion and minced garlic, sautéing until soft and fragrant (about 5 minutes).\n2. Pour in the crushed tomatoes and vegetable broth. Stir well and bring to a gentle simmer.\n3. Reduce heat to low, cover, and let simmer for 15-20 minutes to allow flavors to meld.\n4. Remove from heat. Use an immersion blender (or carefully transfer to a standard blender in batches) to puree the soup until completely smooth.\n5. Stir in the heavy cream and season with salt and pepper to taste.\n6. Serve hot, ideally paired with a grilled cheese sandwich.",
        strIngredient1: "Crushed Tomatoes", strMeasure1: "28 oz can",
        strIngredient2: "Vegetable Broth", strMeasure2: "2 cups",
        strIngredient3: "Heavy Cream", strMeasure3: "0.5 cup",
        strIngredient4: "Onion", strMeasure4: "1 diced",
        strIngredient5: "Garlic", strMeasure5: "3 cloves",
        strIngredient6: "Butter", strMeasure6: "2 tbs"
    },
    {
        idMeal: "custom6",
        strMeal: "Spaghetti with Meat Sauce",
        strMealThumb: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=400&q=80",
        strInstructions: "1. Bring a large pot of salted water to a boil. Add spaghetti and cook according to package directions until al dente. Drain and set aside.\n2. In a large skillet or pot, cook the ground beef over medium heat until browned. Drain excess fat.\n3. Add diced onion and minced garlic to the beef, cooking for 3-4 minutes until softened.\n4. Pour in the tomato sauce and diced tomatoes. Stir in Italian seasoning, salt, and pepper.\n5. Bring the sauce to a simmer, reduce heat to low, and let it cook for 15 minutes, stirring occasionally.\n6. Serve the hot meat sauce generously over the cooked spaghetti. Top with grated Parmesan cheese.",
        strIngredient1: "Spaghetti", strMeasure1: "16 oz",
        strIngredient2: "Ground Beef", strMeasure2: "1 lb",
        strIngredient3: "Tomato Sauce", strMeasure3: "24 oz jar",
        strIngredient4: "Diced Tomatoes", strMeasure4: "14 oz can",
        strIngredient5: "Onion", strMeasure5: "1 diced",
        strIngredient6: "Garlic", strMeasure6: "2 cloves",
        strIngredient7: "Italian Seasoning", strMeasure7: "1 tbs",
        strIngredient8: "Parmesan Cheese", strMeasure8: "0.5 cup"
    }
];

// Tab Switching
tabPlan.addEventListener('click', () => {
    tabPlan.classList.add('active');
    tabGroceries.classList.remove('active');
    viewPlan.classList.add('active');
    viewGroceries.classList.remove('active');
});

tabGroceries.addEventListener('click', () => {
    tabGroceries.classList.add('active');
    tabPlan.classList.remove('active');
    viewGroceries.classList.add('active');
    viewPlan.classList.remove('active');
});

// Modal Logic
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

function openModal(recipe) {
    modalTitle.textContent = recipe.strMeal;
    modalImg.src = recipe.strMealThumb;
    modalInstructions.textContent = recipe.strInstructions;
    
    modalIngredients.innerHTML = '';
    recipe.scaledIngredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = `${ing.measure} ${ing.name}`;
        modalIngredients.appendChild(li);
    });
    
    modal.style.display = "block";
}

// --- SCALING ENGINE (1 Portion) ---
function scaleMeasurement(measureStr) {
    if (!measureStr || measureStr.trim() === '') return '';
    
    let str = measureStr.trim();
    const match = str.match(/^(\d+\s*\d*\/\d+|\d+\/\d+|\d*\.?\d+)\s*(.*)/);
    
    if (match) {
        let numStr = match[1].replace(/\s+/g, ' ').trim();
        let unit = match[2];
        let value = 0;

        if (numStr.includes('/')) {
            let parts = numStr.split(' ');
            if (parts.length === 2) {
                let frac = parts[1].split('/');
                value = parseFloat(parts[0]) + (parseFloat(frac[0]) / parseFloat(frac[1]));
            } else {
                let frac = parts[0].split('/');
                value = parseFloat(frac[0]) / parseFloat(frac[1]);
            }
        } else {
            value = parseFloat(numStr);
        }

        // Divide by 4 to get 1 serving
        let scaledValue = value / 4;
        scaledValue = Math.round(scaledValue * 100) / 100;
        
        return `${scaledValue} ${unit}`.trim();
    }
    return str;
}

// --- DATA FETCHING & FILTERING ---
async function fetchRecipes() {
    try {
        let allMeals = [];

        // Fetch American and Mexican categories from TheMealDB
        const areas = ['American', 'Mexican', 'Italian'];
        for (const area of areas) {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
            const data = await res.json();
            if (data.meals) {
                allMeals = allMeals.concat(data.meals);
            }
        }

        // Shuffle API meals
        allMeals = allMeals.sort(() => 0.5 - Math.random());
        
        // Process Custom Meals First (Guarantees they are in the pool)
        for (const customRecipe of customComfortMeals) {
            if (isRecipeSafe(customRecipe)) {
                customRecipe.scaledIngredients = extractAndScaleIngredients(customRecipe);
                validRecipesPool.push(customRecipe);
            }
        }

        // Process API Meals until we have a healthy pool (e.g., 30 meals)
        for (const mealStub of allMeals) {
            if (validRecipesPool.length >= 30) break;

            const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealStub.idMeal}`);
            const detailData = await detailRes.json();
            const recipe = detailData.meals[0];

            if (isRecipeSafe(recipe)) {
                recipe.scaledIngredients = extractAndScaleIngredients(recipe);
                validRecipesPool.push(recipe);
            }
        }

        // Select exactly 14 meals for the 7-day plan
        mealPlan = validRecipesPool.slice(0, 14);
        
        renderMealPlan();
        generateGroceryList();
        
        loading.style.display = 'none';
        viewPlan.classList.add('active');

    } catch (error) {
        console.error("Error fetching recipes:", error);
        loading.innerHTML = "<p>Failed to load recipes. Please check your connection.</p>";
    }
}

function isRecipeSafe(recipe) {
    const textToSearch = (
        recipe.strMeal + " " + 
        recipe.strInstructions + " " + 
        getRawIngredientsString(recipe)
    ).toLowerCase();

    for (const word of forbiddenKeywords) {
        if (textToSearch.includes(word)) {
            return false;
        }
    }
    return true;
}

function getRawIngredientsString(recipe) {
    let str = "";
    for (let i = 1; i <= 20; i++) {
        if (recipe[`strIngredient${i}`]) {
            str += recipe[`strIngredient${i}`] + " ";
        }
    }
    return str;
}

function extractAndScaleIngredients(recipe) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const name = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        
        if (name && name.trim() !== "") {
            ingredients.push({
                name: name.trim().toLowerCase(),
                measure: scaleMeasurement(measure)
            });
        }
    }
    return ingredients;
}

// --- REGENERATE MEAL ---
function regenerateMeal(planIndex) {
    // Find a meal in the pool that isn't currently in the meal plan
    const currentIds = mealPlan.map(m => m.idMeal);
    const availableMeals = validRecipesPool.filter(m => !currentIds.includes(m.idMeal));
    
    if (availableMeals.length > 0) {
        // Pick a random new meal
        const newMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
        mealPlan[planIndex] = newMeal;
        
        // Re-render UI
        renderMealPlan();
        generateGroceryList();
    } else {
        alert("No more unique meals available in the pool to swap!");
    }
}

// --- RENDERING ---
function renderMealPlan() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    weekGrid.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const dayName = days[i];
        const lunchIndex = i * 2;
        const dinnerIndex = (i * 2) + 1;
        
        const lunch = mealPlan[lunchIndex];
        const dinner = mealPlan[dinnerIndex];

        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.innerHTML = `<h3>${dayName}</h3>`;

        // Lunch Slot
        const lunchSlot = document.createElement('div');
        lunchSlot.className = 'meal-slot';
        lunchSlot.innerHTML = `
            <img src="${lunch.strMealThumb}" alt="${lunch.strMeal}">
            <div class="meal-info">
                <div class="meal-type">Lunch</div>
                <div class="meal-name">${lunch.strMeal}</div>
            </div>
            <button class="regen-btn" title="Swap Meal">🔄</button>
        `;
        // Click slot to open modal
        lunchSlot.onclick = () => openModal(lunch);
        // Click regen button to swap (stop propagation so modal doesn't open)
        lunchSlot.querySelector('.regen-btn').onclick = (e) => {
            e.stopPropagation();
            regenerateMeal(lunchIndex);
        };
        dayCard.appendChild(lunchSlot);

        // Dinner Slot
        const dinnerSlot = document.createElement('div');
        dinnerSlot.className = 'meal-slot';
        dinnerSlot.innerHTML = `
            <img src="${dinner.strMealThumb}" alt="${dinner.strMeal}">
            <div class="meal-info">
                <div class="meal-type">Dinner</div>
                <div class="meal-name">${dinner.strMeal}</div>
            </div>
            <button class="regen-btn" title="Swap Meal">🔄</button>
        `;
        dinnerSlot.onclick = () => openModal(dinner);
        dinnerSlot.querySelector('.regen-btn').onclick = (e) => {
            e.stopPropagation();
            regenerateMeal(dinnerIndex);
        };
        dayCard.appendChild(dinnerSlot);

        weekGrid.appendChild(dayCard);
    }
}

function generateGroceryList() {
    consolidatedGroceries = {};

    mealPlan.forEach(recipe => {
        recipe.scaledIngredients.forEach(ing => {
            const name = ing.name;
            const measure = ing.measure;

            const match = measure.match(/^([\d\.]+)\s*(.*)/);
            let qty = match ? parseFloat(match[1]) : 0;
            let unit = match ? match[2].trim() : measure.trim();

            if (!consolidatedGroceries[name]) {
                consolidatedGroceries[name] = { qty: 0, unit: unit, raw: [] };
            }

            if (qty > 0) {
                consolidatedGroceries[name].qty += qty;
                if (unit && consolidatedGroceries[name].unit === '') {
                    consolidatedGroceries[name].unit = unit;
                }
            } else {
                if (measure && !consolidatedGroceries[name].raw.includes(measure)) {
                    consolidatedGroceries[name].raw.push(measure);
                }
            }
        });
    });

    renderGroceryList();
}

function renderGroceryList() {
    groceryListEl.innerHTML = '';
    const sortedKeys = Object.keys(consolidatedGroceries).sort();

    sortedKeys.forEach(key => {
        const item = consolidatedGroceries[key];
        const li = document.createElement('li');
        
        let displayQty = '';
        if (item.qty > 0) {
            let finalQty = Math.round(item.qty * 100) / 100;
            displayQty = `${finalQty} ${item.unit}`.trim();
        } else if (item.raw.length > 0) {
            displayQty = item.raw.join(', ');
        } else {
            displayQty = 'As needed';
        }

        li.innerHTML = `
            <span class="g-name">${key}</span>
            <span class="g-qty">${displayQty}</span>
        `;
        groceryListEl.appendChild(li);
    });
}

// Init
fetchRecipes();
