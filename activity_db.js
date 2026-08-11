/**
 * FitTrack Activity Database (Minimal)
 * caloriesPerMinute is based on a roughly 70kg person.
 */

const activityDatabase = [
    { name: "Walking (Leisure)", caloriesPerMinute: 4 },
    { name: "Walking (Brisk)", caloriesPerMinute: 6 },
    { name: "Running (Moderate)", caloriesPerMinute: 11 },
    { name: "Running (Fast)", caloriesPerMinute: 15 },
    { name: "Cycling (Leisure)", caloriesPerMinute: 6 },
    { name: "Cycling (Vigorous)", caloriesPerMinute: 10 },
    { name: "Swimming", caloriesPerMinute: 8 },
    { name: "Weight Training", caloriesPerMinute: 5 },
    { name: "Yoga", caloriesPerMinute: 3 },
    { name: "HIIT", caloriesPerMinute: 12 },
    { name: "Jump Rope", caloriesPerMinute: 12 },
    { name: "Cricket / Sports", caloriesPerMinute: 7 },
    { name: "Dancing", caloriesPerMinute: 6 }
];

window.activityDatabase = activityDatabase;
