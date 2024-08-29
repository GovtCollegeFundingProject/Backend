import React from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterOptions() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Register</h2>
      <button onClick={() => navigate('/register-individual')}>Register as Individual</button>
      <button onClick={() => navigate('/register-company')}>Register as Company</button>
    </div>
  );
}

export default RegisterOptions;
