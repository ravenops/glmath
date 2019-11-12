"use strict";
// Common utilities
Object.defineProperty(exports, "__esModule", { value: true });
// Configuration Constants
exports.EPSILON = 0.000001;
exports.RANDOM = Math.random;
exports.degree2rad = Math.PI / 180;
// Tests whether or not the arguments have approximately the same value, within an absolute
// or relative tolerance of EPSILON (an absolute tolerance is used for values less
// than or equal to 1.0, and a relative tolerance is used for larger values)
function equalsApproximately(a, b) {
    return Math.abs(a - b) <= exports.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
exports.equalsApproximately = equalsApproximately;
const bytes = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
const floatView = new Float32Array(bytes);
const intView = new Uint32Array(bytes);
const threehalfs = 1.5;
// https://medium.com/hard-mode/the-legendary-fast-inverse-square-root-e51fee3b49d9
function inverseSqrt(n) {
    const x2 = n * 0.5;
    floatView[0] = n;
    intView[0] = 0x5f3759df - (intView[0] >> 1);
    let y = floatView[0];
    y = y * (threehalfs - x2 * y * y);
    // y = y * (threehalfs - x2 * y * y)
    return y;
}
exports.inverseSqrt = inverseSqrt;
// Inverse q3 inverse sqrt
function sqrt(n) {
    return 1 / inverseSqrt(n);
}
exports.sqrt = sqrt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1CQUFtQjs7QUFFbkIsMEJBQTBCO0FBQ2IsUUFBQSxPQUFPLEdBQUcsUUFBUSxDQUFBO0FBQ2xCLFFBQUEsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7QUFFcEIsUUFBQSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUE7QUFFdkMsMkZBQTJGO0FBQzNGLGtGQUFrRjtBQUNsRiw0RUFBNEU7QUFDNUUsU0FBZ0IsbUJBQW1CLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDdEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxlQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0UsQ0FBQztBQUZELGtEQUVDO0FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDN0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDekMsTUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDdEMsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFBO0FBRXRCLG1GQUFtRjtBQUNuRixTQUFnQixXQUFXLENBQUMsQ0FBUztJQUNuQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBO0lBQ2xCLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDaEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUMzQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDcEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ2pDLG9DQUFvQztJQUNwQyxPQUFPLENBQUMsQ0FBQTtBQUNWLENBQUM7QUFSRCxrQ0FRQztBQUVELDBCQUEwQjtBQUMxQixTQUFnQixJQUFJLENBQUMsQ0FBUztJQUM1QixPQUFPLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDM0IsQ0FBQztBQUZELG9CQUVDIn0=