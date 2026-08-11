/**
 * FitTrack App Logic
 */

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.log('Service Worker Failed', err));
}

// --- DOM Elements ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const navItems = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page-section');
const onboardingModal = document.getElementById('onboarding-modal');

// --- Global State ---
let appData = null;
let currentDate = new Date().toISOString().split('T')[0];

// --- Initialization ---
function init() {
    appData = StorageUtils.getData();
    loadTheme();
    
    // Check if onboarding is needed
    if (!appData.profile.isSetup) {
        onboardingModal.classList.remove('hidden');
    } else {
        checkStreaks();
        renderDashboard();
    }
    
    setupEventListeners();
    setupAutocompletes();
}

// --- Theme Management ---
function loadTheme() {
    const theme = appData.profile.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.name = theme === 'dark' ? 'sunny-outline' : 'moon-outline';
}

themeToggle.addEventListener('click', () => {
    appData.profile.theme = appData.profile.theme === 'dark' ? 'light' : 'dark';
    StorageUtils.saveData(appData);
    loadTheme();
});

// --- Tab Navigation ---
window.switchTab = function(tabId) {
    navItems.forEach(nav => nav.classList.remove('active'));
    pageSections.forEach(sec => sec.classList.remove('active-section'));
    
    const activeNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if(activeNav) activeNav.classList.add('active');
    
    document.getElementById(`tab-${tabId}`).classList.add('active-section');
    
    if (tabId === 'home') renderDashboard();
    if (tabId === 'food') renderFoodLog();
    if (tabId === 'workout') renderActivityLog();
    if (tabId === 'progress') renderProgress();
};

navItems.forEach(nav => {
    nav.addEventListener('click', () => switchTab(nav.dataset.tab));
});

// --- Onboarding Logic ---
document.getElementById('finish-setup-btn').addEventListener('click', () => {
    const profile = {
        isSetup: true,
        name: document.getElementById('setup-name').value.trim(),
        age: parseInt(document.getElementById('setup-age').value),
        gender: document.getElementById('setup-gender').value,
        weight: parseFloat(document.getElementById('setup-weight').value),
        height: parseFloat(document.getElementById('setup-height').value),
        activityLevel: document.getElementById('setup-activity').value,
        goal: document.getElementById('setup-goal').value,
        theme: 'dark'
    };

    const errors = Validation.validateProfile(profile);
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    // Calculate Targets
    const bmr = Calculations.calculateBMR(profile.gender, profile.weight, profile.height, profile.age);
    const actMult = Calculations.getActivityMultiplier(profile.activityLevel);
    const tdee = Calculations.calculateTDEE(bmr, actMult);
    const targetCals = Calculations.calculateTargetCalories(tdee, profile.goal);
    const macros = Calculations.calculateMacros(targetCals, profile.goal);

    appData.profile = profile;
    appData.targets = { calories: targetCals, ...macros };
    
    StorageUtils.saveData(appData);
    onboardingModal.classList.add('hidden');
    
    renderDashboard();
    document.getElementById('user-greeting').textContent = `Welcome, ${profile.name} 👋`;
    showToast("Profile set up successfully!");
});

// --- Dashboard Rendering ---
function getTodayLog() {
    if (!appData.dailyLogs[currentDate]) {
        appData.dailyLogs[currentDate] = { food: [], activity: [], water: 0, weight: appData.profile.weight };
    }
    return appData.dailyLogs[currentDate];
}

