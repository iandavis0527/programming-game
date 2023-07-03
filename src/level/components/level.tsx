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
                        return (
                            <BackgroundTile
                                tileWidth={tileWidth}
                                tileHeight={tileHeight}
                                fill={
                                    tile.x % 2 == 0 && tile.y % 2 != 0
                                        ? 'red'
                                        : 'blue'
                                }
                                point={tile}
                            />
                        );
                    })}
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
