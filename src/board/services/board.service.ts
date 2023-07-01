import { ReactiveSignalService } from '../../services/reactive-signal.service';
import { Board } from '../models/board.model';

export class BoardService extends ReactiveSignalService<Board> {
    constructor() {
        super({
            tiles: [],
            player: {
                x: 0,
                y: 0,
            },
        });
    }
}
