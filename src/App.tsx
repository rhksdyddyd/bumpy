import React from 'react';
import Logo from 'svg/logo.svg';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <Logo></Logo>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    );
};

export default App;
