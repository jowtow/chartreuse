"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Fires a callback whenever the given key is pressed.
 * Only active when `enabled` is true.
 */
export function useKeyPress(
  targetKey: string,
  onPress: () => void,
  enabled = true
) {
  const onPressRef = useRef(onPress);

  // Keep ref up-to-date without recreating the event listener
  useLayoutEffect(() => {
    onPressRef.current = onPress;
  });

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === targetKey || e.key === targetKey) {
        e.preventDefault();
        onPressRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [targetKey, enabled]);
}

/**
 * Fires a callback on spacebar press.
 */
export function useSpacebar(onPress: () => void, enabled = true) {
  return useKeyPress("Space", onPress, enabled);
}
