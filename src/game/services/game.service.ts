import { Level } from 'level/models/level.model';
import { Player } from 'player/models/player.model';
import { Observable } from 'rxjs';
import { Accessor } from 'solid-js';
import { useService } from 'solid-services';
import {
    MultiReactiveSignalManager,
    ReactiveSignalConnection,
} from 'utils/services/reactive-signal.service';
import { SubscribingService } from 'utils/services/subscribing.service';
import { Viewport } from 'viewport/models/viewport.model';
import { ViewportService } from 'viewport/services/viewport.service';

export class GameService extends SubscribingService {
    private signalManager: MultiReactiveSignalManager;

    private levelSignalConnection!: ReactiveSignalConnection<Level>;
    private playerSignalConnection!: ReactiveSignalConnection<Player>;
    private viewportSignalConnection!: ReactiveSignalConnection<Viewport>;

    private viewportService: ViewportService;

    constructor() {
        super();

        this.signalManager = new MultiReactiveSignalManager();
        this.viewportService = useService(ViewportService)();
    }

    async initialize(): Promise<void> {
        const viewport = await this.viewportService.getViewport();
        const level = await this.loadLevelData();
        const player = await this.loadPlayerData();

        this.levelSignalConnection = new ReactiveSignalConnection(level);
        this.playerSignalConnection = new ReactiveSignalConnection(player);
        this.viewportSignalConnection = new ReactiveSignalConnection(viewport);

        this.signalManager.trackConnection(
            this.levelSignalConnection,
            this.playerSignalConnection,
            this.viewportSignalConnection,
        );

        this.trackSubscription(
            this.viewportService
                .observeViewport()
                .subscribe(this.onViewportChanged),
        );
    }

    async onViewportChanged(viewport: Viewport) {
        // TODO
        this.viewportSignalConnection.next(viewport);
    }

    async loadPlayerData(): Promise<Player> {
        return {
            x: 0,
            y: 0,
        };
    }

    async loadLevelData(): Promise<Level> {
        return {
            tiles: [
                {
                    x: 0,
                    y: 0,
                },
                {
                    x: 1,
                    y: 0,
                },
                {
                    x: 2,
                    y: 0,
                },
                {
                    x: 3,
                    y: 0,
                },
                {
                    x: 4,
                    y: 0,
                },
                {
                    x: 5,
                    y: 1,
                },
            ],
        };
    }

    async cleanup(): Promise<void> {
        await this.signalManager.cleanup();
    }

    /**
     * Update the current player attributes, reactively.
     * @param player The player attributes to update.
     */
    updatePlayer(player: Partial<Player>) {
        const current = this.playerSignalConnection.getter();

        this.playerSignalConnection.next({
            ...current,
            ...player,
        });
    }

    getLevel(): Accessor<Level> {
        return this.levelSignalConnection.getter;
    }

    getPlayer(): Accessor<Player> {
        return this.playerSignalConnection.getter;
    }

    getViewport(): Accessor<Viewport> {
        return this.viewportSignalConnection.getter;
    }

    observeLevel(): Observable<Level> {
        return this.levelSignalConnection.observe();
    }

    observePlayer(): Observable<Player> {
        return this.playerSignalConnection.observe();
    }

    observeViewport(): Observable<Viewport> {
        return this.viewportSignalConnection.observe();
    }
}
