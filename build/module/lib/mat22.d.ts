import { Vec2 } from './vec2';
export declare class Mat2 extends Float32Array {
    /**
     * Create a new mat2 with the given values
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m10 Component in column 1, row 0 position (index 2)
     * @param {Number} m11 Component in column 1, row 1 position (index 3)
     * @returns {mat2} out A new 2x2 matrix
     */
    constructor(m00: number, m01: number, m10: number, m11: number);
    clone(): Mat2;
    copy(from: Mat2): Mat2;
    static identity(): Mat2;
    identity(): Mat2;
    transpose(): Mat2;
    invert(): Mat2;
    adjoint(): Mat2;
    get determinant(): number;
    multiply(b: Mat2): Mat2;
    rotate(rad: number): Mat2;
    scale(v: Vec2): Mat2;
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     mat2.setIdentity();
     *     mat2.rotate(rad);
     *
     * @param {Number} rad the angle to rotate the matrix by
     */
    fromRotation(rad: number): Mat2;
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat2.setIdentity();
     *     mat2.scale(vec);
     *
     * @param {mat2} out mat2 receiving operation result
     * @param {vec2} v Scaling vector
     */
    fromScaling(v: Vec2): Mat2;
    toString(): string;
    frobeniusNorm(): number;
    /**
     * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
     * @param {mat2} L the lower triangular matrix
     * @param {mat2} U the upper triangular matrix
     */
    LDU(lowerTriangular: Mat2, upperTriangular: Mat2): void;
    add(b: Mat2): Mat2;
    subtract(b: Mat2): Mat2;
    equalExact(b: Mat2): boolean;
    equalsApproximately(b: Mat2): boolean;
    multiplyScalar(b: number): Mat2;
}
