import { Accessor, Setter } from 'solid-js';
import { Player } from '../player/models/player.model';
import styles from './ide.module.css';

function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CodeIDE = (props: {
    getPlayer: Accessor<Player>;
    setPlayer: Setter<Player>;
}) => {
    let ideEditor!: HTMLTextAreaElement;

    const onProgramRun = async () => {
        const program = ideEditor.value;
        const statements = program.split('\n');

        for (const statement of statements) {
            if (statement.toLowerCase() == 'move_forward()') {
                props.setPlayer((player) => {
                    return {
                        x: player.x,
                        y: player.y + 20,
                    };
                });
            }

            await timeout(450);
        }
    };

    return (
        <div id={styles.ide_container}>
            <textarea
                id={styles.ide_editor}
                ref={ideEditor}
            />
            <div id={styles.ide_button_row}>
                <button
                    id={styles.ide_run_button}
                    class={styles.ide_button}
                    onClick={onProgramRun}
                >
                    Run
                </button>
            </div>
        </div>
    );
};
