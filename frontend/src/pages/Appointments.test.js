import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Appointments from './Appointments'; // Adjust the import path if needed
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios
const mockAxios = new MockAdapter(axios);

describe('Appointments Component', () => {
  let token = 'dummyToken';

  beforeEach(() => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('role', 'therapist');
    localStorage.setItem('userId', '123');
    localStorage.setItem('username', 'testUser');
  });  
     
  afterEach(() => {
    mockAxios.reset();
    localStorage.clear();
  });

  test('fetches and displays therapists', async () => {
    mockAxios.onGet('http://localhost:5001/api/appointments/therapists').reply(200, [
      { _id: '1', name: 'Therapist 1' },
      { _id: '2', name: 'Therapist 2' },
    ]);

    render(<Appointments />);

    await waitFor(() => screen.getByText('Therapist 1'));

    expect(screen.getByText('Therapist 1')).toBeInTheDocument();
    expect(screen.getByText('Therapist 2')).toBeInTheDocument();
  });

  test('fetches and displays appointments', async () => {
    mockAxios.onGet('http://localhost:5001/api/appointments').reply(200, [
      { _id: '1', status: 'pending', date: '2025-05-01T09:00:00' },
      { _id: '2', status: 'confirmed', date: '2025-05-02T10:00:00' },
    ]);

    render(<Appointments />);

    await waitFor(() => screen.getByText('Pending'));

    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  test('opens and closes the booking modal', () => {
    render(<Appointments />);

    const bookButton = screen.getByText('Book Appointment'); // Assuming there's a button like this
    fireEvent.click(bookButton);

    expect(screen.getByText('Book Appointment')).toBeInTheDocument(); // Check modal is visible

    const closeButton = screen.getByText('Cancel'); // Assuming there's a button to close the modal
    fireEvent.click(closeButton);

    expect(screen.queryByText('Book Appointment')).not.toBeInTheDocument(); // Check modal is closed
  });

  test('submits the booking form successfully', async () => {
    mockAxios.onPost('http://localhost:5001/api/appointments/book').reply(200, { message: 'Appointment booked' });

    render(<Appointments />);

    fireEvent.click(screen.getByText('Book Appointment'));

    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '09:00' } });

    const submitButton = screen.getByText('Confirm Booking');
    fireEvent.click(submitButton);

    await waitFor(() => screen.getByText('Appointment booked'));

    expect(screen.getByText('Appointment booked')).toBeInTheDocument();
  });

  test('shows error message when booking fails', async () => {
    mockAxios.onPost('http://localhost:5001/api/appointments/book').reply(500, { message: 'Booking failed' });

    render(<Appointments />);

    fireEvent.click(screen.getByText('Book Appointment'));

    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '09:00' } });

    const submitButton = screen.getByText('Confirm Booking');
    fireEvent.click(submitButton);

    await waitFor(() => screen.getByText('Booking failed'));

    expect(screen.getByText('Booking failed')).toBeInTheDocument();
  });

  test('fetches and displays slots for booking', async () => {
    mockAxios.onGet('http://localhost:5001/api/appointments/slots').reply(200, ['09:00', '10:00']);

    render(<Appointments />);

    const bookButton = screen.getByText('Book Appointment');
    fireEvent.click(bookButton);

    const timeSelect = screen.getByLabelText(/Time/i);
    fireEvent.change(timeSelect, { target: { value: '09:00' } });

    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  test('reschedules an appointment successfully', async () => {
    mockAxios.onPut('http://localhost:5001/api/appointments/modify').reply(200, { message: 'Appointment rescheduled' });

    render(<Appointments />);

    fireEvent.click(screen.getByText('Reschedule'));

    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '10:00' } });

    const submitButton = screen.getByText('Confirm Reschedule');
    fireEvent.click(submitButton);

    await waitFor(() => screen.getByText('Appointment rescheduled'));

    expect(screen.getByText('Appointment rescheduled')).toBeInTheDocument();
  });

  test('cancels an appointment successfully', async () => {
    mockAxios.onPut('http://localhost:5001/api/appointments/modify').reply(200, { message: 'Appointment cancelled' });

    render(<Appointments />);

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => screen.getByText('Appointment cancelled'));

    expect(screen.getByText('Appointment cancelled')).toBeInTheDocument();
  });
});
