import * as monaco from 'monaco-editor';
import { useService } from 'solid-services';
import { PlayerService } from '../../player/services/player.service';
import { BaseService, timeout } from '../../utils';

interface Module {
    path: string;
    name: string;
}

export class IDEService extends BaseService {
    private playerService: PlayerService;

    constructor() {
        super();

        this.playerService = useService(PlayerService)();
    }

    private async loadAvailableModules() {
        const response = await fetch(
            'http://localhost:5000/api/available_definition_files',
        );
        const modules = (await response.json()) as Module[];

        return modules.map(this.loadModule);
    }

    private async loadModule(module: Module) {}

    async loadTypescriptModules() {
        const libSource = '';
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
    }

    async onProgramRun(program: string) {
        this.playerService.resetPlayer();

        await timeout(450);

        const statements = program.split('\n');

        for (const statement of statements) {
            if (statement.toLowerCase() == 'move_forward();') {
                this.playerService.movePlayerUp();
            } else if (statement.toLowerCase() == 'move_left();') {
                this.playerService.movePlayerLeft();
            } else if (statement.toLowerCase() == 'move_right();') {
                this.playerService.movePlayerRight();
            } else if (statement.toLowerCase() == 'move_backward();') {
                this.playerService.movePlayerDown();
            }

            await timeout(450);
        }
    }
}
