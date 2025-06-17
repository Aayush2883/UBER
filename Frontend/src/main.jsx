import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import UserContext from './context/userContext.jsx'; // 🟢 Capitalized import
import CaptainContext from './context/CaptainContext'; // Import CaptainContext

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptainContext> {/* Wrap with CaptainContext */}
      <UserContext> {/* 🟢 Capitalized usage */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserContext>
    </CaptainContext>
  </StrictMode>
);
