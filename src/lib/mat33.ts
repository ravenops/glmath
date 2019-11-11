import { equalsApproximately } from './common'
import { Mat23 } from './mat23'
import { Mat4 } from './mat44'
import { Quat } from './quat'
import { Vec2 } from './vec2'

// 3x3 Matrix
export class Mat3 extends Float32Array {
  /**
   * Create a new mat3 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m10 Component in column 1, row 0 position (index 3)
   * @param {Number} m11 Component in column 1, row 1 position (index 4)
   * @param {Number} m12 Component in column 1, row 2 position (index 5)
   * @param {Number} m20 Component in column 2, row 0 position (index 6)
   * @param {Number} m21 Component in column 2, row 1 position (index 7)
   * @param {Number} m22 Component in column 2, row 2 position (index 8)
   */
  constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
    super(9)
    this[0] = m00
    this[1] = m01
    this[2] = m02
    this[3] = m10
    this[4] = m11
    this[5] = m12
    this[6] = m20
    this[7] = m21
    this[8] = m22
    return this
  }

  setIdentity(): Mat3 {
    this.set([1, 0, 0, 0, 1, 0, 0, 0, 1])
    return this
  }

  // Copies the upper-left 3x3 values into the given mat3.
  static fromMat4(a: Mat4): Mat3 {
    return new Mat3(a[0], a[1], a[2], a[4], a[5], a[6], a[8], a[9], a[10])
  }

  clone(): Mat3 {
    return new Mat3(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8])
  }

  copy(a: Mat3): Mat3 {
    this[0] = a[0]
    this[1] = a[1]
    this[2] = a[2]
    this[3] = a[3]
    this[4] = a[4]
    this[5] = a[5]
    this[6] = a[6]
    this[7] = a[7]
    this[8] = a[8]
    return this
  }

  /**
   * Set a mat3 to the identity matrix
   *
   * @param {mat3} out the receiving matrix
   * @returns {mat3} out
   */
  static identity(): Mat3 {
    return new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1)
  }

  transpose(): Mat3 {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    const a01 = this[1]
    const a02 = this[2]
    const a12 = this[5]
    this[1] = this[3]
    this[2] = this[6]
    this[3] = a01
    this[5] = this[7]
    this[6] = a02
    this[7] = a12
    return this
  }

  invert(): Mat3 {
    const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = this
    const b01 = a22 * a11 - a12 * a21
    const b11 = -a22 * a10 + a12 * a20
    const b21 = a21 * a10 - a11 * a20

    // Calculate the determinant
    let det = this.determinant
    if (!det) {
      return this
    }
    det = 1 / det

    this[0] = b01 * det
    this[1] = (-a22 * a01 + a02 * a21) * det
    this[2] = (a12 * a01 - a02 * a11) * det
    this[3] = b11 * det
    this[4] = (a22 * a00 - a02 * a20) * det
    this[5] = (-a12 * a00 + a02 * a10) * det
    this[6] = b21 * det
    this[7] = (-a21 * a00 + a01 * a20) * det
    this[8] = (a11 * a00 - a01 * a10) * det
    return this
  }

  adjoint(): Mat3 {
    const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = this
    this[0] = a11 * a22 - a12 * a21
    this[1] = a02 * a21 - a01 * a22
    this[2] = a01 * a12 - a02 * a11
    this[3] = a12 * a20 - a10 * a22
    this[4] = a00 * a22 - a02 * a20
    this[5] = a02 * a10 - a00 * a12
    this[6] = a10 * a21 - a11 * a20
    this[7] = a01 * a20 - a00 * a21
    this[8] = a00 * a11 - a01 * a10
    return this
  }

  get determinant(): number {
    // const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = this
    // return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20)
    const a00 = this[0],
      a01 = this[1],
      a02 = this[2]
    const a10 = this[3],
      a11 = this[4],
      a12 = this[5]
    const a20 = this[6],
      a21 = this[7],
      a22 = this[8]

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20)
  }

  multiply(b: Mat3): Mat3 {
    const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = this
    const [b00, b01, b02, b10, b11, b12, b20, b21, b22] = b

    this[0] = b00 * a00 + b01 * a10 + b02 * a20
    this[1] = b00 * a01 + b01 * a11 + b02 * a21
    this[2] = b00 * a02 + b01 * a12 + b02 * a22

    this[3] = b10 * a00 + b11 * a10 + b12 * a20
    this[4] = b10 * a01 + b11 * a11 + b12 * a21
    this[5] = b10 * a02 + b11 * a12 + b12 * a22

    this[6] = b20 * a00 + b21 * a10 + b22 * a20
    this[7] = b20 * a01 + b21 * a11 + b22 * a21
    this[8] = b20 * a02 + b21 * a12 + b22 * a22
    return this
  }

  translate(v: Vec2): Mat3 {
    const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = this
    const [x, y] = v
    this[6] = x * a00 + y * a10 + a20
    this[7] = x * a01 + y * a11 + a21
    this[8] = x * a02 + y * a12 + a22
    return this
  }

  rotate(rad: number): Mat3 {
    const [a00, a01, a02, a10, a11, a12] = this
    const c = Math.cos(rad)
    const s = Math.sin(rad)

    this[0] = c * a00 + s * a10
    this[1] = c * a01 + s * a11
    this[2] = c * a02 + s * a12

    this[3] = c * a10 - s * a00
    this[4] = c * a11 - s * a01
    this[5] = c * a12 - s * a02

    return this
  }

  scale(v: Vec2): Mat3 {
    const [x, y] = v
    this[0] *= x
    this[1] *= x
    this[2] *= x
    this[3] *= y
    this[4] *= y
    this[5] *= y
    return this
  }

  // Creates a matrix from a vector translation
  static fromTranslation(v: Vec2): Mat3 {
    const [x, y] = v
    return new Mat3(1, 0, 0, 0, 1, 0, x, y, 1)
  }

  static fromRotation(rad: number): Mat3 {
    const c = Math.cos(rad)
    const s = Math.sin(rad)

    return new Mat3(c, s, 0, -s, c, 0, 0, 0, 1)
  }

  static fromScaling(v: Vec2): Mat3 {
    const [x, y] = v
    return new Mat3(x, 0, 0, 0, y, 0, 0, 0, 1)
  }

  static fromMat23(a: Mat23): Mat3 {
    const [a0, a1, a2, a3, a4, a5] = a
    return new Mat3(a0, a1, 0, a2, a3, 0, a4, a5, 1)
  }

  static fromQuat(q: Quat): Mat3 {
    const [x, y, z, w] = q
    const x2 = x + x
    const y2 = y + y
    const z2 = z + z

    const xx = x * x2
    const yx = y * x2
    const yy = y * y2
    const zx = z * x2
    const zy = z * y2
    const zz = z * z2
    const wx = w * x2
    const wy = w * y2
    const wz = w * z2

    return new Mat3(1 - yy - zz, yx + wz, zx - wy, yx - wz, 1 - xx - zz, zy + wx, zx + wy, zy - wx, 1 - xx - yy)
  }

  static normalFromMat4(a: Mat4): Mat3 {
    const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = a
    const b00 = a00 * a11 - a01 * a10
    const b01 = a00 * a12 - a02 * a10
    const b02 = a00 * a13 - a03 * a10
    const b03 = a01 * a12 - a02 * a11
    const b04 = a01 * a13 - a03 * a11
    const b05 = a02 * a13 - a03 * a12
    const b06 = a20 * a31 - a21 * a30
    const b07 = a20 * a32 - a22 * a30
    const b08 = a20 * a33 - a23 * a30
    const b09 = a21 * a32 - a22 * a31
    const b10 = a21 * a33 - a23 * a31
    const b11 = a22 * a33 - a23 * a32

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

    if (!det) {
      return Mat3.identity()
    }
    det = 1.0 / det

    return new Mat3(
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
    )
  }

  static projection(glContextWidth: number, glContextHeight: number): Mat3 {
    return new Mat3(2 / glContextWidth, 0, 0, 0, -2 / glContextHeight, 0, -1, 1, 1)
  }

  toString(): string {
    const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = this
    return `mat3(${a0}, ${a1}, ${a2}, ${a3}, ${a4}, ${a5}, ${a6}, ${a7}, ${a8})`
  }

  frobeniusNorm(): number {
    const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = this
    return Math.hypot(a0, a1, a2, a3, a4, a5, a6, a7, a8)
  }

  add(b: Mat3): Mat3 {
    this[0] += b[0]
    this[1] += b[1]
    this[2] += b[2]
    this[3] += b[3]
    this[4] += b[4]
    this[5] += b[5]
    this[6] += b[6]
    this[7] += b[7]
    this[8] += b[8]
    return this
  }

  subtract(b: Mat3): Mat3 {
    this[0] -= b[0]
    this[1] -= b[1]
    this[2] -= b[2]
    this[3] -= b[3]
    this[4] -= b[4]
    this[5] -= b[5]
    this[6] -= b[6]
    this[7] -= b[7]
    this[8] -= b[8]
    return this
  }

  multiplyScalar(b: number): Mat3 {
    this[0] *= b
    this[1] *= b
    this[2] *= b
    this[3] *= b
    this[4] *= b
    this[5] *= b
    this[6] *= b
    this[7] *= b
    this[8] *= b
    return this
  }

  equalsExact(b: Mat3): boolean {
    return (
      this[0] === b[0] &&
      this[1] === b[1] &&
      this[2] === b[2] &&
      this[3] === b[3] &&
      this[4] === b[4] &&
      this[5] === b[5] &&
      this[6] === b[6] &&
      this[7] === b[7] &&
      this[8] === b[8]
    )
  }

  equalsApproximately(b: Mat3): boolean {
    const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = this
    const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = b
    return (
      equalsApproximately(a0, b0) &&
      equalsApproximately(a1, b1) &&
      equalsApproximately(a2, b2) &&
      equalsApproximately(a3, b3) &&
      equalsApproximately(a4, b4) &&
      equalsApproximately(a5, b5) &&
      equalsApproximately(a6, b6) &&
      equalsApproximately(a7, b7) &&
      equalsApproximately(a8, b8)
    )
  }
}
