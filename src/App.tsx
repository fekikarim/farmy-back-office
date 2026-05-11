import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import WorkersPage from './pages/Workers';
import DeliveriesPage from './pages/Deliveries';
import PageWrapper from './components/layout/PageWrapper';
import PlaceholderPage from './components/ui/PlaceholderPage';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import LoadingOverlay from './components/ui/LoadingOverlay';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes with Sidebar/Topbar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/workers" element={<WorkersPage />} />
                  <Route path="/lands" element={<PlaceholderPage title="Lands Management" />} />
                  <Route path="/land-rentals" element={<PlaceholderPage title="Land Rentals" />} />
                  <Route path="/jobs" element={<PlaceholderPage title="Job Requests" />} />
                  <Route path="/orders" element={<PlaceholderPage title="Orders" />} />
                  <Route path="/deliveries" element={<DeliveriesPage />} />
                  <Route path="/products" element={<PlaceholderPage title="Products" />} />
                  <Route path="/transactions" element={<PlaceholderPage title="Transactions" />} />
                  <Route path="/wallets" element={<PlaceholderPage title="Worker Wallets" />} />
                  <Route path="/contracts" element={<PlaceholderPage title="Contracts" />} />
                  <Route path="/feedbacks" element={<PlaceholderPage title="Feedbacks" />} />
                  <Route path="/crop-plans" element={<PlaceholderPage title="Crop Plans" />} />
                  <Route path="/analytics" element={<PlaceholderPage title="Advanced Analytics" />} />
                  <Route path="/ai-sessions" element={<PlaceholderPage title="AI Sessions" />} />
                  <Route path="/devices" element={<PlaceholderPage title="Devices & Notifications" />} />
                  <Route path="/notifications" element={<PlaceholderPage title="System Notifications" />} />
                  <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PageWrapper>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
