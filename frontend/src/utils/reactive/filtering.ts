import { Observable, filter } from 'rxjs';

export function filterNulls<T>(
    observable: Observable<T | null | undefined>,
): Observable<T> {
    return observable.pipe(
        filter((value): value is T => value != null && value != undefined),
    );
}
