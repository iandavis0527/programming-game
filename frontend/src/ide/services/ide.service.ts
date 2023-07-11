import { useService } from 'solid-services';
import { PlayerService } from '../../player/services/player.service';
import { BaseService, timeout } from '../../utils';

export class IDEService extends BaseService {
    private playerService: PlayerService;

    constructor() {
        super();

        this.playerService = useService(PlayerService)();
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
