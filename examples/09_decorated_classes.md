# Decorated classes

Sometimes it is more handy to write our services as classes. That way you can create stub objects using libraries like `Sinon` automatically, and typescript will just work with them.

You can use the decorator and class based syntax. Remember, this is just syntax sugar. In the background we will still create injections and runners.

## Simple module

We can create a simple class, and transform it to a configurator using `toConfigurator`.

```ts
import { toConfigurator } from "@tvili999/js-container/decorateors";

export class HelloWorldService {
    print() {
        console.log("Hello world!");
    }
}

export default toConfigurator(HelloWorldService)
```

And now we can use it by its class:

```ts
import { run } from "@tvili999/js-container";

export default run(async ({get}) => {
    const helloWorldService = await get(HelloWorldService);

    helloWorldService.print()
})
```

## Inject

It is possible that we want to use some other services from our class.

We can use the `Inject` decorator. \
This is not the same as our original `inject`. With this we can inject other modules to the class.

```ts
import { toConfigurator, Inject } from "@tvili999/js-container/decorateors";
import { LogService } from "./log.service.js"

export class HelloWorldService {
    @Inject(LogService)
    logger;

    print() {
        this.logger.log("Hello world!");
    }
}

export default toConfigurator(HelloWorldService)
```

## Build

It is a common scenario in functional injects to do some build up before returning our module. \
I.e. for a model, we can sync the model with the db table before returning the actual model.

In some cases, the constructor is OK, but it has a few limitations:

 - Constructor is not async
 - We cannot inject the dependencies before the constructor, so we cannot use them.

In these cases we can use the `Build` decorator:

```ts
import { toConfigurator, Inject, Build } from "@tvili999/js-container/decorateors";
import { LogService } from "./log.service.js"

export class HelloWorldService {
    @Inject(LogService)
    logService;

    logger;

    @Build()
    async buildService() {
        this.logger = await this.logService.create("hello world");
    }

    print() {
        this.logger.log("Hello world!");
    }
}

export default toConfigurator(HelloWorldService)
```

It is guaranteed that `build` will run before anything injects this class, so we can initialize the class safely from here.

## Runners

Sometimes we want to inject, and run something at the same time.

In these cases we can use the `Init` and the `Run` decorators:

```ts
import { toConfigurator, Inject } from "@tvili999/js-container/decorateors";
import { ExpressApp } from "./expressApp.js"
import bodyParser from "body-parser";

export class Server {
    @Inject(ExpressApp)
    server;

    @Init()
    init() {
        server.use(bodyParser.json())
    }

    @Run()
    run() {
        server.listen(3000)
    }
}

export default toConfigurator(Server)
```

## Typescript support

It is the main reason this module exists. We can now inject classes directly, and the types will just work:

```ts
class SomeService { }

export default configure(
    toConfigurator(SomeService),
    run(async ({get}) => {
        const someService = await get(SomeService);
        // someService will have type SomeService
    })
)
```
