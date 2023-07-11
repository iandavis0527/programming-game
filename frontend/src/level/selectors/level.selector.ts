import { Level } from '../models/level.model';

export function selectMaxTileHeight(level: Level) {
    return level.tiles
        .map((tile) => tile.y)
        .reduce((previous, current) =>
            current > previous ? current : previous,
        );
}

export function selectMaxTileWidth(level: Level) {
    return level.tiles
        .map((tile) => tile.x)
        .reduce((previous, current) =>
            current > previous ? current : previous,
        );
}
