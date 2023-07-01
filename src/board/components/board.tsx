import { BackgroundTile } from '../tiles/components/background_tile';
import styles from './board.module.css';

const tileWidth = 40;
const tileHeight = tileWidth;

export const Board = () => {
    const width = 840;
    const height = 703;

    const numberRows = Math.floor(height / tileHeight);
    const numberColumns = Math.floor(width / tileWidth);

    const tiles = [];

    for (let row = 0; row < numberRows; row++) {
        const y = row * tileHeight;

        const evenColor = row % 2 == 0 ? 'red' : 'blue';
        const oddColor = evenColor == 'red' ? 'blue' : 'red';

        for (let column = 0; column < numberColumns; column++) {
            const x = column * tileWidth;
            const fill = column % 2 == 0 ? evenColor : oddColor;

            tiles.push(
                <BackgroundTile
                    x={x}
                    y={y}
                    tileWidth={tileWidth}
                    tileHeight={tileHeight}
                    fill={fill}
                    stroke={'white'}
                />,
            );
        }
    }

    return (
        <svg
            class={styles.board_container}
            width={width}
            height={height}
            stroke={'black'}
        >
            <g>
                <rect
                    width={width}
                    height={height}
                    fill={'white'}
                />
                {tiles}
            </g>
        </svg>
    );
};
