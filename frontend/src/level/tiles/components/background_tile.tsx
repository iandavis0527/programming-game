import { Point } from '../../services/level.service';
import { Tile } from '../models/tile';

export const BackgroundTile = (props: {
    tile: Tile;
    screenLocation: Point;
    tileWidth: number;
    tileHeight: number;
    fill?: string;
    stroke?: string;
}) => {
    return (
        <rect
            width={props.tileWidth}
            height={props.tileHeight}
            x={props.screenLocation.x}
            y={props.screenLocation.y}
            fill={props.fill}
            stroke={props.stroke}
        />
    );
};
