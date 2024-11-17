import { Point } from '../../level';
import { Player } from '../models/player.model';

export const PlayerEntity = (props: {
    tileWidth: number;
    tileHeight: number;
    screenLocation: Point;
    player: Player;
    fill?: string;
    stroke?: string;
}) => {
    return (
        <rect
            width={props.tileWidth}
            height={props.tileHeight}
            x={props.screenLocation.x}
            y={props.screenLocation.y}
            fill={props.player.isDead ? 'transparent' : props.fill}
            stroke={props.player.isDead ? 'transparent' : props.stroke}
        />
    );
};
