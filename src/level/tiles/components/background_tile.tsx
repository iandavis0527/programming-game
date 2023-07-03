import { Point } from '../../services/level.service';

export const BackgroundTile = (props: {
    point: Point;
    tileWidth: number;
    tileHeight: number;
    fill?: string;
    stroke?: string;
}) => {
    return (
        <rect
            width={props.tileWidth}
            height={props.tileHeight}
            x={props.point.x}
            y={props.point.y}
            fill={props.fill}
            stroke={props.stroke}
        />
    );
};
