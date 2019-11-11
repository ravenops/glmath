import { equalsApproximately, sqrt, inverseSqrt } from './common'
import { Quat } from './quat'
import { Mat4 } from './mat44'
import { Vec3 } from './vec3'

export class Vec4 extends Float32Array {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    super(4)
    this[0] = x
    this[1] = y
    this[2] = z
    this[3] = w
  }

  clone(): Vec4 {
    return new Vec4(this[0], this[1], this[2], this[3])
  }

  copy(a: Vec4): Vec4 {
    this[0] = a[0]
    this[1] = a[1]
    this[2] = a[2]
    this[3] = a[3]
    return this
  }

  add(b: Vec4): Vec4 {
    this[0] += b[0]
    this[1] += b[1]
    this[2] += b[2]
    this[3] += b[3]
    return this
  }

  subtract(b: Vec4): Vec4 {
    this[0] -= b[0]
    this[1] -= b[1]
    this[2] -= b[2]
    this[3] -= b[3]
    return this
  }

  multiply(b: Vec4): Vec4 {
    this[0] *= b[0]
    this[1] *= b[1]
    this[2] *= b[2]
    this[3] *= b[3]
    return this
  }

  divide(b: Vec4): Vec4 {
    this[0] /= b[0]
    this[1] /= b[1]
    this[2] /= b[2]
    this[3] /= b[3]
    return this
  }

  ceil(): Vec4 {
    this[0] = Math.ceil(this[0])
    this[1] = Math.ceil(this[1])
    this[2] = Math.ceil(this[2])
    this[3] = Math.ceil(this[3])
    return this
  }

  floor(): Vec4 {
    this[0] = Math.floor(this[0])
    this[1] = Math.floor(this[1])
    this[2] = Math.floor(this[2])
    this[3] = Math.floor(this[3])
    return this
  }

  min(b: Vec4): Vec4 {
    this[0] = Math.min(this[0], b[0])
    this[1] = Math.min(this[1], b[1])
    this[2] = Math.min(this[2], b[2])
    this[3] = Math.min(this[3], b[3])
    return this
  }

  max(b: Vec4): Vec4 {
    this[0] = Math.max(this[0], b[0])
    this[1] = Math.max(this[1], b[1])
    this[2] = Math.max(this[2], b[2])
    this[3] = Math.max(this[3], b[3])
    return this
  }

  round(): Vec4 {
    this[0] = Math.round(this[0])
    this[1] = Math.round(this[1])
    this[2] = Math.round(this[2])
    this[3] = Math.round(this[3])
    return this
  }

  scale(b: number): Vec4 {
    this[0] *= b
    this[1] *= b
    this[2] *= b
    this[3] *= b
    return this
  }

  distance(b: Vec4): number {
    const x = b[0] - this[0]
    const y = b[1] - this[1]
    const z = b[2] - this[2]
    const w = b[3] - this[3]
    return Math.hypot(x, y, z, w)
  }

  // Calculates the squared euclidian distance between two vec4's
  squaredDistance(b: Vec4): number {
    const x = b[0] - this[0]
    const y = b[1] - this[1]
    const z = b[2] - this[2]
    const w = b[3] - this[3]
    return x * x + y * y + z * z + w * w
  }

  get length(): number {
    const [x, y, z, w] = this
    return Math.hypot(x, y, z, w)
  }

  get squaredLength(): number {
    const [x, y, z, w] = this
    return x * x + y * y + z * z + w * w
  }

  negate(): Vec4 {
    this[0] *= -1
    this[1] *= -1
    this[2] *= -1
    this[3] *= -1
    return this
  }

  inverse(): Vec4 {
    this[0] = 1.0 / this[0]
    this[1] = 1.0 / this[1]
    this[2] = 1.0 / this[2]
    this[3] = 1.0 / this[3]
    return this
  }

  normalize(): Vec4 {
    const [x, y, z, w] = this
    const len = inverseSqrt(this.squaredLength)
    this[0] = x * len
    this[1] = y * len
    this[2] = z * len
    this[3] = w * len
    return this
  }

  dot(b: Vec4): number {
    const [a0, a1, a2, a3] = this
    const [b0, b1, b2, b3] = b
    return a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3
  }

  // Returns the cross-product of three vectors in a 4-dimensional space
  cross(u: Vec3, v: Vec3, w: Vec3): Vec4 {
    const A = v[0] * w[1] - v[1] * w[0],
      B = v[0] * w[2] - v[2] * w[0],
      C = v[0] * w[3] - v[3] * w[0],
      D = v[1] * w[2] - v[2] * w[1],
      E = v[1] * w[3] - v[3] * w[1],
      F = v[2] * w[3] - v[3] * w[2]
    const G = u[0]
    const H = u[1]
    const I = u[2]
    const J = u[3]

    this[0] = H * F - I * E + J * D
    this[1] = -(G * F) + I * C - J * B
    this[2] = G * E - H * C + J * A
    this[3] = -(G * D) + H * B - I * A
    return this
  }

  lerp(a: Vec4, b: Vec4, t: number): Vec4 {
    const [ax, ay, az, aw] = a
    const [bx, by, bz, bw] = b
    this[0] = ax + t * (bx - ax)
    this[1] = ay + t * (by - ay)
    this[2] = az + t * (bz - az)
    this[3] = aw + t * (bw - aw)
    return this
  }

  random(scale = 1.0): Vec4 {
    // Marsaglia, George. Choosing a Point from the Surface of a
    // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
    // http://projecteuclid.org/euclid.aoms/1177692644;
    let v1: number, v2: number, v3: number, v4: number, s1: number, s2: number
    do {
      v1 = Math.random() * 2 - 1
      v2 = Math.random() * 2 - 1
      s1 = v1 * v1 + v2 * v2
    } while (s1 >= 1)
    do {
      v3 = Math.random() * 2 - 1
      v4 = Math.random() * 2 - 1
      s2 = v3 * v3 + v4 * v4
    } while (s2 >= 1)

    const d = sqrt((1 - s1) / s2)
    this[0] = scale * v1
    this[1] = scale * v2
    this[2] = scale * v3 * d
    this[3] = scale * v4 * d
    return this
  }

  transformMat4(m: Mat4): Vec4 {
    const [x, y, z, w] = this
    this[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w
    this[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w
    this[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w
    this[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w
    return this
  }

  transformQuat(q: Quat): Vec4 {
    const [x, y, z, w] = this
    const [qx, qy, qz, qw] = q

    // calculate quat * vec
    const ix = qw * x + qy * z - qz * y
    const iy = qw * y + qz * x - qx * z
    const iz = qw * z + qx * y - qy * x
    const iw = -qx * x - qy * y - qz * z

    // calculate result * inverse quat
    this[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy
    this[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz
    this[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx
    this[3] = w
    return this
  }

  zero(): Vec4 {
    this[0] = 0.0
    this[1] = 0.0
    this[2] = 0.0
    this[3] = 0.0
    return this
  }

  toString(): string {
    const [x, y, z, w] = this
    return `vec4(${x}, ${y}, ${z}, ${w})`
  }

  equalsExact(b: Vec4): boolean {
    const [x, y, z, w] = this
    const [bx, by, bz, bw] = b
    return x === bx && y === by && z === bz && w === bw
  }

  equalsApproximately(b: Vec4): boolean {
    const [x, y, z, w] = this
    const [bx, by, bz, bw] = b
    return (
      equalsApproximately(x, bx) &&
      equalsApproximately(y, by) &&
      equalsApproximately(z, bz) &&
      equalsApproximately(w, bw)
    )
  }
}
