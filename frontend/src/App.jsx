import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './components/Login.jsx'
import SignUp from './components/Signup.jsx'
import MyResultPage from './pages/MyResultPage.jsx'

function RequireAuth({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));
  const location  =  useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />

      <Route path='/login' element={<Login />} />

      <Route path='/signup' element={<SignUp />} />

      <Route 
      path="/result" 
      element={
        <RequireAuth>
          <MyResultPage />
        </RequireAuth>
      }
      /> 
    </Routes>
  )
}

export default App;