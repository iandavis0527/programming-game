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
            value: '// run program here.\nmove_north();',
            language: 'typescript',
            theme: 'vs-dark',
            automaticLayout: true,
        });
        /// This is a hack to make the autocomplete automatically expand to show documentation.
        (
            editor.getContribution('editor.contrib.suggestController')! as any
        ).widget.value._setDetailsVisible(true);
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
