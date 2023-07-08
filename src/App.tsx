import { Component, lazy } from 'solid-js';
import { ServiceRegistry, useService } from 'solid-services';
import styles from './App.module.css';
import { bootstrapAPI } from './bootstrap_api';
import { GameService } from './game/services/game.service';
import { CodeIDE } from './ide/components/ide.component';
import { LevelComponent, LevelService } from './level';
import { ViewportService } from './viewport';

const App: Component = () => {
    return (
        <ServiceRegistry>
            <ServiceManager>
                <div class={styles.app_container}>
                    <CodeIDE />
                    <LevelComponent />
                </div>
            </ServiceManager>
        </ServiceRegistry>
    );
};

const ServiceManager = lazy(async () => {
    const gameService = useService(GameService)();
    const levelService = useService(LevelService)();
    const viewportService = useService(ViewportService)();

    bootstrapAPI(gameService, levelService, viewportService);

    viewportService.onMediaQueried(840, 703);

    await gameService.initialize();

    const ManagerComponent: Component<any> = (props: { children: any }) => {
        return <>{props.children}</>;
    };

    return { default: ManagerComponent };
});

export default App;
