# Dependencies

There are cases when you need to define ordering between runners. You can define this with the `dependency` configuration.

## Example

This example order `runner:a` will always run before `runner:b`

```js
import createContainer, {dependency, run} from "@tvili999/js-container"

createContainer(
    dependency("runner:b", { dependsOn: "runner:a" }),
    run("runner:a", async () => {
        console.log("Runner A")
    }),
    run("runner:b", async () => {
        console.log("Runner B")
    })
)
```

## Note

In most of the cases, you need this because your application startup has different stages. I.e. in express the middleware order matters:

```js
const app = express()

// config stage
app.use(bodyParser.json())

// static stage
app.use((req, res) => {
    if(fs.existsSync(req.path)) {
        res.send(fs.readFileSync(req.path))
    }
})

// routes stage
app.get("/", (req, res) => {
    res.send("OK")
})


// fallback stage
app.use((req, res) => {
    res.status(404).send("Not found")
})
```

In this case it is better to use `stages` module.
