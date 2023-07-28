# Module caching

When you do an `inject`, the builder function will only be ran once in the application's lifetime.

When you inject something twice, the same value will be reused.

## Example

Notice that this example will print `Builder of module:a ran` only once.

```js
import createContainer, {inject, run} from "@tvili999/js-container"

createContainer(
    inject("module:a", async () => {
        console.log("Builder of module:a ran")

        return {
            text: "Module A"
        }
    }),
    run(async ({get}) => {
        const moduleA = await get("module:a")

        console.log("First runner: ", moduleA.text)
    }),
    run(async ({get}) => {
        const moduleA = await get("module:a")

        console.log("Second runner: ", moduleA.text)
    })
)
```
