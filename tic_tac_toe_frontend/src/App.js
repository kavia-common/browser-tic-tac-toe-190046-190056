import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useTheme } from './theme/ThemeContext';

// PUBLIC_INTERFACE
function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="App">
      <header className="App-header surface" role="banner">
        <div className="header" style={{ position: 'absolute', top: 0, right: 0, left: 0 }}>
          <div style={{ marginLeft: 'auto', paddingRight: 16 }}>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-pressed={theme === 'dark'}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
              <span style={{ fontSize: 12, opacity: 0.9 }}>
                {theme === 'light' ? 'Dark' : 'Light'}
              </span>
            </button>
          </div>
        </div>

        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-muted">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="status-bar">
          <div className="status-text">Current theme: <strong>{theme}</strong></div>
          <button className="btn" onClick={toggleTheme}>
            Toggle Theme
          </button>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
