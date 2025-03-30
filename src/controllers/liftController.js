const db = require('../config/database');
const RPECalculator = require('../helpers/rpeCalculator');

class LiftController {
    async recordLift(req, res) {
        const { lift_type, weight, reps, rpe, notes, date } = req.body;
        const userId = req.user.id;

        try {
            // Detailed validation
            const validationErrors = [];

            // Validate lift_type
            if (!lift_type) {
                validationErrors.push('Lift type is required');
            } else if (typeof lift_type !== 'string') {
                validationErrors.push('Lift type must be a string');
            }

            // Validate weight
            if (!weight) {
                validationErrors.push('Weight is required');
            } else if (isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
                validationErrors.push('Weight must be a positive number');
            }

            // Validate reps
            if (!reps) {
                validationErrors.push('Reps is required');
            } else if (isNaN(parseInt(reps)) || parseInt(reps) <= 0 || !Number.isInteger(Number(reps))) {
                validationErrors.push('Reps must be a positive integer');
            }

            // Validate RPE
            if (!rpe) {
                validationErrors.push('RPE is required');
            } else if (isNaN(parseFloat(rpe)) || parseFloat(rpe) < 1 || parseFloat(rpe) > 10) {
                validationErrors.push('RPE must be a number between 1 and 10');
            }

            // Validate date if provided
            if (date) {
                const parsedDate = new Date(date);
                if (isNaN(parsedDate.getTime())) {
                    validationErrors.push('Invalid date format');
                } else if (parsedDate > new Date()) {
                    validationErrors.push('Date cannot be in the future');
                }
            }

            // Return validation errors if any
            if (validationErrors.length > 0) {
                return res.status(400).json({ 
                    error: 'Validation failed',
                    details: validationErrors 
                });
            }

            // Parse numeric values
            const parsedWeight = parseFloat(weight);
            const parsedReps = parseInt(reps);
            const parsedRPE = parseFloat(rpe);

            // Format the date
            const liftDate = date ? new Date(date).toISOString() : new Date().toISOString();

            // Insert lift record
            db.run(
                'INSERT INTO lifts (user_id, lift_type, weight, reps, rpe, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, lift_type, parsedWeight, parsedReps, parsedRPE, notes || '', liftDate],
                function(err) {
                    if (err) {
                        console.error('Database error recording lift:', err);
                        return res.status(500).json({ 
                            error: 'Failed to record lift',
                            details: err.message 
                        });
                    }

                    res.status(201).json({ 
                        message: 'Lift recorded successfully',
                        liftId: this.lastID,
                        date: liftDate
                    });
                }
            );
        } catch (error) {
            console.error('Unexpected error in recordLift:', error);
            res.status(500).json({ 
                error: 'Failed to record lift',
                details: error.message 
            });
        }
    }

    async getLifts(req, res) {
        const userId = req.user.id;
        const { date, lift_type } = req.query;

        try {
            let query = 'SELECT * FROM lifts WHERE user_id = ?';
            const params = [userId];

            // Add date filter if provided
            if (date) {
                query += ' AND DATE(created_at) = DATE(?)';
                params.push(date);
            }

            // Add lift type filter if provided
            if (lift_type) {
                query += ' AND lift_type = ?';
                params.push(lift_type);
            }

            // Order by date descending
            query += ' ORDER BY created_at DESC';

            db.all(query, params, (err, lifts) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to fetch lifts' });
                }
                res.json(lifts);
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch lifts' });
        }
    }

    async calculateOneRepMax(req, res) {
        const { weight, reps, rpe } = req.body;

        try {
            const validation = RPECalculator.validateInputs(weight, reps, rpe);
            if (!validation.isValid) {
                return res.status(400).json({ errors: validation.errors });
            }

            const projected1RM = RPECalculator.calculateOneRepMax(
                parseFloat(weight),
                parseInt(reps),
                parseFloat(rpe)
            );

            res.json({ projected_1rm: projected1RM });
        } catch (error) {
            res.status(500).json({ error: 'Failed to calculate 1RM' });
        }
    }

    async getOneRepMaxHistory(req, res) {
        const userId = req.user.id;
        const { lift_type } = req.query;

        try {
            let query = 'SELECT * FROM one_rep_max WHERE user_id = ?';
            const params = [userId];

            if (lift_type) {
                query += ' AND lift_type = ?';
                params.push(lift_type);
            }

            query += ' ORDER BY date DESC';

            db.all(query, params, (err, history) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to fetch 1RM history' });
                }
                res.json(history);
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch 1RM history' });
        }
    }
}

module.exports = new LiftController(); 