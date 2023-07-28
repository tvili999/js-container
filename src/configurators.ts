import { Configurator, Container } from "./types.js";

export default class Configurators {
    private configurators: Configurator[] = []

    constructor(private container: Container) { }

    add(...configurators: Configurator[]) {
        this.configurators.push(...configurators)
    }

    async run() {
        while(this.configurators.length > 0) {
            const config = this.configurators.pop();
            await Promise.resolve(config?.(this.container));
        }
    }
}
