# Basic usage

The goal of this package is to be able to break an application in well defined modules with dependencies.

The way it does so is by defining modules, and runners.

## Builder function

You can build your container with the default exported function like this:

```js
import createContainer from "@tvili999/js-container"

const container = createContainer()
```


## Runner

You can add a runner configuration like this:

```js
import createContainer, {run} from "@tvili999/js-container"

createContainer(
    run(async () => {
        console.log("Hello world!")
    })
)
```

You can specify multiple runners here like this:

```js
import createContainer, {run} from "@tvili999/js-container"

createContainer(
    run(async () => {
        console.log("Runner 1")
    }),
    run(async () => {
        console.log("Runner 2")
    }),
)
```

The order is not guaranteed. We have better ways for ordering runners.

