import { Observable, firstValueFrom } from 'rxjs';
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
}