function renderDashboard() {
    const log = getTodayLog();
    const targets = appData.targets;
    
    document.getElementById('user-greeting').textContent = `Good morning, ${appData.profile.name} 👋`;

    // Calculate Totals
    let calIn = 0, proIn = 0, carIn = 0, fatIn = 0;
    log.food.forEach(f => {
        calIn += f.calories;
        proIn += f.protein;
        carIn += f.carbs;
        fatIn += f.fat;
    });

    let calOut = log.activity.reduce((sum, a) => sum + a.calories, 0);
    let netCals = calIn - calOut;

    // Update UI
    document.getElementById('dash-cal-consumed').textContent = Math.max(0, netCals);
    document.getElementById('dash-cal-target').textContent = targets.calories;
    
    // Ring Animation
    const ring = document.getElementById('cal-progress-ring');
    const pct = Math.min(100, Math.max(0, (netCals / targets.calories) * 100));
    ring.setAttribute('stroke-dasharray', `${pct}, 100`);
    if(pct > 100) ring.style.stroke = 'var(--secondary)';
    else ring.style.stroke = 'var(--primary)';

    // Macros UI
    const updateMacro = (idPrefix, current, target) => {
        document.getElementById(`dash-${idPrefix}-in`).textContent = Math.round(current);
        document.getElementById(`dash-${idPrefix}-target`).textContent = Math.round(target);
        document.getElementById(`bar-${idPrefix}`).style.width = `${Math.min(100, (current/target)*100)}%`;
    };

    updateMacro('pro', proIn, targets.protein);
    updateMacro('car', carIn, targets.carbs);
    updateMacro('fat', fatIn, targets.fat);

    // Water UI
    document.getElementById('dash-water-in').textContent = `${(log.water/1000).toFixed(1)}L / ${(targets.water/1000).toFixed(1)}L`;

    updateCoachInsight(netCals, targets.calories, proIn, targets.protein);
}

function updateCoachInsight(netCals, targetCals, proIn, targetPro) {
    const msgEl = document.getElementById('coach-message');
    const remaining = targetCals - netCals;
    const proRem = targetPro - proIn;

    if (remaining > 500) {
        msgEl.textContent = `You have ${remaining} kcal remaining today. Make sure to eat enough to fuel your body!`;
    } else if (remaining > 0) {
        if (proRem > 20) {
            msgEl.textContent = `You're close to your calorie goal. Try a high-protein snack to hit your protein target!`;
        } else {
            msgEl.textContent = `Great job hitting your macros today! You have ${remaining} kcal left.`;
        }
    } else {
        msgEl.textContent = `You've exceeded your calorie target by ${Math.abs(remaining)} kcal. Try adding a quick walk!`;
    }
}

// --- Autocomplete Logic ---
function setupAutocompletes() {
    // Food
    const fInput = document.getElementById('food-search');
    const fSugg = document.getElementById('food-suggestions');
    fInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        fSugg.innerHTML = '';
        if(!val) { fSugg.style.display = 'none'; return; }
        
        const matches = window.foodDatabase.filter(item => item.name.toLowerCase().includes(val)).slice(0, 8);
        if(matches.length > 0) {
            fSugg.style.display = 'block';
            matches.forEach(m => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${m.name} <small class="text-secondary">(${m.serving})</small></span> <span class="text-primary" style="font-weight:600">${m.calories}kcal</span>`;
                li.onclick = () => selectFood(m);
                fSugg.appendChild(li);
            });
        } else {
            fSugg.style.display = 'none';
        }
    });

    // Activity
    const aInput = document.getElementById('activity-search');
    const aSugg = document.getElementById('activity-suggestions');
    aInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        aSugg.innerHTML = '';
        if(!val) { aSugg.style.display = 'none'; return; }
        
        const matches = window.activityDatabase.filter(item => item.name.toLowerCase().includes(val)).slice(0, 8);
        if(matches.length > 0) {
            aSugg.style.display = 'block';
            matches.forEach(m => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${m.name}</span> <span class="text-secondary">MET: ${m.met}</span>`;
                li.onclick = () => selectActivity(m);
                aSugg.appendChild(li);
            });
        } else {
            aSugg.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if(e.target !== fInput) fSugg.style.display = 'none';
        if(e.target !== aInput) aSugg.style.display = 'none';
    });
}

// --- Food Logging ---
let selectedFood = null;
function selectFood(food) {
    selectedFood = food;
    document.getElementById('food-search').value = '';
    document.getElementById('food-detail-panel').classList.remove('hidden');
    
    document.getElementById('fd-name').textContent = food.name;
    document.getElementById('fd-serving').textContent = food.serving;
    document.getElementById('fd-qty').value = 1;
    
    updateFoodPreview();
}

