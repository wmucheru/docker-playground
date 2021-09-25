import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import About from './About';
import Fib from './Fib';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React, redis, node and docker app</h1>
        <Link to="/">Home</Link>
        <Link to="/about">About Page</Link>
      </header>
      <Route exact path="/" component={Fib} />
      <Route path="/about" component={About} />
    </div>
  );
}

export default App;
