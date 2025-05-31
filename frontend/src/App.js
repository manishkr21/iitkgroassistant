import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PensionSite from './pages/PensionSite';
import MnregaSite from './pages/MnregaSite';

import GrievanceList from './pages/Grievances';

import './App.css';

function App() {
  return (

    <Routes>
      <Route path="/pension" element={<PensionSite />} />
      <Route path="/mnrega" element={<MnregaSite />} />
      <Route path="/" element={<GrievanceList />} />

    </Routes>

  );

}

export default App;
