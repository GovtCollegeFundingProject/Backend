import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Verification = () => {
    const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');

  // Handle sending OTP
  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/otp/verifyemail', { email });
      console.log(response);
      if (response.status===200) {
        setOtpSent(true); // Show OTP input after sending OTP
        setMessage('OTP sent to your email.');
      } else {
        setMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/otp/verifyotp', { email, otp });
      if (response.status===200) {
        setMessage('OTP verified successfully!');
        // Redirect to registration or any other desired action
        navigate('/auth/registerIndividual');
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      {message && <p>{message}</p>}
      
      {!otpSent ? (
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
      ) : (
        <div>
          <label>Enter OTP:</label>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            required 
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default Verification;
