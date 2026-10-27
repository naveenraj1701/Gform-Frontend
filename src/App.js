import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import AdminDashboard from './Pages/AdminDashboard';
import FormDashboard from './Pages/FormDashboard';
function App() {
  const role = localStorage.getItem("role");
  console.log("Local Storage ::", role)
  return (
    <Routes>
     <Route path="/form/:formId" element={<HomePage />} />
      <Route path='/' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/admin' element={<AdminDashboard />}/>
      <Route path='/blank' element={<FormDashboard />} />
    </Routes>
  );
}

export default App;
