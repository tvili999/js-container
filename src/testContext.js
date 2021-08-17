module.exports = container => async (...components) => {
    components = [...components];
    const resolver = components.pop();

    const app = await container(...components);
    if(typeof resolver === "string")
        return await app.get(resolver);
    return await resolver(container);
}
