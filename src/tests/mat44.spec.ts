import { sqrt } from '../lib/common'
import { Mat4 } from '../lib/mat44'
import { Quat } from '../lib/quat'
import { Vec3 } from '../lib/vec3'

describe('mat4', () => {
  const matA = new Mat4()
  const matB = new Mat4()
  const identity = new Mat4()

  let result: Mat4

  beforeEach(() => {
    // Attempting to portray a semi-realistic transform matrix
    matA.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1])
    matB.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 4, 5, 6, 1])
  })

  describe('create', () => {
    beforeEach(() => {
      result = new Mat4()
    })
    it('should return a 16 element array initialized to a 4x4 identity matrix', () => {
      expect(result.equalsApproximately(identity))
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      result = matA.clone()
    })
    it('should return a 16 element array initialized to the values in matA', () => {
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
      result = new Mat4()
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
      expect(result.equalsApproximately(new Mat4(1, 0, 0, 1, 0, 1, 0, 2, 0, 0, 1, 3, 0, 0, 0, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
  })

  describe('invert', () => {
    beforeEach(() => {
      result.copy(matA).invert()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -1, -2, -3, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
  })

  describe('adjoint', () => {
    beforeEach(() => {
      result.copy(matA).adjoint()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -1, -2, -3, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
  })

  describe('determinant', () => {
    let d: number
    beforeEach(() => {
      d = matA.determinant
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
      expect(result.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 7, 9, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 4, 5, 6, 1)))
    })
  })

  describe('translate', () => {
    beforeEach(() => {
      result.copy(matA).translate(new Vec3(4, 5, 6))
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 7, 9, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
  })

  describe('scale', () => {
    beforeEach(() => {
      result.copy(matA).scale(new Vec3(4, 5, 6))
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat4(4, 0, 0, 0, 0, 5, 0, 0, 0, 0, 6, 0, 1, 2, 3, 1)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
  })

  describe('rotate', () => {
    const rad = Math.PI * 0.5
    const axis = new Vec3(1, 0, 0)
    beforeEach(() => {
      result.copy(matA).rotate(axis, rad)
    })

    it('should place values into out', () => {
      expect(
        result.equalsApproximately(
          new Mat4(1, 0, 0, 0, 0, Math.cos(rad), Math.sin(rad), 0, 0, -Math.sin(rad), Math.cos(rad), 0, 1, 2, 3, 1),
        ),
      )
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
  })

  describe('rotateX', () => {
    const rad = Math.PI * 0.5
    beforeEach(() => {
      result.copy(matA).rotateX(rad)
    })

    it('should place values into out', () => {
      expect(
        result.equalsApproximately(
          new Mat4(1, 0, 0, 0, 0, Math.cos(rad), Math.sin(rad), 0, 0, -Math.sin(rad), Math.cos(rad), 0, 1, 2, 3, 1),
        ),
      )
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
  })

  describe('rotateY', () => {
    const rad = Math.PI * 0.5

    beforeEach(() => {
      result.copy(matA).rotateY(rad)
    })

    it('should place values into out', () => {
      expect(
        result.equalsApproximately(
          new Mat4(Math.cos(rad), 0, -Math.sin(rad), 0, 0, 1, 0, 0, Math.sin(rad), 0, Math.cos(rad), 0, 1, 2, 3, 1),
        ),
      )
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
  })

  describe('rotateZ', () => {
    const rad = Math.PI * 0.5
    beforeEach(() => {
      result.copy(matA).rotateZ(rad)
    })

    it('should place values into out', () => {
      expect(
        result.equalsApproximately(
          new Mat4(Math.cos(rad), Math.sin(rad), 0, 0, -Math.sin(rad), Math.cos(rad), 0, 0, 0, 0, 1, 0, 1, 2, 3, 1),
        ),
      )
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)))
    })
  })

  // TODO: fromRotationTranslation

  describe('getTranslation', () => {
    let v3: Vec3
    describe('from the identity matrix', () => {
      beforeEach(() => {
        v3 = identity.translation
      })
      it('should return the zero vector', () => {
        expect(v3.equalsApproximately(new Vec3()))
      })
    })

    describe('from a translation-only matrix', () => {
      beforeEach(() => {
        v3 = matB.translation
      })
      it('should return translation vector', () => {
        expect(v3.equalsApproximately(new Vec3(4, 5, 6)))
      })
    })

    describe('from a translation and rotation matrix', () => {
      beforeEach(() => {
        const v = new Vec3(5, 6, 7)
        const q = Quat.setAxisAngle(new Vec3(0.26726124, 0.534522474, 0.8017837), 0.55)
        result = Mat4.fromTranslationRotation(q, v)
        v3 = result.translation
      })
      it('should keep the same translation vector, regardless of rotation', () => {
        expect(v3.equalsApproximately(new Vec3(5, 6, 7)))
      })
    })
  })

  describe('getScaling', () => {
    let v3: Vec3
    describe('from the identity matrix', () => {
      beforeEach(() => {
        v3 = identity.scaling
      })
      it('should return the identity vector', () => {
        expect(v3.equalsApproximately(new Vec3(1, 1, 1)))
      })
    })

    describe('from a scale-only matrix', () => {
      beforeEach(() => {
        v3 = new Vec3(1, 2, 3)
        result = Mat4.fromScaling(v3)
      })
      it('should return translation vector', () => {
        expect(v3.equalsApproximately(new Vec3(4, 5, 6)))
      })
    })

    describe('from a translation and rotation matrix', () => {
      beforeEach(() => {
        const v = new Vec3(5, 6, 7)
        const q = Quat.setAxisAngle(new Vec3(1, 0, 0), 0.5)
        const result = Mat4.fromTranslationRotation(q, v)
        v3 = result.scaling
      })
      it('should return the identity vector', () => {
        expect(v3.equalsApproximately(new Vec3(1, 1, 1)))
      })
    })

    describe('from a translation, rotation and scale matrix', () => {
      beforeEach(() => {
        const t = new Vec3(1, 2, 3)
        const s = new Vec3(5, 6, 7)
        const q = Quat.setAxisAngle(new Vec3(0, 1, 0), 0.7)
        result = Mat4.fromTranslationRotationScale(t, q, s)
        v3 = result.scaling
      })
      it('should return the same scaling factor when created', () => {
        expect(v3.equalsApproximately(new Vec3(5, 6, 7)))
      })
    })
  })

  describe('getRotation', () => {
    let q: Quat

    describe('from the identity matrix', () => {
      beforeEach(() => {
        q = identity.rotation
      })
      it('should return the unit quaternion', () => {
        expect(q.equalsApproximately(new Quat()))
      })
    })

    describe('from a translation-only matrix', () => {
      beforeEach(() => {
        q = matB.rotation
      })
      it('should return the unit quaternion', () => {
        expect(q.equalsApproximately(new Quat()))
      })
    })

    describe('from a translation and rotation matrix', function() {
      let v3: Vec3
      beforeEach(function() {
        const v = new Vec3(5, 6, 7)
        const q = Quat.setAxisAngle(new Vec3(0.26726124, 0.534522474, 0.8017837), 0.55)
        result = Mat4.fromTranslationRotation(q, v)
        v3 = result.translation
      })
      it('should keep the same translation vector, regardless of rotation', function() {
        expect(v3.equalsApproximately(new Vec3(5, 6, 7)))
      })
    })
  })

  describe('frustum', () => {
    beforeEach(() => {
      result = Mat4.frustum(-1, 1, -1, 1, -1, 1)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat4(-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0)))
    })
  })

  describe('perspective', () => {
    const fovy = Math.PI * 0.5
    beforeEach(() => {
      result = Mat4.perspective(fovy, 1, 0, 1)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0)))
    })

    describe('with nonzero near, 45deg fovy, and realistic aspect ratio', () => {
      beforeEach(() => {
        result = Mat4.perspective((45 * Math.PI) / 180.0, 640 / 480, 0.1, 200)
      })
      it('should calculate correct matrix', () => {
        expect(
          result.equalsApproximately(new Mat4(1.81066, 0, 0, 0, 0, 2.414213, 0, 0, 0, 0, -1.001, -1, 0, 0, -0.2001, 0)),
        )
      })
    })

    describe('with no far plane, 45deg fovy, and realistic aspect ratio', () => {
      beforeEach(() => {
        result = Mat4.perspective((45 * Math.PI) / 180.0, 640 / 480, 0.1, 0)
      })
      it('should calculate correct matrix', () => {
        expect(result.equalsApproximately(new Mat4(1.81066, 0, 0, 0, 0, 2.414213, 0, 0, 0, 0, -1, -1, 0, 0, -0.2, 0)))
      })
    })

    describe('with infinite far plane, 45deg fovy, and realistic aspect ratio', () => {
      beforeEach(() => {
        result = Mat4.perspective((45 * Math.PI) / 180.0, 640 / 480, 0.1, Infinity)
      })
      it('should calculate correct matrix', () => {
        expect(result.equalsApproximately(new Mat4(1.81066, 0, 0, 0, 0, 2.414213, 0, 0, 0, 0, -1, -1, 0, 0, -0.2, 0)))
      })
    })
  })

  describe('ortho', () => {
    beforeEach(() => {
      result = Mat4.ortho(-1, 1, -1, 1, -1, 1)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)))
    })
  })

  describe('lookAt', () => {
    let up = new Vec3(0, 1, 0)
    let view: Vec3, right: Vec3, v3: Vec3

    describe('looking down', () => {
      beforeEach(() => {
        view = new Vec3(0, -1, 0)
        up = new Vec3(0, 0, -1)
        right = new Vec3(1, 0, 0)
        result = Mat4.lookAt(new Vec3(), view, up)
      })

      it('should transform view into local -Z', () => {
        v3 = new Vec3().transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(0, 0, -1)))
      })

      it('should transform up into local +Y', () => {
        v3 = up.clone().transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(0, 1, 0)))
      })

      it('should transform right into local +X', () => {
        v3 = right.clone().transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(1, 0, 0)))
      })
    })

    describe('#74', () => {
      beforeEach(() => {
        result = Mat4.lookAt(new Vec3(0, 2, 0), new Vec3(0, 0.6, 0), new Vec3(0, 0, -1))
      })

      it("should transform a point 'above' into local +Y", () => {
        v3 = new Vec3(0, 2, -1).transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(0, 1, 0)))
      })

      it("should transform a point 'right of' into local +X", () => {
        v3 = new Vec3(1, 2, 0).transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(1, 0, 0)))
      })

      it("should transform a point 'in front of' into local -Z", () => {
        v3 = new Vec3(0, 1, 0).transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(0, 0, -1)))
      })
    })

    describe('extra', () => {
      const eye = new Vec3(0, 0, 1)
      const center = new Vec3(0, 0, -1)
      up = new Vec3(0, 1, 0)
      result = Mat4.lookAt(eye, center, up)
      it('should place values into out', () => {
        expect(result.equalsApproximately(new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1, 1)))
      })
    })
  })

  describe('targetTo', () => {
    let up = new Vec3(0, 1, 0)
    let view: Vec3, right: Vec3
    const v3 = new Vec3()

    describe('looking down', () => {
      beforeEach(() => {
        view = new Vec3(0, -1, 0)
        up = new Vec3(0, 0, -1)
        right = new Vec3(1, 0, 0)
        result = Mat4.targetTo(new Vec3(), view, up)
      })

      it('should transform view into local Z', () => {
        v3.copy(view).transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(0, 0, 1)))
      })

      it('should transform up into local -Y', () => {
        v3.copy(up).transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(0, -1, 0)))
      })

      it('should transform right into local +X', () => {
        v3.copy(right).transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(1, 0, 0)))
      })

      it('scaling should be [1, 1, 1]', () => {
        const scaling = result.scaling
        expect(scaling.equalsApproximately(new Vec3(1, 1, 1)))
      })
    })

    describe('#74', () => {
      beforeEach(() => {
        result = Mat4.targetTo(new Vec3(0, 2, 0), new Vec3(0, 0.6, 0), new Vec3(0, 0, -1))
      })

      it("should transform a point 'above' into local +Y", () => {
        v3.set([0, 2, -1])
        v3.transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(0, 1, -2)))
      })

      it("should transform a point 'right of' into local +X", () => {
        v3.set([1, 2, 0])
        v3.transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(1, 2, -2)))
      })

      it("should transform a point 'in front of' into local -Z", () => {
        v3.set([0, 1, 0])
        v3.transformMat4(result)
        expect(v3.equalsApproximately(new Vec3(0, 2, -1)))
      })

      it('scaling should be [1, 1, 1]', () => {
        const scaling = result.scaling
        expect(scaling.equalsApproximately(new Vec3(1, 1, 1)))
      })
    })

    describe('scaling test', () => {
      beforeEach(() => {
        result = Mat4.targetTo(new Vec3(0, 1, 0), new Vec3(0, 0, 1), new Vec3(0, 0, -1))
      })

      it('scaling should be [1, 1, 1]', () => {
        const scaling = result.scaling
        expect(scaling.equalsApproximately(new Vec3(1, 1, 1)))
      })
    })
  })

  describe('str', () => {
    it('should return a string representation of the matrix', () => {
      expect(matA.toString()).toEqual(`mat4(
  1,0,0,0
  0,1,0,0
  0,0,1,0
  1,2,3,1
)`)
    })
  })

  describe('frob', () => {
    let f: number
    beforeEach(() => {
      f = matA.frobeniusNorm()
    })
    it('should return the Frobenius Norm of the matrix', () => {
      expect(f).toBeCloseTo(sqrt(1 ** 2 + 1 ** 2 + 1 ** 2 + 1 ** 2 + 1 ** 2 + 2 ** 2 + 3 ** 2))
    })
  })

  describe('add', () => {
    beforeEach(() => {
      matA.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
      matB.set([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
      result.copy(matA).add(matB)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat4(18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat4(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)))
    })
  })

  describe('subtract', () => {
    beforeEach(() => {
      matA.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
      matB.set([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
      result.copy(matA).subtract(matB)
    })
    it('should place values into out', () => {
      expect(
        result.equalsApproximately(
          new Mat4(-16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16),
        ),
      )
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat4(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)))
    })
  })

  describe('multiplyScalar', () => {
    beforeEach(() => {
      matA.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    })
    beforeEach(() => {
      result.multiplyScalar(2)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new Mat4(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32)))
    })
    it('should not modify matA', () => {
      expect(matA.equalsApproximately(new Mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)))
    })
  })

  describe('exactEquals', () => {
    const matC = new Mat4()
    let r0: boolean, r1: boolean
    beforeEach(() => {
      matA.set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
      matB.set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
      matC.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
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
      expect(matA.equalsApproximately(new Mat4(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat4(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)))
    })
  })

  describe('equals', () => {
    const matC = new Mat4()
    const matD = new Mat4()
    let r0: boolean, r1: boolean, r2: boolean
    beforeEach(() => {
      matA.set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
      matB.set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
      matC.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
      matD.set([1e-16, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
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
      expect(matA.equalsApproximately(new Mat4(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)))
    })
    it('should not modify matB', () => {
      expect(matB.equalsApproximately(new Mat4(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)))
    })
  })
})
