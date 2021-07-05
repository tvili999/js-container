module.exports = container => (name, component) => new Promise(resolve => {
    container(
        component,
        container => (container
            .run(async ({ get }) => resolve(await get(name)))
        )
    )
})
