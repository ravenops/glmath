import { Mat3 } from '../lib/mat33'
import { Mat4 } from '../lib/mat44'
import { AxisAngle, Quat } from '../lib/quat'
import { Vec3 } from '../lib/vec3'
import { equalsApproximately } from '../lib/common'

describe('quat', () => {
  const quatA = new Quat()
  const quatB = new Quat()
  const identity = new Quat()
  const deg90 = Math.PI / 2
  let result = new Quat()

  beforeEach(() => {
    quatA.set([1, 2, 3, 4])
    quatB.set([5, 6, 7, 8])
  })

  describe('slerp', () => {
    describe('the normal case', () => {
      beforeEach(() => {
        result.slerp(new Quat(0, 0, 0, 1), new Quat(0, 1, 0, 0), 0.5)
      })
      it('should calculate proper quat', () => {
        expect(result.equalsApproximately(new Quat(0, 0.707106, 0, 0.707106)))
      })
    })

    describe('where a == b', () => {
      beforeEach(() => {
        result.slerp(new Quat(0, 0, 0, 1), new Quat(0, 0, 0, 1), 0.5)
      })

      it('should calculate proper quat', () => {
        expect(result.equalsApproximately(new Quat(0, 0, 0, 1)))
      })
    })

    describe('where theta == 180deg', () => {
      beforeEach(() => {
        quatA.rotateX(Math.PI) // 180 deg
        result.slerp(new Quat(1, 0, 0, 0), quatA, 1)
      })

      it('should calculate proper quat', () => {
        expect(result.equalsApproximately(new Quat(0, 0, 0, -1)))
      })
    })

    describe('where a == -b', () => {
      beforeEach(() => {
        result.slerp(new Quat(1, 0, 0, 0), new Quat(-1, 0, 0, 0), 0.5)
      })

      it('should calculate proper quat', () => {
        expect(result.equalsApproximately(new Quat(1, 0, 0, 0)))
      })
    })
  })

  describe('pow', () => {
    describe('identity quat', () => {
      beforeEach(() => {
        result.pow(2.1 /* random number */)
      })

      it('should be the identity', () => {
        expect(result.equalsApproximately(identity))
      })
    })

    describe('power of one', () => {
      beforeEach(() => {
        result
          .copy(quatA)
          .normalize()
          .pow(1)
      })

      it('should be the identity', () => {
        expect(result.equalsApproximately(quatA))
      })
      it('should be normalized', () => {
        expect(result.length).toBeCloseTo(1)
      })
    })

    describe('squared', () => {
      beforeEach(() => {
        result
          .copy(quatA)
          .normalize()
          .pow(2)
      })

      it('should be the square', () => {
        const reference = new Quat().multiply(quatA)
        expect(result.equalsApproximately(reference))
      })
      it('should be normalized', () => {
        expect(result.length).toBeCloseTo(1)
      })
    })

    describe('conjugate', () => {
      beforeEach(() => {
        quatA.normalize()
        result.copy(quatA).pow(-1)
      })

      it('should be the conjugate', () => {
        const reference = quatA.clone().conjugate()
        expect(result.equalsApproximately(reference))
      })
      it('should be normalized', () => {
        expect(result.length).toBeCloseTo(1)
      })
    })

    describe('reversible', () => {
      beforeEach(() => {
        quatA.normalize()

        const b = 2.1 // random number
        result.copy(quatA).pow(b)
        result.pow(1 / b)
      })

      it('should be reverted', () => {
        expect(result.equalsApproximately(quatA))
      })
      it('should be normalized', () => {
        expect(result.length).toBeCloseTo(1)
      })
    })
  })

  describe('rotateX', () => {
    beforeEach(() => {
      result.rotateX(deg90)
    })

    it('should transform vec accordingly', () => {
      const v3 = new Vec3(0, 0, -1).transformQuat(result)
      expect(v3.equalsApproximately(new Vec3(0, 1, 0)))
    })
  })

  describe('rotateY', () => {
    beforeEach(() => {
      result.rotateY(deg90)
    })

    it('should transform vec accordingly', () => {
      const v3 = new Vec3(0, 0, -1).transformQuat(result)
      expect(v3.equalsApproximately(new Vec3(-1, 0, 0)))
    })
  })

  describe('rotateZ', () => {
    beforeEach(() => {
      result.rotateZ(deg90)
    })

    it('should transform vec accordingly', () => {
      const v3 = new Vec3(0, 1, 0).transformQuat(result)
      expect(v3.equalsApproximately(new Vec3(-1, 0, 0)))
    })
  })

  describe('fromMat3', () => {
    let matr = new Mat3()

    describe('legacy', () => {
      beforeEach(() => {
        matr.set([1, 0, 0, 0, 0, -1, 0, 1, 0])
        result = Quat.fromMat3(matr)
      })

      it('should set dest to the correct value', () => {
        expect(result.equalsApproximately(new Quat(-0.707106, 0, 0, 0.707106)))
      })
    })

    describe('where trace > 0', () => {
      beforeEach(() => {
        matr.set([1, 0, 0, 0, 0, -1, 0, 1, 0])
        result = Quat.fromMat3(matr)
      })

      it('should produce the correct transformation', () => {
        expect(new Vec3(0, 1, 0).transformQuat(result).equalsApproximately(new Vec3(0, 0, -1)))
      })
    })

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

    describe("from a normal matrix looking 'left' and 'upside down'", () => {
      beforeEach(() => {
        const lookAt = Mat4.lookAt(new Vec3(0, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, -1, 0))
        matr = Mat3.fromMat4(lookAt)
          .invert()
          .transpose()
        result = Quat.fromMat3(matr).normalize()
      })

      it('should produce the same transformation as the given matrix', () => {
        expect(new Vec3(3, 2, -1).transformQuat(result).equalsApproximately(new Vec3(3, 2, -1).transformMat3(matr)))
      })
    })

    describe("from a normal matrix looking 'upside down'", () => {
      beforeEach(() => {
        const lookAt = Mat4.lookAt(new Vec3(0, 0, 0), new Vec3(0, 0, -1), new Vec3(0, -1, 0))
        matr = Mat3.fromMat4(lookAt)
          .invert()
          .transpose()
        result = Quat.fromMat3(matr).normalize()
      })

      it('should produce the same transformation as the given matrix', () => {
        expect(new Vec3(3, 2, -1).transformQuat(result).equalsApproximately(new Vec3(3, 2, -1).transformMat3(matr)))
      })
    })
  })

  describe('fromEuler', () => {
    describe('legacy', () => {
      beforeEach(() => {
        result = Quat.fromEulerDegrees(-90, 0, 0)
      })

      it('should set dest to the correct value', () => {
        expect(result.equalsApproximately(new Quat(-0.707106, 0, 0, 0.707106)))
      })
    })

    describe('where trace > 0', () => {
      beforeEach(() => {
        result = Quat.fromEulerDegrees(-90, 0, 0)
      })

      it('should produce the correct transformation', () => {
        expect(new Vec3(0, 1, 0).transformQuat(result).equalsApproximately(new Vec3(0, 0, -1)))
      })
    })
  })

  describe('setAxes', () => {
    let v3 = new Vec3()
    const view = new Vec3()
    const up = new Vec3()
    const right = new Vec3()
    beforeEach(() => {
      v3.zero()
    })

    describe('looking left', () => {
      beforeEach(() => {
        view.set([-1, 0, 0])
        up.set([0, 1, 0])
        right.set([0, 0, -1])
        result = Quat.fromAxes(view, right, up)
      })

      it('should transform local view into world left', () => {
        v3 = new Vec3(0, 0, -1).transformQuat(result)
        expect(v3.equalsApproximately(new Vec3(1, 0, 0)))
      })

      it('should transform local right into world front', () => {
        v3 = new Vec3(1, 0, 0).transformQuat(result)
        expect(v3.equalsApproximately(new Vec3(0, 0, 1)))
      })
    })

    describe('given opengl defaults', () => {
      beforeEach(() => {
        view.set([0, 0, -1])
        up.set([0, 1, 0])
        right.set([1, 0, 0])
        result = Quat.fromAxes(view, right, up)
      })

      it('should produce identity', () => {
        expect(result.equalsApproximately(new Quat(0, 0, 0, 1)))
      })
    })

    describe('legacy example', () => {
      beforeEach(() => {
        right.set([1, 0, 0])
        up.set([0, 0, 1])
        view.set([0, -1, 0])
        result = Quat.fromAxes(view, right, up)
      })

      it('should set correct quat4 values', () => {
        expect(result.equalsApproximately(new Quat(0.707106, 0, 0, 0.707106)))
      })
    })
  })

  describe('rotationTo', () => {
    const r = new Vec3()
    beforeEach(() => {
      r.zero()
    })

    describe('at right angle', () => {
      beforeEach(() => {
        result.rotationTo(new Vec3(0, 1, 0), new Vec3(1, 0, 0))
      })

      it('should calculate proper quaternion', () => {
        expect(result.equalsApproximately(new Quat(0, 0, -0.707106, 0.707106)))
      })
    })

    describe('when vectors are parallel', () => {
      beforeEach(() => {
        result.rotationTo(new Vec3(0, 1, 0), new Vec3(0, 1, 0))
      })

      it('multiplying A should produce B', () => {
        expect(new Vec3(0, 1, 0).transformQuat(result).equalsApproximately(new Vec3(0, 1, 0)))
      })
    })

    describe('when vectors are opposed X', () => {
      beforeEach(() => {
        result.rotationTo(new Vec3(1, 0, 0), new Vec3(-1, 0, 0))
      })

      it('multiplying A should produce B', () => {
        expect(new Vec3(1, 0, 0).transformQuat(result).equalsApproximately(new Vec3(-1, 0, 0)))
      })
    })

    describe('when vectors are opposed Y', () => {
      beforeEach(() => {
        result.rotationTo(new Vec3(0, 1, 0), new Vec3(0, -1, 0))
      })

      it('multiplying A should produce B', () => {
        expect(new Vec3(0, 1, 0).transformQuat(result).equalsApproximately(new Vec3(0, -1, 0)))
      })
    })

    describe('when vectors are opposed Z', () => {
      beforeEach(() => {
        result.rotationTo(new Vec3(0, 0, 1), new Vec3(0, 0, -1))
      })

      it('multiplying A should produce B', () => {
        expect(new Vec3(0, 0, 1).transformQuat(result).equalsApproximately(new Vec3(0, 0, -1)))
      })
    })
  })

  describe('create', () => {
    beforeEach(() => {
      result = new Quat()
    })
    it('should return a 4 element array initialized to an identity quaternion', () => {
      expect(result.equalsApproximately(new Quat(0, 0, 0, 1)))
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      result = quatA.clone()
    })
    it('should return a 4 element array initialized to the values in quatA', () => {
      expect(result.equalsApproximately(quatA))
    })
  })

  describe('copy', () => {
    beforeEach(() => {
      result.copy(quatA)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(1, 2, 3, 4)))
    })
  })

  describe('set', () => {
    beforeEach(() => {
      result.set([1, 2, 3, 4])
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(1, 2, 3, 4)))
    })
  })

  describe('identity', () => {
    beforeEach(() => {
      result = new Quat()
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(0, 0, 0, 1)))
    })
  })

  describe('setAxisAngle', () => {
    beforeEach(() => {
      result = Quat.setAxisAngle(new Vec3(1, 0, 0), deg90)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(0.707106, 0, 0, 0.707106)))
    })
  })

  describe('getAxisAngle', () => {
    let aa: AxisAngle
    describe('for a quaternion representing no rotation', () => {
      beforeEach(() => {
        result = Quat.setAxisAngle(new Vec3(0, 1, 0), 0)
        aa = result.axisAngle
      })
      it('should return a multiple of 2*PI as the angle component', () => {
        expect(aa.rad % (Math.PI * 2.0)).toBeCloseTo(0)
      })
    })

    describe('for a simple rotation about X axis', () => {
      beforeEach(() => {
        result = Quat.setAxisAngle(new Vec3(1, 0, 0), 0.7778)
        aa = result.axisAngle
      })
      it('should return the same provided angle', () => {
        expect(aa.rad).toBeCloseTo(0.7778)
      })
      it('should return the X axis as the angle', () => {
        expect(aa.axis.equalsApproximately(new Vec3(1, 0, 0)))
      })
    })

    describe('for a simple rotation about Y axis', () => {
      beforeEach(() => {
        result = Quat.setAxisAngle(new Vec3(0, 1, 0), 0.879546)
        aa = result.axisAngle
      })
      it('should return the same provided angle', () => {
        expect(aa.rad).toBeCloseTo(0.879546)
      })
      it('should return the X axis as the angle', () => {
        expect(aa.axis.equalsApproximately(new Vec3(0, 1, 0)))
      })
    })

    describe('for a simple rotation about Z axis', () => {
      beforeEach(() => {
        result = Quat.setAxisAngle(new Vec3(0, 0, 1), 0.123456)
        aa = result.axisAngle
      })
      it('should return the same provided angle', () => {
        expect(aa.rad).toBeCloseTo(0.123456)
      })
      it('should return the X axis as the angle', () => {
        expect(aa.axis.equalsApproximately(new Vec3(0, 0, 1)))
      })
    })

    describe('for a slightly irregular axis and right angle', () => {
      beforeEach(() => {
        result = Quat.setAxisAngle(new Vec3(0.707106, 0, 0.707106), deg90)
        aa = result.axisAngle
      })
      it('should place values into vec', () => {
        expect(aa.axis.equalsApproximately(new Vec3(0.707106, 0, 0.707106)))
      })
      it('should return a numeric angle', () => {
        expect(equalsApproximately(aa.rad, deg90))
      })
    })

    describe('for a very irregular axis and negative input angle', () => {
      let quatA: Quat, quatB: Quat
      beforeEach(() => {
        quatA = Quat.setAxisAngle(new Vec3(0.65538555, 0.49153915, 0.57346237), 8.8888)
        aa = quatA.axisAngle
        quatB = Quat.setAxisAngle(aa.axis, deg90)
      })
      it('should return an angle between 0 and 2*PI', () => {
        expect(aa.rad).toBeGreaterThan(0)
        expect(aa.rad).toBeLessThan(Math.PI * 2)
      })
      it('should create the same quaternion from axis and angle extracted', () => {
        expect(quatA.equalsApproximately(quatB))
      })
    })
  })

  describe('getAngle', () => {
    beforeEach(() => {
      quatA.normalize()
      quatB.normalize()
    })

    describe('from itself', () => {
      it('should be zero', () => {
        expect(equalsApproximately(quatA.axisAngle.rad, 0))
      })
    })

    describe('from rotated', () => {
      beforeEach(() => {
        quatB.copy(quatA).rotateX(deg90 / 2)
      })

      it('should be 45 degrees', () => {
        expect(equalsApproximately(quatB.axisAngle.rad, deg90 / 2))
      })
    })

    describe('compare with axisAngle', () => {
      it('should be equalish', () => {
        // compute reference value as axisAngle of quatA^{-1} * quatB
        const quatAB = new Quat().conjugate().multiply(quatB)
        const reference = quatAB.axisAngle
        expect(equalsApproximately(quatA.angleDistance(quatB), reference.rad))
      })
    })
  })

  describe('add', () => {
    beforeEach(() => {
      result.copy(quatA).add(quatB)
    })
    describe('with a separate output quaternion', () => {
      it('should place values into out', () => {
        expect(result.equalsApproximately(new Quat(6, 8, 10, 12)))
      })

      it('should not modify quatA', () => {
        expect(quatA.equalsApproximately(new Quat(1, 2, 3, 4)))
      })
      it('should not modify quatB', () => {
        expect(quatB.equalsApproximately(new Quat(5, 6, 7, 8)))
      })
    })

    describe('when quatA is the output quaternion', () => {
      it('should place values into quatA', () => {
        expect(quatA.equalsApproximately(new Quat(6, 8, 10, 12)))
      })
      it('should return quatA', () => {
        expect(result.equalsApproximately(quatA))
      })
      it('should not modify quatB', () => {
        expect(quatB.equalsApproximately(new Quat(5, 6, 7, 8)))
      })
    })

    describe('when quatB is the output quaternion', () => {
      it('should place values into quatB', () => {
        expect(quatB.equalsApproximately(new Quat(6, 8, 10, 12)))
      })
      it('should return quatB', () => {
        expect(result.equalsApproximately(quatB))
      })
      it('should not modify quatA', () => {
        expect(quatA.equalsApproximately(new Quat(1, 2, 3, 4)))
      })
    })
  })

  describe('multiply', () => {
    beforeEach(() => {
      result.copy(quatA).multiply(quatB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(24, 48, 48, -6)))
    })
    it('should not modify quatA', () => {
      expect(quatA.equalsApproximately(new Quat(1, 2, 3, 4)))
    })
    it('should not modify quatB', () => {
      expect(quatB.equalsApproximately(new Quat(5, 6, 7, 8)))
    })
  })

  describe('scale', () => {
    beforeEach(() => {
      result.copy(quatA).scale(2)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(2, 4, 6, 8)))
    })
    it('should not modify quatA', () => {
      expect(quatA.equalsApproximately(new Quat(1, 2, 3, 4)))
    })
  })

  describe('length', () => {
    it('should return the length', () => {
      expect(equalsApproximately(quatA.length, 5.477225))
    })
  })

  describe('squaredLength', () => {
    it('should return the squared length', () => {
      expect(quatA.squaredLength).toEqual(30)
    })
  })

  describe('normalize', () => {
    beforeEach(() => {
      result = quatA.clone().normalize()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(1, 0, 0, 0)))
    })
    it('should not modify quatA', () => {
      expect(quatA.equalsApproximately(new Quat(5, 0, 0, 0)))
    })
  })

  describe('lerp', () => {
    beforeEach(() => {
      result.lerp(quatA, quatB, 0.5)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(3, 4, 5, 6)))
    })
    it('should not modify quatA', () => {
      expect(quatA.equalsApproximately(new Quat(1, 2, 3, 4)))
    })
    it('should not modify quatB', () => {
      expect(quatB.equalsApproximately(new Quat(5, 6, 7, 8)))
    })
  })

  describe('slerp', () => {
    beforeEach(() => {
      result.slerp(quatA, quatB, 0.5)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(3, 4, 5, 6)))
    })
    it('should not modify quatA', () => {
      expect(quatA.equalsApproximately(new Quat(1, 2, 3, 4)))
    })
    it('should not modify quatB', () => {
      expect(quatB.equalsApproximately(new Quat(5, 6, 7, 8)))
    })
  })

  describe('random', () => {
    beforeEach(() => {
      result.random()
    })

    it('should result in a normalized quaternion', () => {
      const copy = result.clone()
      expect(result.normalize().equalsApproximately(copy))
    })
  })

  describe('invert', () => {
    beforeEach(() => {
      result.copy(quatA).invert()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(-0.033333, -0.066666, -0.1, 0.133333)))
    })
    it('should not modify quatA', () => {
      expect(quatA.equalsApproximately(new Quat(1, 2, 3, 4)))
    })
  })

  describe('conjugate', () => {
    beforeEach(() => {
      result.copy(quatA).conjugate()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Quat(-1, -2, -3, 4)))
    })
    it('should not modify quatA', () => {
      expect(quatA.equalsApproximately(new Quat(1, 2, 3, 4)))
    })
  })

  describe('str', () => {
    beforeEach(() => {
      result.copy(quatA)
    })
    it('should return a string representation of the quaternion', () => {
      expect(result.toString()).toEqual('quat(1, 2, 3, 4)')
    })
  })

  describe('exactEquals', () => {
    const quatC = new Quat()
    let r0: boolean, r1: boolean
    beforeEach(() => {
      quatA.set([0, 1, 2, 3])
      quatB.set([0, 1, 2, 3])
      quatC.set([1, 2, 3, 4])
      r0 = quatA.equalsExact(quatB)
      r1 = quatA.equalsExact(quatC)
    })

    it('should return true for identical quaternions', () => {
      expect(r0).toBe(true)
    })
    it('should return false for different quaternions', () => {
      expect(r1).toBe(false)
    })
    it('should not modify quatA', () => {
      expect(quatA.equalsApproximately(new Quat(0, 1, 2, 3)))
    })
    it('should not modify quatB', () => {
      expect(quatB.equalsApproximately(new Quat(0, 1, 2, 3)))
    })
  })

  describe('equals', () => {
    const quatC = new Quat()
    const quatD = new Quat()
    let r0: boolean, r1: boolean, r2: boolean
    beforeEach(() => {
      quatA.set([0, 1, 2, 3])
      quatB.set([0, 1, 2, 3])
      quatC.set([1, 2, 3, 4])
      quatD.set([1e-16, 1, 2, 3])
      r0 = quatA.equalsApproximately(quatB)
      r1 = quatA.equalsApproximately(quatC)
      r2 = quatA.equalsApproximately(quatD)
    })
    it('should return true for identical quaternions', () => {
      expect(r0).toBe(true)
    })
    it('should return false for different quaternions', () => {
      expect(r1).toBe(false)
    })
    it('should return true for close but not identical quaternions', () => {
      expect(r2).toBe(true)
    })
    it('should not modify quatA', () => {
      expect(quatA.equalsApproximately(new Quat(0, 1, 2, 3)))
    })
    it('should not modify quatB', () => {
      expect(quatB.equalsApproximately(new Quat(0, 1, 2, 3)))
    })
  })
})
