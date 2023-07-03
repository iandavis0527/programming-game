import { Player } from '../../player/models/player.model';
import clamp from '../../utils/math/clamp';
import { ReactiveSignalService } from '../../utils/services/reactive-signal.service';
import { Board } from '../models/board.model';
import {
    selectMaxTileHeight,
    selectMaxTileWidth,
} from '../selectors/tile.selector';
import { Tile } from '../tiles/models/tile';

export class BoardService extends ReactiveSignalService<Board> {
    private maxTileHeight: number;
    private maxTileWidth: number;

    constructor() {
        const tile_data: Tile[] = [];

        for (let row = 0; row < 20; row++) {
            for (let column = 0; column < 20; column++) {}
        }

        const player = {
            x: 0,
            y: 0,
        };

        super({
            tiles: tile_data,
            player: player,
        });

        this.maxTileHeight = selectMaxTileHeight(tile_data);
        this.maxTileWidth = selectMaxTileWidth(tile_data);
    }

    startNewBoard(tile_data: Tile[], player: Player) {
        this.subject.next({
            tiles: tile_data,
            player: player,
        });
    }

    movePlayerPosition(position: { x?: number; y?: number }) {
        const board = this.getter();

        if (position.x == null) {
            position.x = board.player.x;
        } else {
            position.x = clamp({
                value: position.x,
                min: 0,
                max: this.maxTileWidth,
            });
        }

        if (position.y == null) {
            position.y = board.player.y;
        } else {
            position.y = clamp({
                value: position.y,
                min: 0,
                max: this.maxTileHeight,
            });
        }

        this.subject.next({
            ...board,
            player: {
                ...board.player,
                x: position.x,
                y: position.y,
            },
        });
    }

    movePlayerUp() {
        const board = this.getter();
        this.movePlayerPosition({ y: board.player.y + 1 });
    }

    movePlayerDown() {
        const board = this.getter();
        this.movePlayerPosition({ y: board.player.y - 1 });
    }

    movePlayerLeft() {
        const board = this.getter();
        this.movePlayerPosition({ x: board.player.x - 1 });
    }

    movePlayerRight() {
        const board = this.getter();
        this.movePlayerPosition({ x: board.player.x + 1 });
    }
}
