import React, { useState } from "react";
import axios from "axios";

function RegisterIndividual() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    whatsappCompatible: false,
    taxExemptionRequired: false,
    anonymous: false,
    aadhar: "",
    pan: "",
    salutation: "",
    name: "",
    residency: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/registerIndividual", formData);
      alert("Registration Successful");
    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    }
  };

  return (
    <div>
      <h2>Register as Individual</h2>
      <form onSubmit={handleSubmit}>
        {/* Add all necessary input fields */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {/* Other form fields */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterIndividual;
