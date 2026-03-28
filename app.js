// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.error('SW registration failed:', err));
}

// UI Elements
const tabPlan = document.getElementById('tab-plan');
const tabGroceries = document.getElementById('tab-groceries');
const viewPlan = document.getElementById('view-plan');
const viewGroceries = document.getElementById('view-groceries');
const loading = document.getElementById('loading');
const week1Grid = document.getElementById('week-1-grid');
const week2Grid = document.getElementById('week-2-grid');
const groceryListEl = document.getElementById('grocery-list');

// Modal Elements
const modal = document.getElementById('recipe-modal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalImg = document.getElementById('modal-img');
const modalIngredients = document.getElementById('modal-ingredients');
const modalInstructions = document.getElementById('modal-instructions');

// State
let mealPlan = [];
let consolidatedGroceries = {};

// Exclusions (Strictly enforced)
const forbiddenKeywords = [
    'seafood', 'shrimp', 'lobster', 'crab', 'peanut', 'tree nut', 
    'almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'macadamia', 
    'hazelnut', 'pine nut', 'caesar', 'scallop', 'mussel', 'clam', 'oyster'
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
// TheMealDB recipes usually serve 4. We divide numbers by 4.
function scaleMeasurement(measureStr) {
    if (!measureStr || measureStr.trim() === '') return '';
    
    let str = measureStr.trim();
    // Match leading numbers, fractions, or decimals (e.g., "1 1/2", "0.5", "2")
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
        
        // Round to 2 decimal places to keep it clean
        scaledValue = Math.round(scaledValue * 100) / 100;
        
        // Convert common decimals back to readable fractions if desired, 
        // but decimals are cleaner for a consolidated list.
        return `${scaledValue} ${unit}`.trim();
    }
    
    // If no number found (e.g., "Pinch", "To taste"), return as is
    return str;
}

// --- DATA FETCHING & FILTERING ---
async function fetchRecipes() {
    try {
        // Fetch from categories that fit "Comfort Food"
        const categories = ['Chicken', 'Beef', 'Pasta', 'Miscellaneous'];
        let allMeals = [];

        for (const cat of categories) {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
            const data = await res.json();
            if (data.meals) {
                allMeals = allMeals.concat(data.meals);
            }
        }

        // Shuffle to get variety
        allMeals = allMeals.sort(() => 0.5 - Math.random());
        
        let validRecipes = [];
        
        // We need 28 meals (14 days * 2 meals)
        for (const mealStub of allMeals) {
            if (validRecipes.length >= 28) break;

            const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealStub.idMeal}`);
            const detailData = await detailRes.json();
            const recipe = detailData.meals[0];

            if (isRecipeSafe(recipe)) {
                // Process and scale ingredients
                recipe.scaledIngredients = extractAndScaleIngredients(recipe);
                validRecipes.push(recipe);
            }
        }

        // If API fails to find 28, duplicate some to fill the plan
        while (validRecipes.length < 28 && validRecipes.length > 0) {
            validRecipes.push(validRecipes[Math.floor(Math.random() * validRecipes.length)]);
        }

        mealPlan = validRecipes;
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

// --- RENDERING ---
function renderMealPlan() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    week1Grid.innerHTML = '';
    week2Grid.innerHTML = '';

    for (let i = 0; i < 14; i++) {
        const dayName = days[i % 7];
        const lunch = mealPlan[i * 2];
        const dinner = mealPlan[(i * 2) + 1];

        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        dayCard.innerHTML = `<h3>${dayName}</h3>`;

        // Lunch Slot
        const lunchSlot = document.createElement('div');
        lunchSlot.className = 'meal-slot';
        lunchSlot.innerHTML = `
            <img src="${lunch.strMealThumb}/preview" alt="${lunch.strMeal}">
            <div class="meal-info">
                <div class="meal-type">Lunch</div>
                <div class="meal-name">${lunch.strMeal}</div>
            </div>
        `;
        lunchSlot.onclick = () => openModal(lunch);
        dayCard.appendChild(lunchSlot);

        // Dinner Slot
        const dinnerSlot = document.createElement('div');
        dinnerSlot.className = 'meal-slot';
        dinnerSlot.innerHTML = `
            <img src="${dinner.strMealThumb}/preview" alt="${dinner.strMeal}">
            <div class="meal-info">
                <div class="meal-type">Dinner</div>
                <div class="meal-name">${dinner.strMeal}</div>
            </div>
        `;
        dinnerSlot.onclick = () => openModal(dinner);
        dayCard.appendChild(dinnerSlot);

        if (i < 7) {
            week1Grid.appendChild(dayCard);
        } else {
            week2Grid.appendChild(dayCard);
        }
    }
}

function generateGroceryList() {
    consolidatedGroceries = {};

    mealPlan.forEach(recipe => {
        recipe.scaledIngredients.forEach(ing => {
            const name = ing.name;
            const measure = ing.measure;

            // Attempt to parse out the numeric value and the unit from the scaled measure
            const match = measure.match(/^([\d\.]+)\s*(.*)/);
            let qty = match ? parseFloat(match[1]) : 0;
            let unit = match ? match[2].trim() : measure.trim();

            if (!consolidatedGroceries[name]) {
                consolidatedGroceries[name] = { qty: 0, unit: unit, raw: [] };
            }

            if (qty > 0) {
                consolidatedGroceries[name].qty += qty;
                // Keep the most common unit found
                if (unit && consolidatedGroceries[name].unit === '') {
                    consolidatedGroceries[name].unit = unit;
                }
            } else {
                // If it's something like "Pinch" or "To taste", just store it
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
    
    // Sort alphabetically
    const sortedKeys = Object.keys(consolidatedGroceries).sort();

    sortedKeys.forEach(key => {
        const item = consolidatedGroceries[key];
        const li = document.createElement('li');
        
        let displayQty = '';
        if (item.qty > 0) {
            // Round to 2 decimals to avoid floating point weirdness
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
