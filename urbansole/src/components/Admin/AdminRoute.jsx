import React from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const context = useOutletContext();
  
  // If context is somehow null (e.g. used outside App.jsx), we can't be sure
  if (!context) {
      return <Navigate to="/" replace />;
  }

  const { isLoggedIn, userRole } = context;

  // If the user is definitely not logged in
  if (isLoggedIn === false) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not admin
  if (userRole !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <svg className="w-20 h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 font-medium mb-8">Sorry, you have no admin access to view this page.</p>
          <a href="/" className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-300">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // If they are an admin, render the children (AdminPanel)
  return children;
};

export default AdminRoute;
