import './App.css'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Dashboard from './pages/Dashboard.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import PublicRoute from './components/PublicRoute.tsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }></Route>
        <Route path='/register' element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }></Route>
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
