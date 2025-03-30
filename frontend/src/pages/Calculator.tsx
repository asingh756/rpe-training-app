import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import axios from 'axios';
import config from '../config';

const Calculator: React.FC = () => {
  const [formData, setFormData] = useState({
    weight: '',
    reps: '',
    rpe: '',
  });
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleLiftTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newLiftType: string | null,
  ) => {
    if (newLiftType !== null) {
      setFormData(prev => ({
        ...prev,
        lift_type: newLiftType
      }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to use the calculator');
        return;
      }

      const response = await axios.post(
        `${config.apiUrl}/api/one-rep-max`,
        {
          weight: formData.weight,
          reps: formData.reps,
          rpe: formData.rpe
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResult(response.data.projected_1rm);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError(err.response?.data?.error || 'Failed to calculate 1RM');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          1RM Calculator
        </Typography>

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Weight (lbs)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 0, step: 0.5 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reps"
                  name="reps"
                  type="number"
                  value={formData.reps}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1, step: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="RPE"
                  name="rpe"
                  type="number"
                  value={formData.rpe}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1, max: 10, step: 0.5 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Calculate 1RM
                </Button>
              </Grid>
            </Grid>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result !== null && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Your estimated 1RM is: {result.toFixed(1)} lbs
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Calculator; 