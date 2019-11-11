import { Vec4 } from '../lib/vec4'
import { equalsApproximately } from '../lib/common'
import { Vec3 } from '../lib/vec3'

describe('vec4', () => {
  const vecA = new Vec4()
  const vecB = new Vec4()
  let result = new Vec4()

  beforeEach(() => {
    vecA.set([1, 2, 3, 4])
    vecB.set([5, 6, 7, 8])
  })

  describe('create', () => {
    beforeEach(() => {
      result = new Vec4()
    })
    it('should return a 4 element array initialized to 0s', () => {
      expect(result.equalsApproximately(new Vec4(0, 0, 0, 0)))
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      result = vecA.clone()
    })
    it('should return a 4 element array initialized to the values in vecA', () => {
      expect(result.equalsApproximately(vecA))
    })
  })

  describe('copy', () => {
    beforeEach(() => {
      result.copy(vecA)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
  })

  describe('set', () => {
    beforeEach(() => {
      result.set([1, 2, 3, 4])
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
  })

  describe('add', () => {
    beforeEach(() => {
      result.copy(vecA).add(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(6, 8, 10, 12)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(5, 6, 7, 8)))
    })
  })

  describe('subtract', () => {
    beforeEach(() => {
      result.copy(vecA).subtract(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(-4, -4, -4, -4)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(5, 6, 7, 8)))
    })
  })

  describe('multiply', () => {
    beforeEach(() => {
      result.copy(vecA).multiply(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(5, 12, 21, 32)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(5, 6, 7, 8)))
    })
  })

  describe('divide', () => {
    beforeEach(() => {
      result.copy(vecA).divide(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(0.2, 0.333333, 0.428571, 0.5)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(5, 6, 7, 8)))
    })
  })

  describe('ceil', () => {
    beforeEach(() => {
      vecA.set([Math.E, Math.PI, Math.SQRT2, Math.SQRT1_2])
      result.copy(vecA).ceil()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(3, 4, 2, 1)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(Math.E, Math.PI, Math.SQRT2, Math.SQRT1_2)))
    })
  })

  describe('floor', () => {
    beforeEach(() => {
      vecA.set([Math.E, Math.PI, Math.SQRT2, Math.SQRT1_2])
      result.copy(vecA).floor()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(2, 3, 1, 0)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(Math.E, Math.PI, Math.SQRT2, Math.SQRT1_2)))
    })
  })

  describe('min', () => {
    beforeEach(() => {
      vecA.set([1, 3, 1, 3])
      vecB.set([3, 1, 3, 1])
      result.copy(vecA).min(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(1, 1, 1, 1)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 3, 1, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(3, 1, 3, 1)))
    })
  })

  describe('max', () => {
    beforeEach(() => {
      vecA.set([1, 3, 1, 3])
      vecB.set([3, 1, 3, 1])
      result.copy(vecA).max(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(3, 3, 3, 3)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 3, 1, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(3, 1, 3, 1)))
    })
  })

  describe('round', () => {
    beforeEach(() => {
      vecA.set([Math.E, Math.PI, Math.SQRT2, Math.SQRT1_2])
      result.copy(vecA).round()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(3, 3, 1, 1)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(Math.E, Math.PI, Math.SQRT2, Math.SQRT1_2)))
    })
  })

  describe('scale', () => {
    beforeEach(() => {
      result.copy(vecA).scale(2)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(2, 4, 6, 8)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
  })

  describe('when vecA is the output vector', () => {
    beforeEach(() => {
      result.copy(vecA).scale(2)
    })

    it('should place values into vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(2, 4, 6, 8)))
    })
    it('should return vecA', () => {
      expect(result.equalsApproximately(vecA))
    })
  })

  let d: number

  describe('distance', () => {
    beforeEach(() => {
      d = result.copy(vecA).distance(vecB)
    })

    it('should return the distance', () => {
      expect(equalsApproximately(d, 8))
    })
  })

  describe('squaredDistance', () => {
    beforeEach(() => {
      d = result.copy(vecA).squaredDistance(vecB)
    })

    it('should return the squared distance', () => {
      expect(equalsApproximately(d, 64))
    })
  })

  let l: number
  describe('length', () => {
    beforeEach(() => {
      l = result.copy(vecA).length
    })

    it('should return the length', () => {
      expect(equalsApproximately(l, 5.477225))
    })
  })

  describe('squaredLength', () => {
    beforeEach(() => {
      l = result.copy(vecA).squaredLength
    })

    it('should return the squared length', () => {
      expect(equalsApproximately(1, 30))
    })
  })

  describe('negate', () => {
    beforeEach(() => {
      result.copy(vecA).negate()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(-1, -2, -3, -4)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
  })

  describe('normalize', () => {
    beforeEach(() => {
      vecA.set([5, 0, 0, 0])
      result.copy(vecA).normalize()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(1, 0, 0, 0)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(5, 0, 0, 0)))
    })
  })

  describe('dot', () => {
    beforeEach(() => {
      d = result.copy(vecA).dot(vecB)
    })

    it('should return the dot product', () => {
      expect(d).toEqual(70)
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(5, 6, 7, 8)))
    })
  })

  describe('lerp', () => {
    beforeEach(() => {
      result.copy(vecA).lerp(vecA, vecB, 0.5)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(3, 4, 5, 6)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 2, 3, 4)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(5, 6, 7, 8)))
    })
  })

  describe('random', () => {
    describe('with no scale', () => {
      beforeEach(() => {
        result.copy(vecA).random()
      })

      it('should result in a unit length vector', () => {
        expect(equalsApproximately(result.length, 1.0))
      })
    })

    describe('with a scale', () => {
      beforeEach(() => {
        result.copy(vecA).random(5.0)
      })

      it('should result in a unit length vector', () => {
        expect(equalsApproximately(result.length, 5.0))
      })
    })
  })

  describe('cross', () => {
    const vecC = new Vec4()
    beforeEach(() => {
      vecA.set([1, 0, 0, 0])
      vecB.set([0, 1, 0, 0])
      vecC.set([0, 0, 1, 0])
      result.cross(new Vec3(1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, 1, 0))
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec4(0, 0, 0, -1)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(1, 0, 0, 0)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(0, 1, 0, 0)))
    })
    it('should not modify vecC', () => {
      expect(vecC.equalsApproximately(new Vec4(0, 0, 1, 0)))
    })
  })

  describe('str', () => {
    beforeEach(() => {
      result.copy(vecA)
    })

    it('should return a string representation of the vector', () => {
      expect(result.toString()).toEqual('vec4(1, 2, 3, 4)')
    })
  })

  describe('exactEquals', () => {
    const vecC = new Vec4()
    let r0: boolean, r1: boolean
    beforeEach(() => {
      vecA.set([0, 1, 2, 3])
      vecB.set([0, 1, 2, 3])
      vecC.set([1, 2, 3, 4])
      r0 = vecA.equalsExact(vecB)
      r1 = vecA.equalsExact(vecC)
    })

    it('should return true for identical vectors', () => {
      expect(r0).toBe(true)
    })
    it('should return false for different vectors', () => {
      expect(r1).toBe(false)
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(0, 1, 2, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(0, 1, 2, 3)))
    })
  })

  describe('equals', () => {
    const vecC = new Vec4()
    const vecD = new Vec4()
    let r0: boolean, r1: boolean, r2: boolean
    beforeEach(() => {
      vecA.set([0, 1, 2, 3])
      vecB.set([0, 1, 2, 3])
      vecC.set([1, 2, 3, 4])
      vecD.set([1e-16, 1, 2, 3])
      r0 = vecA.equalsApproximately(vecB)
      r1 = vecA.equalsApproximately(vecC)
      r2 = vecA.equalsApproximately(vecD)
    })
    it('should return true for identical vectors', () => {
      expect(r0).toBe(true)
    })
    it('should return false for different vectors', () => {
      expect(r1).toBe(false)
    })
    it('should return true for close but not identical vectors', () => {
      expect(r2).toBe(true)
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec4(0, 1, 2, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec4(0, 1, 2, 3)))
    })
  })

  describe('zero', () => {
    beforeEach(() => {
      vecA.set([1, 2, 3, 4])
      result.copy(vecA).zero()
    })
    it('should result in a 4 element vector with zeros', () => {
      expect(result.equalsApproximately(new Vec4(0, 0, 0, 0)))
    })
  })
})
