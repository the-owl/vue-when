# vue-when

[![NPM version](https://img.shields.io/npm/v/vue-when.svg?style=flat)](https://npmjs.org/package/vue-when)

`when()` is a reactive utility function that waits until some
condition becomes true using Vue reactivity system. This package is a port of [when-promise from MobX](https://mobx.js.org/refguide/when.html#when-promise)
for Vue.

# Install
```
$ npm install --save vue-when
```

# API
### `when(predicate: () => boolean): Promise<void>`
`when()` returns a promise that resolves when predicate returns a truthy value.
Predicate is re-evaluated every time when referenced reactive properties change. If the
predicate returns true at the time of `when()` call, the promise resolves
immediately.

# Examples and use cases

### Simple example
```js
import Vue from 'vue';
import when from 'vue-when';

const data = Vue.observable({
  value: 0
});

// will print 1 and 2 with ~5 second interval
async function test() {
  console.log(1);
  await when(() => data.value === 5);
  console.log(2);
}

setInterval(() => data.value++, 1000);
test();
``` 

### Wait until action finishes
```js
import when from 'vue-when';

// can be useful in case someFn() is called when some action is already running
async function someFn() {
  if (someService.listLoading) {
    // if action is already running - wait until it finishes
    await when(() => !someService.listLoading);
  } else {
    // otherwise, call the action itself
    await someService.loadList();
  }
  // (do something with list here)
}
```

### vue-router hook for access control
```js
import when from 'vue-when';
import store from '@/path/to/store';

const router = new Router(...);

router.beforeEach(async function (to, from, next) {
  // we need to init app (load user data) before running access control code
  await when(() => store.state.appInitialized);

  if (store.getters.isLoggedIn) {
    next();
  } else {
    next({ name: 'login' });
  }
});
```

# License
MIT