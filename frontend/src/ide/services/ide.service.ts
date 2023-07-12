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

    private async loadAvailableModules(): Promise<
        {
            module: Module;
            blob: Promise<Blob>;
        }[]
    > {
        const response = await fetch(
            'http://localhost:5000/api/available_definition_files',
        );
        const modules = (await response.json()) as Module[];

        return modules.map((module) => {
            return {
                module: module,
                blob: this.loadModule(module),
            };
        });
    }

    private async loadModule(module: Module): Promise<Blob> {
        const response = await fetch(
            `http://localhost:5000/api/load_definition/${module.path}`,
        );
        return response.blob();
    }

    private async registerModule(module: Module, blob: Blob) {
        const libSource = await blob.text();
        const libUri = `ts:filename/${module.name}`;

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

    async loadTypescriptModules() {
        const available = await this.loadAvailableModules();

        for (const loadedModule of available) {
            const blob = await loadedModule.blob;
            await this.registerModule(loadedModule.module, blob);
        }
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
