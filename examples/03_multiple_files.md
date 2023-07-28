# Multiple files

You can organize these configurations in multiple files very easily.

## Example

You can simply export your inject and run configurations.

```js
// moduleA.js
import { configure } from "@tvili999/js-container"
export default inject("module:a", async () => {
    return {
        text: "Module A"
    }
})
```

```js
// runner.js
import { configure } from "@tvili999/js-container"
export default run(async ({get}) => {
    const moduleA = await get("module:a");

    console.log(moduleA.text)
})
```

Then you can simply import and specify it in the container

```js
// index.js
import container from "@tvili999/js-container"
import moduleA from "./moduleA.js"
import runner from "./runner.js"

container(moduleA, runner)
```

Notice how `runner.js` didn't need to know anything about `module:a` except its name and exported interface.

## Multiple directories

You probably don't want to list every file of every directory in your root `index.js`.

The solution for this is the `configure` function.

The two modules are the same:

```js
// modules/moduleA.js
import { inject } from "@tvili999/js-container"

export default inject("module:a", async () => {
    return {
        text: "Module A"
    }
})
```

```js
// modules/runner.js
import { run } from "@tvili999/js-container"

export default run(async ({get}) => {
    const moduleA = await get("module:a");

    console.log(moduleA.text)
})
```

But we can join these with `configure` method.

```js
// modules/index.js
import {configure} from "@tvili999/js-container"
import moduleA from "./moduleA.js"
import runner from "./runner.js"

export default configure(moduleA, runner)
```

And we can now use it in our root `index.js` like all other configurations.

```js
// index.js
import createContainer from "@tvili999/js-container"
import modules from "./modules.js"

createContainer(modules)
```