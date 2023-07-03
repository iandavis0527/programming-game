import { createSignal, type Component } from 'solid-js';

import styles from './App.module.css';
import { Board } from './board/components/board';
import { CodeIDE } from './ide/ide';
import { Player } from './player/models/player.model';

const App: Component = () => {
    const [getPlayer, setPlayer] = createSignal<Player>({
        x: 0,
        y: 0,
    });

    return (
        <div class={styles.app_container}>
            <CodeIDE
                getPlayer={getPlayer}
                setPlayer={setPlayer}
            />
            <Board getPlayer={getPlayer} />
        </div>
    );
};

export default App;
