import { degree2rad as deg2rad, EPSILON, equalsApproximately, inverseSqrt, sqrt } from './common'
import { Vec3 } from './vec3'
import { Quat } from './quat'
import { DualQuat } from './quat2'

// 4x4 Matrix, column-major, when typed out it looks like row-major. The matrices are being post multiplied.
export class Mat4 extends Float32Array {
  /**
   * Create a new mat4 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m03 Component in column 0, row 3 position (index 3)
   * @param {Number} m10 Component in column 1, row 0 position (index 4)
   * @param {Number} m11 Component in column 1, row 1 position (index 5)
   * @param {Number} m12 Component in column 1, row 2 position (index 6)
   * @param {Number} m13 Component in column 1, row 3 position (index 7)
   * @param {Number} m20 Component in column 2, row 0 position (index 8)
   * @param {Number} m21 Component in column 2, row 1 position (index 9)
   * @param {Number} m22 Component in column 2, row 2 position (index 10)
   * @param {Number} m23 Component in column 2, row 3 position (index 11)
   * @param {Number} m30 Component in column 3, row 0 position (index 12)
   * @param {Number} m31 Component in column 3, row 1 position (index 13)
   * @param {Number} m32 Component in column 3, row 2 position (index 14)
   * @param {Number} m33 Component in column 3, row 3 position (index 15)
   * @returns {mat4} A new mat4
   */
  constructor(
    m00 = 1,
    m01 = 0,
    m02 = 0,
    m03 = 0,
    m10 = 0,
    m11 = 1,
    m12 = 0,
    m13 = 0,
    m20 = 0,
    m21 = 0,
    m22 = 1,
    m23 = 0,
    m30 = 0,
    m31 = 0,
    m32 = 0,
    m33 = 1,
  ) {
    super(16)
    this[0] = m00
    this[1] = m01
    this[2] = m02
    this[3] = m03
    this[4] = m10
    this[5] = m11
    this[6] = m12
    this[7] = m13
    this[8] = m20
    this[9] = m21
    this[10] = m22
    this[11] = m23
    this[12] = m30
    this[13] = m31
    this[14] = m32
    this[15] = m33
  }

  clone(): Mat4 {
    return new Mat4(
      this[0],
      this[1],
      this[2],
      this[3],
      this[4],
      this[5],
      this[6],
      this[7],
      this[8],
      this[9],
      this[10],
      this[11],
      this[12],
      this[13],
      this[14],
      this[15],
    )
  }

  copy(m: Mat4): Mat4 {
    this[0] = m[0]
    this[1] = m[1]
    this[2] = m[2]
    this[3] = m[3]
    this[4] = m[4]
    this[5] = m[5]
    this[6] = m[6]
    this[7] = m[7]
    this[8] = m[8]
    this[9] = m[9]
    this[10] = m[10]
    this[11] = m[11]
    this[12] = m[12]
    this[13] = m[13]
    this[14] = m[14]
    this[15] = m[15]
    return this
  }

  setIdentity(): Mat4 {
    this.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    return this
  }

  static identity(): Mat4 {
    return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  }

  transpose(): Mat4 {
    const a01 = this[1]
    const a02 = this[2]
    const a03 = this[3]
    const a12 = this[6]
    const a13 = this[7]
    const a23 = this[11]
    this[1] = this[4]
    this[2] = this[8]
    this[3] = this[12]
    this[4] = a01
    this[6] = this[9]
    this[7] = this[13]
    this[8] = a02
    this[9] = a12
    this[11] = this[14]
    this[12] = a03
    this[13] = a13
    this[14] = a23
    return this
  }

  invert(): Mat4 {
    const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this
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
    let det = this.determinant

    if (!det) {
      return this
    }
    det = 1 / det

    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
    this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det
    this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det
    this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det
    this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det
    this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det
    this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det
    this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det
    this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det
    this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det
    this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det
    this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det
    this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det
    this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det
    this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det
    this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det

    return this
  }

