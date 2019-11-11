import { degree2rad, EPSILON, equalsApproximately, sqrt, inverseSqrt } from './common'
import { Mat3 } from './mat33'
import { Vec3 } from './vec3'

export interface AxisAngle {
  axis: Vec3
  rad: number
}

export class Quat extends Float32Array {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(4)
    this.set([x, y, z, w])
  }

  static setAxisAngle(axis: Vec3, rad: number): Quat {
    rad *= 0.5
    const s = Math.sin(rad)
    return new Quat(s * axis[0], s * axis[1], s * axis[2], Math.cos(rad))
  }

  /**
   * Gets the rotation axis and angle for a given
   *  quaternion. If a quaternion is created with
   *  setAxisAngle, this method will return the same
   *  values as providied in the original parameter list
   *  OR functionally equivalent values.
   * Example: The quaternion formed by axis [0, 0, 1] and
   *  angle -90 is the same as the quaternion formed by
   *  [0, 0, 1] and 270. This method favors the latter.
   */
  get axisAngle(): AxisAngle {
    const rad = Math.acos(this[3]) * 2.0
    const s = Math.sin(rad / 2.0)
    let axis: Vec3
    if (s > EPSILON) {
      axis = new Vec3(this[0] / s, this[1] / s, this[2] / s)
    } else {
      // If s is zero, return any axis (no rotation - axis does not matter)
      axis = new Vec3(1, 0, 0)
    }
    return { rad, axis }
  }

  // Angular distance between two unit quaternions
  angleDistance(b: Quat): number {
    const dotproduct = this.dot(b)
    return Math.acos(2 * dotproduct * dotproduct - 1)
  }

  multiply(b: Quat): Quat {
    const [ax, ay, az, aw] = this
    const [bx, by, bz, bw] = b
    this[0] = ax * bw + aw * bx + ay * bz - az * by
    this[1] = ay * bw + aw * by + az * bx - ax * bz
    this[2] = az * bw + aw * bz + ax * by - ay * bx
    this[3] = aw * bw - ax * bx - ay * by - az * bz
    return this
  }

  rotateX(rad: number): Quat {
    rad *= 0.5
    const [ax, ay, az, aw] = this
    const bx = Math.sin(rad)
    const bw = Math.cos(rad)
    this[0] = ax * bw + aw * bx
    this[1] = ay * bw + az * bx
    this[2] = az * bw - ay * bx
    this[3] = aw * bw - ax * bx
    return this
  }

  rotateY(rad: number): Quat {
    rad *= 0.5
    const [ax, ay, az, aw] = this
    const by = Math.sin(rad)
    const bw = Math.cos(rad)

    this[0] = ax * bw - az * by
    this[1] = ay * bw + aw * by
    this[2] = az * bw + ax * by
    this[3] = aw * bw - ay * by
    return this
  }

  rotateZ(rad: number): Quat {
    rad *= 0.5
    const [x, y, z, w] = this
    const rz = Math.sin(rad)
    const rw = Math.cos(rad)

    this[0] = x * rw + y * rz
    this[1] = y * rw - x * rz
    this[2] = z * rw + w * rz
    this[3] = w * rw - z * rz
    return this
  }

  /**
   * Calculates the W component of a quat from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   */
  calculateW(): Quat {
    const [x, y, z] = this
    this[3] = sqrt(Math.abs(1.0 - x * x - y * y - z * z))
    return this
  }

  // Calculate the exponential of a unit quaternion.
  exp(): Quat {
    const [x, y, z, w] = this
    const r = sqrt(x * x + y * y + z * z)
    const et = Math.exp(w)
    const s = r > 0 ? (et * Math.sin(r)) / r : 0
    this[0] = x * s
    this[1] = y * s
    this[2] = z * s
    this[3] = et * Math.cos(r)
    return this
  }

  // Calculate the natural logarithm of a unit quaternion.
  ln(): Quat {
    const [x, y, z, w] = this
    const r = sqrt(x * x + y * y + z * z)
    const t = r > 0 ? Math.atan2(r, w) / r : 0
    this[0] = x * t
    this[1] = y * t
    this[2] = z * t
    this[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w)
    return this
  }

  // Calculate the scalar power of a unit quaternion.
  pow(b: number): Quat {
    return this.ln()
      .scale(b)
      .exp()
  }

  slerp(a: Quat, b: Quat, t: number): Quat {
    const [ax, ay, az, aw] = a
    let [bx, by, bz, bw] = b

    // calc cosine
    let cosom = ax * bx + ay * by + az * bz + aw * bw
    // adjust signs (if necessary)
    if (cosom < 0.0) {
      cosom = -cosom
      bx = -bx
      by = -by
      bz = -bz
      bw = -bw
    }

    let omega: number, sinom: number, scale0: number, scale1: number

    // calculate coefficients
    if (1.0 - cosom > EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom)
      sinom = Math.sin(omega)
      scale0 = Math.sin((1.0 - t) * omega) / sinom
      scale1 = Math.sin(t * omega) / sinom
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t
      scale1 = t
    }
    // calculate final values
    this[0] = scale0 * ax + scale1 * bx
    this[1] = scale0 * ay + scale1 * by
    this[2] = scale0 * az + scale1 * bz
    this[3] = scale0 * aw + scale1 * bw
    return this
  }

  random(): Quat {
    // Implementation of http://planning.cs.uiuc.edu/node198.html
    // TODO: Calling random 3 times is probably not the fastest solution
    const u1 = Math.random()
    const u2 = Math.random()
    const u3 = Math.random()
    const sqrt1MinusU1 = sqrt(1 - u1)
    const sqrtU1 = sqrt(u1)

    this[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2)
    this[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2)
    this[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3)
    this[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3)
    return this
  }

  invert(): Quat {
    const [x, y, z, w] = this
    const dot = x * x + y * y + z * z + w * w
    const invDot = dot ? 1.0 / dot : 0
    this[0] = -x * invDot
    this[1] = -y * invDot
    this[2] = -z * invDot
    this[3] = z * invDot
    return this
  }

  // Calculates the conjugate of a quat if the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
  conjugate(): Quat {
    const [x, y, z, w] = this
    this[0] = -x
    this[1] = -y
    this[2] = -z
    this[3] = w
    return this
  }

  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   *
   */
  static fromMat3(m: Mat3): Quat {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    const fTrace = m[0] + m[4] + m[8]
    let fRoot = 0

    const q = new Quat()
    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = sqrt(fTrace + 1.0) // 2w
      q[3] = 0.5 * fRoot
      fRoot = 0.5 / fRoot // 1/(4w)
      q[0] = (m[5] - m[7]) * fRoot
      q[1] = (m[6] - m[2]) * fRoot
      q[2] = (m[1] - m[3]) * fRoot
    } else {
      // |w| <= 1/2
      let i = 0
      if (m[4] > m[0]) i = 1
      if (m[8] > m[i * 3 + i]) i = 2
      const j = (i + 1) % 3
      const k = (i + 2) % 3

      fRoot = sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0)
      q[i] = 0.5 * fRoot
      fRoot = 0.5 / fRoot
      q[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot
      q[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot
      q[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot
    }

    return q
  }

  // Creates a quaternion from the given euler angle x, y, z.in degrees
  static fromEulerDegrees(x: number, y: number, z: number): Quat {
    const halfToRad = 0.5 * degree2rad
    x *= halfToRad
    y *= halfToRad
    z *= halfToRad

    const sx = Math.sin(x)
    const cx = Math.cos(x)
    const sy = Math.sin(y)
    const cy = Math.cos(y)
    const sz = Math.sin(z)
    const cz = Math.cos(z)

    return new Quat(
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz,
      cx * cy * cz + sx * sy * sz,
    )
  }

  toString(): string {
    const [x, y, z, w] = this
    return `quat(${x}, ${y}, ${z}, ${w})`
  }

  clone(): Quat {
    return new Quat(this[0], this[1], this[2], this[3])
  }

  copy(q: Quat): Quat {
    this.set([q[0], q[1], q[2], q[3]])
    return this
  }

  add(q: Quat): Quat {
    this[0] += q[0]
    this[1] += q[1]
    this[2] += q[2]
    this[3] += q[3]
    return this
  }

  scale(n: number): Quat {
    this[0] *= n
    this[1] *= n
    this[2] *= n
    this[3] *= n
    return this
  }

  dot(b: Quat): number {
    const [a0, a1, a2, a3] = this
    const [b0, b1, b2, b3] = b
    return a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3
  }

  lerp(a: Quat, b: Quat, t: number): Quat {
    const [ax, ay, az, aw] = a
    const [bx, by, bz, bw] = b
    this[0] = ax + t * (bx - ax)
    this[1] = ay + t * (by - ay)
    this[2] = az + t * (bz - az)
    this[3] = aw + t * (bw - aw)
    return this
  }

  get length(): number {
    const [x, y, z, w] = this
    return Math.hypot(x, y, z, w)
  }

  get squaredLength(): number {
    const [x, y, z, w] = this
    return x * x + y * y + z * z + w * w
  }

  normalize(): Quat {
    const [x, y, z, w] = this
    const len = inverseSqrt(this.squaredLength)
    this[0] = x * len
    this[1] = y * len
    this[2] = z * len
    this[3] = w * len
    return this
  }

  equalsExact(b: Quat): boolean {
    const [x, y, z, w] = this
    const [bx, by, bz, bw] = b
    return x === bx && y === by && z === bz && w === bw
  }

  equalsApproximately(b: Quat): boolean {
    const [x, y, z, w] = this
    const [bx, by, bz, bw] = b
    return (
      equalsApproximately(x, bx) &&
      equalsApproximately(y, by) &&
      equalsApproximately(z, bz) &&
      equalsApproximately(w, bw)
    )
  }

  // represent the shortest rotation from one vector to another.
  // Both vectors are assumed to be unit length.
  rotationTo(a: Vec3, b: Vec3): Quat {
    const dot = a.dot(b)
    if (dot < -0.999999) {
      const tmpvec3 = Vec3.right().cross(a)
      if (tmpvec3.length < EPSILON) {
        const axis = Vec3.up()
          .cross(a)
          .normalize()

        this.copy(Quat.setAxisAngle(axis, Math.PI))
        return this
      }
    } else if (dot > 0.999999) {
      this.set([0, 0, 0, 1])
      return this
    }

    const tmp = a.clone().cross(b)
    this[0] = tmp[0]
    this[1] = tmp[1]
    this[2] = tmp[2]
    this[3] = 1 + dot
    return this.normalize()
  }

  // Performs a spherical linear interpolation with two control points
  sqlerp(a: Quat, b: Quat, c: Quat, d: Quat, t: number): Quat {
    const temp1 = new Quat().slerp(a, d, t)
    const temp2 = new Quat().slerp(b, c, t)
    this.slerp(temp1, temp2, 2 * t * (1 - t))
    return this
  }

  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {vec3} view  the vector representing the viewing direction
   * @param {vec3} right the vector representing the local "right" direction
   * @param {vec3} up    the vector representing the local "up" direction
   */
  static fromAxes(view: Vec3, right: Vec3, up: Vec3): Quat {
    const m = new Mat3(right[0], up[0], -view[0], right[1], up[1], -view[1], right[2], up[2], -view[2])
    return Quat.fromMat3(m).normalize()
  }
}
