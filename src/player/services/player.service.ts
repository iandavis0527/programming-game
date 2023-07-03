import { ReactiveSignalService } from 'utils/services/reactive-signal.service';
import { Player } from '../models/player.model';

export class PlayerService extends ReactiveSignalService<Player> {
    constructor() {
        const player = {
            x: 0,
            y: 0,
        };
        super(player);
    }
}
