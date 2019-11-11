import { Mat2 } from '../lib/mat22'
import { Mat23 } from '../lib/mat23'
import { Vec2 } from '../lib/vec2'
import { Vec3 } from '../lib/vec3'
import { equalsApproximately } from '../lib/common'

describe('vec2', () => {
  const vecA = new Vec2()
  const vecB = new Vec2()
  let result = new Vec2()

  beforeEach(() => {
    vecA.set([1, 2])
    vecB.set([3, 4])
  })

  describe('create', () => {
    beforeEach(() => {
      result.set([0, 0])
    })
    it('should return a 2 element array initialized to 0s', () => {
      expect(result.equalsApproximately(new Vec2(0, 0)))
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      result = vecA.clone()
    })
    it('should return a 2 element array initialized to the values in vecA', () => {
      expect(result.equalsApproximately(vecA))
    })
  })

  describe('copy', () => {
    beforeEach(() => {
      result.copy(vecA)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(vecA))
    })
  })

  describe('set', () => {
    beforeEach(() => {
      result.set([1, 2])
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(vecA))
    })
  })

  describe('add', () => {
    beforeEach(() => {
      result.copy(vecA).add(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(4, 6)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(3, 4)))
    })
  })

  describe('subtract', () => {
    beforeEach(() => {
      result.copy(vecA).subtract(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(-2, -2)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(3, 4)))
    })
  })

  describe('multiply', () => {
    beforeEach(() => {
      result.copy(vecA).multiply(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(3, 8)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(3, 4)))
    })
  })

  describe('divide', () => {
    beforeEach(() => {
      result.copy(vecA).divide(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(0.3333333, 0.5)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(3, 4)))
    })
  })

  describe('ceil', () => {
    beforeEach(() => {
      vecA.set([Math.E, Math.PI])
      result.copy(vecA).ceil()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(3, 4)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
  })

  describe('floor', () => {
    beforeEach(() => {
      vecA.set([Math.E, Math.PI])
      result.copy(vecA).ceil()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(2, 3)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(Math.E, Math.PI)))
    })
  })

  describe('min', () => {
    beforeEach(() => {
      vecA.set([1, 4])
      vecB.set([3, 2])
      result.copy(vecA).min(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(1, 2)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 4)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(3, 2)))
    })
  })

  describe('max', () => {
    beforeEach(() => {
      vecA.set([1, 4])
      vecB.set([3, 2])
      result.copy(vecA).max(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(3, 4)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 4)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(3, 2)))
    })
  })

  describe('round', () => {
    beforeEach(() => {
      vecA.set([Math.E, Math.PI])
      result.copy(vecA).round()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(3, 3)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(Math.E, Math.PI)))
    })
  })

  describe('scale', () => {
    beforeEach(() => {
      result.copy(vecA).scale(2)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(2, 4)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
  })

  describe('distance', () => {
    let distance: number
    beforeEach(() => {
      distance = result.copy(vecA).distance(vecB)
    })

    it('should return the distance', () => {
      expect(distance).toBeCloseTo(2.828427)
    })
  })

  describe('squaredDistance', () => {
    let distance: number
    beforeEach(() => {
      distance = result.copy(vecA).squaredDistance(vecB)
    })

    it('should return the squared distance', () => {
      expect(distance).toEqual(8)
    })
  })

  describe('length', () => {
    let length: number
    beforeEach(() => {
      result.copy(vecA).length
    })

    it('should return the length', () => {
      expect(equalsApproximately(length, 2.236067))
    })
  })

  describe('squaredLength', () => {
    it('should return the squared length', () => {
      expect(vecA.sqLength).toEqual(5)
    })
  })

  describe('negate', () => {
    beforeEach(() => {
      result.copy(vecA).negate()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(-1, -2)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
  })

  describe('normalize', () => {
    beforeEach(() => {
      vecA.set([5, 0])
      result.copy(vecA).normalize()
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(1, 0)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(5, 0)))
    })
  })

  describe('dot', () => {
    let dot: number
    beforeEach(() => {
      dot = result.copy(vecA).dot(vecB)
    })

    it('should return the dot product', () => {
      expect(dot).toEqual(11)
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(3, 4)))
    })
  })

  describe('cross', () => {
    let out: Vec3

    beforeEach(() => {
      out = vecA.cross(vecB)
    })

    it('should place values into out', () => {
      expect(out.equalsApproximately(new Vec3(0, 0, -2)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(3, 4)))
    })
  })

  describe('lerp', () => {
    describe('with a separate output vector', () => {
      beforeEach(() => {
        result.lerp(vecA, vecB, 0.5)
      })

      it('should place values into out', () => {
        expect(result.equalsApproximately(new Vec2(2, 3)))
      })
      it('should not modify vecA', () => {
        expect(vecA.equalsApproximately(new Vec2(1, 2)))
      })
      it('should not modify vecB', () => {
        expect(vecB.equalsApproximately(new Vec2(3, 4)))
      })
    })
  })

  describe('random', () => {
    describe('with no scale', () => {
      beforeEach(() => {
        result.random()
      })

      it('should result in a unit length vector', () => {
        expect(result.length).toBeCloseTo(1.0)
      })
    })

    describe('with a scale', () => {
      beforeEach(() => {
        result.random(5)
      })

      it('should result in a unit length vector', () => {
        expect(equalsApproximately(result.length, 5))
      })
    })
  })

  describe('transformMat2', () => {
    const matA = new Mat2()
    beforeEach(() => {
      matA.set([1, 2, 3, 4])
    })

    beforeEach(() => {
      result.copy(vecA).transformMatrix2(matA)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(7, 10)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat2(1, 2, 3, 4)))
    })
  })

  describe('transformMat23', () => {
    const matA = new Mat23()
    beforeEach(() => {
      matA.set([1, 2, 3, 4, 5, 6])
    })

    beforeEach(() => {
      result.copy(vecA).transformMatrix23(matA)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec2(12, 16)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(1, 2)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat23(1, 2, 3, 4, 5, 6)))
    })
  })

  describe('rotate', () => {
    describe('rotation around world origin [0, 0, 0]', () => {
      beforeEach(() => {
        vecA.set([0, 1])
        vecB.set([0, 0])
        result.copy(vecA).rotate(vecB, Math.PI)
      })
      it('should return the rotated vector', () => {
        expect(result.equalsApproximately(new Vec2(0, -1)))
      })
    })

    describe('rotation around an arbitrary origin', () => {
      beforeEach(() => {
        vecA.set([6, -5])
        vecB.set([0, -5])
        result.copy(vecA).rotate(vecB, Math.PI)
      })
      it('should return the rotated vector', () => {
        expect(result.equalsApproximately(new Vec2(-6, -5)))
      })
    })
  })

  describe('angle', () => {
    let angle: number
    beforeEach(() => {
      vecA.set([1, 0])
      vecB.set([1, 2])
      angle = vecA.angle(vecB)
    })

    it('should return the angle', () => {
      expect(equalsApproximately(angle, 1.10714))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec2(0, 1)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(1, 2)))
    })
  })

  describe('str', () => {
    beforeEach(() => {
      result.copy(vecA)
    })
    it('should return a string representation of the vector', () => {
      expect(result.toString()).toEqual('vec2(1, 2)')
    })
  })

  describe('exactEquals', () => {
    const vecC = new Vec2()
    let r0: boolean, r1: boolean
    beforeEach(() => {
      vecA.set([0, 1])
      vecB.set([0, 1])
      vecC.set([1, 2])
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
      expect(vecA.equalsApproximately(new Vec2(0, 1)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(0, 1)))
    })
  })

  describe('equals', () => {
    const vecC = new Vec2()
    const vecD = new Vec2()
    let r0: boolean, r1: boolean, r2: boolean

    beforeEach(() => {
      vecA.set([0, 1])
      vecB.set([0, 1])
      vecC.set([1, 2])
      vecD.set([1e-16, 1])
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
      expect(vecA.equalsApproximately(new Vec2(0, 1)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec2(0, 1)))
    })
  })

  describe('zero', () => {
    beforeEach(() => {
      result.set([1, 2])
      result.zero()
    })
    it('should result in a 2 element vector with zeros', () => {
      expect(result.equalsApproximately(new Vec2()))
    })
  })
})
