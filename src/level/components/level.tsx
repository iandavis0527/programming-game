import { useService } from 'solid-services';
import { LevelService } from '../services/level.service';
import { BackgroundTile } from '../tiles/components/background_tile';
import { tileHeight, tileWidth } from '../tiles/models/tile';
import styles from './level.module.css';

export const LevelComponent = () => {
    const levelService = useService(LevelService)();

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
                <BackgroundTile
                    tileWidth={tileWidth}
                    tileHeight={tileHeight}
                    fill={'yellow'}
                    point={levelService.getPlayerWindowCoordinates()()}
                />
            </g>
        </svg>
    );
};
