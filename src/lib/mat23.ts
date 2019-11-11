import { equalsApproximately } from './common'
import { Vec2 } from './vec2'

/**
 * 2x3 Matrix
 * @module mat2d
 *
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b,
 *  c, d,
 *  tx, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0,
 *  c, d, 0,
 *  tx, ty, 1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */
export class Mat23 extends Float32Array {
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    super(6)
    this[0] = a
    this[1] = b
    this[2] = c
    this[3] = d
    this[4] = tx
    this[5] = ty
  }

  setIdentity(): Mat23 {
    this.set([1, 0, 0, 1, 0, 0])
    return this
  }

  clone(): Mat23 {
    return new Mat23(this[0], this[1], this[2], this[3], this[4], this[5])
  }

  copy(b: Mat23): Mat23 {
    this[0] = b[0]
    this[1] = b[1]
    this[2] = b[2]
    this[3] = b[3]
    this[4] = b[4]
    this[5] = b[5]
    return this
  }

  /**
   * Set a mat2d to the identity matrix
   *
   * @param {mat2d} out the receiving matrix
   * @returns {mat2d} out
   */
  static identity(): Mat23 {
    return new Mat23(1, 0, 0, 1, 0, 0)
  }

  invert(): Mat23 {
    let det = this.determinant
    if (!det) {
      return this
    }
    det = 1 / det
    const [aa, ab, ac, ad, atx, aty] = this
    this[0] = ad * det
    this[1] = -ab * det
    this[2] = -ac * det
    this[3] = aa * det
    this[4] = (ac * aty - ad * atx) * det
    this[5] = (ab * atx - aa * aty) * det
    return this
  }

  get determinant(): number {
    return this[0] * this[3] - this[1] * this[2]
  }

  multiply(b: Mat23): Mat23 {
    const [a0, a1, a2, a3, a4, a5] = this
    const [b0, b1, b2, b3, b4, b5] = b
    this[0] = a0 * b0 + a2 * b1
    this[1] = a1 * b0 + a3 * b1
    this[2] = a0 * b2 + a2 * b3
    this[3] = a1 * b2 + a3 * b3
    this[4] = a0 * b4 + a2 * b5 + a4
    this[5] = a1 * b4 + a3 * b5 + a5
    return this
  }

  rotate(rad: number): Mat23 {
    const [a0, a1, a2, a3] = this
    const s = Math.sin(rad)
    const c = Math.cos(rad)
    this[0] = a0 * c + a2 * s
    this[1] = a1 * c + a3 * s
    this[2] = a0 * -s + a2 * c
    this[3] = a1 * -s + a3 * c
    return this
  }

  scale(v: Vec2): Mat23 {
    const [a0, a1, a2, a3] = this
    const [v0, v1] = v
    this[0] = a0 * v0
    this[1] = a1 * v0
    this[2] = a2 * v1
    this[3] = a3 * v1
    return this
  }

  translate(v: Vec2): Mat23 {
    const [a0, a1, a2, a3, a4, a5] = this
    const [v0, v1] = v
    this[4] = a0 * v0 + a2 * v1 + a4
    this[5] = a1 * v0 + a3 * v1 + a5
    return this
  }

  static fromRotation(rad: number): Mat23 {
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    return new Mat23(c, s, -s, c, 0, 0)
  }

  static fromScaling(v: Vec2): Mat23 {
    return new Mat23(v[0], 0, 0, v[1], 0, 0)
  }

  static fromTranslation(v: Vec2): Mat23 {
    return new Mat23(1, 0, 0, 1, v[0], v[1])
  }

  toString(): string {
    const [a, b, c, d, e, f] = this
    return `mat2d(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`
  }

  frobeniusNorm(): number {
    const [a0, a1, a2, a3, a4, a5] = this
    return Math.hypot(a0, a1, a2, a3, a4, a5, 1)
  }

  add(b: Mat23): Mat23 {
    this[0] += b[0]
    this[1] += b[1]
    this[2] += b[2]
    this[3] += b[3]
    this[4] += b[4]
    this[5] += b[5]
    return this
  }

  subtract(b: Mat23): Mat23 {
    this[0] -= b[0]
    this[1] -= b[1]
    this[2] -= b[2]
    this[3] -= b[3]
    this[4] -= b[4]
    this[5] -= b[5]
    return this
  }

  multiplyScalar(b: number): Mat23 {
    this[0] *= b
    this[1] *= b
    this[2] *= b
    this[3] *= b
    this[4] *= b
    this[5] *= b
    return this
  }

  equalsExact(b: Mat23): boolean {
    const [a0, a1, a2, a3, a4, a5] = this
    const [b0, b1, b2, b3, b4, b5] = b
    return a0 === b0 && a1 === b1 && a2 === b2 && a3 === b3 && a4 === b4 && a5 === b5
  }

  equalsApproximately(b: Mat23): boolean {
    const [a0, a1, a2, a3, a4, a5] = this
    const [b0, b1, b2, b3, b4, b5] = b
    return (
      equalsApproximately(a0, b0) &&
      equalsApproximately(a1, b1) &&
      equalsApproximately(a2, b2) &&
      equalsApproximately(a3, b3) &&
      equalsApproximately(a4, b4) &&
      equalsApproximately(a5, b5)
    )
  }
}
