"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const vec3_1 = require("./vec3");
const quat_1 = require("./quat");
// 4x4 Matrix, column-major, when typed out it looks like row-major. The matrices are being post multiplied.
class Mat4 extends Float32Array {
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
    constructor(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        super(16);
        this[0] = m00;
        this[1] = m01;
        this[2] = m02;
        this[3] = m03;
        this[4] = m10;
        this[5] = m11;
        this[6] = m12;
        this[7] = m13;
        this[8] = m20;
        this[9] = m21;
        this[10] = m22;
        this[11] = m23;
        this[12] = m30;
        this[13] = m31;
        this[14] = m32;
        this[15] = m33;
    }
    clone() {
        return new Mat4(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8], this[9], this[10], this[11], this[12], this[13], this[14], this[15]);
    }
    copy(m) {
        this[0] = m[0];
        this[1] = m[1];
        this[2] = m[2];
        this[3] = m[3];
        this[4] = m[4];
        this[5] = m[5];
        this[6] = m[6];
        this[7] = m[7];
        this[8] = m[8];
        this[9] = m[9];
        this[10] = m[10];
        this[11] = m[11];
        this[12] = m[12];
        this[13] = m[13];
        this[14] = m[14];
        this[15] = m[15];
        return this;
    }
    identity() {
        this.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        return this;
    }
    static identity() {
        return new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    transpose() {
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a12 = this[6];
        const a13 = this[7];
        const a23 = this[11];
        this[1] = this[4];
        this[2] = this[8];
        this[3] = this[12];
        this[4] = a01;
        this[6] = this[9];
        this[7] = this[13];
        this[8] = a02;
        this[9] = a12;
        this[11] = this[14];
        this[12] = a03;
        this[13] = a13;
        this[14] = a23;
        return this;
    }
    invert() {
        const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this;
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        // Calculate the determinant
        let det = this.determinant;
        if (!det) {
            return this;
        }
        det = 1 / det;
        this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return this;
    }
    adjoint() {
        const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this;
        this[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
        this[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        this[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
        this[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        this[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        this[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
        this[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        this[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
        this[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
        this[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        this[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
        this[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        this[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        this[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
        this[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        this[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
        return this;
    }
    get determinant() {
        const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this;
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }
    multiply(b) {
        const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this;
        // Cache only the current line of the second matrix
        let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[4];
        b1 = b[5];
        b2 = b[6];
        b3 = b[7];
        this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[8];
        b1 = b[9];
        b2 = b[10];
        b3 = b[11];
        this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[12];
        b1 = b[13];
        b2 = b[14];
        b3 = b[15];
        this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return this;
    }
    translate(v) {
        const [x, y, z] = v;
        this[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
        this[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
        this[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
        this[15] = this[3] * x + this[7] * y + this[11] * z + this[15];
        return this;
    }
    scale(v) {
        const [x, y, z] = v;
        this[0] = this[0] * x;
        this[1] = this[1] * x;
        this[2] = this[2] * x;
        this[3] = this[3] * x;
        this[4] = this[4] * y;
        this[5] = this[5] * y;
        this[6] = this[6] * y;
        this[7] = this[7] * y;
        this[8] = this[8] * z;
        this[9] = this[9] * z;
        this[10] = this[10] * z;
        this[11] = this[11] * z;
        this[12] = this[12];
        this[13] = this[13];
        this[14] = this[14];
        this[15] = this[15];
        return this;
    }
    rotate(axis, rad) {
        let [x, y, z] = axis;
        let len = common_1.sqrt(x * x + y * y + z * z);
        if (len < common_1.EPSILON) {
            return this;
        }
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const t = 1 - c;
        const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23] = this;
        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c;
        const b01 = y * x * t + z * s;
        const b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s;
        const b11 = y * y * t + c;
        const b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s;
        const b21 = y * z * t - x * s;
        const b22 = z * z * t + c;
        // Perform rotation-specific matrix multiplication
        this[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this[11] = a03 * b20 + a13 * b21 + a23 * b22;
        return this;
    }
    rotateX(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const a10 = this[4];
        const a11 = this[5];
        const a12 = this[6];
        const a13 = this[7];
        const a20 = this[8];
        const a21 = this[9];
        const a22 = this[10];
        const a23 = this[11];
        // Perform axis-specific matrix multiplication
        this[4] = a10 * c + a20 * s;
        this[5] = a11 * c + a21 * s;
        this[6] = a12 * c + a22 * s;
        this[7] = a13 * c + a23 * s;
        this[8] = a20 * c - a10 * s;
        this[9] = a21 * c - a11 * s;
        this[10] = a22 * c - a12 * s;
        this[11] = a23 * c - a13 * s;
        return this;
    }
    rotateY(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a20 = this[8];
        const a21 = this[9];
        const a22 = this[10];
        const a23 = this[11];
        // Perform axis-specific matrix multiplication
        this[0] = a00 * c - a20 * s;
        this[1] = a01 * c - a21 * s;
        this[2] = a02 * c - a22 * s;
        this[3] = a03 * c - a23 * s;
        this[8] = a00 * s + a20 * c;
        this[9] = a01 * s + a21 * c;
        this[10] = a02 * s + a22 * c;
        this[11] = a03 * s + a23 * c;
        return this;
    }
    rotateZ(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a10 = this[4];
        const a11 = this[5];
        const a12 = this[6];
        const a13 = this[7];
        // Perform axis-specific matrix multiplication
        this[0] = a00 * c + a10 * s;
        this[1] = a01 * c + a11 * s;
        this[2] = a02 * c + a12 * s;
        this[3] = a03 * c + a13 * s;
        this[4] = a10 * c - a00 * s;
        this[5] = a11 * c - a01 * s;
        this[6] = a12 * c - a02 * s;
        this[7] = a13 * c - a03 * s;
        return this;
    }
    setFromTranslation(v) {
        const [x, y, z] = v;
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = 1;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = 1;
        this[11] = 0;
        this[12] = x;
        this[13] = y;
        this[14] = z;
        this[15] = 1;
        return this;
    }
    setFromScaling(v) {
        const [x, y, z] = v;
        this[0] = x;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = y;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = z;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;
        return this;
    }
    setFromRotation(axis, rad) {
        let len = axis.length;
        if (len < common_1.EPSILON) {
            return Mat4.identity();
        }
        let [x, y, z] = axis;
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const t = 1 - c;
        // Perform rotation-specific matrix multiplication
        this[0] = x * x * t + c;
        this[1] = y * x * t + z * s;
        this[2] = z * x * t - y * s;
        this[3] = 0;
        this[4] = x * y * t - z * s;
        this[5] = y * y * t + c;
        this[6] = z * y * t + x * s;
        this[7] = 0;
        this[8] = x * z * t + y * s;
        this[9] = y * z * t - x * s;
        this[10] = z * z * t + c;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;
        return this;
    }
    setFromXRotation(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        // Perform axis-specific matrix multiplication
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = c;
        this[6] = s;
        this[7] = 0;
        this[8] = 0;
        this[9] = -s;
        this[10] = c;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;
        return this;
    }
    setFromYRotation(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        // Perform axis-specific matrix multiplication
        this[0] = c;
        this[1] = 0;
        this[2] = s;
        this[3] = 0;
        this[4] = 0;
        this[5] = 1;
        this[6] = 0;
        this[7] = 0;
        this[8] = s;
        this[9] = 0;
        this[10] = c;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;
        return this;
    }
    setFromZRotation(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        // Perform axis-specific matrix multiplication
        this[0] = c;
        this[1] = s;
        this[2] = 0;
        this[3] = 0;
        this[4] = s;
        this[5] = c;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = 1;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;
        return this;
    }
    setFromTranslationRotation(q, v) {
        // Quaternion math
        const [x, y, z, w] = q;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        const [vx, vy, vz] = v;
        this[0] = 1 - (yy + zz);
        this[1] = xy + wz;
        this[2] = xz - wy;
        this[3] = 0;
        this[4] = xy - wz;
        this[5] = 1 - (xx + zz);
        this[6] = yz + wx;
        this[7] = 0;
        this[8] = xz + wy;
        this[9] = yz - wx;
        this[10] = 1 - (xx + yy);
        this[11] = 0;
        this[12] = vx;
        this[13] = vy;
        this[14] = vz;
        this[15] = 1;
        return this;
    }
    setFromQuat2(a) {
        const translation = vec3_1.Vec3.zero();
        const bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
        const magnitude = bx * bx + by * by + bz * bz + bw * bw;
        //Only scale if it makes sense
        if (magnitude > 0) {
            translation[0] = ((ax * bw + aw * bx + ay * bz - az * by) * 2) / magnitude;
            translation[1] = ((ay * bw + aw * by + az * bx - ax * bz) * 2) / magnitude;
            translation[2] = ((az * bw + aw * bz + ax * by - ay * bx) * 2) / magnitude;
        }
        else {
            translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
            translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
            translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
        }
        return this.setFromTranslationRotation(a.real, translation);
    }
    get translation() {
        return new vec3_1.Vec3(this[12], this[13], this[14]);
    }
    get scaling() {
        const [m11, m12, m13, m21, m22, m23, m31, m32, m33] = this;
        return new vec3_1.Vec3(common_1.sqrt(m11 * m11 + m12 * m12 + m13 * m13), common_1.sqrt(m21 * m21 + m22 * m22 + m23 * m23), common_1.sqrt(m31 * m31 + m32 * m32 + m33 * m33));
    }
    get rotation() {
        // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
        let S = 0;
        const trace = this[0] + this[5] + this[10];
        const q = quat_1.Quat.identity();
        if (trace > 0) {
            S = common_1.sqrt(trace + 1) * 2;
            q[3] = 0.25 * S;
            q[0] = (this[6] - this[9]) / S;
            q[1] = (this[8] - this[2]) / S;
            q[2] = (this[1] - this[4]) / S;
        }
        else if (this[0] > this[5] && this[0] > this[10]) {
            S = common_1.sqrt(1.0 + this[0] - this[5] - this[10]) * 2;
            q[3] = (this[6] - this[9]) / S;
            q[0] = 0.25 * S;
            q[1] = (this[1] + this[4]) / S;
            q[2] = (this[8] + this[2]) / S;
        }
        else if (this[5] > this[10]) {
            S = common_1.sqrt(1.0 + this[5] - this[0] - this[10]) * 2;
            q[3] = (this[8] - this[2]) / S;
            q[0] = (this[1] + this[4]) / S;
            q[1] = 0.25 * S;
            q[2] = (this[6] + this[9]) / S;
        }
        else {
            S = common_1.sqrt(1.0 + this[10] - this[0] - this[5]) * 2;
            q[3] = (this[1] - this[4]) / S;
            q[0] = (this[8] + this[2]) / S;
            q[1] = (this[6] + this[9]) / S;
            q[2] = 0.25 * S;
        }
        return q;
    }
    setFromTranslationRotationScale(translation, rotation, scaling) {
        // Quaternion math
        const [qx, qy, qz, qw] = rotation;
        const x2 = qx + qx;
        const y2 = qy + qy;
        const z2 = qz + qz;
        const xx = qx * x2;
        const xy = qx * y2;
        const xz = qx * z2;
        const yy = qy * y2;
        const yz = qy * z2;
        const zz = qz * z2;
        const wx = qw * x2;
        const wy = qw * y2;
        const wz = qw * z2;
        const sx = scaling[0];
        const sy = scaling[1];
        const sz = scaling[2];
        const [vx, vy, vz] = translation;
        this[0] = (1 - (yy + zz)) * sx;
        this[1] = (xy + wz) * sx;
        this[2] = (xz - wy) * sx;
        this[3] = 0;
        this[4] = (xy - wz) * sy;
        this[5] = (1 - (xx + zz)) * sy;
        this[6] = (yz + wx) * sy;
        this[7] = 0;
        this[8] = (xz + wy) * sz;
        this[9] = (yz - wx) * sz;
        this[10] = (1 - (xx + yy)) * sz;
        this[11] = 0;
        this[12] = vx;
        this[13] = vy;
        this[14] = vz;
        this[15] = 1;
        return this;
    }
    // Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
    setFromRotationTranslationScaleOrigin(translation, rotation, scaling, origin) {
        // Quaternion math
        const [x, y, z, w] = rotation;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        const [sx, sy, sz] = scaling;
        const [ox, oy, oz] = origin;
        const [vx, vy, vz] = translation;
        this[0] = (1 - (yy + zz)) * sx;
        this[1] = (xy + wz) * sx;
        this[2] = (xz - wy) * sx;
        this[3] = 0;
        this[4] = (xy - wz) * sy;
        this[5] = (1 - (xx + zz)) * sy;
        this[6] = (yz + wx) * sy;
        this[7] = 0;
        this[8] = (xz + wy) * sz;
        this[9] = (yz - wx) * sz;
        this[10] = (1 - (xx + yy)) * sz;
        this[11] = 0;
        this[12] = vx + ox - (this[0] * ox + this[4] * oy + this[8] * oz);
        this[13] = vy + oy - (this[1] * ox + this[5] * oy + this[9] * oz);
        this[14] = vz + oz - (this[2] * ox + this[6] * oy + this[10] * oz);
        this[15] = 1;
        return this;
    }
    setFromQuat(q) {
        const [x, y, z, w] = q;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        this[0] = 1 - yy - zz;
        this[1] = yx + wz;
        this[2] = zx - wy;
        this[3] = 0;
        this[4] = yx - wz;
        this[5] = 1 - xx - zz;
        this[6] = zy + wx;
        this[7] = 0;
        this[8] = zx + wy;
        this[9] = zy - wx;
        this[10] = 1 - xx - yy;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;
        return this;
    }
    setFromFrustum(left, right, bottom, top, near, far) {
        const rl = 1 / (right - left);
        const tb = 1 / (top - bottom);
        const nf = 1 / (near - far);
        this[0] = near * 2 * rl;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = near * 2 * tb;
        this[6] = 0;
        this[7] = 0;
        this[8] = (right + left) * rl;
        this[9] = (top + bottom) * tb;
        this[10] = (far + near) * nf;
        this[11] = -1;
        this[12] = 0;
        this[13] = 0;
        this[14] = far * near * 2 * nf;
        this[15] = 0;
        return this;
    }
    setFromPerspective(fovy, aspect, near, far) {
        const f = 1.0 / Math.tan(fovy / 2);
        let m10 = -1;
        let m14 = -2 * near;
        if (far && Number.isFinite(far)) {
            const nf = 1 / (near - far);
            m10 = (far + near) * nf;
            m14 = 2 * far * near * nf;
        }
        this[0] = f / aspect;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = f;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = m10;
        this[11] = -1;
        this[12] = 0;
        this[13] = 0;
        this[14] = m14;
        this[15] = 0;
        return this;
    }
    // Generates a perspective projection matrix with the given field of view.
    //  This is primarily useful for generating projection matrices to be used with the still experiemental WebVR API.
    setFromPerspectiveFromFieldOfView(fovDegrees, near, far) {
        const upTan = Math.tan(fovDegrees.up * common_1.degree2rad);
        const downTan = Math.tan(fovDegrees.down * common_1.degree2rad);
        const leftTan = Math.tan(fovDegrees.left * common_1.degree2rad);
        const rightTan = Math.tan(fovDegrees.right * common_1.degree2rad);
        const xScale = 2.0 / (leftTan + rightTan);
        const yScale = 2.0 / (upTan + downTan);
        this[0] = xScale;
        this[1] = 0.0;
        this[2] = 0.0;
        this[3] = 0.0;
        this[4] = 0.0;
        this[5] = yScale;
        this[6] = 0.0;
        this[7] = 0.0;
        this[8] = -((leftTan - rightTan) * xScale * 0.5);
        this[9] = (upTan - downTan) * yScale * 0.5;
        this[10] = far / (near - far);
        this[11] = -1.0;
        this[12] = 0.0;
        this[13] = 0.0;
        this[14] = (far * near) / (near - far);
        this[15] = 0.0;
        return this;
    }
    setFromOrtho(left, right, bottom, top, near, far) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        this[0] = -2 * lr;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = -2 * bt;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = 2 * nf;
        this[11] = 0;
        this[12] = (left + right) * lr;
        this[13] = (top + bottom) * bt;
        this[14] = (far + near) * nf;
        this[15] = 1;
        return this;
    }
    // Generates a look-at matrix with the given eye position, focal point, and up axis.
    // If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
    setFromLookAt(eye, center, up) {
        const [ex, ey, ez] = eye;
        const [cx, cy, cz] = center;
        const [ux, uy, uz] = up;
        if (Math.abs(ex - cx) < common_1.EPSILON && Math.abs(ey - cy) < common_1.EPSILON && Math.abs(ez - cz) < common_1.EPSILON) {
            return Mat4.identity();
        }
        let z0 = ex - cx;
        let z1 = ey - cy;
        let z2 = ez - cz;
        let len = common_1.inverseSqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        let x0 = uy * z2 - uz * z1;
        let x1 = uz * z0 - ux * z2;
        let x2 = ux * z1 - uy * z0;
        len = common_1.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        }
        else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        const y0 = z1 * x2 - z2 * x1;
        const y1 = z2 * x0 - z0 * x2;
        const y2 = z0 * x1 - z1 * x0;
        len = common_1.inverseSqrt(y0 * y0 + y1 * y1 + y2 * y2);
        this[0] = x0;
        this[1] = y0;
        this[2] = z0;
        this[3] = 0;
        this[4] = x1;
        this[5] = y1;
        this[6] = z1;
        this[7] = 0;
        this[8] = x2;
        this[9] = y2;
        this[10] = z2;
        this[11] = 0;
        this[12] = -(x0 * ex + x1 * ey + x2 * ez);
        this[13] = -(y0 * ex + y1 * ey + y2 * ez);
        this[14] = -(z0 * ex + z1 * ey + z2 * ez);
        this[15] = 1;
        return this;
    }
    // Generates a matrix that makes something look at something else.
    setFromTargetTo(eye, target, up) {
        const [ex, ey, ez] = eye;
        const [ux, uy, uz] = up;
        let z0 = ex - target[0], z1 = ey - target[1], z2 = ez - target[2];
        let len = common_1.inverseSqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        const x0 = uy * z2 - uz * z1, x1 = uz * z0 - ux * z2, x2 = ux * z1 - uy * z0;
        len = common_1.inverseSqrt(x0 * x0 + x1 * x1 + x2 * x2);
        this[0] = x0;
        this[1] = x1;
        this[2] = x2;
        this[3] = 0;
        this[4] = z1 * x2 - z2 * x1;
        this[5] = z2 * x0 - z0 * x2;
        this[6] = z0 * x1 - z1 * x0;
        this[7] = 0;
        this[8] = z0;
        this[9] = z1;
        this[10] = z2;
        this[11] = 0;
        this[12] = ex;
        this[13] = ey;
        this[14] = ez;
        this[15] = 1;
        return this;
    }
    toString() {
        const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = this;
        return `mat4(
  ${a00},${a01},${a02},${a03}
  ${a10},${a11},${a12},${a13}
  ${a20},${a21},${a22},${a23}
  ${a30},${a31},${a32},${a33}
)`;
    }
    frobeniusNorm() {
        return common_1.sqrt(Math.pow(this[0], 2) +
            Math.pow(this[1], 2) +
            Math.pow(this[2], 2) +
            Math.pow(this[3], 2) +
            Math.pow(this[4], 2) +
            Math.pow(this[5], 2) +
            Math.pow(this[6], 2) +
            Math.pow(this[7], 2) +
            Math.pow(this[8], 2) +
            Math.pow(this[9], 2) +
            Math.pow(this[10], 2) +
            Math.pow(this[11], 2) +
            Math.pow(this[12], 2) +
            Math.pow(this[13], 2) +
            Math.pow(this[14], 2) +
            Math.pow(this[15], 2));
    }
    add(b) {
        this[0] += b[0];
        this[1] += b[1];
        this[2] += b[2];
        this[3] += b[3];
        this[4] += b[4];
        this[5] += b[5];
        this[6] += b[6];
        this[7] += b[7];
        this[8] += b[8];
        this[9] += b[9];
        this[10] += b[10];
        this[11] += b[11];
        this[12] += b[12];
        this[13] += b[13];
        this[14] += b[14];
        this[15] += b[15];
        return this;
    }
    subtract(b) {
        this[0] -= b[0];
        this[1] -= b[1];
        this[2] -= b[2];
        this[3] -= b[3];
        this[4] -= b[4];
        this[5] -= b[5];
        this[6] -= b[6];
        this[7] -= b[7];
        this[8] -= b[8];
        this[9] -= b[9];
        this[10] -= b[10];
        this[11] -= b[11];
        this[12] -= b[12];
        this[13] -= b[13];
        this[14] -= b[14];
        this[15] -= b[15];
        return this;
    }
    multiplyScalar(b) {
        this[0] *= b;
        this[1] *= b;
        this[2] *= b;
        this[3] *= b;
        this[4] *= b;
        this[5] *= b;
        this[6] *= b;
        this[7] *= b;
        this[8] *= b;
        this[9] *= b;
        this[10] *= b;
        this[11] *= b;
        this[12] *= b;
        this[13] *= b;
        this[14] *= b;
        this[15] *= b;
        return this;
    }
    equalsExact(b) {
        return (this[0] === b[0] &&
            this[1] === b[1] &&
            this[2] === b[2] &&
            this[3] === b[3] &&
            this[4] === b[4] &&
            this[5] === b[5] &&
            this[6] === b[6] &&
            this[7] === b[7] &&
            this[8] === b[8] &&
            this[9] === b[9] &&
            this[10] === b[10] &&
            this[11] === b[11] &&
            this[12] === b[12] &&
            this[13] === b[13] &&
            this[14] === b[14] &&
            this[15] === b[15]);
    }
    equalsApproximately(b) {
        const [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15] = this;
        const [b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15] = b;
        return (common_1.equalsApproximately(a0, b0) &&
            common_1.equalsApproximately(a1, b1) &&
            common_1.equalsApproximately(a2, b2) &&
            common_1.equalsApproximately(a3, b3) &&
            common_1.equalsApproximately(a4, b4) &&
            common_1.equalsApproximately(a5, b5) &&
            common_1.equalsApproximately(a6, b6) &&
            common_1.equalsApproximately(a7, b7) &&
            common_1.equalsApproximately(a8, b8) &&
            common_1.equalsApproximately(a9, b9) &&
            common_1.equalsApproximately(a10, b10) &&
            common_1.equalsApproximately(a11, b11) &&
            common_1.equalsApproximately(a12, b12) &&
            common_1.equalsApproximately(a13, b13) &&
            common_1.equalsApproximately(a14, b14) &&
            common_1.equalsApproximately(a15, b15));
    }
}
exports.Mat4 = Mat4;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0NDQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL21hdDQ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWlHO0FBQ2pHLGlDQUE2QjtBQUM3QixpQ0FBNkI7QUFHN0IsNEdBQTRHO0FBQzVHLE1BQWEsSUFBSyxTQUFRLFlBQVk7SUFDcEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bb0JHO0lBQ0gsWUFDRSxHQUFXLEVBQ1gsR0FBVyxFQUNYLEdBQVcsRUFDWCxHQUFXLEVBQ1gsR0FBVyxFQUNYLEdBQVcsRUFDWCxHQUFXLEVBQ1gsR0FBVyxFQUNYLEdBQVcsRUFDWCxHQUFXLEVBQ1gsR0FBVyxFQUNYLEdBQVcsRUFDWCxHQUFXLEVBQ1gsR0FBVyxFQUNYLEdBQVcsRUFDWCxHQUFXO1FBRVgsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ1QsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNiLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDYixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQ2IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNiLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDYixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQ2IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNiLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDYixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQ2IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNiLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQ2QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNkLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQ2QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtJQUNoQixDQUFDO0lBRUQsS0FBSztRQUNILE9BQU8sSUFBSSxJQUFJLENBQ2IsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ1AsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ1AsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ1AsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLElBQUksQ0FBQyxFQUFFLENBQUMsRUFDUixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQ1IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUNSLElBQUksQ0FBQyxFQUFFLENBQUMsRUFDUixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQ1IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNULENBQUE7SUFDSCxDQUFDO0lBRUQsSUFBSSxDQUFDLENBQU87UUFDVixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDaEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDaEIsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFELE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELE1B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TUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNqQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDakMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBRWpDLDRCQUE0QjtRQUM1QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO1FBRTFCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUixPQUFPLElBQUksQ0FBQTtTQUNaO1FBQ0QsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7UUFFYixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUVwRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRCxPQUFPO1FBQ0wsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTtRQUM3RixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDdkcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUN2RyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDMUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUN2RyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDMUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUN2RyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDMUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQ3hHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMzRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDM0csSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQ3hHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMzRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDeEcsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ2IsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTtRQUM3RixNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDakMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNqQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDakMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNqQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDakMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNqQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDakMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUVqQyw0QkFBNEI7UUFDNUIsT0FBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtJQUM5RSxDQUFDO0lBRUQsUUFBUSxDQUFDLENBQU87UUFDZCxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFBO1FBRTdGLG1EQUFtRDtRQUNuRCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1gsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDVCxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNULEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUNuRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUVuRCxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ1QsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNULEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDVCxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ1QsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUE7UUFDbkQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUE7UUFDbkQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUE7UUFDbkQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUE7UUFFbkQsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNULEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDVCxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ1YsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNWLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFBO1FBQ25ELElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFBO1FBQ25ELElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFBO1FBQ3BELElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFBO1FBRXBELEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDVixFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ1YsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNWLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDVixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUNwRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRCxTQUFTLENBQUMsQ0FBTztRQUNmLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNuQixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzdELElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDN0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM5RCxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzlELE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELEtBQUssQ0FBQyxDQUFPO1FBQ1gsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ25CLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENB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LENBQUMsR0FBRyxDQUFDLENBQUE7UUFDN0IsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM3QixNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzdCLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUV6QixrREFBa0Q7UUFDbEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQzNDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUMzQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDM0MsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQzNDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUMzQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDM0MsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQzNDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUMzQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDM0MsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQzNDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUM1QyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFFNUMsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsT0FBTyxDQUFDLEdBQVc7UUFDakIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN2QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNwQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFFcEIsOENBQThDO1FBQzlDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDNUIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUM1QixPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBVztRQUNqQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3BCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUVwQiw4Q0FBOEM7UUFDOUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDM0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUM1QixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQzVCLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFXO1FBQ2pCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN2QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRW5CLDhDQUE4QztRQUM5QyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDM0IsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsa0JBQWtCLENBQUMsQ0FBTztRQUN4QixNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFbkIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNaLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLEVBQUUs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Q0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNaLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNaLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1osT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsR0FBVztRQUMxQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFdkIsOENBQThDO1FBQzlDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLENB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LElBQUksRUFBRSxDQUFBO1FBQy9CLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNkLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDVixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1YsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDVCxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNULEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1QsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDVCxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRVgsTUFBTSxTQUFTLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQTtRQUN2RCw4QkFBOEI7UUFDOUIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQTtZQUMxRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUE7WUFDMUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxD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QyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUN4QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDOUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUN4QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUN4QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1FBQ2pFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUNqRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUs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QUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFBO1FBQ2xELEVBQUUsSUFBSSxHQUFHLENBQUE7UUFDVCxFQUFFLElBQUksR0FBRyxDQUFBO1FBQ1QsRUFBRSxJQUFJLEdBQUcsQ0FBQTtRQUVULE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFDMUIsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFDdEIsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQTtRQUN4QixHQUFHLEdBQUcsb0JBQVcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFBO1FBRTlDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBO1FBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUE7UUFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQTtRQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDWixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ2IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNaLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDYixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ2IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNiLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDWixPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTtRQUM3RixPQUFPO0lBQ1AsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRztJQUN4QixHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHO0lBQ3hCLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUc7SUFDeEIsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRztFQUMxQixDQUFBO0lBQ0EsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLGFBQUksQ0FDVCxTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDVixTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDWixTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDWixTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDWixTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDWixTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDWixTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDWixTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDWixTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDWixTQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDWixTQUFBLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDYixTQUFBLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDYixTQUFBLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDYixTQUFBLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDYixTQUFBLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBSSxDQUFDLENBQUE7WUFDYixTQUFBLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBSSxDQUFDLENBQUEsQ0FDaEIsQ0FBQTtJQUNILENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBTztRQUNULElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNqQixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNqQixPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBTztRQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNqQixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2pCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNqQixPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRCxjQUFjLENBQUMsQ0FBUztRQUN0QixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNiLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDYixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNiLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDYixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2IsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsV0FBVyxDQUFDLENBQU87UUFDakIsT0FBTyxDQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ25CLENBQUE7SUFDSCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsQ0FBTztRQUN6QixNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFBO1FBQ25GLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFaEYsT0FBTyxDQUNMLDRCQUFtQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDM0IsNEJBQW1CLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUMzQiw0QkFBbUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQzNCLDRCQUFtQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDM0IsNEJBQW1CLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUMzQiw0QkFBbUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQzNCLDRCQUFtQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDM0IsNEJBQW1CLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUMzQiw0QkFBbUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQzNCLDRCQUFtQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDM0IsNEJBQW1CLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUM3Qiw0QkFBbUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzdCLDRCQUFtQixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDN0IsNEJBQW1CLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUM3Qiw0QkFBbUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzdCLDRCQUFtQixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FDOUIsQ0FBQTtJQUNILENBQUM7Q0FDRjtBQTFsQ0Qsb0JBMGxDQyJ9