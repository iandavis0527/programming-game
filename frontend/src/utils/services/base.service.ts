import { Service } from 'solid-services';

export class BaseService extends Service {
    /**
     * Perform any service initialization here.
     * This is to permit the service manager to initialize services in
     * the proper order.
     */
    async initialize() {}

    /**
     * Perform any cleanup processes here.
     * This is to permit the service manager to cleanup resources if necessary.
     */
    async cleanup() {}
}
