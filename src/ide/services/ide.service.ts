import { GameService } from 'game';
import { useService } from 'solid-services';
import { BaseService, timeout } from 'utils';

export class IDEService extends BaseService {
    private gameService: GameService;

    constructor() {
        super();

        this.gameService = useService(GameService)();
    }

    async onProgramRun(program: string) {
        const statements = program.split('\n');

        for (const statement of statements) {
            if (statement.toLowerCase() == 'move_forward()') {
                const player = this.gameService.getPlayer()();

                this.gameService.updatePlayer({
                    y: player.y + 20,
                });
            }

            await timeout(450);
        }
    }
}
