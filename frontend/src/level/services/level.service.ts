import autoBind from 'auto-bind';
import { distinctUntilChanged, zip } from 'rxjs';
import { Accessor, createSignal } from 'solid-js';
import { useService } from 'solid-services';
import { GameService } from '../../game/services/game.service';
import { Player } from '../../player/models/player.model';
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
     * Get the screen space coordinates for the current player's position.
     * @returns An accessor that will update the window coordinates for the player.
     */
    getPlayerWindowCoordinates(): Accessor<Point> {
        const player = this.gameService.getPlayer()();
        const point = this.convertWorldCoordinates(player.worldLocation);

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
                        player.worldLocation,
                        viewport,
                    ),
                );
            }),
        );

        return getCoords;
    }

    /**
     * Get a display tile for the player, with coordinates converted.
     * @returns The player tile.
     */
    getPlayerTile(): Accessor<Player> {
        const player = this.gameService.getPlayer()();
        const point = this.convertWorldCoordinates(player.worldLocation);

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
                        player.worldLocation,
                        viewport,
                    ),
                });
            }),
        );

        return getPlayer;
    }

    /**
     * Convert world coordinates to screen space coordinates (pixels).
     * @param point The world point to convert.
     * @returns The screen space point.
     */
    convertWorldCoordinates(point: Point, viewport?: Viewport): Point {
        viewport ??= this.gameService.getViewport()();
        const actualHeight =
            Math.floor(viewport.height / tileHeight) * tileHeight - tileHeight;

        const coords = {
            x: point.x * tileWidth,
            y: actualHeight - point.y * tileHeight,
        };

        return coords;
    }

    /**
     * Get all background tiles for the current level.
     * @returns
     */
    getBackgroundTiles(): Accessor<Tile[]> {
        const viewport = this.gameService.getViewport()();
        const level = this.gameService.getLevel()();
        const tiles = this.convertLevelTiles(level);
        const [getTiles, setTiles] = createSignal<Tile[]>(tiles);
        this.trackSubscription(
            zip(
                this.gameService.observeViewport(),
                this.gameService.observeLevel(),
            ).subscribe(([viewport, level]) => {
                setTiles(this.convertLevelTiles(level, viewport));
            }),
        );

        return getTiles;
    }

    /**
     * Get the current max tile width in world coordinates.
     */
    getMaxTileWidth() {
        return this.maxTileWidth;
    }

    /**
     * Get the current max tile height in world coordinates.
     */
    getMaxTileHeight() {
        return this.maxTileHeight;
    }

    /**
     * Given a point in world coordinates, return whether that tile is walkable in the current level.
     * @param point
     * @returns
     */
    isWalkableTile(point: Point): boolean {
        const tiles = this.getBackgroundTiles()();

        const matching = tiles.filter((tile) => {
            return (
                tile.worldLocation.x == point.x &&
                tile.worldLocation.y == point.y
            );
        });

        return matching.length >= 1;
    }

    private convertLevelTiles(level: Level, viewport?: Viewport): Tile[] {
        return level.tiles.map((tile) => {
            return {
                ...tile,
                point: this.convertWorldCoordinates(tile.worldLocation),
            };
        });
    }
}
