import * as monaco from 'monaco-editor';
import { useService } from 'solid-services';
import { PlayerService } from '../../player/services/player.service';
import { BaseService, timeout } from '../../utils';

interface Module {
    path: string;
    name: string;
}

interface LoadedModule {
    module: Module;
    blob: Promise<Blob>;
}

class Command {
    type: string;
    raw: string;
    body?: Command[];
    closed?: boolean;
    assignment?: string;
    condition?: string;
    increment?: string;

    constructor(
        type: string,
        raw: string,
        body?: Command[],
        closed?: boolean,
        assignment?: string,
        condition?: string,
        increment?: string,
    ) {
        this.type = type;
        this.raw = raw;
        this.body = body;
        this.closed = closed;
        this.assignment = assignment;
        this.condition = condition;
        this.increment = increment;
    }

    isControlBlock() {
        return this.type == 'control';
    }

    isOpened() {
        return this.closed != null && this.closed == false;
    }
}

export class IDEService extends BaseService {
    private playerService: PlayerService;

    constructor() {
        super();

        this.playerService = useService(PlayerService)();
    }

    private async loadAvailableModules(): Promise<LoadedModule[]> {
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

    getCurrentControlBlock(currentCommand: Command): Command | null {
        if (currentCommand.isControlBlock() && currentCommand.isOpened()) {
            // let nested = currentCommand.body[-1];
        }

        return null;
    }

    parseForLoop(
        cleaned: string,
        forLoopMatch: RegExpMatchArray,
        parsedCommandStack: Command[],
    ) {
        const assignment = forLoopMatch[1];
        const condition = forLoopMatch[2];
        const increment = forLoopMatch[3];
        const newBlock = new Command(
            'control',
            cleaned,
            [],
            false,
            assignment,
            condition,
            increment,
        );

        let current = null;

        if (parsedCommandStack.length >= 1) {
            current = parsedCommandStack[-1];
        }

        if (current?.isControlBlock() && current?.isOpened()) {
            parsedCommandStack.push(newBlock);
        } else {
            current?.body!.push(newBlock);
        }
    }

    parseBlockEnd(cleaned: string, parsedCommandStack: Command[]) {
        const parsedCommand = parsedCommandStack[-1];

        if (parsedCommand.closed) {
            throw new Error('Unexpected } with no opened block!');
        } else if (parsedCommand.body == null) {
            throw new Error('Unexpected } with no opened block!');
        }

        parsedCommand.closed = true;
        parsedCommand.body.push(new Command('basic', cleaned.replace('}', '')));
    }

    async onProgramRun(program: string) {
        this.playerService.resetPlayer();

        await timeout(450);

        const statements = program.split('\n');

        // This is the first level of parsing, and will convert
        // parse all control flow objects into higher level objects.
        // const parsedCommandStack: Command[] = [];
        // const forLoopRegex = 'for ((.*); (.*); (.*)) {';

        for (const statement of statements) {
            // const cleaned = statement.toLowerCase();
            await this.executeBasicCommand(statement);
        }
    }

    async executeBasicCommand(command: string) {
        const cleaned = command.toLowerCase();
        if (cleaned == 'move_north();') {
            this.playerService.movePlayerUp();
        } else if (cleaned == 'move_west();') {
            this.playerService.movePlayerLeft();
        } else if (cleaned == 'move_east();') {
            this.playerService.movePlayerRight();
        } else if (cleaned == 'move_south();') {
            this.playerService.movePlayerDown();
        }

        await timeout(450);
    }

    async executeBasicCommands(commands: string[]) {
        /** Execute a list of basic commands in order as given.
         * Basic commands should be things parseable to a single instruction
         * of a game service, and should not include things like logic or control flow
         * statements like if, for, function definitions, etc.
         */
        for (const command of commands) {
            await this.executeBasicCommand(command);
        }
    }
}
