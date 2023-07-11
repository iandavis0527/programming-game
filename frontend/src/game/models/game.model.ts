import { Level } from 'level/models/level.model';

export interface Game {
    viewWidth: number;
    viewHeight: number;
    level: Level;
}
