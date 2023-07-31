import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlayerList from './PlayerList';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/start/:id" element={<PlayerList />} />
        {/* <Route path="/game/:id" element={} /> */}
      </Routes>
    </Router>
  );
};

export default App;
