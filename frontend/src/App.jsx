import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Video from './pages/Video';
import Login from './pages/Login';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const PrivateRoute = ({ path, element }) => {
    const { loggedIn } = useAuth();

    return loggedIn ? (
      <>
        <div className="main font-NotoSans">
          <Header />
          {element}
        </div>
      </>
    ) : (
      <Navigate to="/login" replace state={{ from: path }} />
    );
  };

  return (
    <div className="main font-NotoSans">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            exact
            path="/"      
            element={
              <PrivateRoute exact path="/" element={<Home />} />
            }
          />
          <Route 
            exact
            path="/video"      
            element={
              <PrivateRoute exact path="/video" element={<Video />} />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;