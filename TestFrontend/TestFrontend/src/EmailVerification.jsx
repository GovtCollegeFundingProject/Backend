import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function EmailVerification() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send OTP request
      await axios.post("/otp/verifyemail", { email });

      // Verify OTP
      const response = await axios.post("/otp/verifyotp", { email, otp });

      if (response.data.success) {
        navigate("/registerIndividual");
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Email Verification</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default EmailVerification;
