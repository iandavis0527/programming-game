import { Point } from '../../services/level.service';

export const tileWidth = 40;
export const tileHeight = 40;

export interface Tile {
    point?: Point;
    worldLocation: Point;
}
