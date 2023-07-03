import { useService } from 'solid-services';
import { GameService } from '../../game';
import { LevelService } from '../../level';
import { BaseService, timeout } from '../../utils';

export class IDEService extends BaseService {
    private gameService: GameService;
    private levelService: LevelService;

    constructor() {
        super();

        this.gameService = useService(GameService)();
        this.levelService = useService(LevelService)();
    }

    async onProgramRun(program: string) {
        const statements = program.split('\n');

        for (const statement of statements) {
            if (statement.toLowerCase() == 'move_forward()') {
                this.levelService.movePlayerUp();
            } else if (statement.toLowerCase() == 'move_left()') {
                this.levelService.movePlayerLeft();
            }

            await timeout(450);
        }
    }
}
