// components/PaymentForm.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';

console.log("PaymentForm Component Loaded");

const PaymentForm = () => {
  const search = useLocation().search;
  const appointmentId = new URLSearchParams(search).get('appointmentId');
  console.log("Appointment ID:", appointmentId); 
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const token = localStorage.getItem('authToken');

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5001/api/payments',
        {
          appointmentId,
          cardHolder,
          cardNumber,
          expiryDate,
          cvv,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        message.success('Payment Successful!');
      } else {
        message.error('Payment Failed.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      message.error('Payment Failed. Try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Payment Form for Appointment ID: {appointmentId}</h2>
      <form onSubmit={handlePaymentSubmit}>
        <div>
          <label>Cardholder Name:</label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Card Number:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Expiry Date (MM/YY):</label>
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>CVV:</label>
          <input
            type="password"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