function updateFoodPreview() {
    if(!selectedFood) return;
    const qty = parseFloat(document.getElementById('fd-qty').value) || 1;
    document.getElementById('fd-cal').textContent = Math.round(selectedFood.calories * qty);
    document.getElementById('fd-pro').textContent = Math.round(selectedFood.protein * qty);
    document.getElementById('fd-car').textContent = Math.round(selectedFood.carbs * qty);
    document.getElementById('fd-fat').textContent = Math.round(selectedFood.fat * qty);
}

document.getElementById('fd-qty').addEventListener('input', updateFoodPreview);

document.getElementById('btn-save-food').addEventListener('click', () => {
    if(!selectedFood) return;
    const qty = parseFloat(document.getElementById('fd-qty').value) || 1;
    const meal = document.getElementById('fd-meal').value;
    
    const log = getTodayLog();
    log.food.push({
        id: Date.now(),
        name: selectedFood.name,
        meal: meal,
        qty: qty,
        calories: Math.round(selectedFood.calories * qty),
        protein: Math.round(selectedFood.protein * qty),
        carbs: Math.round(selectedFood.carbs * qty),
        fat: Math.round(selectedFood.fat * qty),
        fiber: Math.round(selectedFood.fiber * qty)
    });
    
    StorageUtils.saveData(appData);
    document.getElementById('food-detail-panel').classList.add('hidden');
    showToast("Food added to log!");
    renderFoodLog();
    
    // Update streaks
    checkStreaks();
});

function renderFoodLog() {
    const list = document.getElementById('food-log-list');
    const food = getTodayLog().food;
    
    if(food.length === 0) {
        list.innerHTML = `<p class="text-secondary text-center mt-15">No meals logged yet today.</p>`;
        return;
    }
    
    list.innerHTML = '';
    food.forEach(f => {
        const div = document.createElement('div');
        div.className = 'log-item';
        div.innerHTML = `
            <div class="log-info">
                <div class="log-icon"><ion-icon name="restaurant"></ion-icon></div>
                <div class="log-details">
                    <h4>${f.name}</h4>
                    <p>${f.meal} • ${f.qty} serving(s) • P:${f.protein}g C:${f.carbs}g F:${f.fat}g</p>
                </div>
            </div>
            <div>
                <span class="log-calories">+${f.calories}</span>
                <button class="delete-btn" onclick="deleteItem(${f.id}, 'food')"><ion-icon name="trash-outline"></ion-icon></button>
            </div>
        `;
        list.appendChild(div);
    });
}

// --- Activity Logging ---
let selectedActivity = null;
function selectActivity(activity) {
    selectedActivity = activity;
    document.getElementById('activity-search').value = '';
    document.getElementById('activity-detail-panel').classList.remove('hidden');
    document.getElementById('ad-name').textContent = activity.name;
    document.getElementById('ad-duration').value = 30;
    updateActivityPreview();
}

function updateActivityPreview() {
    if(!selectedActivity) return;
    const dur = parseInt(document.getElementById('ad-duration').value) || 0;
    const weight = appData.profile.weight || 70;
    const cals = Calculations.calculateExerciseCalories(selectedActivity.met, weight, dur);
    document.getElementById('ad-cal').value = cals;
}

document.getElementById('ad-duration').addEventListener('input', updateActivityPreview);

document.getElementById('btn-save-activity').addEventListener('click', () => {
    if(!selectedActivity) return;
    const dur = parseInt(document.getElementById('ad-duration').value) || 0;
    const cals = parseInt(document.getElementById('ad-cal').value) || 0;
    
    const log = getTodayLog();
    log.activity.push({
        id: Date.now(),
        name: selectedActivity.name,
        duration: dur,
        calories: cals
    });
    
    StorageUtils.saveData(appData);
    document.getElementById('activity-detail-panel').classList.add('hidden');
    showToast("Activity logged!");
    renderActivityLog();
});

