import * as monaco from 'monaco-editor';
import { useService } from 'solid-services';
import { IDEService } from '../services/ide.service';
import { Editor } from './editor/editor.component';
import styles from './ide.module.css';

export const CodeIDE = () => {
    const ideService = useService(IDEService)();
    let ideEditor!: HTMLTextAreaElement;

    const onProgramRun = async () => {
        const program = monaco.editor.getEditors()[0].getValue();
        ideService.onProgramRun(program);
    };

    return (
        <div id={styles.ide_container}>
            <Editor
                height='703px'
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
