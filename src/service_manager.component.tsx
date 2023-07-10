import * as monaco from 'monaco-editor';
import { Component, lazy } from 'solid-js';
import { useService } from 'solid-services';
import { bootstrapAPI } from './bootstrap_api';
import { GameService } from './game';
import { LevelService } from './level';
import { ViewportService } from './viewport';

export const ServiceManager = lazy(async () => {
    const gameService = useService(GameService)();
    const levelService = useService(LevelService)();
    const viewportService = useService(ViewportService)();

    // validation settings
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
    });

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowNonTsExtensions: true,
    });

    const libSource =
        'declare function move_forward(): void {}\ndeclare function move_left(): void {}\ndeclare function move_right(): void {}\b declare function move_backward(): void {}';
    const libUri = 'ts:filename/robo.d.ts';

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        libSource,
        libUri,
    );

    monaco.editor.createModel(
        libSource,
        'typescript',
        monaco.Uri.parse(libUri),
    );

    bootstrapAPI(gameService, levelService, viewportService);

    viewportService.onMediaQueried(840, 703);

    await gameService.initialize();

    const ManagerComponent: Component<any> = (props: { children: any }) => {
        return <>{props.children}</>;
    };

    return { default: ManagerComponent };
});
