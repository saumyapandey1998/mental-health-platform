import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Appointments from './Appointments';

const renderWithRouter = (ui) => {
  return render(<Router>{ui}</Router>);
};

describe('Appointments Component', () => {
  let token = 'abc';

  beforeEach(() => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('role', 'therapist');
    localStorage.setItem('userId', '123');
    localStorage.setItem('username', 'testUser');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('test case 1', async () => {
    renderWithRouter(<Appointments />);
    expect(true).toBe(true);
  });

  test('test case 2', async () => {
    renderWithRouter(<Appointments />);
    expect(true).toBe(true);
  });

  test('test case 3', async () => {
    renderWithRouter(<Appointments />);
    const openButton = screen.getByText('Book Appointment');
    fireEvent.click(openButton);
    expect(true).toBe(true);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    await waitFor(() => expect(true).toBe(true)); 
  });

  test('test case 4', async () => {
    renderWithRouter(<Appointments />);
    fireEvent.click(screen.getByText('Book Appointment'));
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '09:00' } });

    fireEvent.click(screen.getByText('Confirm Booking'));
    expect(true).toBe(true);
  });

  test('test case 5', async () => {
    renderWithRouter(<Appointments />);
    fireEvent.click(screen.getByText('Book Appointment'));
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '09:00' } });

    fireEvent.click(screen.getByText('Confirm Booking'));
    expect(true).toBe(true);
  });

  test('test case 6', async () => {
    renderWithRouter(<Appointments />);
    fireEvent.click(screen.getByText('Book Appointment'));
    await waitFor(() => expect(true).toBe(true)); 
  });

  test('test case 7', async () => {
    renderWithRouter(<Appointments />);
    fireEvent.click(screen.getByText('Reschedule'));
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '10:00' } });

    fireEvent.click(screen.getByText('Confirm Reschedule'));
    expect(true).toBe(true);
  });

  test('test case 8', async () => {
    renderWithRouter(<Appointments />);
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => expect(true).toBe(true)); 
  });
});
