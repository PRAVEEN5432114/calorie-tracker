/**
 * FitTrack App Logic (Sci-Fi Minimal)
 */

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('SW Registered'))
        .catch(err => console.log('SW Failed', err));
}

let appData = null;
let currentDate = new Date().toISOString().split('T')[0];

// --- Init ---
function init() {
    appData = StorageUtils.getData();
    
    // Ensure today exists
    if (!appData.days[currentDate]) {
        appData.days[currentDate] = { foods: [], exercises: [], weight: null };
    }
    
    document.getElementById('date-display').textContent = new Date().toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'}).toUpperCase();
    document.getElementById('inp-target').value = appData.settings.calorieTarget;
    
    setupAutocompletes();
    renderDashboard();
}

// --- Render Core Dashboard ---
function renderDashboard() {
    const today = appData.days[currentDate];
    const target = appData.settings.calorieTarget || 2000;
    
    const { eaten, burned, net } = Calculations.getTotals(today);
    const remaining = Math.max(0, target - eaten);
    const pct = Math.min(100, Math.round((eaten / target) * 100)) || 0;
    
    // Update text
    document.getElementById('ui-eaten').textContent = eaten;
    document.getElementById('ui-eaten-small').textContent = eaten;
    document.getElementById('ui-burned').textContent = burned;
    document.getElementById('ui-net').textContent = net;
    document.getElementById('ui-target').innerHTML = `${target} <span>KCAL</span>`;
    document.getElementById('ui-rem').innerHTML = `${remaining} <span>KCAL</span>`;
    document.getElementById('ui-pct').textContent = `${pct}%`;
    
    // Update SVG Ring
    const ring = document.getElementById('cal-ring');
    const circumference = 2 * Math.PI * 45; // 283
    const offset = circumference - (pct / 100) * circumference;
    ring.style.strokeDasharray = `${circumference}, ${circumference}`;
    ring.style.strokeDashoffset = offset;
    
    if (eaten > target) {
        ring.classList.add('over');
        document.getElementById('ui-eaten').style.color = 'var(--neon-red)';
    } else {
        ring.classList.remove('over');
        document.getElementById('ui-eaten').style.color = 'var(--text-main)';
    }

    renderStream(today);
    renderChart();
}

// --- Activity Stream ---
function renderStream(today) {
    const stream = document.getElementById('activity-stream');
    let logs = [];
    
    today.foods.forEach(f => logs.push({ ...f, isFood: true, time: f.time || '00:00' }));
    today.exercises.forEach(e => logs.push({ ...e, isFood: false, time: e.time || '00:00' }));
    
    // Sort by creation time if available, otherwise just order added
    logs.sort((a, b) => a.id - b.id);
    
    if (logs.length === 0) {
        stream.innerHTML = `<div class="stream-item" style="justify-content:center; color:var(--text-muted)">NO DATA DETECTED</div>`;
        return;
    }
    
    stream.innerHTML = '';
    logs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'stream-item';
        const typeStr = log.isFood ? 'FOOD' : 'EXER';
        const nameStr = log.name || (log.isFood ? 'QUICK KCAL' : 'ACTIVITY');
        const valStr = log.isFood ? `+${log.calories}` : `-${log.calories}`;
        const valClass = log.isFood ? 'val-pos' : 'val-neg';
        
        item.innerHTML = `
            <span class="stream-time">${typeStr}</span>
            <span class="stream-name">${nameStr}</span>
            <span class="stream-val ${valClass}">${valStr}</span>
            <button class="stream-del" onclick="deleteLog(${log.id}, ${log.isFood})">×</button>
        `;
        stream.appendChild(item);
    });
}

window.deleteLog = function(id, isFood) {
    const today = appData.days[currentDate];
    if (isFood) {
        today.foods = today.foods.filter(f => f.id !== id);
    } else {
        today.exercises = today.exercises.filter(e => e.id !== id);
    }
    StorageUtils.saveData(appData);
    renderDashboard();
    showToast("ENTRY DELETED");
};

