import { sqrt } from '../lib/common'
import { Mat2 } from '../lib/mat22'
import { Vec2 } from '../lib/vec2'

describe('mat2', () => {
  let matA: Mat2, matB: Mat2, result: Mat2
  const identity = Mat2.identity()

  beforeEach(() => {
    matA = new Mat2(1, 2, 3, 4)
    matB = new Mat2(5, 6, 7, 8)
  })

  describe('create', () => {
    beforeEach(() => {
      result = Mat2.identity()
    })
    it('should return a 4 element array initialized to a 2x2 identity matrix', () => {
      expect(result.equalsApproximately(identity))
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      result = matA.clone()
    })
    it('should return a 4 element array initialized to the values in matA', () => {
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
      result = new Mat2()
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
      expect(result.equalsApproximately(new Mat2(1, 3, 2, 4)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })
  })

  describe('invert', () => {
    beforeEach(() => {
      result.copy(matA).invert()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat2(-2, 1, 1.5, -0.5)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })
  })

  describe('adjoint', () => {
    beforeEach(() => {
      result.copy(matA).adjoint()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat2(4, -2, -3, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })
  })

  describe('determinant', () => {
    it('should return the determinant', () => {
      expect(matA.determinant).toEqual(-2)
    })
  })

  describe('multiply', () => {
    beforeEach(() => {
      result.copy(matA).multiply(matB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat2(23, 34, 31, 46)))
    })

    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })

    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat2(5, 6, 7, 8)))
    })
  })

  describe('rotate', () => {
    beforeEach(() => {
      result.copy(matA).rotate(Math.PI * 0.5)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat2(3, 4, -1, -2)))
    })

    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })
  })

  describe('scale', () => {
    let vecA: Vec2
    beforeEach(() => {
      vecA = new Vec2(2, 3)
    })

    beforeEach(() => {
      result.copy(matA).scale(vecA)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat2(2, 4, 9, 12)))
    })

    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })
  })

  describe('toString', () => {
    it('should return a string representation of the matrix', () => {
      expect(matA.toString()).toEqual('mat2(1, 2, 3, 4)')
    })
  })

  describe('frobeniusNorm', () => {
    it('should return the Frobenius Norm of the matrix', () => {
      const e = sqrt(1 ** 2 + 2 ** 2 + 3 ** 2 + 4 ** 2)
      expect(matA.frobeniusNorm()).toBeCloseTo(e)
    })
  })

  describe('LDU', () => {
    let L: Mat2, U: Mat2, a: Mat2
    beforeEach(() => {
      L = Mat2.identity()
      U = Mat2.identity()
      a = new Mat2(4, 3, 6, 3)
      a.LDU(L, U)
    })
    it('should return a lower triangular, a diagonal and an upper triangular matrix', () => {
      expect(L.equalsApproximately(new Mat2(0, 1.5, 0, 0)))
      expect(U.equalsApproximately(new Mat2(4, 3, 0, -1.5)))
    })
  })

  describe('add', () => {
    beforeEach(() => {
      result.copy(matA).add(matB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat2(6, 8, 10, 12)))
    })

    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })

    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat2(5, 6, 7, 8)))
    })
  })

  describe('subtract', () => {
    beforeEach(() => {
      result.copy(matA).subtract(matB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat2(-4, -4, -4, -4)))
    })

    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })

    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat2(5, 6, 7, 8)))
    })
  })

  describe('setValues', () => {
    beforeEach(() => {
      result.set([1, 2, 3, 4])
    })
    it('should return a 4 element array initialized to the values passed', () => {
      expect(result.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })

    describe('set', () => {
      beforeEach(() => {
        result.set([1, 2, 3, 4])
      })
      it('should place values into out', () => {
        expect(result.equalsApproximately(new Mat2(1, 2, 3, 4)))
      })
    })

    describe('multiplyScalar', () => {
      beforeEach(() => {
        result.copy(matA).multiplyScalar(2)
      })

      it('should place values into out', () => {
        expect(result.equalsApproximately(new Mat2(2, 4, 6, 8)))
      })

      it('should not modify matA', () => {
        expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
      })
    })

    describe('exactEquals', () => {
      let matC: Mat2
      let r0: boolean, r1: boolean
      beforeEach(() => {
        matA.set([0, 1, 2, 3])
        matB.set([0, 1, 2, 3])
        matC = new Mat2(1, 2, 3, 4)
        r0 = matA.equalExact(matB)
        r1 = matA.equalExact(matC)
      })
      it('should return true for identical matrices', () => {
        expect(r0).toBe(true)
      })
      it('should return false for different matrices', () => {
        expect(r1).toBe(false)
      })
      it('should not modify matA', () => {
        expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
      })

      it('should not modify matB', () => {
        expect(matB.equalsApproximately(new Mat2(1, 2, 3, 4)))
      })
    })

    describe('equals', () => {
      let matC: Mat2, matD: Mat2
      let r0: boolean, r1: boolean, r2: boolean
      beforeEach(() => {
        matA.set([0, 1, 2, 3])
        matB.set([0, 1, 2, 3])
        matC = new Mat2(1, 2, 3, 4)
        matD = new Mat2(1e-16, 1, 2, 3)
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
        expect(matA.equalsApproximately(new Mat2(0, 1, 2, 3)))
      })
      it('should not modify matB', () => {
        expect(matB.equalsApproximately(new Mat2(0, 1, 2, 3)))
      })
    })
  })
})
