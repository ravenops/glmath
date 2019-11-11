import { equalsApproximately, sqrt, inverseSqrt } from './common'
import { Mat2 } from './mat22'
import { Mat23 } from './mat23'
import { Mat3 } from './mat33'
import { Mat4 } from './mat44'
import { Vec3 } from './vec3'

export class Vec2 extends Float32Array {
  constructor(x = 0, y = 0) {
    super(2)
    this[0] = x
    this[1] = y
  }

  zero(): Vec2 {
    this[0] = 0
    this[1] = 0
    return this
  }

  clone(): Vec2 {
    return new Vec2(this[0], this[1])
  }

  copy(a: Vec2): Vec2 {
    this[0] = a[0]
    this[1] = a[1]
    return this
  }

  add(b: Vec2): Vec2 {
    this[0] += b[0]
    this[1] += b[1]
    return this
  }

  subtract(b: Vec2): Vec2 {
    this[0] -= b[0]
    this[1] -= b[1]
    return this
  }

  multiply(b: Vec2): Vec2 {
    this[0] *= b[0]
    this[1] *= b[1]
    return this
  }

  divide(b: Vec2): Vec2 {
    this[0] /= b[0]
    this[1] /= b[1]
    return this
  }

  ceil(): Vec2 {
    this[0] = Math.ceil(this[0])
    this[1] = Math.ceil(this[1])
    return this
  }

  floor(): Vec2 {
    this[0] = Math.floor(this[0])
    this[1] = Math.floor(this[1])
    return this
  }

  min(b: Vec2): Vec2 {
    this[0] = Math.min(this[0], b[0])
    this[1] = Math.min(this[1], b[1])
    return this
  }

  max(b: Vec2): Vec2 {
    this[0] = Math.max(this[0], b[0])
    this[1] = Math.max(this[1], b[1])
    return this
  }

  round(): Vec2 {
    this[0] = Math.round(this[0])
    this[1] = Math.round(this[1])
    return this
  }

  scale(b: number): Vec2 {
    this[0] *= b
    this[1] *= b
    return this
  }

  distance(b: Vec2): number {
    return sqrt(this.squaredDistance(b))
  }

  squaredDistance(b: Vec2): number {
    const x = b[0] - this[0]
    const y = b[1] - this[1]
    return x * x + y * y
  }

  get sqLength(): number {
    const [x, y] = this
    return x * x + y * y
  }

  get length(): number {
    return sqrt(this.sqLength)
  }

  negate(): Vec2 {
    this[0] = -this[0]
    this[1] = -this[1]
    return this
  }

  inverse(): Vec2 {
    this[0] = 1 / this[0]
    this[1] = 1 / this[1]
    return this
  }

  normalize(): Vec2 {
    const len = this.length
    if (len > 0) {
      this.scale(1 / sqrt(len))
    }
    return this
  }

  dot(b: Vec2): number {
    return this[0] * b[0] + this[1] * b[1]
  }

  cross(b: Vec2): Vec3 {
    const [ax, ay] = this
    const [bx, by] = b
    const z = ax * by - ay * bx
    return new Vec3(0, 0, z)
  }

  /**
   * Performs a linear interpolation between two vec2's
   * @param {vec2} a the second operand
   * @param {vec2} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {vec2} out
   */
  lerp(a: Vec2, b: Vec2, t: number): Vec2 {
    const [ax, ay] = a
    const [bx, by] = b
    this[0] = ax + t * (bx - ax)
    this[1] = ay + t * (by - ay)
    return this
  }

  /**
   * Generates a random vector with the given scale
   * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns {vec2} out
   */
  random(scale = 1.0): Vec2 {
    const r = Math.random() * 2.0 * Math.PI
    this[0] = Math.cos(r) * scale
    this[1] = Math.sin(r) * scale
    return this
  }

  transformMatrix2(m: Mat2): Vec2 {
    const [x, y] = this
    this[0] = m[0] * x + m[2] * y
    this[1] = m[1] * x + m[3] * y
    return this
  }

  /**
   * Transforms the vec2 with a mat2d
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat2d} m matrix to transform with
   * @returns {vec2} out
   */
  transformMatrix23(m: Mat23): Vec2 {
    const [x, y] = this
    this[0] = m[0] * x + m[2] * y + m[4]
    this[1] = m[1] * x + m[3] * y + m[5]
    return this
  }

  /**
   * Transforms the vec2 with a mat3
   * 3rd vector component is implicitly '1'
   * @param {mat3} m matrix to transform with
   */
  transformMatrix3(m: Mat3): Vec2 {
    const [x, y] = this
    this[0] = m[0] * x + m[3] * y + m[6]
    this[1] = m[1] * x + m[4] * y + m[7]
    return this
  }

  /**
   * Transforms the vec2 with a mat4
   * 3rd vector component is implicitly '0'
   * 4th vector component is implicitly '1'
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat4} m matrix to transform with
   * @returns {vec2} out
   */
  transformMatrix4(m: Mat4): Vec2 {
    const [x, y] = this
    this[0] = m[0] * x + m[4] * y + m[12]
    this[1] = m[1] * x + m[5] * y + m[13]
    return this
  }

  /**
   * Rotate a 2D vector
   * @param {vec2} out The receiving vec2
   * @param {vec2} a The vec2 point to rotate
   * @param {vec2} origin The origin of the rotation
   * @returns {vec2} out
   */
  rotate(origin: Vec2, angleOfRotation: number): Vec2 {
    //Translate point to the origin
    const p0 = this[0] - origin[0]
    const p1 = this[1] - origin[1]
    const sinC = Math.sin(angleOfRotation)
    const cosC = Math.cos(angleOfRotation)

    //perform rotation and translate to correct position
    this[0] = p0 * cosC - p1 * sinC + origin[0]
    this[1] = p0 * sinC + p1 * cosC + origin[1]
    return this
  }

  angle(b: Vec2): number {
    const len1 = inverseSqrt(this.length)
    const len2 = inverseSqrt(b.length)
    const cos = this.squaredDistance(b) * len1 * len2
    if (cos > 1) {
      return 0
    } else if (cos < -1) {
      return Math.PI
    }
    return Math.acos(cos)
  }

  toString(): string {
    return `vec2(${this[0]}, ${this[1]})`
  }

  equalsExact(b: Vec2): boolean {
    return this[0] === b[0] && this[1] === b[1]
  }

  equalsApproximately(b: Vec2): boolean {
    const [a0, a1] = this
    const [b0, b1] = b
    return equalsApproximately(a0, b0) && equalsApproximately(a1, b1)
  }
}
