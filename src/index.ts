import { watch } from 'vue';

/**
 * Returns a promise that resolves when predicate value changes to true.
 * (does the same thing as when() in mobX)
 *
 * @param predicate
 */
export default function when(predicate: () => any) {
  return new Promise<void>((resolve, reject) => {
    if (predicate()) {
      resolve();
      return;
    }

    const wrappedPredicate = () => {
      try {
        return [null, predicate()];
      } catch (error) {
        return [error, null];
      }
    };

    const unwatch = watch(wrappedPredicate, ([error, result]) => {
      if (error || result) {
        unwatch();
      }

      if (error) {
        reject(error);
      } else if (result) {
        resolve();
      }
    });
  });
}
