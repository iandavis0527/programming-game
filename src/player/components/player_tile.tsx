import { Player } from '../models/player.model';

export const PlayerTile = (props: {
    tileWidth: number;
    tileHeight: number;
    player: Player;
    fill?: string;
    stroke?: string;
}) => {
    return (
        <rect
            width={props.tileWidth}
            height={props.tileHeight}
            x={props.player.point!.x}
            y={props.player.point!.y}
            fill={props.player.isDead ? 'transparent' : props.fill}
            stroke={props.player.isDead ? 'transparent' : props.stroke}
        />
    );
};
