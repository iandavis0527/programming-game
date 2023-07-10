import autoBind from 'auto-bind';
import { cloneDeep } from 'lodash';
import { distinctUntilChanged, zip } from 'rxjs';
import { Accessor, createSignal } from 'solid-js';
import { useService } from 'solid-services';
import { GameService } from '../../game/services/game.service';
import { Player } from '../../player/models/player.model';
import clamp from '../../utils/math/clamp';
import { filterNulls } from '../../utils/reactive/filtering';
import { SubscribingService } from '../../utils/services/subscribing.service';
import { Viewport } from '../../viewport';
import { Level } from '../models/level.model';
import {
    selectMaxTileHeight,
    selectMaxTileWidth,
} from '../selectors/level.selector';
import { Tile, tileHeight, tileWidth } from '../tiles/models/tile';

export interface Point {
    x: number;
    y: number;
}

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

        player.worldLocation.x += position.x;
        player.worldLocation.x = clamp({
            value: player.worldLocation.x,
            min: 0,
            max: this.maxTileWidth,
        });

        player.worldLocation.y += position.y;
        player.worldLocation.y = clamp({
            value: player.worldLocation.y,
            min: 0,
            max: this.maxTileHeight,
        });

        const viewport = this.gameService.getViewport()();

        this.gameService.updatePlayer({
            worldLocation: player.worldLocation,
            point: this.convertWorldCoordinates(viewport, player.worldLocation),
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

    resetPlayer() {
        const player = this.gameService.getPlayer()();
        const viewport = this.gameService.getViewport()();
        const original = cloneDeep(player.startingPosition);
        const originalPoint = this.convertWorldCoordinates(viewport, original);

        this.gameService.updatePlayer({
            worldLocation: original,
            point: originalPoint,
        });
    }

    getPlayerWindowCoordinates(): Accessor<Point> {
        const player = this.gameService.getPlayer()();
        const viewport = this.gameService.getViewport()();
        const point = this.convertWorldCoordinates(
            viewport,
            player.worldLocation,
        );

        const [getCoords, setCoords] = createSignal<{ x: number; y: number }>(
            point,
        );

        this.trackSubscription(
            zip(
                this.gameService.observePlayer(),
                this.gameService.observeViewport(),
            ).subscribe(([player, viewport]) => {
                setCoords(
                    this.convertWorldCoordinates(
                        viewport,
                        player.worldLocation,
                    ),
                );
            }),
        );

        return getCoords;
    }

    getPlayerTile(): Accessor<Player> {
        const player = this.gameService.getPlayer()();
        const viewport = this.gameService.getViewport()();
        const point = this.convertWorldCoordinates(
            viewport,
            player.worldLocation,
        );

        const [getPlayer, setPlayer] = createSignal<Player>({
            ...player,
            point: point,
        });

        this.trackSubscription(
            zip(
                this.gameService.observePlayer(),
                this.gameService.observeViewport(),
            ).subscribe(([player, viewport]) => {
                setPlayer({
                    ...player,
                    point: this.convertWorldCoordinates(
                        viewport,
                        player.worldLocation,
                    ),
                });
            }),
        );

        return getPlayer;
    }

    private convertWorldCoordinates(viewport: Viewport, point: Point): Point {
        const actualHeight =
            Math.floor(viewport.height / tileHeight) * tileHeight - tileHeight;

        const coords = {
            x: point.x * tileWidth,
            y: actualHeight - point.y * tileHeight,
        };

        return coords;
    }

    getBackgroundTiles(): Accessor<Tile[]> {
        const viewport = this.gameService.getViewport()();
        const level = this.gameService.getLevel()();
        const tiles = this.convertLevelTiles(viewport, level);
        const [getTiles, setTiles] = createSignal<Tile[]>(tiles);
        this.trackSubscription(
            zip(
                this.gameService.observeViewport(),
                this.gameService.observeLevel(),
            ).subscribe(([viewport, level]) => {
                setTiles(this.convertLevelTiles(viewport, level));
            }),
        );

        return getTiles;
    }

    private convertLevelTiles(viewport: Viewport, level: Level): Tile[] {
        return level.tiles.map((tile) => {
            return {
                ...tile,
                point: this.convertWorldCoordinates(
                    viewport,
                    tile.worldLocation,
                ),
            };
        });
    }
}
