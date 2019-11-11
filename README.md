# glmath

## Docs
https://delaneyj.github.io/glmath/

Pure Typescript port of [glMatrix](https://github.com/toji/gl-matrix) for modern browsers

## Why?

glMatrix is a great succient library focused on low level graphic constructs, but there are some sore spots given its age.  Went to update the `@types` defs for it and noticed a lot of little changes that snowballed into it be easier to rewrite to first principled is latest Typescript.

## What's different?

### Float32Array
All types extend Float32Array as its fast and available in all modern browsers.
### Simpler API
All methods that aren't static effect the current object, all static methods create new Float32Arrays.  By not having a seperate out example usage became much clearer.  For example
```
 describe("from a normal matrix looking 'backward'", function() {
      beforeEach(function() {
        matr = mat3.create()
        mat3.transpose(
          matr,
          mat3.invert(matr, mat3.fromMat4(matr, mat4.lookAt(mat4.create(), [0, 0, 0], [0, 0, 1], [0, 1, 0]))),
        )
        result = quat.fromMat3(out, matr)
      })

      it('should return out', function() {
        expect(result).toBe(out)
      })

      it('should produce the same transformation as the given matrix', function() {
        expect(vec3.transformQuat([], [3, 2, -1], quat.normalize(out, out))).toBeEqualish(
          vec3.transformMat3([], [3, 2, -1], matr),
        )
      })
    })
```

and with the new version
```
 describe("from a normal matrix looking 'backward'", () => {
      beforeEach(() => {
        const lookAt = Mat4.lookAt(new Vec3(0, 0, 0), new Vec3(0, 0, 1), new Vec3(0, 1, 0))
        matr = Mat3.fromMat4(lookAt)
          .invert()
          .transpose()
        result = Quat.fromMat3(matr).normalize()
      })

      it('should produce the same transformation as the given matrix', () => {
        expect(new Vec3(3, 2, -1).transformQuat(result).equalsApproximately(new Vec3(3, 2, -1).transformMat3(matr)))
      })
    })
```

### Faster InvSqrt
Inverse square root and square root happen all the time, especially in rotations and culling.  This version uses [Quake3's Fast Inverse Square Root](https://betterexplained.com/articles/understanding-quakes-fast-inverse-square-root/)

## Tests?

All relevent tests have been ported over from the original.  Quite a few where able to be removed due to static typing and simplified API.

## Status

Functionally done but still working on cleaning up the API.  