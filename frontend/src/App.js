import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Header from './components/Header';
import './App.css';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import ForgotPassword from './pages/Forgot/forgot';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import NurseDashboard from './pages/NurseDashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Header /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
        </Routes>

      </BrowserRouter>
    </>
  );

}



export default App;
