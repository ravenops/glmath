import { Vec3 } from '../lib/vec3'
import { Mat4 } from '../lib/mat44'
import { Mat3 } from '../lib/mat33'
import { Quat } from '../lib/quat'
import { equalsApproximately } from '../lib/common'

describe('vec3', () => {
  const vecA = new Vec3()
  const vecB = new Vec3()
  let result = new Vec3()

  beforeEach(() => {
    vecA.set([1, 2, 3])
    vecB.set([4, 5, 6])
  })

  describe('rotateX', () => {
    describe('rotation around world origin [0, 0, 0]', () => {
      beforeEach(() => {
        vecA.set([0, 1, 0])
        vecB.set([0, 0, 0])
        result.copy(vecA).rotateX(vecB, Math.PI)
      })
      it('should return the rotated vector', () => {
        expect(result.equalsApproximately(new Vec3(0, -1, 0)))
      })
    })
    describe('rotation around an arbitrary origin', () => {
      beforeEach(() => {
        vecA.set([2, 7, 0])
        vecB.set([2, 5, 0])
        result.copy(vecA).rotateX(vecB, Math.PI)
      })
      it('should return the rotated vector', () => {
        expect(result.equalsApproximately(new Vec3(2, 3, 0)))
      })
    })
  })

  describe('rotateY', () => {
    describe('rotation around world origin [0, 0, 0]', () => {
      beforeEach(() => {
        vecA.set([1, 0, 0])
        vecB.set([0, 0, 0])
        result.copy(vecA).rotateY(vecB, Math.PI)
      })
      it('should return the rotated vector', () => {
        expect(result.equalsApproximately(new Vec3(-1, 0, 0)))
      })
    })
    describe('rotation around an arbitrary origin', () => {
      beforeEach(() => {
        vecA.set([-2, 3, 10])
        vecB.set([-4, 3, 10])
        result.copy(vecA).rotateY(vecB, Math.PI)
      })
      it('should return the rotated vector', () => {
        expect(result.equalsApproximately(new Vec3(-6, 3, 10)))
      })
    })
  })

  describe('rotateZ', () => {
    describe('rotation around world origin [0, 0, 0]', () => {
      beforeEach(() => {
        vecA.set([0, 1, 0])
        vecB.set([0, 0, 0])
        result.copy(vecA).rotateZ(vecB, Math.PI)
      })
      it('should return the rotated vector', () => {
        expect(result.equalsApproximately(new Vec3(0, -1, 0)))
      })
    })
    describe('rotation around an arbitrary origin', () => {
      beforeEach(() => {
        vecA.set([0, 6, -5])
        vecB.set([0, 0, -5])
        result.copy(vecA).rotateZ(vecB, Math.PI)
      })
      it('should return the rotated vector', () => {
        expect(result.equalsApproximately(new Vec3(0, -6, -5)))
      })
    })
  })

  describe('transformMat4', () => {
    let matr: Mat4
    describe('with an identity', () => {
      beforeEach(() => {
        matr = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
      })

      beforeEach(() => {
        result.copy(vecA).transformMat4(matr)
      })

      it('should produce the input', () => {
        expect(result.equalsApproximately(new Vec3(1, 2, 3)))
      })
    })

    describe('with a lookAt', () => {
      beforeEach(() => {
        matr = Mat4.lookAt(new Vec3(5, 6, 7), new Vec3(2, 6, 7), new Vec3(0, 1, 0))
      })

      beforeEach(() => {
        result.copy(vecA).transformMat4(matr)
      })

      it('should rotate and translate the input', () => {
        expect(result.equalsApproximately(new Vec3(4, -4, -4)))
      })
    })

    describe('with a perspective matrix (#92)', () => {
      it('should transform a point from perspective(pi/2, 4/3, 1, 100)', () => {
        matr.set([0.75, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1.02, -1, 0, 0, -2.02, 0])
        result.copy(new Vec3(10, 20, 30)).transformMat4(matr)
        expect(result.equalsApproximately(new Vec3(-0.25, -0.666666, 1.087333)))
      })
    })
  })

  describe('transformMat3', () => {
    let matr = new Mat3()
    describe('with an identity', () => {
      beforeEach(() => {
        matr.set([1, 0, 0, 0, 1, 0, 0, 0, 1])
      })

      beforeEach(() => {
        result.copy(vecA).transformMat3(matr)
      })

      it('should produce the input', () => {
        expect(result.equalsApproximately(new Vec3(1, 2, 3)))
      })
    })

    describe('with 90deg about X', () => {
      beforeEach(() => {
        result.copy(new Vec3(0, 1, 0)).transformMat3(new Mat3(1, 0, 0, 0, 0, 1, 0, -1, 0))
      })

      it('should produce correct output', () => {
        expect(result.equalsApproximately(new Vec3(0, 0, 1)))
      })
    })

    describe('with 90deg about Y', () => {
      beforeEach(() => {
        result.copy(new Vec3(1, 0, 0)).transformMat3(new Mat3(0, 0, -1, 0, 1, 0, 1, 0, 0))
      })

      it('should produce correct output', () => {
        expect(result.equalsApproximately(new Vec3(0, 0, -1)))
      })
    })

    describe('with 90deg about Z', () => {
      beforeEach(() => {
        result.copy(new Vec3(1, 0, 0)).transformMat3(new Mat3(0, 1, 0, -1, 0, 0, 0, 0, 1))
      })

      it('should produce correct output', () => {
        expect(result.equalsApproximately(new Vec3(0, 1, 0)))
      })
    })

    describe('with a lookAt normal matrix', () => {
      beforeEach(() => {
        const m4 = Mat4.lookAt(new Vec3(5, 6, 7), new Vec3(2, 6, 7), new Vec3(0, 1, 0))
        matr = Mat3.fromMat4(m4)
          .invert()
          .transpose()
      })

      beforeEach(() => {
        result.copy(new Vec3(1, 0, 0)).transformMat3(matr)
      })

      it('should rotate the input', () => {
        expect(result.equalsApproximately(new Vec3(0, 0, 1)))
      })
    })
  })

  describe('transformQuat', () => {
    beforeEach(() => {
      result
        .copy(vecA)
        .transformQuat(new Quat(0.18257418567011074, 0.3651483713402215, 0.5477225570103322, 0.730296742680443))
    })
    it('should rotate the input vector', () => {
      expect(result.equalsApproximately(new Vec3(1, 2, 3)))
    })
  })

  describe('create', () => {
    beforeEach(() => {
      result = new Vec3()
    })
    it('should return a 3 element array initialized to 0s', () => {
      expect(result.equalsApproximately(new Vec3(0, 0, 0)))
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      result = vecA.clone()
    })
    it('should return a 3 element array initialized to the values in vecA', () => {
      expect(result.equalsApproximately(vecA))
    })
  })

  describe('copy', () => {
    beforeEach(() => {
      result.copy(vecA)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(1, 2, 3)))
    })
  })

  describe('set', () => {
    beforeEach(() => {
      result.copy(vecA).set([1, 2, 3])
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(1, 2, 3)))
    })
  })

  describe('add', () => {
    describe('with a separate output vector', () => {
      beforeEach(() => {
        result.copy(vecA).add(vecB)
      })

      it('should place values into out', () => {
        expect(result.equalsApproximately(new Vec3(5, 7, 9)))
      })
      it('should not modify vecA', () => {
        expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
      })
      it('should not modify vecB', () => {
        expect(vecB.equalsApproximately(new Vec3(4, 5, 6)))
      })
    })
  })

  describe('subtract', () => {
    beforeEach(() => {
      result.copy(vecA).subtract(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(-3, -3, -3)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(4, 5, 6)))
    })
  })

  describe('multiply', () => {
    beforeEach(() => {
      result.copy(vecA).multiply(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(4, 10, 18)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(4, 5, 6)))
    })
  })

  describe('divide', () => {
    beforeEach(() => {
      result.copy(vecA).divide(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(0.25, 0.4, 0.5)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(4, 5, 6)))
    })
  })

  describe('ceil', () => {
    beforeEach(() => {
      vecA.set([Math.E, Math.PI, Math.SQRT2])
      result.copy(vecA).ceil()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(3, 4, 2)))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(Math.E, Math.PI, Math.SQRT2)))
    })
  })

  describe('floor', () => {
    beforeEach(() => {
      vecA.set([Math.E, Math.PI, Math.SQRT2])
      result.copy(vecA).floor()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(2, 3, 1)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(Math.E, Math.PI, Math.SQRT2)))
    })
  })

  describe('min', () => {
    beforeEach(() => {
      vecA.set([1, 3, 1])
      vecB.set([3, 1, 3])
    })

    describe('with a separate output vector', () => {
      beforeEach(() => {
        result.copy(vecA).min(vecB)
      })

      it('should place values into out', () => {
        expect(result.equalsApproximately(new Vec3(1, 1, 1)))
      })

      it('should not modify vecA', () => {
        expect(vecA.equalsApproximately(new Vec3(1, 3, 1)))
      })
      it('should not modify vecB', () => {
        expect(vecB.equalsApproximately(new Vec3(3, 1, 3)))
      })
    })
  })

  describe('max', () => {
    beforeEach(() => {
      vecA.set([1, 3, 1])
      vecB.set([3, 1, 3])
      result.copy(vecA).max(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(3, 3, 3)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 3, 1)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(3, 1, 3)))
    })
  })

  describe('round', () => {
    beforeEach(() => {
      vecA.set([Math.E, Math.PI, Math.SQRT2])
      result.copy(vecA).round()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(3, 3, 1)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(Math.E, Math.PI, Math.SQRT2)))
    })
  })

  describe('scale', () => {
    beforeEach(() => {
      result.copy(vecA).scale(2)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(2, 4, 6)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
    })
  })

  describe('distance', () => {
    let d: number
    beforeEach(() => {
      d = result.copy(vecA).distance(vecB)
    })

    it('should return the distance', () => {
      expect(equalsApproximately(d, 5.196152))
    })
  })

  describe('squaredDistance', () => {
    let d: number
    beforeEach(() => {
      d = result.copy(vecA).squaredDistance(vecB)
    })

    it('should return the squared distance', () => {
      expect(d).toEqual(27)
    })
  })

  describe('length', () => {
    let l: number
    beforeEach(() => {
      l = result.copy(vecA).length
    })

    it('should return the length', () => {
      expect(equalsApproximately(l, 3.741657))
    })
  })

  describe('squaredLength', () => {
    let l: number
    beforeEach(() => {
      l = result.copy(vecA).squaredLength
    })

    it('should return the squared length', () => {
      expect(l).toEqual(14)
    })
  })

  describe('negate', () => {
    beforeEach(() => {
      result.copy(vecA).negate()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(-1, -2, -3)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
    })
  })

  describe('normalize', () => {
    beforeEach(() => {
      vecA.set([5, 0, 0])
      result.copy(vecA).normalize()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(1, 0, 0)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(5, 0, 0)))
    })
  })

  describe('dot', () => {
    let d: number
    beforeEach(() => {
      d = result.copy(vecA).dot(vecB)
    })

    it('should return the dot product', () => {
      expect(d).toEqual(32)
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(4, 5, 6)))
    })
  })

  describe('cross', () => {
    beforeEach(() => {
      result.copy(vecA).cross(vecB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(-3, 6, -3)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(4, 5, 6)))
    })
  })

  describe('lerp', () => {
    beforeEach(() => {
      result.copy(vecA).lerp(vecA, vecB, 0.5)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Vec3(2.5, 3.5, 4.5)))
    })

    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(4, 5, 6)))
    })
  })

  describe('random', () => {
    describe('with no scale', () => {
      beforeEach(() => {
        result.copy(vecA).random()
      })

      it('should result in a unit length vector', () => {
        expect(result.length).toBeCloseTo(1.0)
      })
    })

    describe('with a scale', () => {
      beforeEach(() => {
        result.copy(vecA).random(5)
      })

      it('should result in a unit length vector', () => {
        expect(equalsApproximately(result.length, 5.0))
      })
    })
  })

  describe('angle', () => {
    let a: number
    beforeEach(() => {
      a = result.copy(vecA).angle(vecB)
    })

    it('should return the angle', () => {
      expect(equalsApproximately(a, 0.225726))
    })
    it('should not modify vecA', () => {
      expect(vecA.equalsApproximately(new Vec3(1, 2, 3)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(4, 5, 6)))
    })
  })

  describe('str', () => {
    it('should return a string representation of the vector', () => {
      expect(result.toString()).toEqual('vec3(1, 2, 3)')
    })
  })

  describe('exactEquals', () => {
    const vecC = new Vec3()
    let r0: boolean, r1: boolean
    beforeEach(() => {
      vecA.set([0, 1, 2])
      vecB.set([0, 1, 2])
      vecC.set([1, 2, 3])
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
      expect(vecA.equalsApproximately(new Vec3(0, 1, 2)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(0, 1, 2)))
    })
  })

  describe('equals', () => {
    const vecC = new Vec3()
    const vecD = new Vec3()
    let r0: boolean, r1: boolean, r2: boolean
    beforeEach(() => {
      vecA.set([0, 1, 2])
      vecB.set([0, 1, 2])
      vecC.set([1, 2, 3])
      vecD.set([1e-16, 1, 2])
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
      expect(vecA.equalsApproximately(new Vec3(0, 1, 2)))
    })
    it('should not modify vecB', () => {
      expect(vecB.equalsApproximately(new Vec3(0, 1, 2)))
    })
  })

  describe('zero', () => {
    beforeEach(() => {
      vecA.set([1, 2, 3])
      result.copy(vecA).zero()
    })
    it('should result in a 3 element vector with zeros', () => {
      expect(result.equalsApproximately(new Vec3(0, 0, 0)))
    })
  })
})
