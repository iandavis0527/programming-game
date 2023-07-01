import { Tile } from '../tiles/models/tile';

export function selectMaxTileHeight(tiles: Tile[]) {
    return tiles
        .map((tile) => tile.y)
        .reduce((previous, current) =>
            current > previous ? current : previous,
        );
}

export function selectMaxTileWidth(tiles: Tile[]) {
    return tiles
        .map((tile) => tile.x)
        .reduce((previous, current) =>
            current > previous ? current : previous,
        );
}
