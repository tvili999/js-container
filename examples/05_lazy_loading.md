# Lazy loading

When you don't read an injected value in the application, it will not be built.

## Example

This example will not print `Builder of module:a ran`.

```js
import createContainer, {inject, run} from "@tvili999/js-container"

createContainer(
    inject("module:a", async () => {
        console.log("Builder of module:a ran")

        return {
            text: "Module A"
        }
    }),
    run(async () => {
        console.log("Runner")
    })
)
```