// --- Custom Canvas Chart ---
function renderChart() {
    const canvas = document.getElementById('weekly-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Setup high-DPI canvas
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const w = rect.width;
    const h = rect.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // Get last 7 days data
    let daysData = [];
    let d = new Date();
    d.setDate(d.getDate() - 6); // start 6 days ago
    
    let maxKcal = appData.settings.calorieTarget || 2000;
    
    for (let i = 0; i < 7; i++) {
        const dateStr = d.toISOString().split('T')[0];
        const day = appData.days[dateStr];
        let eaten = 0, burned = 0;
        if (day) {
            const totals = Calculations.getTotals(day);
            eaten = totals.eaten;
            burned = totals.burned;
        }
        daysData.push({ eaten, burned });
        if (eaten > maxKcal) maxKcal = eaten;
        d.setDate(d.getDate() + 1);
    }
    
    // Add padding to max
    maxKcal = Math.max(maxKcal * 1.2, 500); 
    
    const drawLine = (dataKey, color, isDashed = false) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        if (isDashed) ctx.setLineDash([5, 5]);
        else ctx.setLineDash([]);
        
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        for (let i = 0; i < 7; i++) {
            const val = typeof dataKey === 'number' ? dataKey : daysData[i][dataKey];
            const x = (w / 6) * i;
            const y = h - ((val / maxKcal) * (h - 20)) - 10;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            
            // Draw point
            if (!isDashed) {
                ctx.fillStyle = '#02060A';
                ctx.fillRect(x - 2, y - 2, 4, 4);
                ctx.strokeRect(x - 2, y - 2, 4, 4);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]); // reset
    };

    // Draw Target Line
    drawLine(appData.settings.calorieTarget, 'rgba(255, 176, 0, 0.5)', true);
    // Draw Eaten Line
    drawLine('eaten', '#00E5FF');
    // Draw Burned Line
    drawLine('burned', '#00FF9C');
}

// --- Modals & Data Entry ---
window.openModal = function(id) {
    document.getElementById(id).classList.remove('hidden');
};

window.closeModal = function(id) {
    document.getElementById(id).classList.add('hidden');
    // Reset inputs
    document.querySelectorAll(`#${id} input`).forEach(inp => {
        if(inp.id !== 'inp-food-qty' && inp.id !== 'inp-ex-dur') inp.value = '';
    });
};

