import Vue from 'vue';

// used only for watchers here
// vuex internally uses the same pattern with separate vue instance for its watchers
const watcherVM = new Vue();

/**
 * Returns a promise that resolves when predicate value changes to true.
 * (does the same thing as when() in mobX)
 *
 * @param predicate
 */
export default function when(predicate: () => any) {
  return new Promise<void>(resolve => {
    if (predicate()) {
      resolve();
      return;
    }
    const unwatch = watcherVM.$watch(predicate, result => {
      if (result) {
        unwatch();
        resolve();
      }
    });
  });
}
