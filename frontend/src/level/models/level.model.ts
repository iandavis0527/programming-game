import { Tile } from '../tiles/models/tile';
import { Wall } from '../tiles/models/wall';

export interface Level {
    tiles: Tile[];
    walls?: Wall[];
}
