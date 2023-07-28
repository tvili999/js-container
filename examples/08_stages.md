# Stages

When we need to run our application in multiple stages, it is better to utilize the module `stages`.

I.e. when you'd like to configure an express server, you'll need to:
 - configure the middlewares
 - set up static handlers
 - set up route handlers
 - set up fallback handlers
 - run listen

So this is 5 stages. We'll see an example on how to do it.

## Usage

First we need to configure a stages module, and tell which stages exist, then we can define runners for them.

```ts
import createContainer from "@tvili999/js-container";
import stage, { configureStages } from "@tvili999/js-container/stages"

createContainer(
    configureStages("myStages", ["stageA", "stageB"]),
    stage("myStages", "stageA", async ({get}) => {
        console.log("Stage A")
    }),
    stage("myStages", "stageB", async ({get}) => {
        console.log("Stage B")
    })
)
```

It is guaranteed that Stage A is printed before Stage B.

## Example with express

We can create a file that contains our server configuration.

Here we create a module with the server itself, and

```ts
// server.js
import express from "express"
import bodyParser from "body-parser"
import { configure, inject } from "@tvili999/js-container";
import stage, { configureStages } from "@tvili999/js-container/stages"

export default configure(
    inject("server", () => express()),
    configureStages("expressStages", [
        "config", "static", "routes", "fallback", "listen"
    ]),
    stage("expressStages", "config", async ({get}) => {
        const app = await get("server")

        app.listen(8080)
    }),
    stage("expressStages", "listen", async ({get}) => {
        const app = await get("server")

        app.listen(8080)
    }),
)
```

Then we can create i.e. a route.

```ts
// root.js
import createContainer, { inject } from "@tvili999/js-container";
import stage, { configureStages } from "@tvili999/js-container/stages"

configure(
    stage("expressStages", "routes", async ({get}) => {
        const app = await get("server")

        app.get("/", (req, res) => {
            res.send("Root site")
        })
    }),
)
```