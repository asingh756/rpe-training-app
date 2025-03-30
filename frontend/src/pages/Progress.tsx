import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Lift {
  id: number;
  lift_type: string;
  weight: number;
  reps: number;
  rpe: number;
  notes: string;
  created_at: string;
}

const Progress: React.FC = () => {
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLiftType, setSelectedLiftType] = useState<string>('');
  const [liftTypes, setLiftTypes] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLifts();
  }, [selectedDate, selectedLiftType]);

  const fetchLifts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const params = new URLSearchParams();
      if (selectedDate) {
        params.append('date', selectedDate.toISOString());
      }
      if (selectedLiftType) {
        params.append('lift_type', selectedLiftType);
      }

      const response = await axios.get(`/api/lifts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setLifts(response.data);

      // Extract unique lift types from the response
      const types = [...new Set(response.data.map((lift: Lift) => lift.lift_type))];
      setLiftTypes(types);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch lifts');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lift History
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                maxDate={new Date()}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Lift Type"
              value={selectedLiftType}
              onChange={(e) => setSelectedLiftType(e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              {liftTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Lift Type</TableCell>
                <TableCell align="right">Weight (lbs)</TableCell>
                <TableCell align="right">Reps</TableCell>
                <TableCell align="right">RPE</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lifts.map((lift) => (
                <TableRow key={lift.id}>
                  <TableCell>
                    {new Date(lift.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{lift.lift_type}</TableCell>
                  <TableCell align="right">{lift.weight}</TableCell>
                  <TableCell align="right">{lift.reps}</TableCell>
                  <TableCell align="right">{lift.rpe}</TableCell>
                  <TableCell>{lift.notes}</TableCell>
                </TableRow>
              ))}
              {lifts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No lifts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Progress; 