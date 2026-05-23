import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PosScreen from './pages/PosScreen';
import OwnersDashboard from './pages/OwnersDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* মেইন রুট (ক্যাশিয়ার প্যানেল) */}
        <Route path="/" element={<PosScreen />} />
        
        {/* ড্যাশবোর্ড রুট (মাসুম ভাইয়ের প্যানেল) */}
        <Route path="/dashboard" element={<OwnersDashboard />} />
      </Routes>

      {/* ডেমো নেভিগেশন বার (টেস্টিং এর সুবিধার জন্য একদম নিচে থাকবে) */}
      <div className="fixed-bottom p-3 m-3 bg-dark text-white rounded shadow d-inline-flex gap-3" style={{ width: 'fit-content', zIndex: 1050 }}>
        <Link to="/" className="text-white text-decoration-none fw-bold">🛒 POS Counter</Link>
        <Link to="/dashboard" className="text-success text-decoration-none fw-bold">📊 Live Dashboard</Link>
      </div>
    </Router>
  );
}

export default App;