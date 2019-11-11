import { equalsApproximately, sqrt } from './common'
import { Vec2 } from './vec2'
import { Mat4 } from './mat44'
import { Mat3 } from './mat33'
import { Quat } from './quat'

// 3 Dimensional Vector
export class Vec3 extends Float32Array {
  constructor(x = 0, y = 0, z = 0) {
    super(3)
    this.set([x, y, z])
  }

  static fromV2(v: Vec2): Vec3 {
    const [x, y] = v
    return new Vec3(x, y)
  }

  static right(): Vec3 {
    return new Vec3(1, 0, 0)
  }

  static up(): Vec3 {
    return new Vec3(0, 1, 0)
  }

  clone(): Vec3 {
    const [x, y, z] = this
    return new Vec3(x, y, z)
  }

  get length(): number {
    const [x, y, z] = this
    return Math.hypot(x, y, z)
  }

  copy(a: Vec3): Vec3 {
    this[0] = a[0]
    this[1] = a[1]
    this[2] = a[2]
    return this
  }

  add(b: Vec3): Vec3 {
    this[0] += b[0]
    this[1] += b[1]
    this[2] += b[2]
    return this
  }

  subtract(b: Vec3): Vec3 {
    this[0] -= b[0]
    this[1] -= b[1]
    this[2] -= b[2]
    return this
  }

  multiply(b: Vec3): Vec3 {
    this[0] *= b[0]
    this[1] *= b[1]
    this[2] *= b[2]
    return this
  }

  divide(b: Vec3): Vec3 {
    this[0] /= b[0]
    this[1] /= b[1]
    this[2] /= b[2]
    return this
  }

  ceil(): Vec3 {
    this[0] = Math.ceil(this[0])
    this[1] = Math.ceil(this[1])
    this[2] = Math.ceil(this[2])
    return this
  }

  floor(): Vec3 {
    this[0] = Math.floor(this[0])
    this[1] = Math.floor(this[1])
    this[2] = Math.floor(this[2])
    return this
  }

  min(b: Vec3): Vec3 {
    this[0] = Math.min(this[0], b[0])
    this[1] = Math.min(this[1], b[1])
    this[2] = Math.min(this[2], b[2])
    return this
  }

  max(b: Vec3): Vec3 {
    this[0] = Math.max(this[0], b[0])
    this[1] = Math.max(this[1], b[1])
    this[2] = Math.max(this[2], b[2])
    return this
  }

  round(): Vec3 {
    this[0] = Math.round(this[0])
    this[1] = Math.round(this[1])
    this[2] = Math.round(this[2])
    return this
  }

  scale(b: number): Vec3 {
    this[0] *= b
    this[1] *= b
    this[2] *= b
    return this
  }

  distance(b: Vec3): number {
    const x = b[0] - this[0]
    const y = b[1] - this[1]
    const z = b[2] - this[2]
    return Math.hypot(x, y, z)
  }

  squaredDistance(b: Vec3): number {
    const x = b[0] - this[0]
    const y = b[1] - this[1]
    const z = b[2] - this[2]
    return x * x + y * y + z * z
  }

  get squaredLength(): number {
    const [x, y, z] = this
    return x * x + y * y + z * z
  }

  negate(): Vec3 {
    this[0] *= -1
    this[1] *= -1
    this[2] *= -1
    return this
  }

  inverse(): Vec3 {
    this[0] = 1 / this[0]
    this[1] = 1 / this[1]
    this[2] = 1 / this[2]
    return this
  }

  normalize(): Vec3 {
    let len = this.length
    if (len > 0) {
      len = 1 / len
    }
    this[0] *= len
    this[1] *= len
    this[2] *= len
    return this
  }

  dot(b: Vec3): number {
    const [a0, a1, a2] = this
    const [b0, b1, b2] = b
    return a0 * b0 + a1 * b1 + a2 * b2
  }

  cross(b: Vec3): Vec3 {
    const [ax, ay, az] = this
    const [bx, by, bz] = b

    this[0] = ay * bz - az * by
    this[1] = az * bx - ax * bz
    this[2] = ax * by - ay * bx
    return this
  }

  // Performs a linear interpolation between two vec3's
  lerp(a: Vec3, b: Vec3, t: number): Vec3 {
    const [ax, ay, az] = a
    const [bx, by, bz] = b
    this[0] = ax + t * (bx - ax)
    this[1] = ay + t * (by - ay)
    this[2] = az + t * (bz - az)
    return this
  }

