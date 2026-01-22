import './App.css'
import AppRoutes from './routes/AppRoutes.jsx'
import Navbar from './components/Navbar.jsx'
import { AuthProvider } from './api/auth.api'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App
