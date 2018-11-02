import React from 'react';
import './App.css';
import PersonList from "./components/PersonList";
import ActionBar from "./components/ActionBar";


const App = () => (
    <React.Fragment>
        <section className="hero is-primary is-bold">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="title">
                        Javascript​ ​UI​ ​↔​ ​Server​ ​syncing
                    </h1>
                    <h2 className="subtitle">
                        Jan Calanog
                    </h2>
                </div>
            </div>
        </section>
          <div className="section">
            <div className="content">
                <p className="has-text-centered is-size-7">
                    Have a look at the console, there you can find mocked network request logs.
                </p>
            </div>
            <div className="container">
              <div className="columns is-centered">
                <div className="column is-4">
                    <PersonList/>
                    <ActionBar />
                </div>
              </div>
            </div>
          </div>
    </React.Fragment>
);

export default App;