  // Performs a hermite interpolation with two control points
  hermite(a: Vec3, b: Vec3, c: Vec3, d: Vec3, t: number): Vec3 {
    const factorTimes2 = t * t
    const factor1 = factorTimes2 * (2 * t - 3) + 1
    const factor2 = factorTimes2 * (t - 2) + t
    const factor3 = factorTimes2 * (t - 1)
    const factor4 = factorTimes2 * (3 - 2 * t)
    this[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4
    this[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4
    this[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4
    return this
  }

  // Performs a bezier interpolation with two control points
  bezier(a: Vec3, b: Vec3, c: Vec3, d: Vec3, t: number): Vec3 {
    const inverseFactor = 1 - t
    const inverseFactorTimesTwo = inverseFactor * inverseFactor
    const factorTimes2 = t * t
    const factor1 = inverseFactorTimesTwo * inverseFactor
    const factor2 = 3 * t * inverseFactorTimesTwo
    const factor3 = 3 * factorTimes2 * inverseFactor
    const factor4 = factorTimes2 * t
    this[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4
    this[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4
    this[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4
    return this
  }

  random(scale = 1): Vec3 {
    const r = Math.random() * 2.0 * Math.PI
    const z = Math.random() * 2.0 - 1.0
    const zScale = sqrt(1.0 - z * z) * scale
    this[0] = Math.cos(r) * zScale
    this[1] = Math.sin(r) * zScale
    this[2] = z * scale
    return this
  }

  transformMat4(m: Mat4): Vec3 {
    const [x, y, z] = this
    const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1.0
    this[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w
    this[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w
    this[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
    return this
  }

  transformMat3(m: Mat3): Vec3 {
    const [x, y, z] = this
    this[0] = x * m[0] + y * m[3] + z * m[6]
    this[1] = x * m[1] + y * m[4] + z * m[7]
    this[2] = x * m[2] + y * m[5] + z * m[8]
    return this
  }

  // Transforms the vec3 with a quat. Can also be used for dual quaternions. (Multiply it with the real part)
  transformQuat(q: Quat): Vec3 {
    const [qx, qy, qz, qw] = q
    const [x, y, z] = this
    let uvx = qy * z - qz * y
    let uvy = qz * x - qx * z
    let uvz = qx * y - qy * x
    let uuvx = qy * uvz - qz * uvy
    let uuvy = qz * uvx - qx * uvz
    let uuvz = qx * uvy - qy * uvx
    const w2 = qw * 2
    uvx *= w2
    uvy *= w2
    uvz *= w2
    // vec3.scale(uuv, uuv, 2);
    uuvx *= 2
    uuvy *= 2
    uuvz *= 2
    // return vec3.add(out, a, vec3.add(out, uv, uuv));
    this[0] = x + uvx + uuvx
    this[1] = y + uvy + uuvy
    this[2] = z + uvz + uuvz
    return this
  }

  rotateX(origin: Vec3, rad: number): Vec3 {
    //Translate point to the origin
    const p = new Vec3(this[0] - origin[0], this[1] - origin[1], this[2] - origin[2])

    //perform rotation
    const r = new Vec3(p[0], p[1] * Math.cos(rad) - p[2] * Math.sin(rad), p[1] * Math.sin(rad) + p[2] * Math.cos(rad))

    //translate to correct position
    this[0] = r[0] + origin[0]
    this[1] = r[1] + origin[1]
    this[2] = r[2] + origin[2]

    return this
  }

  rotateY(origin: Vec3, rad: number): Vec3 {
    //Translate point to the origin
    const p = new Vec3(this[0] - origin[0], this[1] - origin[1], this[2] - origin[2])

    //perform rotation
    const r = new Vec3(p[2] * Math.sin(rad) + p[0] * Math.cos(rad), p[1], p[2] * Math.cos(rad) - p[0] * Math.sin(rad))

    //translate to correct position
    this[0] = r[0] + origin[0]
    this[1] = r[1] + origin[1]
    this[2] = r[2] + origin[2]

    return this
  }

  rotateZ(origin: Vec3, rad: number): Vec3 {
    //Translate point to the origin
    const p = new Vec3(this[0] - origin[0], this[1] - origin[1], this[2] - origin[2])

    //perform rotation
    const r = new Vec3(p[0] * Math.cos(rad) - p[1] * Math.sin(rad), p[0] * Math.sin(rad) + p[1] * Math.cos(rad), p[2])

    //translate to correct position
    this[0] = r[0] + origin[0]
    this[1] = r[1] + origin[1]
    this[2] = r[2] + origin[2]

    return this
  }

  // Get the angle between two 3D vectors
  angle(b: Vec3): number {
    const tempA = this.clone().normalize()
    const tempB = b.clone().normalize()
    const cosine = tempA.dot(tempB)

    if (cosine > 1.0) {
      return 0
    } else if (cosine < -1.0) {
      return Math.PI
    } else {
      return Math.acos(cosine)
    }
  }

  zero(): Vec3 {
    this.set([0, 0, 0])
    return this
  }

  toString(): string {
    const [x, y, z] = this
    return `vec3(${x}, ${y}, ${z})`
  }

  equalsExact(b: Vec3): boolean {
    const [ax, ay, az] = this
    const [bx, by, bz] = b
    return ax === bx && ay === by && az === bz
  }

  equalsApproximately(b: Vec3): boolean {
    const [ax, ay, az] = this
    const [bx, by, bz] = b
    return equalsApproximately(ax, bx) && equalsApproximately(ay, by) && equalsApproximately(az, bz)
  }
}
