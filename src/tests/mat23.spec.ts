import { sqrt, equalsApproximately } from '../lib/common'
import { Mat23 } from '../lib/mat23'
import { Vec2 } from '../lib/vec2'

describe('mat2d', () => {
  const matA = new Mat23()
  const matB = new Mat23()
  let result = new Mat23()
  const identity = Mat23.identity()

  beforeEach(() => {
    matA.set([1, 2, 3, 4, 5, 6])
    matB.set([7, 8, 9, 10, 11, 12])
  })

  describe('create', () => {
    beforeEach(() => {
      result = new Mat23()
    })
    it('should return a 6 element array initialized to a 2x3 identity matrix', () => {
      expect(result.equalsApproximately(identity))
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      result = matA.clone()
    })
    it('should return a 6 element array initialized to the values in matA', () => {
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
      result.setIdentity()
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(identity))
    })
  })

  describe('invert', () => {
    beforeEach(() => {
      result.copy(matA).invert()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat23(-2, 1, 1.5, -0.5, 1, -2)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
  })

  describe('determinant', () => {
    let d: number
    beforeEach(() => {
      d = matA.determinant
    })

    it('should return the determinant', () => {
      expect(d).toEqual(-2)
    })
  })

  describe('multiply', () => {
    beforeEach(() => {
      result.copy(matA).multiply(matB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat23(31, 46, 39, 58, 52, 76)))
    })

    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat23(7, 8, 9, 10, 11, 12)))
    })
  })

  describe('rotate', () => {
    beforeEach(() => {
      result.copy(matA).rotate(Math.PI * 0.5)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat23(3, 4, -1, -2, 5, 6)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
  })

  describe('scale', () => {
    beforeEach(() => {
      result.copy(matA).scale(new Vec2(2, 3))
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat23(2, 4, 9, 12, 5, 6)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
  })

  describe('translate', () => {
    beforeEach(() => {
      result.copy(matA).translate(new Vec2(2, 3))
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat23(1, 2, 3, 4, 16, 22)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
  })

  describe('str', () => {
    it('should return a string representation of the matrix', () => {
      expect(matA.toString()).toEqual('mat2d(1, 2, 3, 4, 5, 6)')
    })
  })

  describe('frob', () => {
    let f: number
    beforeEach(() => {
      f = matA.frobeniusNorm()
    })
    it('should return the Frobenius Norm of the matrix', () => {
      expect(equalsApproximately(f, sqrt(1 ** 2 + 2 ** 2 + 3 ** 2 + 4 ** 2 + 5 ** 2 + 6 ** 2 + 1)))
    })
  })

  describe('add', () => {
    beforeEach(() => {
      result.copy(matA).add(matB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat23(8, 10, 12, 14, 16, 18)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat23(7, 8, 9, 10, 11, 12)))
    })
  })

  describe('subtract', () => {
    beforeEach(() => {
      result.copy(matA).subtract(matB)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat23(-6, -6, -6, -6, -6, -6)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat23(7, 8, 9, 10, 11, 12)))
    })
  })

  describe('multiplyScalar', () => {
    beforeEach(() => {
      result.copy(matA).multiplyScalar(2)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat23(2, 4, 6, 8, 10, 12)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
  })

  describe('exactEquals', () => {
    const matC = new Mat23()
    let r0: boolean, r1: boolean
    beforeEach(() => {
      matA.set([0, 1, 2, 3, 4, 5])
      matB.set([0, 1, 2, 3, 4, 5])
      matC.set([1, 2, 3, 4, 5, 6])
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
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
  })

  describe('equals', () => {
    const matC = new Mat23()
    const matD = new Mat23()
    let r0: boolean, r1: boolean, r2: boolean
    beforeEach(() => {
      matA.set([0, 1, 2, 3, 4, 5])
      matB.set([0, 1, 2, 3, 4, 5])
      matC.set([1, 2, 3, 4, 5, 6])
      matD.set([1e-16, 1, 2, 3, 4, 5])
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
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
  })
})
