import { Vec3 } from './vec3';
import { Quat } from './quat';
import { DualQuat } from './quat2';
export declare class Mat4 extends Float32Array {
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
    constructor(m00: number, m01: number, m02: number, m03: number, m10: number, m11: number, m12: number, m13: number, m20: number, m21: number, m22: number, m23: number, m30: number, m31: number, m32: number, m33: number);
    clone(): Mat4;
    copy(m: Mat4): Mat4;
    identity(): Mat4;
    static identity(): Mat4;
    transpose(): Mat4;
    invert(): Mat4;
    adjoint(): Mat4;
    get determinant(): number;
    multiply(b: Mat4): Mat4;
    translate(v: Vec3): Mat4;
    scale(v: Vec3): Mat4;
    rotate(axis: Vec3, rad: number): Mat4;
    rotateX(rad: number): Mat4;
    rotateY(rad: number): Mat4;
    rotateZ(rad: number): Mat4;
    setFromTranslation(v: Vec3): Mat4;
    setFromScaling(v: Vec3): Mat4;
    setFromRotation(axis: Vec3, rad: number): Mat4;
    setFromXRotation(rad: number): Mat4;
    setFromYRotation(rad: number): Mat4;
    setFromZRotation(rad: number): Mat4;
    setFromTranslationRotation(q: Quat, v: Vec3): Mat4;
    setFromQuat2(a: DualQuat): Mat4;
    get translation(): Vec3;
    get scaling(): Vec3;
    get rotation(): Quat;
    setFromTranslationRotationScale(translation: Vec3, rotation: Quat, scaling: Vec3): Mat4;
    setFromRotationTranslationScaleOrigin(translation: Vec3, rotation: Quat, scaling: Vec3, origin: Vec3): Mat4;
    setFromQuat(q: Quat): Mat4;
    setFromFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
    setFromPerspective(fovy: number, aspect: number, near: number, far?: number): Mat4;
    setFromPerspectiveFromFieldOfView(fovDegrees: {
        up: number;
        down: number;
        left: number;
        right: number;
    }, near: number, far: number): Mat4;
    setFromOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
    setFromLookAt(eye: Vec3, center: Vec3, up: Vec3): Mat4;
    setFromTargetTo(eye: Vec3, target: Vec3, up: Vec3): Mat4;
    toString(): string;
    frobeniusNorm(): number;
    add(b: Mat4): Mat4;
    subtract(b: Mat4): Mat4;
    multiplyScalar(b: number): Mat4;
    equalsExact(b: Mat4): boolean;
    equalsApproximately(b: Mat4): boolean;
}
