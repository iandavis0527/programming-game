import type { Component } from 'solid-js';

import styles from './App.module.css';
import { Board } from './board/components/board';
import { CodeIDE } from './ide/ide';

const App: Component = () => {
    const handleKeyPressed = (event: KeyboardEvent) => {
        console.debug(event.key);
    };

    return (
        <div class={styles.app_container}>
            <CodeIDE />
            <Board />
        </div>
    );
};

export default App;
