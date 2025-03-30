import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import config from '../config';

const Dashboard: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [liftType, setLiftType] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${config.apiUrl}/api/lifts`,
        {
          lift_type: liftType,
          weight: parseFloat(weight),
          reps: parseInt(reps),
          rpe: parseFloat(rpe),
          notes,
          date: date ? date.toISOString() : new Date().toISOString()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLiftType('');
      setWeight('');
      setReps('');
      setRpe('');
      setNotes('');
      setDate(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to record lift');
      console.error('Error recording lift:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Record Your Lift
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Lift Type"
                value={liftType}
                onChange={(e) => setLiftType(e.target.value)}
                required
              >
                <MenuItem value="bench">Bench Press</MenuItem>
                <MenuItem value="squat">Squat</MenuItem>
                <MenuItem value="deadlift">Deadlift</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (lbs)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                inputProps={{ 
                  style: { 
                    WebkitAppearance: 'textfield',
                    MozAppearance: 'textfield'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
                inputProps={{ 
                  style: { 
                    WebkitAppearance: 'textfield',
                    MozAppearance: 'textfield'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="RPE (1-10)"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                required
              >
                {/* Whole numbers from 1-6 */}
                {Array.from({ length: 6 }, (_, i) => i + 1).map((value) => (
                  <MenuItem key={value} value={value.toString()}>
                    {value}
                  </MenuItem>
                ))}
                {/* 0.5 increments from 6.5-10 */}
                {Array.from({ length: 8 }, (_, i) => 6.5 + (i * 0.5)).map((value) => (
                  <MenuItem key={value} value={value.toString()}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  maxDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Record Lift
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard; 