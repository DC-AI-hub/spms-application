import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Organization from './pages/Organization';
import Access from './pages/Access';
import Process from './pages/Process';
import FormComponent from './components/form/FormComponent';
import UserProcess from './pages/UserProcess';

/**
 * Main application component
 * @returns {JSX.Element} Application structure
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={
          <AdminLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/organization" element={<Organization />} />
              <Route path="/access" element={<Access />} />
              <Route path="/process" element={<Process />} />
              <Route path="/user-process" element={<UserProcess />} />
              <Route path="/form" element={<FormComponent />} />
              <Route path="*" element={<Dashboard />} />      
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
