// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import Login from './Login';
// import { BrowserRouter as Router } from 'react-router-dom';

// // Mocking the useNavigate hook to test navigation
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: jest.fn(),
// }));

// describe('Login Component', () => {
//   test('renders login form', () => {
//     render(
//       <Router>
//         <Login />
//       </Router>
//     );

//     // Check if form elements are present
//     expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
//     expect(screen.getByText(/login/i)).toBeInTheDocument();
//     expect(screen.getByText(/create account/i)).toBeInTheDocument();
//   });

//   test('shows error message when login fails', async () => {
//     const mockNavigate = jest.fn();
//     jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(mockNavigate);

//     // Mock fetch response to simulate failed login
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: false,
//         json: () => Promise.resolve({ msg: '❌ Invalid credentials. Please try again.' }),
//       })
//     );

//     render(
//       <Router>
//         <Login />
//       </Router>
//     );

//     fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'invaliduser' } });
//     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'invalidpass' } });
//     fireEvent.click(screen.getByText(/login/i));

//     // Wait for error message to appear
//     await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());
//   });

//   test('shows success message and navigates to appointments on successful login', async () => {
//     const mockNavigate = jest.fn();
//     jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(mockNavigate);

//     // Mock fetch response to simulate successful login
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({
//           token: 'fakeToken',
//           role: 'patient',
//           username: 'validuser',
//           id: '123',
//         }),
//       })
//     );

//     render(
//       <Router>
//         <Login />
//       </Router>
//     );

//     fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'validuser' } });
//     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'validpassword' } });
//     fireEvent.click(screen.getByText(/login/i));

//     // Wait for success message to appear
//     await waitFor(() => expect(screen.getByText(/login successful/i)).toBeInTheDocument());

//     // Check if the navigate function was called with the correct route
//     expect(mockNavigate).toHaveBeenCalledWith('/appointments');
//   });

//   test('shows server error message when fetch fails', async () => {
//     const mockNavigate = jest.fn();
//     jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(mockNavigate);

//     // Mock fetch to simulate a server error
//     global.fetch = jest.fn(() =>
//       Promise.reject(new Error('Server error'))
//     );

//     render(
//       <Router>
//         <Login />
//       </Router>
//     );

//     fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'user' } });
//     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
//     fireEvent.click(screen.getByText(/login/i));

//     // Wait for error message to appear
//     await waitFor(() => expect(screen.getByText(/server error/i)).toBeInTheDocument());
//   });
// });

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

beforeEach(() => {
  Storage.prototype.setItem = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
  if (global.fetch) delete global.fetch;
});

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });

  test('shows error message when login fails', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ msg: '❌ Invalid credentials. Please try again.' }),
      })
    );

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'invaliduser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'invalidpass' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());
  });

  test('shows success message and navigates to appointments on successful login', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          token: 'fakeToken',
          role: 'patient',
          username: 'validuser',
          id: '123',
        }),
      })
    );

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'validpassword' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => expect(screen.getByText(/login successful/i)).toBeInTheDocument());
    expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    expect(localStorage.setItem).toHaveBeenCalledWith("authToken", "fakeToken");
  });

  test('shows server error message when fetch fails', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    global.fetch = jest.fn(() => Promise.reject(new Error('Server error')));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => expect(screen.getByText(/server error/i)).toBeInTheDocument());
  });
});