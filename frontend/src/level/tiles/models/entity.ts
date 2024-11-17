import { Point } from '../../services/level.service';
import { GameObject } from './game.object';

export interface Entity extends GameObject {
    point?: Point;
}
