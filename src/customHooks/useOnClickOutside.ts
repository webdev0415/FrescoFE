import { useEffect } from 'react';

const useOnClickOutside = (refs, handler) => {
  useEffect(
    () => {
      const listener = event => {
        let ignoredElement = false;

        refs.forEach(ref => {
          if (!ref.current || ref.current.contains(event.target)) {
            ignoredElement = true;
          }
        });

        // Do nothing if clicking ref's element or descendent elements
        if (ignoredElement) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [refs, handler],
  );
};

export default useOnClickOutside;
