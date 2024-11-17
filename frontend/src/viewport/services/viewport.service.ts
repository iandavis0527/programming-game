import { Observable, firstValueFrom } from 'rxjs';
import { tileHeight, tileWidth } from '../../level';
import { Point } from '../../level/services/level.service';
import { filterNulls } from '../../utils/reactive/filtering';
import { ReactiveSignalService } from '../../utils/services/reactive-signal.service';
import { Viewport } from '../../viewport/models/viewport.model';

export class ViewportService extends ReactiveSignalService<
    Viewport | undefined
> {
    constructor() {
        super(undefined);
    }

    onMediaQueried(width: number, height: number) {
        this.subject.next({
            width: width,
            height: height,
        });
    }

    async getViewport(): Promise<Viewport> {
        let viewport = this.getter();

        if (viewport == null) {
            return firstValueFrom(this.subject.pipe(filterNulls));
        } else {
            return viewport;
        }
    }

    observeViewport(): Observable<Viewport> {
        return this.subject.pipe(filterNulls);
    }

    /**
     * Convert world coordinates to screen space coordinates (pixels).
     * @param point The world point to convert.
     * @returns The screen space point.
     */
    convertWorldCoordinates(point: Point): Point {
        const viewport = this.getter();

        if (viewport == null) {
            throw new Error(
                'Cannot convert screenspace coordinates before viewport initialized!',
            );
        }

        const actualHeight =
            Math.floor(viewport.height / tileHeight) * tileHeight - tileHeight;

        const coords = {
            x: point.x * tileWidth,
            y: actualHeight - point.y * tileHeight,
        };

        return coords;
    }
}
