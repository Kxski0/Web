/** Minimaler Ereignis-Emitter. Rückgabewert von `on` meldet den Listener ab. */
export function createEmitter() {
  const listeners = new Map();

  return {
    on(event, fn) {
      const set = listeners.get(event) || new Set();
      set.add(fn);
      listeners.set(event, set);
      return () => set.delete(fn);
    },
    emit(event, payload) {
      const set = listeners.get(event);
      if (!set) return;
      // Kopie, damit ein Listener sich während des Durchlaufs abmelden darf.
      for (const fn of [...set]) {
        try {
          fn(payload);
        } catch (err) {
          console.error(`[bizdash] Fehler im Listener für "${event}"`, err);
        }
      }
    },
    clear() {
      listeners.clear();
    },
  };
}
