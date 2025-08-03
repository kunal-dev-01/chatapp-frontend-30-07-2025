/*  Re-usable ripple effect – TypeScript  */
export function addRipple(el: HTMLElement): void {
  // Ensure non-static positioning
  if (getComputedStyle(el).position === 'static') {
    el.style.position = 'relative';
  }

  el.addEventListener('pointerdown', createRipple, { passive: true });
}

function createRipple(evt: PointerEvent): void {
  // Current target is always HTMLElement because we bind to HTMLElement only
  const host = evt.currentTarget as HTMLElement;

  // Find or create the container
  let container = host.querySelector('.ripple-container') as HTMLElement | null;
  if (!container) {
    container = document.createElement('span');
    container.className = 'ripple-container';
    host.appendChild(container);
  }

  const rect = host.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = evt.clientX - rect.left - size / 2;
  const y = evt.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  container.appendChild(ripple);

  ripple.addEventListener('animationend', () => {
    ripple.remove();
    if (container && container.children.length === 0) container.remove();
  });
}

/*  Convenience auto-initializer  */
export function initRipples(selector = '[data-ripple]'): void {
  document.addEventListener('DOMContentLoaded', () =>
    document.querySelectorAll<HTMLElement>(selector).forEach(addRipple)
  );
}