export function bootstrapAPI(gameService, levelService, viewportService) {
    window.programmingGame = {
        gameService: gameService,
        levelService: levelService,
        viewportService: viewportService,
    };
}
