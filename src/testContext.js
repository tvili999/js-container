module.exports = container => (...components) => new Promise(resolve => {
    components = [...components];
    const resolver = components.pop();

    container(
        ...components,
        container => (container
            .run(async (container) => {
                if(typeof resolver === "string")
                    resolve(await container.get(resolver))
                else
                    resolve(await handler(container))
            })
        )
    )
})
