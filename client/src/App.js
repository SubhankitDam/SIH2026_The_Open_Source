import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import'./App.css';
import Home from './pages/Home';
import LoginPage from './pages/loginpage/login';

function App() {
  return (
    <BrowserRouter>
    <Header />
    <LoginPage />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
    
    </BrowserRouter>
  );
  
}



export default App;