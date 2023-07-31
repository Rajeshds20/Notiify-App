import React, { useEffect, useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      setUser(localStorage.getItem('token'));
    }
  }, []);

  const routes = createBrowserRouter([
    {
      path: '/',
      element: <HomePage user={user} />,
    },
    {
      path: '/login',
      element: <LoginPage user={user} setUser={setUser} />,
    },
    {
      path: '/register',
      element: <RegisterPage user={user} setUser={setUser} />,
    },
    {
      path: '/*',
      element: <NotFoundPage />,
    }
  ]);

  return (
    <RouterProvider router={routes} />
  );
}

export default App;
