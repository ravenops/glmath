import { EPSILON, equalsApproximately } from './common'
import { Quat } from './quat'
import { Vec3 } from './vec3'
import { Mat4 } from './mat44'

// Dual Quaternion.  Format: [real, dual]
// Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
export class DualQuat extends Float32Array {
  constructor(realX = 0, realY = 0, realZ = 0, realW = 1, dualX = 0, dualY = 0, dualZ = 0, dualW = 0) {
    super(8)
    this[0] = realX
    this[1] = realY
    this[2] = realZ
    this[3] = realW
    this[4] = dualX
    this[5] = dualY
    this[6] = dualZ
    this[7] = dualW
    return this
  }

  clone(): DualQuat {
    return new DualQuat(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7])
  }

  static fromRotationTranslationValues(
    x1: number,
    y1: number,
    z1: number,
    w1: number,
    x2: number,
    y2: number,
    z2: number,
  ): DualQuat {
    const ax = x2 * 0.5
    const ay = y2 * 0.5
    const az = z2 * 0.5
    return new DualQuat(
      x1,
      y1,
      z1,
      w1,
      ax * w1 + ay * z1 - az * y1,
      ay * w1 + az * x1 - ax * z1,
      az * w1 + ax * y1 - ay * x1,
      -ax * x1 - ay * y1 - az * z1,
    )
  }

  static fromTranslationRotation(q: Quat, t: Vec3): DualQuat {
    const ax = t[0] * 0.5
    const ay = t[1] * 0.5
    const az = t[2] * 0.5
    const [bx, by, bz, bw] = q
    return new DualQuat(
      bx,
      by,
      bz,
      bw,
      ax * bw + ay * bz - az * by,
      ay * bw + az * bx - ax * bz,
      az * bw + ax * by - ay * bx,
      -ax * bx - ay * by - az * bz,
    )
  }

  static fromTranslation(t: Vec3): DualQuat {
    return new DualQuat(0, 0, 0, 1, t[0] * 0.5, t[1] * 0.5, t[2] * 0.5, 0)
  }

  static fromRotation(q: Quat): DualQuat {
    return new DualQuat(q[0], q[1], q[2], q[3], 0, 0, 0, 0)
  }

  static fromMat4(a: Mat4): DualQuat {
    const outer = a.rotation
    const t = a.translation
    return DualQuat.fromTranslationRotation(outer, t)
  }

  copy(dq: DualQuat): DualQuat {
    this[0] = dq[0]
    this[1] = dq[1]
    this[2] = dq[2]
    this[3] = dq[3]
    this[4] = dq[4]
    this[5] = dq[5]
    this[6] = dq[6]
    this[7] = dq[7]
    return this
  }

  setIdentity(): DualQuat {
    this[0] = 0
    this[1] = 0
    this[2] = 0
    this[3] = 1
    this[4] = 0
    this[5] = 0
    this[6] = 0
    this[7] = 0
    return this
  }

  get real(): Quat {
    return new Quat(this[0], this[1], this[2], this[3])
  }

  set real(q: Quat) {
    this[0] = q[0]
    this[1] = q[1]
    this[2] = q[2]
    this[3] = q[3]
  }

  get dual(): Quat {
    return new Quat(this[4], this[5], this[6], this[7])
  }

  set dual(q: Quat) {
    this[4] = q[0]
    this[5] = q[1]
    this[6] = q[2]
    this[7] = q[3]
  }

  get translation(): Vec3 {
    const ax = this[4]
    const ay = this[5]
    const az = this[6]
    const aw = this[7]
    const bx = -this[0]
    const by = -this[1]
    const bz = -this[2]
    const bw = this[3]
    return new Vec3(
      (ax * bw + aw * bx + ay * bz - az * by) * 2,
      (ay * bw + aw * by + az * bx - ax * bz) * 2,
      (az * bw + aw * bz + ax * by - ay * bx) * 2,
    )
  }

  translate(v: Vec3): DualQuat {
    const [ax1, ay1, az1, aw1, ax2, ay2, az2, aw2] = this
    const bx1 = v[0] * 0.5
    const by1 = v[1] * 0.5
    const bz1 = v[2] * 0.5
    this[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2
    this[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2
    this[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2
    this[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2
    return this
  }

  rotateX(rad: number): DualQuat {
    let bx = -this[0]
    let by = -this[1]
    let bz = -this[2]
    let bw = this[3]
    const ax = this[4]
    const ay = this[5]
    const az = this[6]
    const aw = this[7]
    const ax1 = ax * bw + aw * bx + ay * bz - az * by
    const ay1 = ay * bw + aw * by + az * bx - ax * bz
    const az1 = az * bw + aw * bz + ax * by - ay * bx
    const aw1 = aw * bw - ax * bx - ay * by - az * bz
    this.rotateX(rad)
    bx = this[0]
    by = this[1]
    bz = this[2]
    bw = this[3]
    this[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by
    this[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz
    this[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx
    this[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz
    return this
  }

  rotateY(rad: number): DualQuat {
    let bx = -this[0]
    let by = -this[1]
    let bz = -this[2]
    let bw = this[3]
    const ax = this[4]
    const ay = this[5]
    const az = this[6]
    const aw = this[7]
    const ax1 = ax * bw + aw * bx + ay * bz - az * by
    const ay1 = ay * bw + aw * by + az * bx - ax * bz
    const az1 = az * bw + aw * bz + ax * by - ay * bx
    const aw1 = aw * bw - ax * bx - ay * by - az * bz
    this.rotateY(rad)
    bx = this[0]
    by = this[1]
    bz = this[2]
    bw = this[3]
    this[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by
    this[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz
    this[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx
    this[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz
    return this
  }

  rotateZ(rad: number): DualQuat {
    let bx = -this[0]
    let by = -this[1]
    let bz = -this[2]
    let bw = this[3]
    const ax = this[4]
    const ay = this[5]
    const az = this[6]
    const aw = this[7]
    const ax1 = ax * bw + aw * bx + ay * bz - az * by
    const ay1 = ay * bw + aw * by + az * bx - ax * bz
    const az1 = az * bw + aw * bz + ax * by - ay * bx
    const aw1 = aw * bw - ax * bx - ay * by - az * bz
    this.rotateZ(rad)
    bx = this[0]
    by = this[1]
    bz = this[2]
    bw = this[3]
    this[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by
    this[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz
    this[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx
    this[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz
    return this
  }

  // Rotates a dual quat by a given quaternion (a * q)
  rotateByQuatAppend(q: Quat): DualQuat {
    const [qx, qy, qz, qw] = q
    let [ax, ay, az, aw] = this

    this[0] = ax * qw + aw * qx + ay * qz - az * qy
    this[1] = ay * qw + aw * qy + az * qx - ax * qz
    this[2] = az * qw + aw * qz + ax * qy - ay * qx
    this[3] = aw * qw - ax * qx - ay * qy - az * qz
    ax = this[4]
    ay = this[5]
    az = this[6]
    aw = this[7]
    this[4] = ax * qw + aw * qx + ay * qz - az * qy
    this[5] = ay * qw + aw * qy + az * qx - ax * qz
    this[6] = az * qw + aw * qz + ax * qy - ay * qx
    this[7] = aw * qw - ax * qx - ay * qy - az * qz
    return this
  }

  // Rotates a dual quat by a given quaternion (q * a)
  rotateByQuatPrepend(q: Quat): DualQuat {
    const [qx, qy, qz, qw] = q
    let [bx, by, bz, bw] = this

    this[0] = qx * bw + qw * bx + qy * bz - qz * by
    this[1] = qy * bw + qw * by + qz * bx - qx * bz
    this[2] = qz * bw + qw * bz + qx * by - qy * bx
    this[3] = qw * bw - qx * bx - qy * by - qz * bz
    bx = this[4]
    by = this[5]
    bz = this[6]
    bw = this[7]
    this[4] = qx * bw + qw * bx + qy * bz - qz * by
    this[5] = qy * bw + qw * by + qz * bx - qx * bz
    this[6] = qz * bw + qw * bz + qx * by - qy * bx
    this[7] = qw * bw - qx * bx - qy * by - qz * bz
    return this
  }

  rotateAroundAxis(axis: Vec3, rad: number): DualQuat {
    //Special case for rad = 0
    if (Math.abs(rad) < EPSILON) {
      return this
    }
    const axisLength = axis.length
    rad *= 0.5
    const s = Math.sin(rad)
    const bx = (s * axis[0]) / axisLength
    const by = (s * axis[1]) / axisLength
    const bz = (s * axis[2]) / axisLength
    const bw = Math.cos(rad)

    const [ax1, ay1, az1, aw1] = this
    this[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by
    this[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz
    this[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx
    this[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz
    const ax = this[4]
    const ay = this[5]
    const az = this[6]
    const aw = this[7]
    this[4] = ax * bw + aw * bx + ay * bz - az * by
    this[5] = ay * bw + aw * by + az * bx - ax * bz
    this[6] = az * bw + aw * bz + ax * by - ay * bx
    this[7] = aw * bw - ax * bx - ay * by - az * bz

    return this
  }

  add(b: DualQuat): DualQuat {
    this[0] += b[0]
    this[1] += b[1]
    this[2] += b[2]
    this[3] += b[3]
    this[4] += b[4]
    this[5] += b[5]
    this[6] += b[6]
    this[7] += b[7]
    return this
  }

  multiply(b: DualQuat): DualQuat {
    const ax0 = this[0]
    const ay0 = this[1]
    const az0 = this[2]
    const aw0 = this[3]
    const bx1 = b[4]
    const by1 = b[5]
    const bz1 = b[6]
    const bw1 = b[7]
    const ax1 = this[4]
    const ay1 = this[5]
    const az1 = this[6]
    const aw1 = this[7]
    const bx0 = b[0]
    const by0 = b[1]
    const bz0 = b[2]
    const bw0 = b[3]
    this[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0
    this[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0
    this[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0
    this[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0
    this[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0
    this[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0
    this[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0
    this[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0
    return this
  }

  scale(b: number): DualQuat {
    this[0] *= b
    this[1] *= b
    this[2] *= b
    this[3] *= b
    this[4] *= b
    this[5] *= b
    this[6] *= b
    this[7] *= b
    return this
  }

  // Calculates the dot product of two dual quat's (The dot product of the real parts)
  dot(b: DualQuat): number {
    const [a0, a1, a2, a3] = this
    const [b0, b1, b2, b3] = b
    return a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3
  }

  // Performs a linear interpolation between two dual quats's
  // NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
  lerp(a: DualQuat, b: DualQuat, t: number): DualQuat {
    const mt = 1 - t
    if (a.dot(b) < 0) {
      t = -t
    }

    this[0] = a[0] * mt + b[0] * t
    this[1] = a[1] * mt + b[1] * t
    this[2] = a[2] * mt + b[2] * t
    this[3] = a[3] * mt + b[3] * t
    this[4] = a[4] * mt + b[4] * t
    this[5] = a[5] * mt + b[5] * t
    this[6] = a[6] * mt + b[6] * t
    this[7] = a[7] * mt + b[7] * t

    return this
  }

  // Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
  invert(): DualQuat {
    const sqlen = this.squaredLength
    this[0] = -this[0] / sqlen
    this[1] = -this[1] / sqlen
    this[2] = -this[2] / sqlen
    this[3] = this[3] / sqlen
    this[4] = -this[4] / sqlen
    this[5] = -this[5] / sqlen
    this[6] = -this[6] / sqlen
    this[7] = this[7] / sqlen
    return this
  }

  // Calculates the conjugate of a dual quat. If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
  conjugate(): DualQuat {
    this[0] = -this[0]
    this[1] = -this[1]
    this[2] = -this[2]
    this[3] = this[3]
    this[4] = -this[4]
    this[5] = -this[5]
    this[6] = -this[6]
    this[7] = this[7]
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

  normalize(): DualQuat {
    let magnitude = this.squaredLength
    if (magnitude > 0) {
      magnitude = Math.sqrt(magnitude)
      this[0] /= magnitude
      this[1] /= magnitude
      this[2] /= magnitude
      this[3] /= magnitude
      this[4] /= magnitude
      this[5] /= magnitude
      this[6] /= magnitude
      this[7] /= magnitude
    }
    return this
  }

  toString(): string {
    const [rx, ry, rz, rw, dx, dy, dz, dw] = this
    return `quat2(${rx}, ${ry}, ${rz}, ${rw}, ${dx}, ${dy}, ${dz}, ${dw})`
  }

  equalsExact(b: DualQuat): boolean {
    const [a0, a1, a2, a3, a4, a5, a6, a7] = this
    const [b0, b1, b2, b3, b4, b5, b6, b7] = b
    return a0 === b0 && a1 === b1 && a2 === b2 && a3 === b3 && a4 === b4 && a5 === b5 && a6 === b6 && a7 === b7
  }

  equalsApproximately(b: DualQuat): boolean {
    const [a0, a1, a2, a3, a4, a5, a6, a7] = this
    const [b0, b1, b2, b3, b4, b5, b6, b7] = b
    return (
      equalsApproximately(a0, b0) &&
      equalsApproximately(a1, b1) &&
      equalsApproximately(a2, b2) &&
      equalsApproximately(a3, b3) &&
      equalsApproximately(a4, b4) &&
      equalsApproximately(a5, b5) &&
      equalsApproximately(a6, b6) &&
      equalsApproximately(a7, b7)
    )
  }
}
