import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';
import { BrowserRouter } from 'react-router-dom';

// Mock fetch globally
global.fetch = jest.fn();

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Signup Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders all form fields', () => {
    renderWithRouter(<Signup />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles successful signup', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ msg: 'Signup successful' }),
    });

    renderWithRouter(<Signup />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'therapist' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    });
  });

  test('displays backend error message', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ msg: 'Username already taken' }),
    });

    renderWithRouter(<Signup />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/username already taken/i)).toBeInTheDocument();
    });
  });

  test('handles fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Server down'));

    renderWithRouter(<Signup />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });
});
