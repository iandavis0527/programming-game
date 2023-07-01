import styles from "./board.module.css";

const tileWidth = 40;
const tileHeight = tileWidth;

export const Board = () => {
    const width = 1600;
    const height = 900;

    const numberRows = height / tileHeight;
    const numberColumns = width / tileWidth;

    const tiles = [];

    for (let row=0; row < numberRows; row++) {
        const y = row * tileHeight;

        const evenColor = row % 2 == 0 ? "red" : "blue";
        const oddColor = evenColor == "red" ? "blue" : "red";

        for (let column=0; column < numberColumns; column++) {
            const x = column * tileWidth;
            const fill = column % 2 == 0 ? evenColor : oddColor;

            tiles.push(<Tile x={x} y={y} fill={fill} stroke={"white"}/>);
        }
    }  
    
    return (
        <svg 
            class={styles.board_container} 
            width={width} 
            height={width} 
            stroke={"black"}>
            <g>
                <rect 
                    width={width} 
                    height={width}
                    fill={"white"}/>
                {tiles}
            </g>
        </svg>
    );
};

const Tile = (props: {
    x: number,
    y: number,
    fill?: string;
    stroke?: string,
}) => {
    return (
        <rect 
            width={tileWidth} 
            height={tileWidth} 
            x={props.x} 
            y={props.y} 
            fill={props.fill}
            stroke={props.stroke}/>
    );
}