import './App.css';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProjectRoutes from './routes';

export default function App() {
  return (
    <Router>
      <div className="container font-face">
        <ProjectRoutes />
      </div>
    </Router>
  );
};
