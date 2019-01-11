import React, { Component } from 'react';
import FaleMais from './FaleMais'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
            <img src="https://vizir.com.br/wp-content/uploads/2016/06/logo_software_studio.png" alt="logo" />
        </header>
        <FaleMais />
      </div>
    );
  }
}

export default App;
