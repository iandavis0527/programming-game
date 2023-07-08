import { useService } from 'solid-services';
import { GameService } from '../../game';
import { LevelService } from '../services/level.service';
import { BackgroundTile } from '../tiles/components/background_tile';
import { tileHeight, tileWidth } from '../tiles/models/tile';
import styles from './level.module.css';

export const LevelComponent = () => {
    const gameService = useService(GameService)();
    const levelService = useService(LevelService)();

    return (
        <svg
            class={styles.level_container}
            width={gameService.getViewport()().width}
            height={gameService.getViewport()().height}
            stroke={'black'}
        >
            <g>
                <rect
                    width={gameService.getViewport()().width}
                    height={gameService.getViewport()().height}
                    fill={'white'}
                />
                {levelService
                    .getBackgroundTiles()()
                    .map((tile) => {
                        console.debug(
                            tile.worldLocation.x,
                            tile.worldLocation.y,
                            tile.worldLocation.x % 2 == 0,
                            tile.worldLocation.y % 2 != 0,
                        );
                        let color = 'red';

                        if (tile.worldLocation.x % 2 == 0) {
                            if (tile.worldLocation.y % 2 == 0) {
                                color = 'red';
                            } else {
                                color = 'blue';
                            }
                        } else {
                            if (tile.worldLocation.y % 2 == 0) {
                                color = 'blue';
                            } else {
                                color = 'red';
                            }
                        }

                        return (
                            <BackgroundTile
                                tileWidth={tileWidth}
                                tileHeight={tileHeight}
                                fill={color}
                                tile={tile}
                            />
                        );
                    })}
                <BackgroundTile
                    tileWidth={tileWidth}
                    tileHeight={tileHeight}
                    fill={'yellow'}
                    tile={levelService.getPlayerTile()()}
                />
            </g>
        </svg>
    );
};
