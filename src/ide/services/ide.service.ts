import { useService } from 'solid-services';
import { LevelService } from '../../level';
import { BaseService, timeout } from '../../utils';

export class IDEService extends BaseService {
    private levelService: LevelService;

    constructor() {
        super();

        this.levelService = useService(LevelService)();
    }

    async onProgramRun(program: string) {
        this.levelService.resetPlayer();

        await timeout(450);

        const statements = program.split('\n');

        for (const statement of statements) {
            if (statement.toLowerCase() == 'move_forward()') {
                this.levelService.movePlayerUp();
            } else if (statement.toLowerCase() == 'move_left()') {
                this.levelService.movePlayerLeft();
            } else if (statement.toLowerCase() == 'move_right()') {
                this.levelService.movePlayerRight();
            } else if (statement.toLowerCase() == 'move_backward()') {
                this.levelService.movePlayerDown();
            }

            await timeout(450);
        }
    }
}
