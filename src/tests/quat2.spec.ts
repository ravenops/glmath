import { DualQuat } from '../lib/quat2'
import { Vec3 } from '../lib/vec3'
import { Mat4 } from '../lib/mat44'
import { Quat } from '../lib/quat'
import { equalsApproximately } from '../lib/common'

describe('quat2', () => {
  let quat2A = new DualQuat()
  let quat2B = new DualQuat()
  const vec = new Vec3()
  let result = new DualQuat()

  beforeEach(() => {
    quat2A.set([1, 2, 3, 4, 2, 5, 6, -2])
    quat2B.set([5, 6, 7, 8, 9, 8, 6, -4])
    vec.set([1, 1, -1])
  })

  describe('translate', () => {
    let matrixA: Mat4

    beforeEach(() => {
      //quat2A only seems to work when created using this function?
      quat2B = DualQuat.fromTranslationRotation(new Quat(1, 2, 3, 4), new Vec3(-5, 4, 10))
      quat2A.normalize()
      matrixA = Mat4.fromQuat2(quat2A)
      result.copy(quat2A).translate(vec)

      //Same thing with a matrix
      matrixA.translate(vec)
      result = DualQuat.fromMat4(matrixA)
    })

    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(quat2B))
    })
    it('should not modify vec', () => {
      expect(vec.equalsApproximately(new Vec3(1, 1, -1)))
    })
  })

  describe('rotateAroundAxis', () => {
    let matrixA = new Mat4()
    const ax = new Vec3(1, 4, 2)
    beforeEach(() => {
      //quat2A only seems to work when created using this function?
      quat2A = DualQuat.fromTranslationRotation(new Quat(1, 2, 3, 4), new Vec3(-5, 4, 10)).normalize()
      matrixA = Mat4.fromQuat2(quat2A)
      result = quat2A.rotateAroundAxis(ax, 5)

      //Same thing with a matrix
      matrixA.rotate(ax, 5)
      quat2B = DualQuat.fromMat4(matrixA)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(quat2B))
    })

    it('should not modify quat2A', () => {
      expect(
        quat2A.equalsApproximately(
          new DualQuat(
            0.18257418583505536,
            0.3651483716701107,
            0.5477225575051661,
            0.7302967433402214,
            -2.556038601690775,
            3.742770809618635,
            2.37346441585572,
            -3.0124740662784135,
          ),
        ),
      )
    })
    it('should not modify ax', () => {
      expect(ax.equalsApproximately(new Vec3(1, 4, 2)))
    })

    describe('when quat2A is the output quaternion', () => {
      beforeEach(() => {
        quat2A.rotateAroundAxis(ax, 5)
        //Same thing with a matrix
        matrixA.rotate(ax, 5)
        result = DualQuat.fromMat4(matrixA)
      })

      it('should place values into quat2A', () => {
        expect(quat2A.equalsApproximately(quat2B))
      })
      it('should return quat2A', () => {
        expect(result.equalsApproximately(quat2A))
      })
      it('should not modify ax', () => {
        expect(ax.equalsApproximately(new Vec3(1, 4, 2)))
      })
    })
  })

  describe('rotateByQuatPrepend', () => {
    const correctResult = new DualQuat()
    const rotationQuat = new DualQuat()
    beforeEach(() => {
      rotationQuat.set([2, 5, 2, -10], 0)
      correctResult.copy(rotationQuat).multiply(quat2A)
      result.copy(quat2A).rotateByQuatPrepend(rotationQuat.real)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(correctResult))
    })

    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
    })
    it('should not modify the rotation quaternion', () => {
      expect(rotationQuat.equalsApproximately(new DualQuat(2, 5, 2, -10, 0, 0, 0, 0)))
    })
  })

  //   describe('rotateX', function() {
  //     const matrixA = mat4.create(),
  //       matOut = mat4.create(),
  //       quatOut = quat2.create()
  //     beforeEach(function() {
  //       //quat2A only seems to work when created using this function?
  //       quat2B = quat2.fromRotationTranslation(quat2A, [1, 2, 3, 4], [-5, 4, 10])
  //       quat2.normalize(quat2A, quat2A)
  //       mat4.fromQuat2(matrixA, quat2A)

  //         result = quat2.rotateX(out, quat2A, 5)
  //         //Same thing with a matrix
  //         mat4.rotateX(matOut, matrixA, 5)
  //         quat2.fromMat4(quatOut, matOut)
  //       })

  //       it('should place values into out', function() {
  //         expect(out).toBeEqualishQuat2(quatOut)
  //       })
  //       it('should return out', function() {
  //         expect(result).toBe(out)
  //       })
  //       it('should not modify quat2A', function() {
  //         expect(quat2A).toBeEqualishQuat2(quat2B)
  //       })
  //     })
  //   })

  //   describe('rotateY', () => {
  //     const matrixA = mat4.create(),
  //       matOut = mat4.create(),
  //       quatOut = quat2.create()
  //     beforeEach(() => {
  //       //quat2A only seems to work when created using this function?
  //       quat2B = quat2.fromRotationTranslation(quat2A, [1, 2, 3, 4], [5, 4, -10])
  //       quat2.normalize(quat2A, quat2A)
  //       mat4.fromQuat2(matrixA, quat2A)
  //         result = quat2.rotateY(out, quat2A, -2)
  //         //Same thing with a matrix
  //         mat4.rotateY(matOut, matrixA, -2)
  //         quat2.fromMat4(quatOut, matOut)
  //       })

  //       it('should place values into out', () => {
  //         expect(result.equalsApproximately(quatOut)
  //       })

  //       it('should not modify quat2A', () => {
  //         expect(quat2A).toBeEqualishQuat2(quat2B)
  //       })
  //     })

  //   describe('rotateZ', () => {
  //     const matrixA = mat4.create(),
  //       matOut = mat4.create(),
  //       quatOut = quat2.create()
  //     beforeEach(() => {
  //       //quat2A only seems to work when created using this function?
  //       quat2B = quat2.fromRotationTranslation(quat2A, [1, 0, 3, -4], [0, -4, -10])
  //       quat2.normalize(quat2A, quat2A)
  //       mat4.fromQuat2(matrixA, quat2A)
  //         result = quat2.rotateZ(out, quat2A, 1)
  //         //Same thing with a matrix
  //         mat4.rotateZ(matOut, matrixA, 1)
  //         quat2.fromMat4(quatOut, matOut)
  //       })

  //       it('should place values into out', () => {
  //         expect(result.equalsApproximately(quatOut)
  //       })

  //       it('should not modify quat2A', () => {
  //         expect(quat2A).toBeEqualishQuat2(quat2B)
  //       })
  //     })

  describe('from/toMat4', () => {
    let matRes = new Mat4()
    let rotationQuat: Quat
    describe('quat to matrix and back', () => {
      beforeEach(() => {
        rotationQuat = new Quat(1, 2, 3, 4).normalize()
        quat2A = DualQuat.fromTranslationRotation(rotationQuat, new Vec3(1, -5, 3))
        matRes = Mat4.fromQuat2(quat2A)
        result = DualQuat.fromMat4(matRes)
      })
      it('should not modify quat2A', () => {
        expect(
          quat2A.equalsApproximately(
            new DualQuat(0.18257418, 0.36514836, 0.54772257, 0.73029673, -1.5518806, -1.82574184, 1.73445473, 0),
          ),
        )
      })

      it('should be equal to the starting dual quat', () => {
        expect(quat2A.equalsApproximately(result))
      })
    })
  })

  describe('create', () => {
    beforeEach(() => {
      result = new DualQuat()
    })
    it('should return 2 4 element arrays initialized to an identity dual quaternion', () => {
      expect(result.equalsApproximately(new DualQuat(0, 0, 0, 1, 0, 0, 0, 0)))
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      result = quat2A.clone()
    })
    it('should return 2 4 element arrays initialized to the values in quat2A', () => {
      expect(result.equalsApproximately(quat2A))
    })
  })

  describe('copy', () => {
    beforeEach(() => {
      result.copy(quat2A)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
    })
  })

  describe('identity', () => {
    beforeEach(() => {
      result.setIdentity()
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new DualQuat(0, 0, 0, 1, 0, 0, 0, 0)))
    })
  })

  describe('add', () => {
    beforeEach(() => {
      result.copy(quat2A).add(quat2B)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new DualQuat(6, 8, 10, 12, 11, 13, 12, -6)))
    })

    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
    })
    it('should not modify quat2B', () => {
      expect(quat2B.equalsApproximately(new DualQuat(5, 6, 7, 8, 9, 8, 6, -4)))
    })
  })

  describe('multiply', () => {
    describe('with a separate output quaternion', () => {
      beforeEach(() => {
        result.copy(quat2A).multiply(quat2B)
      })

      it('should place values into out', () => {
        expect(result.equalsApproximately(new DualQuat(24, 48, 48, -6, 25, 89, 23, -157)))
      })

      it('should not modify quat2A', () => {
        expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
      })
      it('should not modify quat2B', () => {
        expect(quat2B.equalsApproximately(new DualQuat(5, 6, 7, 8, 9, 8, 6, -4)))
      })
    })

    describe('same as matrix multiplication', () => {
      let matrixA: Mat4
      let matrixB: Mat4
      let testQuat: DualQuat
      beforeEach(() => {
        //quat2A and quat2B only seem to work when created using this function?
        quat2A = DualQuat.fromTranslationRotation(new Quat(1, 2, 3, 4), new Vec3(-5, 4, 10)).normalize()
        matrixA = Mat4.fromQuat2(quat2A)
        quat2B = DualQuat.fromTranslationRotation(new Quat(5, 6, 7, 8), new Vec3(9, 8, 6)).normalize()
        matrixB = Mat4.fromQuat2(quat2B)
      })
      it('the matrices should be equal to the dual quaternions', () => {
        testQuat = DualQuat.fromMat4(matrixA)
        expect(testQuat.equalsApproximately(quat2A))

        testQuat = DualQuat.fromMat4(matrixB)
        expect(testQuat.equalsApproximately(quat2B))
      })

      it('should be equal to the matrix multiplication', () => {
        result.copy(quat2A).multiply(quat2B)
        const matOut = matrixA.clone().multiply(matrixB)
        const quatOut = DualQuat.fromMat4(matOut)
        expect(result.equalsApproximately(quatOut))
      })
    })
  })

  describe('scale', () => {
    beforeEach(() => {
      result.copy(quat2A).scale(2)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new DualQuat(2, 4, 6, 8, 4, 10, 12, -4)))
    })

    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
    })
  })

  describe('length', () => {
    it('should return the length', () => {
      expect(equalsApproximately(quat2A.length, 5.477225))
    })
  })

  describe('squaredLength', () => {
    beforeEach(() => {
      result.copy(quat2A)
    })

    it('should return the squared length', () => {
      expect(result.squaredLength).toEqual(30)
    })
  })

  describe('fromRotation', () => {
    beforeEach(() => {
      result = DualQuat.fromRotation(new Quat(1, 2, 3, 4))
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new DualQuat(1, 2, 3, 4, 0, 0, 0, 0)))
    })

    it('should not modify the quaternion', () => {
      expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
    })
  })

  describe('fromTranslation', () => {
    beforeEach(() => {
      vec.set([1, 2, 3])
      result = DualQuat.fromTranslation(vec)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new DualQuat(0, 0, 0, 1, 0.5, 1, 1.5, 0)))
    })

    it('should not modify the vector', () => {
      expect(vec.equalsApproximately(new Vec3(1, 2, 3)))
    })
  })

  describe('fromRotationTranslation', () => {
    beforeEach(() => {
      vec.set([1, 2, 3])
      result = DualQuat.fromTranslationRotation(new Quat(1, 2, 3, 4), vec)
    })
    it('should place values into out', () => {
      expect(result.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 4, 6, -7)))
    })

    it('should not modify the quaternion', () => {
      expect(quat2A.real.equalsApproximately(new Quat(1, 2, 3, 4)))
    })
    it('should not modify the vector', () => {
      expect(vec.equalsApproximately(new Vec3(1, 2, 3)))
    })
    it('should have a translation that can be retrieved with getTranslation', () => {
      const t = result.normalize().translation
      expect(t.equalsApproximately(new Vec3(1, 2, 3)))
    })
  })

  describe('getTranslation', () => {
    let resultVec: Vec3
    describe('without a real part', () => {
      beforeEach(() => {
        result = DualQuat.fromTranslation(new Vec3(1, 2, 3))
        resultVec = result.translation
      })
      describe('not normalized', () => {
        it('should return the same translation value', () => {
          expect(resultVec.equalsApproximately(new Vec3(1, 2, 3)))
        })
      })
      describe('normalized', () => {
        it('should return the same translation value', () => {
          result.normalize()
          expect(resultVec.equalsApproximately(new Vec3(1, 2, 3)))
        })
      })
    })

    describe('with a real part', () => {
      beforeEach(() => {
        result = DualQuat.fromTranslationRotation(new Quat(2, 4, 6, 2), new Vec3(1, 2, 3))
        resultVec = result.translation
      })
      describe('not normalized', () => {
        it('should not return the same translation value', () => {
          expect(!resultVec.equalsApproximately(new Vec3(1, 2, 3)))
        })
      })
      describe('normalized', () => {
        it('should return the same translation value', () => {
          resultVec = result.normalize().translation
          expect(resultVec.equalsApproximately(new Vec3(1, 2, 3)))
        })
      })
    })
  })

  describe('normalize', () => {
    describe('when it is normalizing quat2A', () => {
      beforeEach(() => {
        quat2A = new DualQuat(1, 2, 3, 4, 2, 5, 6, -2).normalize()
      })
      it('both parts should have been normalized', () => {
        expect(
          result.equalsApproximately(
            new DualQuat(
              1 / 5.4772255,
              2 / 5.4772255,
              3 / 5.4772255,
              4 / 5.4772255,
              0.23126,
              0.6450954,
              0.693781,
              -0.9006993,
            ),
          ),
        )
      })
    })

    beforeEach(() => {
      quat2A.set([5, 0, 0, 0, 0, 0, 0, 0])
    })

    describe('with a separate output quaternion', () => {
      beforeEach(() => {
        result.copy(quat2A).normalize()
      })

      it('should place values into out', () => {
        expect(result.equalsApproximately(new DualQuat(1, 0, 0, 0, 0, 0, 0, 0)))
      })

      it('should not modify quat2A', () => {
        expect(quat2A.equalsApproximately(new DualQuat(5, 0, 0, 0, 0, 0, 0, 0)))
      })
    })

    describe('when it contains a translation', () => {
      beforeEach(() => {
        result = new DualQuat(5, 0, 0, 0, 1, 2, 3, 5).normalize()
      })
      it('both parts should have been normalized', () => {
        expect(result.equalsApproximately(new DualQuat(1, 0, 0, 0, 0, 0.4, 0.6, 1)))
      })
    })
  })

  describe('lerp', () => {
    beforeEach(() => {
      result.lerp(quat2A, quat2B, 0.7)
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new DualQuat(3.8, 4.8, 5.8, 6.8, 6.9, 7.1, 6.0, -3.4)))
    })

    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
    })
    it('should not modify quat2B', () => {
      expect(quat2B.equalsApproximately(new DualQuat(5, 6, 7, 8, 9, 8, 6, -4)))
    })

    describe('shortest path', () => {
      beforeEach(() => {
        result.lerp(new DualQuat(1, 2, 3, -4, 2, 5, 6, -2), new DualQuat(5, -6, 7, 8, 9, 8, 6, -4), 0.4)
      })
      it('should pick the shorter path', () => {
        expect(result.equalsApproximately(new DualQuat(-1.4, 3.6, -1, -5.6, -2.4, -0.2, 1.2, 0.4)))
      })
    })
  })

  describe('dot', () => {
    let d: number
    beforeEach(() => {
      d = result.copy(quat2A).dot(quat2B)
    })
    it('should return the dot product', () => {
      expect(equalsApproximately(d, 70))
    })
    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
    })
    it('should not modify quat2B', () => {
      expect(quat2B.equalsApproximately(new DualQuat(5, 6, 7, 8, 9, 8, 6, -4)))
    })
  })

  describe('invert', () => {
    beforeEach(() => {
      result.copy(quat2A).invert()
    })

    it('should place values into out', () => {
      expect(
        result.equalsApproximately(
          new DualQuat(-0.0333333333, -0.06666666666, -0.1, 0.13333333333, -2 / 30, -5 / 30, -6 / 30, -2 / 30),
        ),
      )
    })
    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
    })
    it('the real part should be equal to a inverted quaternion', () => {
      const q = new Quat(1, 2, 3, 4).invert()

      expect(result.real.equalsApproximately(q))
    })
  })

  describe('get real/dual', () => {
    let rq: Quat
    describe('get real', () => {
      beforeEach(() => {
        rq = quat2A.real
      })

      it('should place values into out', () => {
        expect(rq.equalsApproximately(new Quat(1, 2, 3, 4)))
      })

      it('should not modify quat2A', () => {
        expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
      })
    })

    describe('get dual', () => {
      beforeEach(() => {
        rq = quat2A.dual
      })

      it('should place values into out', () => {
        expect(rq.equalsApproximately(new Quat(2, 5, 6, -2)))
      })

      it('should not modify quat2A', () => {
        expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
      })
    })
  })

  describe('set real/dual', () => {
    let rq: Quat
    describe('set real', () => {
      beforeEach(() => {
        rq = new Quat(4, 6, 8, -100)
        result.copy(quat2A).real = rq
      })

      it('should place values into out', () => {
        expect(quat2A.equalsApproximately(new DualQuat(4, 6, 8, -100, 2, 5, 6, -2)))
      })

      it('should not modify outQuat', () => {
        expect(rq.equalsApproximately(new Quat(4, 6, 8, -100)))
      })
    })

    describe('set dual', () => {
      beforeEach(() => {
        rq = new Quat(4.3, 6, 8, -100)
        result.copy(quat2A).dual = rq
      })

      it('should place values into out', () => {
        expect(result.equalsApproximately(new DualQuat(1, 2, 3, 4, 4.3, 6, 8, -100)))
      })

      it('should not modify outQuat', () => {
        expect(rq.equalsApproximately(new Quat(4.3, 6, 8, -100)))
      })
    })
  })

  describe('conjugate', () => {
    beforeEach(() => {
      result.copy(quat2A).conjugate()
    })

    it('should place values into out', () => {
      expect(result.equalsApproximately(new DualQuat(-1, -2, -3, 4, -2, -5, -6, -2)))
    })

    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)))
    })
  })

  describe('str', () => {
    beforeEach(() => {
      result.copy(quat2A)
    })

    it('should return a string representation of the quaternion', () => {
      expect(result.toString()).toEqual('quat2(1, 2, 3, 4, 2, 5, 6, -2)')
    })
  })

  describe('exactEquals', () => {
    const quat2C = new DualQuat()
    let r0: boolean, r1: boolean
    beforeEach(() => {
      quat2A.set([0, 1, 2, 3, 4, 5, 6, 7])
      quat2B.set([0, 1, 2, 3, 4, 5, 6, 7])
      quat2C.set([1, 2, 3, 4, 5, 6, 7, 8])
      r0 = quat2A.equalsExact(quat2B)
      r1 = quat2A.equalsExact(quat2C)
    })

    it('should return true for identical quaternions', () => {
      expect(r0).toBe(true)
    })
    it('should return false for different quaternions', () => {
      expect(r1).toBe(false)
    })
    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(new DualQuat(0, 1, 2, 3, 4, 5, 6, 7)))
    })
    it('should not modify quat2B', () => {
      expect(quat2B.equalsApproximately(new DualQuat(0, 1, 2, 3, 4, 5, 6, 7)))
    })
  })

  describe('equals', () => {
    const quat2C = new DualQuat()
    const quat2D = new DualQuat()
    let r0: boolean, r1: boolean, r2: boolean
    beforeEach(() => {
      quat2A.set([0, 1, 2, 3, 4, 5, 6, 7])
      quat2B.set([0, 1, 2, 3, 4, 5, 6, 7])
      quat2C.set([1, 2, 3, 4, 5, 6, 7, 8])
      quat2D.set([1e-16, 1, 2, 3, 4, 5, 6, 7])
      r0 = quat2A.equalsApproximately(quat2B)
      r1 = quat2A.equalsApproximately(quat2C)
      r2 = quat2A.equalsApproximately(quat2D)
    })
    it('should return true for identical dual quaternions', () => {
      expect(r0).toBe(true)
    })
    it('should return false for different dual quaternions', () => {
      expect(r1).toBe(false)
    })
    it('should return true for close but not identical quaternions', () => {
      expect(r2).toBe(true)
    })
    it('should not modify quat2A', () => {
      expect(quat2A.equalsApproximately(new DualQuat(0, 1, 2, 3, 4, 5, 6, 7)))
    })
    it('should not modify quat2B', () => {
      expect(quat2B.equalsApproximately(new DualQuat(0, 1, 2, 3, 4, 5, 6, 7)))
    })
  })
})
