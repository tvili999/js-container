module.exports = (...defaultArgs) => (...args) => {
    defaultArgs = [...defaultArgs];
    defaultArgs.reverse();

    args = [...args];
    args.reverse();
    for(let i = 0; i < args.length; i++)
        defaultArgs[i] = args[i];
    
    defaultArgs.reverse();

    return defaultArgs;
}
