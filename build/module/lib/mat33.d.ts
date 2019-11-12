import { Mat23 } from './mat23';
import { Mat4 } from './mat44';
import { Quat } from './quat';
import { Vec2 } from './vec2';
export declare class Mat3 extends Float32Array {
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
    constructor(m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number);
    static identity(): Mat3;
    identity(): Mat3;
    setFromMat4(a: Mat4): Mat3;
    clone(): Mat3;
    copy(a: Mat3): Mat3;
    transpose(): Mat3;
    invert(): Mat3;
    adjoint(): Mat3;
    get determinant(): number;
    multiply(b: Mat3): Mat3;
    translate(v: Vec2): Mat3;
    rotate(rad: number): Mat3;
    scale(v: Vec2): Mat3;
    setFromTranslation(v: Vec2): Mat3;
    setFromRotation(rad: number): Mat3;
    setFromScaling(v: Vec2): Mat3;
    setFromMat23(a: Mat23): Mat3;
    setFromQuat(q: Quat): Mat3;
    setFromMat4Normal(a: Mat4): Mat3;
    setFromProjection(glContextWidth: number, glContextHeight: number): Mat3;
    toString(): string;
    frobeniusNorm(): number;
    add(b: Mat3): Mat3;
    subtract(b: Mat3): Mat3;
    multiplyScalar(b: number): Mat3;
    equalsExact(b: Mat3): boolean;
    equalsApproximately(b: Mat3): boolean;
}
