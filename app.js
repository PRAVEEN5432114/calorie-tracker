// App Logic

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const totalCalIn = document.getElementById('total-cal-in');
const totalCalOut = document.getElementById('total-cal-out');
const netCal = document.getElementById('net-cal');
const logList = document.getElementById('log-list');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.input-section');

// Food Inputs
const foodInput = document.getElementById('food-input');
const foodCalories = document.getElementById('food-calories');
const foodSuggestions = document.getElementById('food-suggestions');
const addFoodBtn = document.getElementById('add-food-btn');

// Activity Inputs
const activityInput = document.getElementById('activity-input');
const activityDuration = document.getElementById('activity-duration');
const activityCalories = document.getElementById('activity-calories');
const activitySuggestions = document.getElementById('activity-suggestions');
const addActivityBtn = document.getElementById('add-activity-btn');

// State
let currentDate = new Date().toISOString().split('T')[0];
let appData = JSON.parse(localStorage.getItem('fitTrackData')) || {};

// Initialize App
function init() {
    loadTheme();
    setupEventListeners();
    renderDashboard();
    renderLog();
}

// Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.name = savedTheme === 'dark' ? 'sunny-outline' : 'moon-outline';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.name = newTheme === 'dark' ? 'sunny-outline' : 'moon-outline';
});

// Tab Management
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.style.display = 'none');
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).style.display = 'block';
    });
});

// Autocomplete Logic - Generic function
function setupAutocomplete(inputEl, suggestionsEl, database, onSelect) {
    inputEl.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        suggestionsEl.innerHTML = '';
        if (!val) {
            suggestionsEl.style.display = 'none';
            return;
        }

        const matches = database.filter(item => item.name.toLowerCase().includes(val)).slice(0, 5);
        if (matches.length > 0) {
            suggestionsEl.style.display = 'block';
            matches.forEach(match => {
                const li = document.createElement('li');
                let detailText = '';
                if(match.calories) detailText = `${match.calories} kcal / ${match.unit}`;
                if(match.calPerMin) detailText = `${match.calPerMin} kcal/min`;

                li.innerHTML = `<span>${match.name}</span> <span class="s-cal">${detailText}</span>`;
                li.addEventListener('click', () => {
                    inputEl.value = match.name;
                    suggestionsEl.style.display = 'none';
                    onSelect(match);
                });
                suggestionsEl.appendChild(li);
            });
        } else {
            suggestionsEl.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target !== inputEl) suggestionsEl.style.display = 'none';
    });
}

// Setup Food Autocomplete
setupAutocomplete(foodInput, foodSuggestions, foodDatabase, (match) => {
    foodCalories.value = match.calories;
});

// Setup Activity Autocomplete
setupAutocomplete(activityInput, activitySuggestions, activityDatabase, (match) => {
    activityInput.dataset.calPerMin = match.calPerMin;
    if(activityDuration.value) {
        activityCalories.value = Math.round(match.calPerMin * activityDuration.value);
    }
});

activityDuration.addEventListener('input', () => {
    const calPerMin = parseFloat(activityInput.dataset.calPerMin);
    if(calPerMin && activityDuration.value) {
        activityCalories.value = Math.round(calPerMin * activityDuration.value);
    }
});

// Data Management
function getTodayData() {
    if (!appData[currentDate]) {
        appData[currentDate] = { food: [], activity: [] };
    }
    return appData[currentDate];
}

function saveData() {
    localStorage.setItem('fitTrackData', JSON.stringify(appData));
    renderDashboard();
    renderLog();
}

// Add Item Handlers
addFoodBtn.addEventListener('click', () => {
    const name = foodInput.value.trim();
    const cals = parseInt(foodCalories.value);
    if (!name || isNaN(cals)) return alert('Please enter food name and calories.');
    
    getTodayData().food.push({ id: Date.now(), name, calories: cals });
    saveData();
    foodInput.value = '';
    foodCalories.value = '';
});

addActivityBtn.addEventListener('click', () => {
    const name = activityInput.value.trim();
    const duration = parseInt(activityDuration.value);
    const cals = parseInt(activityCalories.value);
    if (!name || isNaN(cals)) return alert('Please enter activity details.');
    
    getTodayData().activity.push({ id: Date.now(), name: `${name} (${duration || 0}m)`, calories: cals });
    saveData();
    activityInput.value = '';
    activityDuration.value = '';
    activityCalories.value = '';
    delete activityInput.dataset.calPerMin;
});

// Render Functions
function renderDashboard() {
    const data = getTodayData();
    const totalIn = data.food.reduce((sum, item) => sum + item.calories, 0);
    const totalOut = data.activity.reduce((sum, item) => sum + item.calories, 0);
    const net = totalIn - totalOut;

    totalCalIn.textContent = totalIn;
    totalCalOut.textContent = totalOut;
    netCal.textContent = net;
    
    netCal.style.color = net > 2000 ? 'var(--secondary)' : 'var(--text-primary)';
}

function renderLog() {
    const data = getTodayData();
    logList.innerHTML = '';
    
    const allItems = [
        ...data.food.map(f => ({ ...f, type: 'food' })),
        ...data.activity.map(a => ({ ...a, type: 'activity' }))
    ].sort((a, b) => b.id - a.id);

    if (allItems.length === 0) {
        logList.innerHTML = `
            <div class="empty-state">
                <ion-icon name="document-text-outline"></ion-icon>
                <p>No entries yet today. Start tracking!</p>
            </div>`;
        return;
    }

    allItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'log-item';
        
        const isFood = item.type === 'food';
        const icon = isFood ? 'restaurant' : 'flame';
        const sign = isFood ? '+' : '-';
        const calClass = isFood ? 'positive' : 'negative';

        div.innerHTML = `
            <div class="log-info">
                <div class="log-icon ${item.type}">
                    <ion-icon name="${icon}"></ion-icon>
                </div>
                <div class="log-details">
                    <h4>${item.name}</h4>
                    <p>${isFood ? 'Consumed' : 'Burned'}</p>
                </div>
            </div>
            <div class="log-actions">
                <span class="log-calories ${calClass}">${sign}${item.calories}</span>
                <button class="delete-btn" onclick="deleteItem(${item.id}, '${item.type}')">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </div>
        `;
        logList.appendChild(div);
    });
}

// Delete Item attached to window to work with inline onclick
window.deleteItem = function(id, type) {
    const data = getTodayData();
    data[type] = data[type].filter(item => item.id !== id);
    saveData();
};

init();
