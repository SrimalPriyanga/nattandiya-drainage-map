/** Read at call time so a change to the OS setting applies without a reload. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