function padZero(n) { return n < 10 ? '0'+n : n; }
function getCurrentTime() {
    const now = new Date();
    return `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
}

window.saveFood = function() {
    const name = document.getElementById('inp-food-name').value.trim() || 'Custom Food';
    const cal = parseInt(document.getElementById('inp-food-cal').value);
    const qty = parseFloat(document.getElementById('inp-food-qty').value) || 1;
    
    if (!cal || cal < 0) return alert('INVALID CALORIES');
    
    const totalCal = Math.round(cal * qty);
    
    appData.days[currentDate].foods.push({
        id: Date.now(),
        name: name,
        calories: totalCal,
        time: getCurrentTime()
    });
    
    StorageUtils.saveData(appData);
    closeModal('food-modal');
    renderDashboard();
    showToast("FOOD LOGGED");
};

window.saveQuickCal = function() {
    const cal = parseInt(document.getElementById('inp-qk-cal').value);
    if (!cal || cal < 0) return alert('INVALID CALORIES');
    
    appData.days[currentDate].foods.push({
        id: Date.now(),
        name: 'QUICK KCAL',
        calories: cal,
        time: getCurrentTime()
    });
    
    StorageUtils.saveData(appData);
    closeModal('quick-cal-modal');
    renderDashboard();
    showToast("CALORIES LOGGED");
};

window.saveExercise = function() {
    const name = document.getElementById('inp-ex-name').value.trim() || 'Custom Activity';
    const cal = parseInt(document.getElementById('inp-ex-cal').value);
    
    if (!cal || cal < 0) return alert('INVALID CALORIES');
    
    appData.days[currentDate].exercises.push({
        id: Date.now(),
        name: name,
        calories: cal,
        time: getCurrentTime()
    });
    
    StorageUtils.saveData(appData);
    closeModal('exercise-modal');
    renderDashboard();
    showToast("EXERCISE LOGGED");
};

window.saveWeight = function() {
    const wt = parseFloat(document.getElementById('inp-weight').value);
    if (!wt || wt < 0) return alert('INVALID WEIGHT');
    
    appData.days[currentDate].weight = wt;
    StorageUtils.saveData(appData);
    closeModal('weight-modal');
    showToast("WEIGHT LOGGED");
};

window.saveTarget = function() {
    const t = parseInt(document.getElementById('inp-target').value);
    if (!t || t < 500) return alert('INVALID TARGET');
    
    appData.settings.calorieTarget = t;
    StorageUtils.saveData(appData);
    closeModal('settings-modal');
    renderDashboard();
    showToast("TARGET SAVED");
};

window.exportData = function() {
    StorageUtils.exportData();
};

// --- Autocomplete Setup ---
let selectedSugg = null;
function setupAutocompletes() {
    // Food
    const fInp = document.getElementById('inp-food-name');
    const fSugg = document.getElementById('sugg-food');
    const fCal = document.getElementById('inp-food-cal');
    
    fInp.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        fSugg.innerHTML = '';
        if(!val) { fSugg.style.display = 'none'; return; }
        
        const matches = window.foodDatabase.filter(x => x.name.toLowerCase().includes(val)).slice(0, 5);
        if (matches.length > 0) {
            fSugg.style.display = 'block';
            matches.forEach(m => {
                const div = document.createElement('div');
                div.className = 'sugg-item';
                div.innerHTML = `${m.name} <span>${m.calories} KCAL</span>`;
                div.onpointerdown = (ev) => {
                    ev.preventDefault(); // Prevents input blur on mobile
                    fInp.value = m.name;
                    fCal.value = m.calories;
                    fSugg.style.display = 'none';
                };
                fSugg.appendChild(div);
            });
        } else {
            fSugg.style.display = 'none';
        }
    });

    // Exercise
    const eInp = document.getElementById('inp-ex-name');
    const eSugg = document.getElementById('sugg-ex');
    const eCal = document.getElementById('inp-ex-cal');
    const eDur = document.getElementById('inp-ex-dur');
    
    let currentEx = null;

    eInp.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        eSugg.innerHTML = '';
        currentEx = null;
        if(!val) { eSugg.style.display = 'none'; return; }
        
        const matches = window.activityDatabase.filter(x => x.name.toLowerCase().includes(val)).slice(0, 5);
        if (matches.length > 0) {
            eSugg.style.display = 'block';
            matches.forEach(m => {
                const div = document.createElement('div');
                div.className = 'sugg-item';
                div.innerHTML = `${m.name} <span>~${m.caloriesPerMinute}/MIN</span>`;
                div.onpointerdown = (ev) => {
                    ev.preventDefault();
                    eInp.value = m.name;
                    currentEx = m;
                    updateExCal();
                    eSugg.style.display = 'none';
                };
                eSugg.appendChild(div);
            });
        } else {
            eSugg.style.display = 'none';
        }
    });

    const updateExCal = () => {
        if(currentEx) {
            const dur = parseInt(eDur.value) || 0;
            eCal.value = dur * currentEx.caloriesPerMinute;
        }
    };
    eDur.addEventListener('input', updateExCal);

    // Hide suggestions on click outside
    document.addEventListener('click', (e) => {
        if(e.target !== fInp) fSugg.style.display = 'none';
        if(e.target !== eInp) eSugg.style.display = 'none';
    });
}

// --- Toast ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Init
init();
