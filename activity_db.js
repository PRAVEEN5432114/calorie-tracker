/**
 * FitTrack Activity Database
 * Uses MET (Metabolic Equivalent of Task) for calorie calculations.
 * Formula: Calories = MET * Weight(kg) * Duration(hrs)
 */

const activityDatabase = [
    // Walking & Running
    { name: "Walking (Leisure, 3mph)", met: 3.5, category: "Cardio" },
    { name: "Walking (Brisk, 4mph)", met: 5.0, category: "Cardio" },
    { name: "Running (5mph / 12min mile)", met: 8.3, category: "Cardio" },
    { name: "Running (6mph / 10min mile)", met: 9.8, category: "Cardio" },
    { name: "Running (8mph / 7.5min mile)", met: 13.5, category: "Cardio" },
    { name: "Jogging (General)", met: 7.0, category: "Cardio" },
    
    // Cycling
    { name: "Cycling (Leisure, 10mph)", met: 4.0, category: "Cardio" },
    { name: "Cycling (Moderate, 12-14mph)", met: 8.0, category: "Cardio" },
    { name: "Cycling (Vigorous, 16-19mph)", met: 12.0, category: "Cardio" },
    { name: "Stationary Bike (Moderate)", met: 6.8, category: "Gym" },
    
    // Swimming
    { name: "Swimming (Freestyle, Light)", met: 5.8, category: "Cardio" },
    { name: "Swimming (Freestyle, Vigorous)", met: 9.8, category: "Cardio" },
    
    // Gym & Fitness
    { name: "Weight Training (Light/Moderate)", met: 3.5, category: "Gym" },
    { name: "Weight Training (Vigorous)", met: 6.0, category: "Gym" },
    { name: "Yoga (Hatha)", met: 2.5, category: "Mind/Body" },
    { name: "Yoga (Power/Vinyasa)", met: 4.0, category: "Mind/Body" },
    { name: "Pilates", met: 3.0, category: "Mind/Body" },
    { name: "HIIT", met: 8.0, category: "Gym" },
    { name: "Aerobics (High Impact)", met: 7.3, category: "Gym" },
    { name: "Jump Rope (Moderate)", met: 10.0, category: "Cardio" },
    { name: "Jump Rope (Fast)", met: 12.0, category: "Cardio" },
    { name: "Rowing Machine (Moderate)", met: 7.0, category: "Gym" },
    { name: "Stair Climber", met: 9.0, category: "Gym" },
    { name: "Elliptical Trainer", met: 5.0, category: "Gym" },

    // Sports
    { name: "Cricket (Batting/Bowling)", met: 4.8, category: "Sports" },
    { name: "Cricket (Fielding)", met: 5.0, category: "Sports" },
    { name: "Badminton (Competitive)", met: 7.0, category: "Sports" },
    { name: "Badminton (Social)", met: 5.5, category: "Sports" },
    { name: "Football (Soccer, Competitive)", met: 10.0, category: "Sports" },
    { name: "Football (Social/Casual)", met: 7.0, category: "Sports" },
    { name: "Basketball (Game)", met: 8.0, category: "Sports" },
    { name: "Tennis (Singles)", met: 8.0, category: "Sports" },
    { name: "Tennis (Doubles)", met: 5.0, category: "Sports" },

    // Lifestyle & Activities
    { name: "Dancing (General)", met: 5.0, category: "Lifestyle" },
    { name: "Hiking", met: 6.0, category: "Outdoor" },
    { name: "House Cleaning (Vigorous)", met: 3.5, category: "Lifestyle" },
    { name: "Gardening", met: 4.0, category: "Lifestyle" },
    { name: "Sitting / Working at Desk", met: 1.5, category: "Lifestyle" },
    { name: "Sleeping", met: 0.9, category: "Lifestyle" }
];

window.activityDatabase = activityDatabase;
