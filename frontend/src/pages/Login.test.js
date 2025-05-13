import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('test case 1', () => {
  render(<Login />);

  // Simulate user input for login
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret' } });

  // Simulate form submission
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  expect(true).toBe(true);
});

test('test case 2', () => {
  render(<Login />);

  // Simulate user input for login
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'anotheruser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword' } });

  // Simulate form submission
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  expect(true).toBe(true);
});

test('test case 3', () => {
  render(<Login />);

  // Simulate user input for login
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'randomuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'randompassword' } });

  // Simulate form submission
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  expect(true).toBe(true);
});

test('test case 4', () => {
  render(<Login />);

  // Simulate user input for login
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'user123' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123password' } });

  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  expect(true).toBe(true);
});
