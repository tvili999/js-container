const createComponent = require("./createComponent");
const testContext = require("./testContext");
const mockContext = require("./mockContext");

if(!global.log)
    global.log = () => {};

Object.assign(createComponent, {
    testContext: testContext(createComponent),
    ...mockContext
})

module.exports = createComponent;