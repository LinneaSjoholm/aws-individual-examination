import React from 'react';
import MessageBoard from './components/MessageBoard.jsx';
import './style/index.css';

function App() {
  return (
    <div className="App">
      <h1>Shui</h1>
      <p style={{ color: 'white' }} >En innovativ plattform där användare kan dela och ta emot tips inom en inspirerande gemenskap.<br>
      </br>Posta, upptäck och inspireras av idéer som förvandlar vardagen!</p>
      <MessageBoard />
    </div>
  );
}

export default App;