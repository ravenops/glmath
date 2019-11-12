import { Mat2 } from './mat22';
import { Mat23 } from './mat23';
import { Mat3 } from './mat33';
import { Mat4 } from './mat44';
import { Vec3 } from './vec3';
export declare class Vec2 extends Float32Array {
    constructor(x: number, y: number);
    static zero(): Vec2;
    zero(): Vec2;
    static one(): Vec2;
    one(): Vec2;
    clone(): Vec2;
    copy(a: Vec2): Vec2;
    add(b: Vec2): Vec2;
    subtract(b: Vec2): Vec2;
    multiply(b: Vec2): Vec2;
    divide(b: Vec2): Vec2;
    ceil(): Vec2;
    floor(): Vec2;
    min(b: Vec2): Vec2;
    max(b: Vec2): Vec2;
    round(): Vec2;
    scale(b: number): Vec2;
    distance(b: Vec2): number;
    squaredDistance(b: Vec2): number;
    get sqLength(): number;
    get length(): number;
    negate(): Vec2;
    inverse(): Vec2;
    normalize(): Vec2;
    dot(b: Vec2): number;
    cross(b: Vec2): Vec3;
    /**
     * Performs a linear interpolation between two vec2's
     * @param {vec2} a the second operand
     * @param {vec2} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {vec2} out
     */
    lerp(a: Vec2, b: Vec2, t: number): Vec2;
    /**
     * Generates a random vector with the given scale
     * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns {vec2} out
     */
    random(scale?: number): Vec2;
    transformMatrix2(m: Mat2): Vec2;
    /**
     * Transforms the vec2 with a mat2d
     *
     * @param {vec2} out the receiving vector
     * @param {vec2} a the vector to transform
     * @param {mat2d} m matrix to transform with
     * @returns {vec2} out
     */
    transformMatrix23(m: Mat23): Vec2;
    /**
     * Transforms the vec2 with a mat3
     * 3rd vector component is implicitly '1'
     * @param {mat3} m matrix to transform with
     */
    transformMatrix3(m: Mat3): Vec2;
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
    transformMatrix4(m: Mat4): Vec2;
    /**
     * Rotate a 2D vector
     * @param {vec2} out The receiving vec2
     * @param {vec2} a The vec2 point to rotate
     * @param {vec2} origin The origin of the rotation
     * @returns {vec2} out
     */
    rotate(origin: Vec2, angleOfRotation: number): Vec2;
    angle(b: Vec2): number;
    toString(): string;
    equalsExact(b: Vec2): boolean;
    equalsApproximately(b: Vec2): boolean;
}
