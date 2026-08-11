/**
 * FitTrack Calculations (Minimal)
 */

const Calculations = {
    getTotals: (dayData) => {
        let eaten = 0;
        let burned = 0;

        if (dayData) {
            if (dayData.foods) {
                eaten = dayData.foods.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
            }
            if (dayData.exercises) {
                burned = dayData.exercises.reduce((sum, e) => sum + (Number(e.calories) || 0), 0);
            }
        }

        const net = eaten - burned;
        return { eaten, burned, net };
    }
};

window.Calculations = Calculations;
