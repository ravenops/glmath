import { Vec2 } from './vec2';
/**
 * 2x3 Matrix
 * @module mat2d
 *
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b,
 *  c, d,
 *  tx, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0,
 *  c, d, 0,
 *  tx, ty, 1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */
export declare class Mat23 extends Float32Array {
    constructor(a: number, b: number, c: number, d: number, tx: number, ty: number);
    static identity(): Mat23;
    setIdentity(): Mat23;
    clone(): Mat23;
    copy(b: Mat23): Mat23;
    invert(): Mat23;
    get determinant(): number;
    multiply(b: Mat23): Mat23;
    rotate(rad: number): Mat23;
    scale(v: Vec2): Mat23;
    translate(v: Vec2): Mat23;
    fromRotation(rad: number): Mat23;
    fromScaling(v: Vec2): Mat23;
    fromTranslation(v: Vec2): Mat23;
    toString(): string;
    frobeniusNorm(): number;
    add(b: Mat23): Mat23;
    subtract(b: Mat23): Mat23;
    multiplyScalar(b: number): Mat23;
    equalsExact(b: Mat23): boolean;
    equalsApproximately(b: Mat23): boolean;
}
