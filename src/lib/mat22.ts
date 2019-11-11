import { equalsApproximately } from './common'
import { Vec2 } from './vec2'

export class Mat2 extends Float32Array {
  /**
   * Create a new mat2 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m10 Component in column 1, row 0 position (index 2)
   * @param {Number} m11 Component in column 1, row 1 position (index 3)
   * @returns {mat2} out A new 2x2 matrix
   */
  constructor(m00 = 1, m01 = 0, m10 = 0, m11 = 1) {
    super(4)
    this[0] = m00
    this[1] = m01
    this[2] = m10
    this[3] = m11
  }

  // Creates a new mat2 initialized with values from an existing matrix
  clone(): Mat2 {
    return new Mat2(this[0], this[1], this[2], this[3])
  }

  // Copy the values from one mat2 to another
  copy(from: Mat2): Mat2 {
    this[0] = from[0]
    this[1] = from[1]
    this[2] = from[2]
    this[3] = from[3]
    return this
  }

  static identity(): Mat2 {
    return new Mat2(1, 0, 0, 1)
  }

  setIdentity(): Mat2 {
    this[0] = 1
    this[1] = 0
    this[2] = 0
    this[3] = 1
    return this
  }

  transpose(): Mat2 {
    // If we are transposing ourselves we can skip a few steps but have to cache
    // some values
    const a1 = this[1]
    this[1] = this[2]
    this[2] = a1
    return this
  }

  invert(): Mat2 {
    let det = this.determinant
    if (det === 0) return this
    det = 1 / det
    this[0] = this[3] * det
    this[1] = -this[1] * det
    this[2] = -this[2] * det
    this[3] = this[0] * det
    return this
  }

  adjoint(): Mat2 {
    const a0 = this[0]
    this[0] = this[3]
    this[1] = -this[1]
    this[2] = -this[2]
    this[3] = a0
    return this
  }

  get determinant(): number {
    return this[0] * this[3] - this[2] * this[1]
  }

  // Multiplies two mat2's
  multiply(b: Mat2): Mat2 {
    const a0 = this[0],
      a1 = this[1],
      a2 = this[2],
      a3 = this[3]
    const b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3]
    this[0] = a0 * b0 + a2 * b1
    this[1] = a1 * b0 + a3 * b1
    this[2] = a0 * b2 + a2 * b3
    this[3] = a1 * b2 + a3 * b3
    return this
  }

  // Rotates by the given angle
  rotate(rad: number): Mat2 {
    const a0 = this[0],
      a1 = this[1],
      a2 = this[2],
      a3 = this[3]
    const s = Math.sin(rad)
    const c = Math.cos(rad)
    this[0] = a0 * c + a2 * s
    this[1] = a1 * c + a3 * s
    this[2] = a0 * -s + a2 * c
    this[3] = a1 * -s + a3 * c
    return this
  }

  // Scales the mat2 by the dimensions in the given vec2
  scale(v: Vec2): Mat2 {
    const a0 = this[0],
      a1 = this[1],
      a2 = this[2],
      a3 = this[3]
    const v0 = v[0],
      v1 = v[1]
    this[0] = a0 * v0
    this[1] = a1 * v0
    this[2] = a2 * v1
    this[3] = a3 * v1
    return this
  }

  /**
   * Creates a matrix from a given angle
   * This is equivalent to (but much faster than):
   *
   *     mat2.setIdentity();
   *     mat2.rotate(rad);
   *
   * @param {Number} rad the angle to rotate the matrix by
   */
  fromRotation(rad: number): Mat2 {
    const s = Math.sin(rad)
    const c = Math.cos(rad)
    this[0] = c
    this[1] = s
    this[2] = -s
    this[3] = c
    return this
  }

  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat2.setIdentity();
   *     mat2.scale(vec);
   *
   * @param {mat2} out mat2 receiving operation result
   * @param {vec2} v Scaling vector
   */
  fromScaling(v: Vec2): Mat2 {
    this[0] = v[0]
    this[1] = 0
    this[2] = 0
    this[3] = v[1]
    return this
  }

  // Returns a string representation of a mat2
  toString(): string {
    return `mat2(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`
  }

  // Frobenius norm http://mathworld.wolfram.com/FrobeniusNorm.html
  frobeniusNorm(): number {
    return Math.hypot(this[0], this[1], this[2], this[3])
  }

  /**
   * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
   * @param {mat2} L the lower triangular matrix
   * @param {mat2} U the upper triangular matrix
   */
  LDU(lowerTriangular: Mat2, upperTriangular: Mat2): void {
    lowerTriangular[2] = this[2] / this[0]
    upperTriangular[0] = this[0]
    upperTriangular[1] = this[1]
    upperTriangular[3] = this[3] - lowerTriangular[2] * upperTriangular[1]
  }

  add(b: Mat2): Mat2 {
    this[0] += b[0]
    this[1] += b[1]
    this[2] += b[2]
    this[3] += b[3]
    return this
  }

  subtract(b: Mat2): Mat2 {
    this[0] -= b[0]
    this[1] -= b[1]
    this[2] -= b[2]
    this[3] -= b[3]
    return this
  }

  // Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
  equalExact(b: Mat2): boolean {
    return this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3]
  }

  equalsApproximately(b: Mat2): boolean {
    const a0 = this[0],
      a1 = this[1],
      a2 = this[2],
      a3 = this[3]
    const b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3]

    return (
      equalsApproximately(a0, b0) &&
      equalsApproximately(a1, b1) &&
      equalsApproximately(a2, b2) &&
      equalsApproximately(a3, b3)
    )
  }

  multiplyScalar(b: number): Mat2 {
    this[0] *= b
    this[1] *= b
    this[2] *= b
    this[3] *= b
    return this
  }
}
