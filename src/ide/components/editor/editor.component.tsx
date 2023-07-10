import * as monaco from 'monaco-editor';
import { onMount } from 'solid-js';
import styles from './editor.module.css';

export interface EditorProps {
    height: string;
    ref: HTMLTextAreaElement;
}

export const Editor = (props: EditorProps) => {
    let ideEditor!: HTMLDivElement;

    onMount(() => {
        const editor = monaco.editor.create(ideEditor, {
            value: '// run program here.\nmove_forward();',
            language: 'typescript',
            theme: 'vs-dark',
            automaticLayout: true,
        });
    });
    return (
        <div
            ref={ideEditor}
            id={styles.ide_container}
            style={{
                height: '703px',
            }}
        ></div>
    );
};
