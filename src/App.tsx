import { Route, Router, Routes } from '@solidjs/router';
import { Component } from 'solid-js';
import { ServiceRegistry } from 'solid-services';
import styles from './App.module.css';
import { CodeIDE } from './ide/components/ide.component';
import { LevelComponent } from './level';
import { ServiceManager } from './service_manager.component';

const App: Component = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path='/'
                    component={MainAppComponent}
                />
            </Routes>
        </Router>
    );
};

const MainAppComponent = () => {
    return (
        <ServiceRegistry>
            <ServiceManager>
                <div class={styles.app_container}>
                    <CodeIDE />
                    <LevelComponent />
                </div>
            </ServiceManager>
        </ServiceRegistry>
    );
};

export default App;
