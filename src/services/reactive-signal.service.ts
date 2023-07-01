import { Subject } from 'rxjs';
import { Accessor, Setter, createSignal } from 'solid-js';
import { SubscribingService } from './subscribing.service';

export class ReactiveSignalService<T> extends SubscribingService {
    public readonly setter: Setter<T>;
    public readonly getter: Accessor<T>;

    protected readonly subject: Subject<T>;

    constructor(initial: T) {
        super();

        this.subject = new Subject<T>();

        // Subscribe to our subject to ensure that updates here
        // are reflected in our signal.
        this.trackSubscription(
            this.subject.subscribe((value: T) => {
                this.setter(() => value);
            }),
        );

        const [getter, setter] = createSignal<T>(initial);

        this.getter = getter;
        this.setter = setter;
    }

    get value() {
        return this.getter;
    }
}
