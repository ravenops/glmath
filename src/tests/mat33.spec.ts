import { Mat3 } from '../lib/mat33'
import { Mat4 } from '../lib/mat44'
import { Vec3 } from '../lib/vec3'
import { Quat } from '../lib/quat'
import { Vec2 } from '../lib/vec2'
import { sqrt, equalsApproximately } from '../lib/common'

describe('mat3', () => {
  const matA4 = new Mat4()
  let matA = new Mat3()
  const matB = new Mat3()
  let result: Mat3
  const identity = Mat3.identity()

  beforeEach(() => {
    matA4.set([1, 0, 0, 0, 1, 0, 1, 2, 1])
    matA = Mat3.fromMat4(matA4)
    matB.set([1, 0, 0, 0, 1, 0, 3, 4, 1])
  })

  describe('normalFromMat4', () => {
    beforeEach(() => {
      matA4.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
      result = Mat3.normalFromMat4(matA4)
    })

    describe('with translation and rotation', () => {
      beforeEach(() => {
        matA4.translate(new Vec3(2, 4, 6))
        matA4.rotateX(Math.PI / 2)
        result = Mat3.normalFromMat4(matA4)
      })

      it('should give rotated matrix', () => {
        expect(result.equalsApproximately(new Mat3(1, 0, 0, 0, 0, 1, 0, -1, 0)))
      })

      describe('and scale', () => {
        beforeEach(() => {
          matA4.scale(new Vec3(2, 3, 4))
          result = Mat3.normalFromMat4(matA4)
        })

        it('should give rotated matrix', () => {
          expect(result.equalsApproximately(new Mat3(0.5, 0, 0, 0, 0, 0.333333, 0, -0.25, 0)))
        })
      })
    })
  })

  describe('fromQuat', () => {
    const q = new Quat(0, -0.7071067811865475, 0, 0.7071067811865475)
    beforeEach(() => {
      result = Mat3.fromQuat(q)
    })

    it('should rotate a vector the same as the original quat', () => {
      const a = new Vec3().transformMat3(new Mat3(0, 0, -1))
      const b = new Vec3().transformQuat(q)
      expect(a.equalsApproximately(b))
    })

    it('should rotate a vector by PI/2 radians', () => {
      const a = new Vec3().transformMat3(new Mat3(0, 0, -1))
      const b = new Vec3(1, 0, 0)
      expect(a.equalsApproximately(b))
    })
  })

  describe('fromMat4', () => {
    beforeEach(() => {
      result = Mat3.fromMat4(new Mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16))
    })
    it('should calculate proper mat3', () => {
      expect(result.equalsApproximately(new Mat3(1, 2, 3, 5, 6, 7, 9, 10, 11)))
    })
  })

  describe('scale', () => {
    beforeEach(() => {
      result.copy(Mat3.fromMat4(matA4)).scale(new Vec2(2, 2))
    })
    it('should place proper values in out', () => {
      expect(result.equalsApproximately(new Mat3(2, 0, 0, 0, 2, 0, 1, 2, 1)))
    })
  })

  describe('create', () => {
    beforeEach(() => {
      result = new Mat3()
    })
    it('should return a 9 element array initialized to a 3x3 identity matrix', () => {
      expect(result.equalsApproximately(identity))
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      result = matA.clone()
    })
    it('should return a 9 element array initialized to the values in matA', () => {
      expect(result.equalsApproximately(matA))
    })
  })

  describe('copy', () => {
    beforeEach(() => {
      result.copy(matA)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(matA))
    })
  })

  describe('identity', () => {
    beforeEach(() => {
      result = Mat3.identity()
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(identity))
    })
  })

  describe('transpose', () => {
    beforeEach(() => {
      result.copy(matA).transpose()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat3(1, 0, 1, 0, 1, 2, 0, 0, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat3(1, 0, 0, 0, 1, 0, 1, 2, 1)))
    })
  })

  describe('invert', () => {
    beforeEach(() => {
      result.copy(matA).invert()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat3(1, 0, 0, 0, 1, 0, -1, -2, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat3(1, 0, 0, 0, 1, 0, 1, 2, 1)))
    })
  })

  describe('adjoint', () => {
    beforeEach(() => {
      result.copy(matA).adjoint()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat3(1, 0, 0, 0, 1, 0, -1, -2, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat3(1, 0, 0, 0, 1, 0, 1, 2, 1)))
    })
  })

  describe('determinant', () => {
    let d: number
    beforeEach(() => {
      d = new Mat3(1, 0, 0, 0, 1, 0, 1, 2, 1).determinant
    })

    it('should return the determinant', () => {
      expect(d).toEqual(1)
    })
  })

  describe('multiply', () => {
    beforeEach(() => {
      result.copy(matA).multiply(matB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat3(1, 0, 0, 0, 1, 0, 4, 6, 1)))
    })

    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat3(1, 0, 0, 0, 1, 0, 1, 2, 1)))
    })

    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat3(1, 0, 0, 0, 1, 0, 3, 4, 1)))
    })
  })

  describe('str', () => {
    it('should return a string representation of the matrix', () => {
      expect(new Mat3(1, 0, 0, 0, 1, 0, 1, 2, 1).toString()).toEqual('mat3(1, 0, 0, 0, 1, 0, 1, 2, 1)')
    })
  })

  describe('frob', () => {
    let f: number
    beforeEach(() => {
      f = new Mat3(1, 0, 0, 0, 1, 0, 1, 2, 1).frobeniusNorm()
    })
    it('should return the Frobenius Norm of the matrix', () => {
      expect(
        equalsApproximately(f, sqrt(1 ** 2 + 0 ** 2 + 0 ** 2 + 0 ** 2 + 1 ** 2 + 0 ** 2 + 1 ** 2 + 2 ** 2 + 1 ** 2)),
      )
    })
  })

  describe('add', () => {
    beforeEach(() => {
      matA.set([1, 2, 3, 4, 5, 6, 7, 8, 9])
      matB.set([10, 11, 12, 13, 14, 15, 16, 17, 18])
      result.copy(matA).add(matB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat3(11, 13, 15, 17, 19, 21, 23, 25, 27)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat3(10, 11, 12, 13, 14, 15, 16, 17, 18)))
    })
  })

  describe('subtract', () => {
    beforeEach(() => {
      matA.set([1, 2, 3, 4, 5, 6, 7, 8, 9])
      matB.set([10, 11, 12, 13, 14, 15, 16, 17, 18])
      result.copy(matA).subtract(matB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat3(-9, -9, -9, -9, -9, -9, -9, -9, -9)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat3(10, 11, 12, 13, 14, 15, 16, 17, 18)))
    })
  })

  describe('multiplyScalar', () => {
    beforeEach(() => {
      matA.set([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
    beforeEach(() => {
      result.copy(matA).multiplyScalar(2)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat3(2, 4, 6, 8, 10, 12, 14, 16, 18)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)))
    })
  })

  describe('projection', () => {
    beforeEach(() => {
      result = Mat3.projection(100, 200)
    })

    it('should give projection matrix', () => {
      expect(result.equalsApproximately(new Mat3(0.02, 0, 0, 0, -0.01, 0, -1, 1, 1)))
    })
  })

  describe('exactEquals', () => {
    const matC = new Mat3()
    let r0: boolean, r1: boolean
    beforeEach(() => {
      matA.set([0, 1, 2, 3, 4, 5, 6, 7, 8])
      matB.set([0, 1, 2, 3, 4, 5, 6, 7, 8])
      matC.set([1, 2, 3, 4, 5, 6, 7, 8, 9])
      r0 = matA.equalsExact(matB)
      r1 = matA.equalsExact(matC)
    })

    it('should return true for identical matrices', () => {
      expect(r0).toBe(true)
    })
    it('should return false for different matrices', () => {
      expect(r1).toBe(false)
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat3(0, 1, 2, 3, 4, 5, 6, 7, 8)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat3(0, 1, 2, 3, 4, 5, 6, 7, 8)))
    })
  })

  describe('equals', () => {
    const matC = new Mat3()
    const matD = new Mat3()
    let r0: boolean, r1: boolean, r2: boolean

    beforeEach(() => {
      matA.set([0, 1, 2, 3, 4, 5, 6, 7, 8])
      matB.set([0, 1, 2, 3, 4, 5, 6, 7, 8])
      matC.set([1, 2, 3, 4, 5, 6, 7, 8, 9])
      matD.set([1e-16, 1, 2, 3, 4, 5, 6, 7, 8])
      r0 = matA.equalsApproximately(matB)
      r1 = matA.equalsApproximately(matC)
      r2 = matA.equalsApproximately(matD)
    })
    it('should return true for identical matrices', () => {
      expect(r0).toBe(true)
    })
    it('should return false for different matrices', () => {
      expect(r1).toBe(false)
    })
    it('should return true for close but not identical matrices', () => {
      expect(r2).toBe(true)
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat3(0, 1, 2, 3, 4, 5, 6, 7, 8)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat3(0, 1, 2, 3, 4, 5, 6, 7, 8)))
    })
  })
})
