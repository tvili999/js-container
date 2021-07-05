module.exports = (container) => {
    const _configurators = [];

    const api = {
        add: (...configurators) => {
            _configurators.push(...configurators);
        },
        run: async () => {
            while(_configurators.length > 0) {
                const config = _configurators.pop();
                await Promise.resolve(config(container));
            }
        }
    };

    return api;
}