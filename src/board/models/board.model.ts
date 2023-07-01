import { Player } from '../../player/models/player.model';
import { Tile } from '../tiles/models/tile';

export interface Board {
    tiles: Tile[];
    player: Player;
}
