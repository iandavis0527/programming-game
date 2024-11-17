import autoBind from 'auto-bind';
import { cloneDeep } from 'lodash';
import { useService } from 'solid-services';
import { GameService } from '../../game';
import { LevelService } from '../../level';
import { SubscribingService } from '../../utils';
import clamp from '../../utils/math/clamp';

export class PlayerService extends SubscribingService {
    private gameService: GameService;
    private levelService: LevelService;

    constructor() {
        super();

        autoBind(this);

        this.gameService = useService(GameService)();
        this.levelService = useService(LevelService)();
    }

    /**
     * Handle updating the player position.
     * @param position The new position to update.
     */
    movePlayerPosition(position: { x: number; y: number }) {
        const player = this.gameService.getPlayer()();

        player.worldLocation.x += position.x;
        player.worldLocation.x = clamp({
            value: player.worldLocation.x,
            min: 0,
            max: this.levelService.getMaxTileWidth(),
        });

        player.worldLocation.y += position.y;
        player.worldLocation.y = clamp({
            value: player.worldLocation.y,
            min: 0,
            max: this.levelService.getMaxTileHeight(),
        });

        const isDead = !this.levelService.isWalkableTile(player.worldLocation);

        this.gameService.updatePlayer({
            worldLocation: player.worldLocation,
            isDead: isDead,
        });
    }

    /**
     * Move the player up one tile.
     */
    movePlayerUp() {
        this.movePlayerPosition({ x: 0, y: 1 });
    }

    /**
     * Move the player down one tile.
     */
    movePlayerDown() {
        this.movePlayerPosition({ x: 0, y: -1 });
    }

    /**
     * Move the player left one tile.
     */
    movePlayerLeft() {
        this.movePlayerPosition({ x: -1, y: 0 });
    }

    /**
     * Move the player right one tile.
     */
    movePlayerRight() {
        this.movePlayerPosition({ x: 1, y: 0 });
    }

    /**
     * Reset current player position to level starting position.
     */
    resetPlayer() {
        const player = this.gameService.getPlayer()();
        const original = cloneDeep(player.startingPosition);

        this.gameService.updatePlayer({
            worldLocation: original,
            isDead: false,
        });
    }
}
