import { useService } from 'solid-services';
import { GameService } from '../../game';
import { BackgroundTile } from '../../level/tiles/components/background_tile';
import { tileHeight, tileWidth } from '../../level/tiles/models/tile';
import styles from './level_maker.module.css';

export const LevelMaker = () => {
    const gameService = useService(GameService)();

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
                    point={{ x: x, y: y }}
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
            class={styles.level_container}
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
                <rect
                    width={tileWidth}
                    height={tileHeight}
                    fill={'yellow'}
                    x={gameService.getPlayer()().x}
                    y={gameService.getPlayer()().y}
                />
            </g>
        </svg>
    );
};
