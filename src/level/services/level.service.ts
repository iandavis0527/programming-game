import autoBind from 'auto-bind';
import { GameService } from 'game/services/game.service';
import { distinctUntilChanged } from 'rxjs';
import { useService } from 'solid-services';
import clamp from 'utils/math/clamp';
import { filterNulls } from 'utils/reactive/filtering';
import { SubscribingService } from 'utils/services/subscribing.service';
import { Level } from '../models/level.model';
import {
    selectMaxTileHeight,
    selectMaxTileWidth,
} from '../selectors/level.selector';

export class LevelService extends SubscribingService {
    private maxTileHeight!: number;
    private maxTileWidth!: number;

    private gameService: GameService;

    constructor() {
        super();

        autoBind(this);

        this.gameService = useService(GameService)();
    }

    /**
     * Listen to the game service level connection
     * and update state as new levels are loaded.
     */
    async initialize() {
        this.trackSubscription(
            this.gameService
                .observeLevel()
                .pipe(filterNulls)
                .pipe(distinctUntilChanged())
                .subscribe(this.startNewLevel),
        );
    }

    /**
     * Update our state to represent the new loaded level.
     * @param level The new level.
     */
    startNewLevel(level: Level) {
        this.maxTileHeight = selectMaxTileHeight(level);
        this.maxTileWidth = selectMaxTileWidth(level);
    }

    /**
     * Handle updating the player position.
     * @param position The new position to update.
     */
    movePlayerPosition(position: { x: number; y: number }) {
        const player = this.gameService.getPlayer()();

        player.x += position.x;
        player.x = clamp({
            value: player.x,
            min: 0,
            max: this.maxTileWidth,
        });

        player.y += position.y;
        player.y = clamp({
            value: player.y,
            min: 0,
            max: this.maxTileHeight,
        });

        this.gameService.updatePlayer({
            x: player.x,
            y: player.y,
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
}
