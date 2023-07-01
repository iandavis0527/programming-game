import { Service, useService } from 'solid-services';
import { BoardService } from '../../board/services/board.service';

export class PlayerService extends Service {
    private readonly boardService: BoardService;

    constructor() {
        super();
        this.boardService = useService(BoardService)();
    }
}
