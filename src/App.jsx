import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Dash, Login, Menu, NotFound } from './pages';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const saveMenuDataToFile = (updatedData) => {
    // This is a special instruction for the Gemini CLI agent.
    // When this function is invoked, the agent should execute the 'write_file' tool
    // to update the 'src/data/menu.json' file with the 'updatedData'.
    // The content for 'write_file' should be JSON.stringify(updatedData, null, 2).
    // The file_path should be 'src/data/menu.json'.
    console.log("Agent Instruction: Save updated menu data to file.");
    console.log("Updated data to save:", updatedData);
    // The agent will intercept this log and perform the write_file tool call.
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dash" />} />
        <Route path="/dash" element={isAuthenticated ? <Dash /> : <Navigate to="/login" />} />
        <Route path="/menu" element={isAuthenticated ? <Menu onSaveMenuData={saveMenuDataToFile} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
