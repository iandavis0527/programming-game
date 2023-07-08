import { Tile } from '../models/tile';

export const BackgroundTile = (props: {
    tile: Tile;
    tileWidth: number;
    tileHeight: number;
    fill?: string;
    stroke?: string;
}) => {
    return (
        <rect
            width={props.tileWidth}
            height={props.tileHeight}
            x={props.tile.point.x}
            y={props.tile.point.y}
            fill={props.fill}
            stroke={props.stroke}
        />
    );
};
