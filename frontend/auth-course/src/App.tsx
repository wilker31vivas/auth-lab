import './App.css'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'
import ProtectedRoute from './ProtectedRoute'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthContext.tsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard></Dashboard></ProtectedRoute>}></Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
