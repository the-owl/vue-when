import when from './src';
import Vue from 'vue';

test('basic functionality', async () => {
  const data = Vue.observable({
    reachedEnd: false,
    stop: true,
  });

  async function testFn() {
    await when(() => !data.stop);
    data.reachedEnd = true;
  }

  testFn();
  expect(data.reachedEnd).toBeFalsy();
  data.stop = false;
  await Vue.nextTick();
  expect(data.reachedEnd).toBeTruthy();
});

test('immediate resolve', async () => {
  const data = Vue.observable({
    reachedEnd: false,
  });

  async function testFn() {
    await when(() => true);
    data.reachedEnd = true;
  }

  testFn();
  await Vue.nextTick();
  expect(data.reachedEnd).toBeTruthy();
});

test('immediate error propagation', () => {
  return expect(async () => {
    await when(() => {
      throw new Error();
    });
  }).rejects.toThrow();
});

test('watcher error propagation', () => {
  const data = Vue.observable({
    flag: false,
  });

  async function testFn() {
    await when(() => {
      if (data.flag) {
        throw new Error();
      }
    });
  }

  const promise = expect(testFn()).rejects.toThrow();
  data.flag = true;
  return promise;
});
