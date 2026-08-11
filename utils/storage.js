/**
 * FitTrack Storage (v3 - Minimal Sci-Fi)
 */

const StorageUtils = {
    VERSION: 'fittrack_data_v3',
    
    defaultData: {
        settings: {
            calorieTarget: 2000,
            theme: "cyber"
        },
        days: {}
    },

    getData: () => {
        try {
            let data = localStorage.getItem(StorageUtils.VERSION);
            if (data) {
                return JSON.parse(data);
            }
            
            // Check for v2 data to migrate
            let v2Data = localStorage.getItem('fittrack_data_v2');
            if (v2Data) {
                return StorageUtils.migrateV2toV3(JSON.parse(v2Data));
            }

            return { ...StorageUtils.defaultData, days: {} };
        } catch (e) {
            console.error("Storage error, resetting", e);
            return { ...StorageUtils.defaultData, days: {} };
        }
    },

    saveData: (data) => {
        try {
            localStorage.setItem(StorageUtils.VERSION, JSON.stringify(data));
        } catch (e) {
            console.error("Save error", e);
        }
    },

    migrateV2toV3: (v2Data) => {
        const newData = {
            settings: {
                calorieTarget: (v2Data.targets && v2Data.targets.calories) ? v2Data.targets.calories : 2000,
                theme: "cyber"
            },
            days: {}
        };

        if (v2Data.dailyLogs) {
            for (const [date, log] of Object.entries(v2Data.dailyLogs)) {
                newData.days[date] = {
                    foods: (log.food || []).map(f => ({
                        id: f.id || Date.now() + Math.random(),
                        name: f.name,
                        calories: f.calories
                    })),
                    exercises: (log.activity || []).map(a => ({
                        id: a.id || Date.now() + Math.random(),
                        name: a.name,
                        duration: a.duration,
                        calories: a.calories
                    })),
                    weight: log.weight || null
                };
            }
        }
        return newData;
    },

    exportData: () => {
        try {
            const dataStr = localStorage.getItem(StorageUtils.VERSION);
            if(!dataStr) return;
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fittrack_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch(e) {
            alert("Export failed");
        }
    },

    resetData: () => {
        localStorage.removeItem(StorageUtils.VERSION);
        localStorage.removeItem('fittrack_data_v2');
        localStorage.removeItem('fitTrackData');
    }
};

window.StorageUtils = StorageUtils;
