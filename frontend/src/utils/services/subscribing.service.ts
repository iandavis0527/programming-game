import { Subscription } from 'rxjs';
import { BaseService } from './base.service';

export class SubscribingService extends BaseService {
    private subscriptions: Subscription[] = [];

    protected trackSubscription(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    async cleanup(): Promise<void> {
        this.cleanupSubscriptions();
    }

    protected cleanupSubscriptions() {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
