import autoBind from 'auto-bind';
import { Subject, Subscription } from 'rxjs';
import { Accessor, Setter, createSignal } from 'solid-js';
import { SubscribingService } from './subscribing.service';

export class ReactiveSignalConnection<T> {
    public readonly getter: Accessor<T>;
    public readonly setter: Setter<T>;

    public readonly subject: Subject<T>;

    private subscription: Subscription;

    constructor(initial: T) {
        autoBind(this);

        this.subject = new Subject<T>();

        this.subscription = this.subject.subscribe((value: T) => {
            this.setter(() => value);
        });

        const [getter, setter] = createSignal<T>(initial);

        this.getter = getter;
        this.setter = setter;
    }

    observe() {
        return this.subject.asObservable();
    }

    next(value: T) {
        return this.subject.next(value);
    }

    cleanup() {
        this.subscription.unsubscribe();
    }
}

export class MultiReactiveSignalManager {
    private reactiveSignals: ReactiveSignalConnection<any>[] = [];

    trackConnection(...signals: ReactiveSignalConnection<any>[]) {
        this.reactiveSignals.push(...signals);
    }

    async cleanup(): Promise<void> {
        for (const signal of this.reactiveSignals) {
            signal.cleanup();
        }
    }
}

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

    observe() {
        return this.subject.asObservable();
    }
}
