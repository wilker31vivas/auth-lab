import './App.css'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Dashboard from './pages/Dashboard.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard></Dashboard>
          </ProtectedRoute>
        }>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
