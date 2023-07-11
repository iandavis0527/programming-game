import { Point, Tile } from '../../level';

export interface Player extends Tile {
    startingPosition: Point;
    isDead: boolean;
}
