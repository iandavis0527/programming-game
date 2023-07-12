import * as monaco from 'monaco-editor';
import { Component, lazy } from 'solid-js';
import { useService } from 'solid-services';
import { bootstrapAPI } from '../bootstrap_api';
import { GameService } from '../game';
import { LevelService } from '../level';
import { ViewportService } from '../viewport';

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

    bootstrapAPI(gameService, levelService, viewportService);

    viewportService.onMediaQueried(840, 703);

    await gameService.initialize();

    const ManagerComponent: Component<any> = (props: { children: any }) => {
        return <>{props.children}</>;
    };

    return { default: ManagerComponent };
});
