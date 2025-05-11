export function hexToNumber(hex: string): number {
  // Remove the # if it exists
  hex = hex.replace(/^#/, "")

  // Parse the hex string to a number
  return Number.parseInt(hex, 16)
}

export function numberToHex(num: number): string {
  // Convert number to hex string and ensure it has 6 digits
  const hex = num.toString(16).padStart(6, "0")

  // Add the # prefix
  return `#${hex}`
}
