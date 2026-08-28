/** Fuegt Klassennamen zusammen und filtert leere Werte heraus. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
