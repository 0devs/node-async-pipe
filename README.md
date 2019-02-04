# async-pipe

organize async functions and promises into pipe, like promise.then, promise.catch

original repo [kirillrogovoy/promised-pipe](https://github.com/kirillrogovoy/promised-pipe)


## install

```
npm i @0devs/async-pipe
```


## usage

<!-- TODO more examples -->

```js
import {pipe} from "@0devs/async-pipe";

pipe(
  async () => 0,
  async (s) => s + 1,
  async (s) => s + 1,
  async (s) => s + 1,
)
  .then((r) => {
    console.log(r);
  })
  .catch((e) => {
    console.log(e);
  });
```
