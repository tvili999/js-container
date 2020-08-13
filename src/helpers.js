module.exports = {};
module.exports.randomString = function(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ )
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
};

module.exports.promisize = function(value) {
    if (typeof value?.then === "function")
        return value;
    if(typeof value === "function")
        return async (...args) => value(...args);
    else 
        return async () => value;
}