  adjoint(): Mat4 {
    const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this
    this[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22)
    this[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22))
    this[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12)
    this[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12))
    this[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22))
    this[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22)
    this[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12))
    this[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12)
    this[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21)
    this[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21))
    this[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11)
    this[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11))
    this[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21))
    this[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21)
    this[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11))
    this[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11)
    return this
  }

  get determinant(): number {
    const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this
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
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
  }

  multiply(b: Mat4): Mat4 {
    const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this

    // Cache only the current line of the second matrix
    let b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3]
    this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[4]
    b1 = b[5]
    b2 = b[6]
    b3 = b[7]
    this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[8]
    b1 = b[9]
    b2 = b[10]
    b3 = b[11]
    this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[12]
    b1 = b[13]
    b2 = b[14]
    b3 = b[15]
    this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
    return this
  }

  translate(v: Vec3): Mat4 {
    const [x, y, z] = v
    this[12] = this[0] * x + this[4] * y + this[8] * z + this[12]
    this[13] = this[1] * x + this[5] * y + this[9] * z + this[13]
    this[14] = this[2] * x + this[6] * y + this[10] * z + this[14]
    this[15] = this[3] * x + this[7] * y + this[11] * z + this[15]
    return this
  }

  scale(v: Vec3): Mat4 {
    const [x, y, z] = v
    this[0] = this[0] * x
    this[1] = this[1] * x
    this[2] = this[2] * x
    this[3] = this[3] * x
    this[4] = this[4] * y
    this[5] = this[5] * y
    this[6] = this[6] * y
    this[7] = this[7] * y
    this[8] = this[8] * z
    this[9] = this[9] * z
    this[10] = this[10] * z
    this[11] = this[11] * z
    this[12] = this[12]
    this[13] = this[13]
    this[14] = this[14]
    this[15] = this[15]
    return this
  }

  rotate(axis: Vec3, rad: number): Mat4 {
    let [x, y, z] = axis
    let len = sqrt(x * x + y * y + z * z)

    if (len < EPSILON) {
      return this
    }
    len = 1 / len
    x *= len
    y *= len
    z *= len

    const c = Math.cos(rad)
    const s = Math.sin(rad)
    const t = 1 - c
    const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23] = this

    // Construct the elements of the rotation matrix
    const b00 = x * x * t + c
    const b01 = y * x * t + z * s
    const b02 = z * x * t - y * s
    const b10 = x * y * t - z * s
    const b11 = y * y * t + c
    const b12 = z * y * t + x * s
    const b20 = x * z * t + y * s
    const b21 = y * z * t - x * s
    const b22 = z * z * t + c

    // Perform rotation-specific matrix multiplication
    this[0] = a00 * b00 + a10 * b01 + a20 * b02
    this[1] = a01 * b00 + a11 * b01 + a21 * b02
    this[2] = a02 * b00 + a12 * b01 + a22 * b02
    this[3] = a03 * b00 + a13 * b01 + a23 * b02
    this[4] = a00 * b10 + a10 * b11 + a20 * b12
    this[5] = a01 * b10 + a11 * b11 + a21 * b12
    this[6] = a02 * b10 + a12 * b11 + a22 * b12
    this[7] = a03 * b10 + a13 * b11 + a23 * b12
    this[8] = a00 * b20 + a10 * b21 + a20 * b22
    this[9] = a01 * b20 + a11 * b21 + a21 * b22
    this[10] = a02 * b20 + a12 * b21 + a22 * b22
    this[11] = a03 * b20 + a13 * b21 + a23 * b22

    return this
  }

  rotateX(rad: number): Mat4 {
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    const a10 = this[4]
    const a11 = this[5]
    const a12 = this[6]
    const a13 = this[7]
    const a20 = this[8]
    const a21 = this[9]
    const a22 = this[10]
    const a23 = this[11]

    // Perform axis-specific matrix multiplication
    this[4] = a10 * c + a20 * s
    this[5] = a11 * c + a21 * s
    this[6] = a12 * c + a22 * s
    this[7] = a13 * c + a23 * s
    this[8] = a20 * c - a10 * s
    this[9] = a21 * c - a11 * s
    this[10] = a22 * c - a12 * s
    this[11] = a23 * c - a13 * s
    return this
  }

  rotateY(rad: number): Mat4 {
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    const a00 = this[0]
    const a01 = this[1]
    const a02 = this[2]
    const a03 = this[3]
    const a20 = this[8]
    const a21 = this[9]
    const a22 = this[10]
    const a23 = this[11]

    // Perform axis-specific matrix multiplication
    this[0] = a00 * c - a20 * s
    this[1] = a01 * c - a21 * s
    this[2] = a02 * c - a22 * s
    this[3] = a03 * c - a23 * s
    this[8] = a00 * s + a20 * c
    this[9] = a01 * s + a21 * c
    this[10] = a02 * s + a22 * c
    this[11] = a03 * s + a23 * c
    return this
  }

  rotateZ(rad: number): Mat4 {
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    const a00 = this[0]
    const a01 = this[1]
    const a02 = this[2]
    const a03 = this[3]
    const a10 = this[4]
    const a11 = this[5]
    const a12 = this[6]
    const a13 = this[7]

    // Perform axis-specific matrix multiplication
    this[0] = a00 * c + a10 * s
    this[1] = a01 * c + a11 * s
    this[2] = a02 * c + a12 * s
    this[3] = a03 * c + a13 * s
    this[4] = a10 * c - a00 * s
    this[5] = a11 * c - a01 * s
    this[6] = a12 * c - a02 * s
    this[7] = a13 * c - a03 * s
    return this
  }

  static fromTranslation(v: Vec3): Mat4 {
    const [x, y, z] = v
    return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1)
  }

  static fromScaling(v: Vec3): Mat4 {
    const [x, y, z] = v
    return new Mat4(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1)
  }

  static fromRotation(axis: Vec3, rad: number): Mat4 {
    let len = axis.length

    if (len < EPSILON) {
      return Mat4.identity()
    }

    let [x, y, z] = axis
    len = 1 / len
    x *= len
    y *= len
    z *= len

    const c = Math.cos(rad)
    const s = Math.sin(rad)
    const t = 1 - c

    // Perform rotation-specific matrix multiplication
    return new Mat4(
      x * x * t + c,
      y * x * t + z * s,
      z * x * t - y * s,
      0,
      x * y * t - z * s,
      y * y * t + c,
      z * y * t + x * s,
      0,
      x * z * t + y * s,
      y * z * t - x * s,
      z * z * t + c,
      0,
      0,
      0,
      0,
      1,
    )
  }

  static fromXRotation(rad: number): Mat4 {
    const c = Math.cos(rad)
    const s = Math.sin(rad)

    // Perform axis-specific matrix multiplication
    return new Mat4(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1)
  }

  static fromYRotation(rad: number): Mat4 {
    const c = Math.cos(rad)
    const s = Math.sin(rad)

    // Perform axis-specific matrix multiplication
    return new Mat4(c, 0, s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1)
  }

  static fromZRotation(rad: number): Mat4 {
    const c = Math.cos(rad)
    const s = Math.sin(rad)

    // Perform axis-specific matrix multiplication
    return new Mat4(c, s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  }

  static fromTranslationRotation(q: Quat, v: Vec3): Mat4 {
    // Quaternion math
    const [x, y, z, w] = q
    const x2 = x + x
    const y2 = y + y
    const z2 = z + z
    const xx = x * x2
    const xy = x * y2
    const xz = x * z2
    const yy = y * y2
    const yz = y * z2
    const zz = z * z2
    const wx = w * x2
    const wy = w * y2
    const wz = w * z2
    const [vx, vy, vz] = v
    return new Mat4(
      1 - (yy + zz),
      xy + wz,
      xz - wy,
      0,
      xy - wz,
      1 - (xx + zz),
      yz + wx,
      0,
      xz + wy,
      yz - wx,
      1 - (xx + yy),
      0,
      vx,
      vy,
      vz,
      1,
    )
  }

  static fromQuat2(a: DualQuat): Mat4 {
    const translation = new Vec3()
    const bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7]

    const magnitude = bx * bx + by * by + bz * bz + bw * bw
    //Only scale if it makes sense
    if (magnitude > 0) {
      translation[0] = ((ax * bw + aw * bx + ay * bz - az * by) * 2) / magnitude
      translation[1] = ((ay * bw + aw * by + az * bx - ax * bz) * 2) / magnitude
      translation[2] = ((az * bw + aw * bz + ax * by - ay * bx) * 2) / magnitude
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2
    }
    return Mat4.fromTranslationRotation(a.real, translation)
  }

  get translation(): Vec3 {
    return new Vec3(this[12], this[13], this[14])
  }

  get scaling(): Vec3 {
    const [m11, m12, m13, m21, m22, m23, m31, m32, m33] = this
    return new Vec3(
      sqrt(m11 * m11 + m12 * m12 + m13 * m13),
      sqrt(m21 * m21 + m22 * m22 + m23 * m23),
      sqrt(m31 * m31 + m32 * m32 + m33 * m33),
    )
  }

  get rotation(): Quat {
    // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    let S = 0
    const trace = this[0] + this[5] + this[10]
    const q = new Quat()
    if (trace > 0) {
      S = sqrt(trace + 1) * 2
      q[3] = 0.25 * S
      q[0] = (this[6] - this[9]) / S
      q[1] = (this[8] - this[2]) / S
      q[2] = (this[1] - this[4]) / S
    } else if (this[0] > this[5] && this[0] > this[10]) {
      S = sqrt(1.0 + this[0] - this[5] - this[10]) * 2
      q[3] = (this[6] - this[9]) / S
      q[0] = 0.25 * S
      q[1] = (this[1] + this[4]) / S
      q[2] = (this[8] + this[2]) / S
    } else if (this[5] > this[10]) {
      S = sqrt(1.0 + this[5] - this[0] - this[10]) * 2
      q[3] = (this[8] - this[2]) / S
      q[0] = (this[1] + this[4]) / S
      q[1] = 0.25 * S
      q[2] = (this[6] + this[9]) / S
    } else {
      S = sqrt(1.0 + this[10] - this[0] - this[5]) * 2
      q[3] = (this[1] - this[4]) / S
      q[0] = (this[8] + this[2]) / S
      q[1] = (this[6] + this[9]) / S
      q[2] = 0.25 * S
    }

    return q
  }

  static fromTranslationRotationScale(translation: Vec3, rotation: Quat, scaling: Vec3): Mat4 {
    // Quaternion math
    const [qx, qy, qz, qw] = rotation
    const x2 = qx + qx
    const y2 = qy + qy
    const z2 = qz + qz
    const xx = qx * x2
    const xy = qx * y2
    const xz = qx * z2
    const yy = qy * y2
    const yz = qy * z2
    const zz = qz * z2
    const wx = qw * x2
    const wy = qw * y2
    const wz = qw * z2
    const sx = scaling[0]
    const sy = scaling[1]
    const sz = scaling[2]
    const [vx, vy, vz] = translation
    return new Mat4(
      (1 - (yy + zz)) * sx,
      (xy + wz) * sx,
      (xz - wy) * sx,
      0,
      (xy - wz) * sy,
      (1 - (xx + zz)) * sy,
      (yz + wx) * sy,
      0,
      (xz + wy) * sz,
      (yz - wx) * sz,
      (1 - (xx + yy)) * sz,
      0,
      vx,
      vy,
      vz,
      1,
    )
  }

  // Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
  static fromRotationTranslationScaleOrigin(translation: Vec3, rotation: Quat, scaling: Vec3, origin: Vec3): Mat4 {
    // Quaternion math
    const [x, y, z, w] = rotation
    const x2 = x + x
    const y2 = y + y
    const z2 = z + z
    const xx = x * x2
    const xy = x * y2
    const xz = x * z2
    const yy = y * y2
    const yz = y * z2
    const zz = z * z2
    const wx = w * x2
    const wy = w * y2
    const wz = w * z2
    const [sx, sy, sz] = scaling
    const [ox, oy, oz] = origin
    const out0 = (1 - (yy + zz)) * sx
    const out1 = (xy + wz) * sx
    const out2 = (xz - wy) * sx
    const out4 = (xy - wz) * sy
    const out5 = (1 - (xx + zz)) * sy
    const out6 = (yz + wx) * sy
    const out8 = (xz + wy) * sz
    const out9 = (yz - wx) * sz
    const out10 = (1 - (xx + yy)) * sz
    const [vx, vy, vz] = translation
    const out12 = vx + ox - (out0 * ox + out4 * oy + out8 * oz)
    const out13 = vy + oy - (out1 * ox + out5 * oy + out9 * oz)
    const out14 = vz + oz - (out2 * ox + out6 * oy + out10 * oz)

    return new Mat4(out0, out1, out2, 0, out4, out5, out6, 0, out8, out9, out10, 0, out12, out13, out14, 1)
  }

  static fromQuat(q: Quat): Mat4 {
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
    return new Mat4(
      1 - yy - zz,
      yx + wz,
      zx - wy,
      0,
      yx - wz,
      1 - xx - zz,
      zy + wx,
      0,
      zx + wy,
      zy - wx,
      1 - xx - yy,
      0,
      0,
      0,
      0,
      1,
    )
  }

  static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    const rl = 1 / (right - left)
    const tb = 1 / (top - bottom)
    const nf = 1 / (near - far)
    return new Mat4(
      near * 2 * rl,
      0,
      0,
      0,
      0,
      near * 2 * tb,
      0,
      0,
      (right + left) * rl,
      (top + bottom) * tb,
      (far + near) * nf,
      -1,
      0,
      0,
      far * near * 2 * nf,
      0,
    )
  }

  static perspective(fovy: number, aspect: number, near: number, far?: number): Mat4 {
    const f = 1.0 / Math.tan(fovy / 2)
    let m10 = -1
    let m14 = -2 * near
    if (far && Number.isFinite(far)) {
      const nf = 1 / (near - far)
      m10 = (far + near) * nf
      m14 = 2 * far * near * nf
    }
    return new Mat4(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, m10, -1, 0, 0, m14, 0)
  }

  // Generates a perspective projection matrix with the given field of view.
  //  This is primarily useful for generating projection matrices to be used with the still experiemental WebVR API.
  static perspectiveFromFieldOfView(
    fovDegrees: { up: number; down: number; left: number; right: number },
    near: number,
    far: number,
  ): Mat4 {
    const upTan = Math.tan(fovDegrees.up * deg2rad)
    const downTan = Math.tan(fovDegrees.down * deg2rad)
    const leftTan = Math.tan(fovDegrees.left * deg2rad)
    const rightTan = Math.tan(fovDegrees.right * deg2rad)
    const xScale = 2.0 / (leftTan + rightTan)
    const yScale = 2.0 / (upTan + downTan)
    return new Mat4(
      xScale,
      0.0,
      0.0,
      0.0,
      0.0,
      yScale,
      0.0,
      0.0,
      -((leftTan - rightTan) * xScale * 0.5),
      (upTan - downTan) * yScale * 0.5,
      far / (near - far),
      -1.0,
      0.0,
      0.0,
      (far * near) / (near - far),
      0.0,
    )
  }

  static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    const lr = 1 / (left - right)
    const bt = 1 / (bottom - top)
    const nf = 1 / (near - far)
    return new Mat4(
      -2 * lr,
      0,
      0,
      0,
      0,
      -2 * bt,
      0,
      0,
      0,
      0,
      2 * nf,
      0,
      (left + right) * lr,
      (top + bottom) * bt,
      (far + near) * nf,
      1,
    )
  }

  // Generates a look-at matrix with the given eye position, focal point, and up axis.
  // If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
  static lookAt(eye: Vec3, center: Vec3, up: Vec3): Mat4 {
    const [ex, ey, ez] = eye
    const [cx, cy, cz] = center
    const [ux, uy, uz] = up

    if (Math.abs(ex - cx) < EPSILON && Math.abs(ey - cy) < EPSILON && Math.abs(ez - cz) < EPSILON) {
      return Mat4.identity()
    }

    let z0 = ex - cx
    let z1 = ey - cy
    let z2 = ez - cz
    let len = inverseSqrt(z0 * z0 + z1 * z1 + z2 * z2)
    z0 *= len
    z1 *= len
    z2 *= len

    let x0 = uy * z2 - uz * z1
    let x1 = uz * z0 - ux * z2
    let x2 = ux * z1 - uy * z0
    len = sqrt(x0 * x0 + x1 * x1 + x2 * x2)
    if (!len) {
      x0 = 0
      x1 = 0
      x2 = 0
    } else {
      len = 1 / len
      x0 *= len
      x1 *= len
      x2 *= len
    }

    const y0 = z1 * x2 - z2 * x1
    const y1 = z2 * x0 - z0 * x2
    const y2 = z0 * x1 - z1 * x0

    len = inverseSqrt(y0 * y0 + y1 * y1 + y2 * y2)

    return new Mat4(
      x0,
      y0,
      z0,
      0,
      x1,
      y1,
      z1,
      0,
      x2,
      y2,
      z2,
      0,
      -(x0 * ex + x1 * ey + x2 * ez),
      -(y0 * ex + y1 * ey + y2 * ez),
      -(z0 * ex + z1 * ey + z2 * ez),
      1,
    )
  }

  // Generates a matrix that makes something look at something else.
  static targetTo(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
    const [ex, ey, ez] = eye
    const [ux, uy, uz] = up
    let z0 = ex - target[0],
      z1 = ey - target[1],
      z2 = ez - target[2]
    let len = inverseSqrt(z0 * z0 + z1 * z1 + z2 * z2)
    z0 *= len
    z1 *= len
    z2 *= len

    const x0 = uy * z2 - uz * z1,
      x1 = uz * z0 - ux * z2,
      x2 = ux * z1 - uy * z0
    len = inverseSqrt(x0 * x0 + x1 * x1 + x2 * x2)

    return new Mat4(
      x0,
      x1,
      x2,
      0,
      z1 * x2 - z2 * x1,
      z2 * x0 - z0 * x2,
      z0 * x1 - z1 * x0,
      0,
      z0,
      z1,
      z2,
      0,
      ex,
      ey,
      ez,
      1,
    )
  }

  toString(): string {
    const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this
    return `mat4(
  ${a00},${a01},${a02},${a03}
  ${a10},${a11},${a12},${a13}
  ${a20},${a21},${a22},${a23}
  ${a30},${a31},${a32},${a33}
)`
  }

  frobeniusNorm(): number {
    return sqrt(
      this[0] ** 2 +
        this[1] ** 2 +
        this[2] ** 2 +
        this[3] ** 2 +
        this[4] ** 2 +
        this[5] ** 2 +
        this[6] ** 2 +
        this[7] ** 2 +
        this[8] ** 2 +
        this[9] ** 2 +
        this[10] ** 2 +
        this[11] ** 2 +
        this[12] ** 2 +
        this[13] ** 2 +
        this[14] ** 2 +
        this[15] ** 2,
    )
  }

  add(b: Mat4): Mat4 {
    this[0] += b[0]
    this[1] += b[1]
    this[2] += b[2]
    this[3] += b[3]
    this[4] += b[4]
    this[5] += b[5]
    this[6] += b[6]
    this[7] += b[7]
    this[8] += b[8]
    this[9] += b[9]
    this[10] += b[10]
    this[11] += b[11]
    this[12] += b[12]
    this[13] += b[13]
    this[14] += b[14]
    this[15] += b[15]
    return this
  }

  subtract(b: Mat4): Mat4 {
    this[0] -= b[0]
    this[1] -= b[1]
    this[2] -= b[2]
    this[3] -= b[3]
    this[4] -= b[4]
    this[5] -= b[5]
    this[6] -= b[6]
    this[7] -= b[7]
    this[8] -= b[8]
    this[9] -= b[9]
    this[10] -= b[10]
    this[11] -= b[11]
    this[12] -= b[12]
    this[13] -= b[13]
    this[14] -= b[14]
    this[15] -= b[15]
    return this
  }

  multiplyScalar(b: number): Mat4 {
    this[0] *= b
    this[1] *= b
    this[2] *= b
    this[3] *= b
    this[4] *= b
    this[5] *= b
    this[6] *= b
    this[7] *= b
    this[8] *= b
    this[9] *= b
    this[10] *= b
    this[11] *= b
    this[12] *= b
    this[13] *= b
    this[14] *= b
    this[15] *= b
    return this
  }

  equalsExact(b: Mat4): boolean {
    return (
      this[0] === b[0] &&
      this[1] === b[1] &&
      this[2] === b[2] &&
      this[3] === b[3] &&
      this[4] === b[4] &&
      this[5] === b[5] &&
      this[6] === b[6] &&
      this[7] === b[7] &&
      this[8] === b[8] &&
      this[9] === b[9] &&
      this[10] === b[10] &&
      this[11] === b[11] &&
      this[12] === b[12] &&
      this[13] === b[13] &&
      this[14] === b[14] &&
      this[15] === b[15]
    )
  }

  equalsApproximately(b: Mat4): boolean {
    const [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15] = this
    const [b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15] = b

    return (
      equalsApproximately(a0, b0) &&
      equalsApproximately(a1, b1) &&
      equalsApproximately(a2, b2) &&
      equalsApproximately(a3, b3) &&
      equalsApproximately(a4, b4) &&
      equalsApproximately(a5, b5) &&
      equalsApproximately(a6, b6) &&
      equalsApproximately(a7, b7) &&
      equalsApproximately(a8, b8) &&
      equalsApproximately(a9, b9) &&
      equalsApproximately(a10, b10) &&
      equalsApproximately(a11, b11) &&
      equalsApproximately(a12, b12) &&
      equalsApproximately(a13, b13) &&
      equalsApproximately(a14, b14) &&
      equalsApproximately(a15, b15)
    )
  }
}
