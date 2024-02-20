# MSW request intercept issue repro

## Steps to reproduce

1. Clone this repo
2. Run `npm i`
3. Run `node index.mjs`

Observe that MSW did not intercept the request.

Now, comment out the following line in `index.mjs`:

```js
import * as https from "node:https";
```

And uncomment the following line:

```js
// import https from "node:https";
```

Run `node index.mjs` again and observe that MSW now intercepts the request as expected.
