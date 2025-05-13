import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Appointments from './Appointments';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

const renderWithRouter = (ui) => {
  return render(<Router>{ui}</Router>);
};

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
    mockAxios.onGet(/\/therapists/).reply(200, [
      { _id: '1', name: 'Therapist 1' },
      { _id: '2', name: 'Therapist 2' },
    ]);

    renderWithRouter(<Appointments />);
    await waitFor(() => expect(screen.getByText('Therapist 1')).toBeInTheDocument());
    expect(screen.getByText('Therapist 2')).toBeInTheDocument();
  });

  test('fetches and displays appointments', async () => {
    mockAxios.onGet(/\/appointments$/).reply(200, [
      { _id: '1', status: 'Pending', date: '2025-05-01T09:00:00' },
      { _id: '2', status: 'Confirmed', date: '2025-05-02T10:00:00' },
    ]);

    renderWithRouter(<Appointments />);
    await waitFor(() => screen.getByText('Pending'));
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  test('opens and closes the booking modal', async () => {
    renderWithRouter(<Appointments />);
    const openButton = screen.getByText('Book Appointment');
    fireEvent.click(openButton);
    expect(screen.getByText(/Confirm Booking/i)).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    await waitFor(() => expect(screen.queryByText(/Confirm Booking/i)).not.toBeInTheDocument());
  });

  test('submits the booking form successfully', async () => {
    mockAxios.onPost(/\/book/).reply(200, { message: 'Appointment booked' });
    renderWithRouter(<Appointments />);

    fireEvent.click(screen.getByText('Book Appointment'));
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '09:00' } });

    fireEvent.click(screen.getByText('Confirm Booking'));
    await waitFor(() => expect(screen.getByText('Appointment booked')).toBeInTheDocument());
  });

  test('shows error message when booking fails', async () => {
    mockAxios.onPost(/\/book/).reply(500, { message: 'Booking failed' });
    renderWithRouter(<Appointments />);

    fireEvent.click(screen.getByText('Book Appointment'));
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '09:00' } });

    fireEvent.click(screen.getByText('Confirm Booking'));
    await waitFor(() => expect(screen.getByText('Booking failed')).toBeInTheDocument());
  });

  test('fetches and displays slots for booking', async () => {
    mockAxios.onGet(/\/slots/).reply(200, ['09:00', '10:00']);
    renderWithRouter(<Appointments />);

    fireEvent.click(screen.getByText('Book Appointment'));
    await waitFor(() => screen.getByText('09:00'));
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  test('reschedules an appointment successfully', async () => {
    mockAxios.onPut(/\/modify/).reply(200, { message: 'Appointment rescheduled' });
    renderWithRouter(<Appointments />);

    fireEvent.click(screen.getByText('Reschedule'));
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '10:00' } });

    fireEvent.click(screen.getByText('Confirm Reschedule'));
    await waitFor(() => expect(screen.getByText('Appointment rescheduled')).toBeInTheDocument());
  });

  test('cancels an appointment successfully', async () => {
    mockAxios.onPut(/\/modify/).reply(200, { message: 'Appointment cancelled' });
    renderWithRouter(<Appointments />);

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => expect(screen.getByText('Appointment cancelled')).toBeInTheDocument());
  });
});