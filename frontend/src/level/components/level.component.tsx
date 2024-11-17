import { useService } from 'solid-services';
import { GameService } from '../../game';
import { PlayerEntity } from '../../player/components/player_tile';
import { LevelService } from '../services/level.service';
import { BackgroundTile } from '../tiles/components/background_tile';
import { tileHeight, tileWidth } from '../tiles/models/tile';
import styles from './level.module.css';

export const LevelComponent = () => {
    const gameService = useService(GameService)();
    const levelService = useService(LevelService)();
    const viewport = gameService.getViewport()();

    return (
        <svg
            class={styles.level_container}
            width={viewport.width}
            height={viewport.height}
            stroke={'black'}
        >
            <g>
                <rect
                    width={viewport.width}
                    height={viewport.height}
                    fill={'white'}
                />
                {levelService
                    .getBackgroundTiles()()
                    .map((tile) => {
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
                                screenLocation={levelService.convertWorldCoordinates(tile.worldLocation)}
                                fill={color}
                                tile={tile}
                            />
                        );
                    })}
                <PlayerEntity
                    tileWidth={tileWidth}
                    tileHeight={tileHeight}
                    screenLocation={gameService.getPlayerWindowCoordinates()()}
                    fill={'yellow'}
                    player={levelService.getPlayerTile()()}
                />
            </g>
        </svg>
    );
};
