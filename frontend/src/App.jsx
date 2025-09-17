import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ChatProvider } from './context';
import { ProtectedRoute, DevHelper } from './components/common';
import { HomePage, LoginPage, SignupPage, ChatPage } from './pages';
import { ROUTES } from './utils/routes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public routes */}
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
              
              {/* Protected routes */}
              <Route 
                path={ROUTES.CHAT} 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
          
          {/* Development helper */}
          <DevHelper />
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
