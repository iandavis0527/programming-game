export const BackgroundTile = (props: {
    x: number;
    y: number;
    tileWidth: number;
    tileHeight: number;
    fill?: string;
    stroke?: string;
}) => {
    return (
        <rect
            width={props.tileWidth}
            height={props.tileHeight}
            x={props.x}
            y={props.y}
            fill={props.fill}
            stroke={props.stroke}
        />
    );
};
