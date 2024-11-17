import { Point } from '../..';

export type Direction = 'East' | 'North' | 'South' | 'West';

export interface Wall {
    edge: Direction;
    worldLocation: Point;
    point?: Point;
}
