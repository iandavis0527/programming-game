import { Observable, Subject } from 'rxjs';
import { BaseService } from './base.service';

export class InputService extends BaseService {
    private subject: Subject<KeyboardEvent> = new Subject();

    onKeyPressed(event: KeyboardEvent) {
        this.subject.next(event);
    }

    observe(): Observable<KeyboardEvent> {
        return this.subject.asObservable();
    }
}
