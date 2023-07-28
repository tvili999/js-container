# Init runners

Usually programs have two stages: An init stage and a running stage.
You can define init runners with `init` configuration.

Init runners will always run before normal runners, and you cannot set up dependencies between init runners. It is because they are intended to initialize a single "thing".

## Example

Here it `init` will always run before `run`

```js
import createContainer, {init, run} from "@tvili999/js-container"

createContainer(
    init(async () => {
        console.log("Initialize")
    }),
    run(async () => {
        console.log("Run")
    })
)
```