function renderActivityLog() {
    const list = document.getElementById('activity-log-list');
    const act = getTodayLog().activity;
    
    if(act.length === 0) {
        list.innerHTML = `<p class="text-secondary text-center mt-15">No activities logged yet.</p>`;
        return;
    }
    
    list.innerHTML = '';
    act.forEach(a => {
        const div = document.createElement('div');
        div.className = 'log-item';
        div.innerHTML = `
            <div class="log-info">
                <div class="log-icon" style="color:var(--secondary); background:rgba(239, 68, 68, 0.1)"><ion-icon name="flame"></ion-icon></div>
                <div class="log-details">
                    <h4>${a.name}</h4>
                    <p>${a.duration} mins</p>
                </div>
            </div>
            <div>
                <span class="log-calories" style="color:var(--secondary)">-${a.calories}</span>
                <button class="delete-btn" onclick="deleteItem(${a.id}, 'activity')"><ion-icon name="trash-outline"></ion-icon></button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Delete item
window.deleteItem = function(id, type) {
    const log = getTodayLog();
    log[type] = log[type].filter(item => item.id !== id);
    StorageUtils.saveData(appData);
    
    if(type === 'food') renderFoodLog();
    if(type === 'activity') renderActivityLog();
};

// --- Water Tracking ---
document.querySelectorAll('.water-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const vol = parseInt(e.target.dataset.vol);
        const log = getTodayLog();
        log.water += vol;
        StorageUtils.saveData(appData);
        showToast(`+${vol}ml water added!`);
        
        // Update dashboard directly if we are on it
        if(document.getElementById('tab-home').classList.contains('active-section')) {
            renderDashboard();
        }
        checkStreaks();
    });
});

// --- Progress & Weight ---
function renderProgress() {
    const current = appData.profile.weight;
    const goal = appData.profile.goalWeight || 0;
    
    document.getElementById('prog-current-weight').textContent = `${current} kg`;
    document.getElementById('prog-goal-weight').textContent = goal ? `${goal} kg` : 'Not Set';
    
    document.getElementById('streak-days').textContent = calculateLogStreak();
    document.getElementById('streak-water').textContent = calculateWaterStreak();
}

document.getElementById('btn-save-weight').addEventListener('click', () => {
    const newWt = parseFloat(document.getElementById('new-weight-input').value);
    if(newWt > 0) {
        appData.profile.weight = newWt;
        getTodayLog().weight = newWt;
        StorageUtils.saveData(appData);
        
        // Recalculate targets based on new weight
        const bmr = Calculations.calculateBMR(appData.profile.gender, newWt, appData.profile.height, appData.profile.age);
        const actMult = Calculations.getActivityMultiplier(appData.profile.activityLevel);
        const tdee = Calculations.calculateTDEE(bmr, actMult);
        const targetCals = Calculations.calculateTargetCalories(tdee, appData.profile.goal);
        const macros = Calculations.calculateMacros(targetCals, appData.profile.goal);
        
        appData.targets = { calories: targetCals, ...macros };
        StorageUtils.saveData(appData);

        renderProgress();
        showToast("Weight updated!");
        document.getElementById('new-weight-input').value = '';
    }
});

// --- Streaks Logic ---
function calculateLogStreak() {
    let streak = 0;
    let d = new Date();
    while(true) {
        const ds = d.toISOString().split('T')[0];
        if(appData.dailyLogs[ds] && appData.dailyLogs[ds].food.length > 0) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

function calculateWaterStreak() {
    let streak = 0;
    let d = new Date();
    const target = appData.targets.water || 3000;
    while(true) {
        const ds = d.toISOString().split('T')[0];
        if(appData.dailyLogs[ds] && appData.dailyLogs[ds].water >= target) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

function checkStreaks() {
    // Only visual update logic can go here, actual logic is calculated on demand in renderProgress
}


// --- Settings ---
document.getElementById('btn-export-data').addEventListener('click', () => {
    StorageUtils.exportData();
});

document.getElementById('btn-reset-data').addEventListener('click', () => {
    if(confirm("Are you sure you want to delete all local data? This cannot be undone.")) {
        StorageUtils.resetData();
        location.reload();
    }
});

// --- Toast Util ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Start App
init();
