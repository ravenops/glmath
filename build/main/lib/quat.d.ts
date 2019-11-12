import { Mat3 } from './mat33';
import { Vec3 } from './vec3';
export interface AxisAngle {
    axis: Vec3;
    rad: number;
}
export declare class Quat extends Float32Array {
    constructor(x: number, y: number, z: number, w: number);
    identity(): void;
    static identity(): Quat;
    static zero(): Quat;
    setFromAxisAngle(axis: Vec3, rad: number): Quat;
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
    get axisAngle(): AxisAngle;
    angleDistance(b: Quat): number;
    multiply(b: Quat): Quat;
    rotateX(rad: number): Quat;
    rotateY(rad: number): Quat;
    rotateZ(rad: number): Quat;
    /**
     * Calculates the W component of a quat from the X, Y, and Z components.
     * Assumes that quaternion is 1 unit in length.
     * Any existing W component will be ignored.
     */
    calculateW(): Quat;
    exp(): Quat;
    ln(): Quat;
    pow(b: number): Quat;
    slerp(a: Quat, b: Quat, t: number): Quat;
    random(): Quat;
    invert(): Quat;
    conjugate(): Quat;
    /**
     * Creates a quaternion from the given 3x3 rotation matrix.
     *
     * NOTE: The resultant quaternion is not normalized, so you should be sure
     * to renormalize the quaternion yourself where necessary.
     *
     */
    setFromMat3(m: Mat3): Quat;
    setFromEulerDegrees(x: number, y: number, z: number): Quat;
    toString(): string;
    clone(): Quat;
    copy(q: Quat): Quat;
    add(q: Quat): Quat;
    scale(n: number): Quat;
    dot(b: Quat): number;
    lerp(a: Quat, b: Quat, t: number): Quat;
    get length(): number;
    get squaredLength(): number;
    normalize(): Quat;
    equalsExact(b: Quat): boolean;
    equalsApproximately(b: Quat): boolean;
    rotationTo(a: Vec3, b: Vec3): Quat;
    sqlerp(a: Quat, b: Quat, c: Quat, d: Quat, t: number): Quat;
    /**
     * Sets the specified quaternion with values corresponding to the given
     * axes. Each axis is a vec3 and is expected to be unit length and
     * perpendicular to all other specified axes.
     *
     * @param {vec3} view  the vector representing the viewing direction
     * @param {vec3} right the vector representing the local "right" direction
     * @param {vec3} up    the vector representing the local "up" direction
     */
    setFromAxes(view: Vec3, right: Vec3, up: Vec3): Quat;
}
