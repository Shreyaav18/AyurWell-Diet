import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import FoodList from './pages/FoodList';
import PatientList from './pages/PatientList';
import PrivateRoute from './components/common/PrivateRoute';
import Newpatient from './components/auth/Newpatient';
import PatientProfile from './pages/PatientProfile';
import DietChartsList from './components/widgets/DietChartsList';
import DietChartBuilder from './components/widgets/DietChartBuilder';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            
              <Dashboard />
          }
        />
        <Route
          path="/foods"
          element={
            <PrivateRoute>
              <FoodList />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <PatientList />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/patients/:patientId/diet-charts" element={<DietChartsList />} />
        
        <Route
          path="/patients/new"
          element={
            <PrivateRoute>
              <Newpatient />
            </PrivateRoute>
          }
        />

        <Route 
          path="/patients/:id" 
          element={
            <PrivateRoute>
                <PatientProfile />
            </PrivateRoute>} 
        />

        <Route path="/patients/:patientId/diet-charts/create" element={<DietChartBuilder />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;