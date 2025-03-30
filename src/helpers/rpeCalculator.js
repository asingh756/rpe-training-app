// RPE Multiplier Chart
const RPE_MULTIPLIERS = {
    10: [1.00, 0.955, 0.922, 0.892, 0.863, 0.835, 0.808, 0.782],
    9.5: [0.978, 0.939, 0.907, 0.878, 0.848, 0.822, 0.795, 0.769],
    9: [0.955, 0.922, 0.892, 0.863, 0.835, 0.808, 0.782, 0.757],
    8.5: [0.939, 0.907, 0.878, 0.848, 0.822, 0.795, 0.769, 0.744],
    8: [0.922, 0.892, 0.863, 0.835, 0.808, 0.782, 0.757, 0.733],
    7.5: [0.907, 0.878, 0.848, 0.822, 0.795, 0.769, 0.744, 0.720],
    7: [0.892, 0.863, 0.835, 0.808, 0.782, 0.757, 0.733, 0.709],
    6.5: [0.878, 0.848, 0.822, 0.795, 0.769, 0.744, 0.720, 0.697],
    6: [0.863, 0.835, 0.808, 0.782, 0.757, 0.733, 0.709, 0.686],
    5.5: [0.848, 0.822, 0.795, 0.769, 0.744, 0.720, 0.697, 0.674],
    5: [0.835, 0.808, 0.782, 0.757, 0.733, 0.709, 0.686, 0.663],
    4.5: [0.822, 0.795, 0.769, 0.744, 0.720, 0.697, 0.674, 0.653],
    4: [0.808, 0.782, 0.757, 0.733, 0.709, 0.686, 0.663, 0.642],
    3.5: [0.795, 0.769, 0.744, 0.720, 0.697, 0.674, 0.653, 0.632],
    3: [0.782, 0.757, 0.733, 0.709, 0.686, 0.663, 0.642, 0.622],
    2.5: [0.769, 0.744, 0.720, 0.697, 0.674, 0.653, 0.632, 0.612],
    2: [0.757, 0.733, 0.709, 0.686, 0.663, 0.642, 0.622, 0.602],
    1.5: [0.744, 0.720, 0.697, 0.674, 0.653, 0.632, 0.612, 0.592],
    1: [0.733, 0.709, 0.686, 0.663, 0.642, 0.622, 0.602, 0.583]
};

class RPECalculator {
    static calculateOneRepMax(weight, reps, rpe) {
        // Round RPE to nearest 0.5
        const roundedRPE = Math.round(rpe * 2) / 2;
        
        // For reps 1-8, use the RPE multiplier chart
        if (reps <= 8) {
            const multiplier = RPE_MULTIPLIERS[roundedRPE][reps - 1];
            return weight / multiplier;
        }
        
        // For reps > 8, use the Brzycki formula with RPE adjustment
        // Brzycki formula: 1RM = weight × (36 / (37 - reps))
        // RPE adjustment: multiply by (1 + (10 - RPE) * 0.03)
        const brzyckiMultiplier = 36 / (37 - reps);
        const rpeAdjustment = 1 + (10 - roundedRPE) * 0.03;
        return weight * brzyckiMultiplier * rpeAdjustment;
    }

    static validateInputs(weight, reps, rpe) {
        const errors = [];

        if (!weight || !reps || !rpe) {
            errors.push('Missing required parameters. Please provide weight, reps, and rpe.');
            return { isValid: false, errors };
        }

        // Convert parameters to numbers
        const weightNum = parseFloat(weight);
        const repsNum = parseInt(reps);
        const rpeNum = parseFloat(rpe);

        // Validate numeric values
        if (isNaN(weightNum) || isNaN(repsNum) || isNaN(rpeNum)) {
            errors.push('Invalid parameters. Please provide valid numbers.');
            return { isValid: false, errors };
        }

        // Validate ranges
        if (repsNum < 1) {
            errors.push('Reps must be greater than 0.');
        }

        if (rpeNum < 1 || rpeNum > 10) {
            errors.push('RPE must be between 1 and 10.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = RPECalculator; 