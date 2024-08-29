import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Verification from './Verification';
import RegisterOptions from './RegisterOptions';
import RegisterIndividual from './RegisterIndividual';
import RegisterCompany from './RegisterCompany';
import Login from './Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Verification />} />
        <Route path="/register-options" element={<RegisterOptions />} />
        <Route path="/register-individual" element={<RegisterIndividual />} />
        <Route path="/register-company" element={<RegisterCompany />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
