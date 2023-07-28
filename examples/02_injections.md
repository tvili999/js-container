# Injections

To provide modules you can use in runners, you need to inject them.

## Example

You can create a module with `inject`. It accepts a builder function as parameter that will return your module.

In this example we create a module that is an object with a field `text`. We need to return that module from a function.

```js
import createContainer, { run, inject } from "@tvili999/js-container"

createContainer(
    inject("module:a", async () => {
        return {
            text: "Module A"
        }
    }),
    run(async ({get}) => {
        const moduleA = await get("module:a");

        console.log(moduleA.text)
    })
)
```