export function highlighter(
  primaryClasses: string
): (s: string) => (s: string) => string {
  return function(secondaryClasses: string): (s: string) => string {
    return function(value: string): string {
      return `<span class="${primaryClasses} ${secondaryClasses}">${value}</span>`
    }
  }
}
