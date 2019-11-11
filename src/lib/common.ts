// Common utilities

// Configuration Constants
export const EPSILON = 0.000001
export const RANDOM = Math.random

export const degree2rad = Math.PI / 180

// Tests whether or not the arguments have approximately the same value, within an absolute
// or relative tolerance of EPSILON (an absolute tolerance is used for values less
// than or equal to 1.0, and a relative tolerance is used for larger values)
export function equalsApproximately(a: number, b: number): boolean {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b))
}

const bytes = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT)
const floatView = new Float32Array(bytes)
const intView = new Uint32Array(bytes)
const threehalfs = 1.5

// https://medium.com/hard-mode/the-legendary-fast-inverse-square-root-e51fee3b49d9
export function inverseSqrt(n: number): number {
  const x2 = n * 0.5
  floatView[0] = n
  intView[0] = 0x5f3759df - (intView[0] >> 1)
  let y = floatView[0]
  y = y * (threehalfs - x2 * y * y)
  // y = y * (threehalfs - x2 * y * y)
  return y
}

// Inverse q3 inverse sqrt
export function sqrt(n: number): number {
  return 1 / inverseSqrt(n)
}
