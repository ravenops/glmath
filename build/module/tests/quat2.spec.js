import { DualQuat } from '../lib/quat2';
import { Vec3 } from '../lib/vec3';
import { Mat4 } from '../lib/mat44';
import { Quat } from '../lib/quat';
import { equalsApproximately } from '../lib/common';
describe('quat2', () => {
    const quat2A = DualQuat.identity();
    const quat2B = DualQuat.identity();
    const vec = Vec3.zero();
    const result = DualQuat.identity();
    beforeEach(() => {
        quat2A.set([1, 2, 3, 4, 2, 5, 6, -2]);
        quat2B.set([5, 6, 7, 8, 9, 8, 6, -4]);
        vec.set([1, 1, -1]);
    });
    describe('translate', () => {
        const matrixA = Mat4.identity();
        beforeEach(() => {
            //quat2A only seems to work when created using this function?
            quat2B.setFromTranslationRotation(new Quat(1, 2, 3, 4), new Vec3(-5, 4, 10));
            quat2A.normalize();
            matrixA.setFromQuat2(quat2A);
            result.copy(quat2A).translate(vec);
            //Same thing with a matrix
            matrixA.translate(vec);
            result.setFromMat4(matrixA);
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(quat2B));
        });
        it('should not modify vec', () => {
            expect(vec.equalsApproximately(new Vec3(1, 1, -1)));
        });
    });
    describe('rotateAroundAxis', () => {
        const matrixA = Mat4.identity();
        const ax = new Vec3(1, 4, 2);
        beforeEach(() => {
            //quat2A only seems to work when created using this function?
            quat2A.setFromTranslationRotation(new Quat(1, 2, 3, 4), new Vec3(-5, 4, 10)).normalize();
            matrixA.setFromQuat2(quat2A);
            result.copy(quat2A).rotateAroundAxis(ax, 5);
            //Same thing with a matrix
            matrixA.rotate(ax, 5);
            quat2B.setFromMat4(matrixA);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(quat2B));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(0.18257418583505536, 0.3651483716701107, 0.5477225575051661, 0.7302967433402214, -2.556038601690775, 3.742770809618635, 2.37346441585572, -3.0124740662784135)));
        });
        it('should not modify ax', () => {
            expect(ax.equalsApproximately(new Vec3(1, 4, 2)));
        });
        describe('when quat2A is the output quaternion', () => {
            beforeEach(() => {
                quat2A.rotateAroundAxis(ax, 5);
                //Same thing with a matrix
                matrixA.rotate(ax, 5);
                result.setFromMat4(matrixA);
            });
            it('should place values into quat2A', () => {
                expect(quat2A.equalsApproximately(quat2B));
            });
            it('should return quat2A', () => {
                expect(result.equalsApproximately(quat2A));
            });
            it('should not modify ax', () => {
                expect(ax.equalsApproximately(new Vec3(1, 4, 2)));
            });
        });
    });
    describe('rotateByQuatPrepend', () => {
        const correctResult = DualQuat.identity();
        const rotationQuat = DualQuat.identity();
        beforeEach(() => {
            rotationQuat.set([2, 5, 2, -10], 0);
            correctResult.copy(rotationQuat).multiply(quat2A);
            result.copy(quat2A).rotateByQuatPrepend(rotationQuat.real);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(correctResult));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('should not modify the rotation quaternion', () => {
            expect(rotationQuat.equalsApproximately(new DualQuat(2, 5, 2, -10, 0, 0, 0, 0)));
        });
    });
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
        const matRes = Mat4.identity();
        let rotationQuat;
        describe('quat to matrix and back', () => {
            beforeEach(() => {
                rotationQuat = new Quat(1, 2, 3, 4).normalize();
                quat2A.setFromTranslationRotation(rotationQuat, new Vec3(1, -5, 3));
                matRes.setFromQuat2(quat2A);
                result.setFromMat4(matRes);
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new DualQuat(0.18257418, 0.36514836, 0.54772257, 0.73029673, -1.5518806, -1.82574184, 1.73445473, 0)));
            });
            it('should be equal to the starting dual quat', () => {
                expect(quat2A.equalsApproximately(result));
            });
        });
    });
    describe('create', () => {
        beforeEach(() => {
            result.identity();
        });
        it('should return 2 4 element arrays initialized to an identity dual quaternion', () => {
            expect(result.equalsApproximately(new DualQuat(0, 0, 0, 1, 0, 0, 0, 0)));
        });
    });
    describe('clone', () => {
        beforeEach(() => {
            result.copy(quat2A);
        });
        it('should return 2 4 element arrays initialized to the values in quat2A', () => {
            expect(result.equalsApproximately(quat2A));
        });
    });
    describe('copy', () => {
        beforeEach(() => {
            result.copy(quat2A);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
    });
    describe('identity', () => {
        beforeEach(() => {
            result.setIdentity();
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(0, 0, 0, 1, 0, 0, 0, 0)));
        });
    });
    describe('add', () => {
        beforeEach(() => {
            result.copy(quat2A).add(quat2B);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(6, 8, 10, 12, 11, 13, 12, -6)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new DualQuat(5, 6, 7, 8, 9, 8, 6, -4)));
        });
    });
    describe('multiply', () => {
        describe('with a separate output quaternion', () => {
            beforeEach(() => {
                result.copy(quat2A).multiply(quat2B);
            });
            it('should place values into out', () => {
                expect(result.equalsApproximately(new DualQuat(24, 48, 48, -6, 25, 89, 23, -157)));
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
            });
            it('should not modify quat2B', () => {
                expect(quat2B.equalsApproximately(new DualQuat(5, 6, 7, 8, 9, 8, 6, -4)));
            });
        });
        describe('same as matrix multiplication', () => {
            const matrixA = Mat4.identity();
            const matrixB = Mat4.identity();
            const testQuat = DualQuat.identity();
            beforeEach(() => {
                //quat2A and quat2B only seem to work when created using this function?
                quat2A.setFromTranslationRotation(new Quat(1, 2, 3, 4), new Vec3(-5, 4, 10)).normalize();
                matrixA.setFromQuat2(quat2A);
                quat2B.setFromTranslationRotation(new Quat(5, 6, 7, 8), new Vec3(9, 8, 6)).normalize();
                matrixB.setFromQuat2(quat2B);
            });
            it('the matrices should be equal to the dual quaternions', () => {
                testQuat.setFromMat4(matrixA);
                expect(testQuat.equalsApproximately(quat2A));
                testQuat.setFromMat4(matrixB);
                expect(testQuat.equalsApproximately(quat2B));
            });
            it('should be equal to the matrix multiplication', () => {
                result.copy(quat2A).multiply(quat2B);
                const matOut = matrixA.clone().multiply(matrixB);
                const quatOut = DualQuat.identity().setFromMat4(matOut);
                expect(result.equalsApproximately(quatOut));
            });
        });
    });
    describe('scale', () => {
        beforeEach(() => {
            result.copy(quat2A).scale(2);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(2, 4, 6, 8, 4, 10, 12, -4)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
    });
    describe('length', () => {
        it('should return the length', () => {
            expect(equalsApproximately(quat2A.length, 5.477225));
        });
    });
    describe('squaredLength', () => {
        beforeEach(() => {
            result.copy(quat2A);
        });
        it('should return the squared length', () => {
            expect(result.squaredLength).toEqual(30);
        });
    });
    describe('fromRotation', () => {
        beforeEach(() => {
            result.setFromRotation(new Quat(1, 2, 3, 4));
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(1, 2, 3, 4, 0, 0, 0, 0)));
        });
        it('should not modify the quaternion', () => {
            expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
    });
    describe('fromTranslation', () => {
        beforeEach(() => {
            vec.set([1, 2, 3]);
            result.setFromTranslation(vec);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(0, 0, 0, 1, 0.5, 1, 1.5, 0)));
        });
        it('should not modify the vector', () => {
            expect(vec.equalsApproximately(new Vec3(1, 2, 3)));
        });
    });
    describe('fromRotationTranslation', () => {
        beforeEach(() => {
            vec.set([1, 2, 3]);
            result.setFromTranslationRotation(new Quat(1, 2, 3, 4), vec);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 4, 6, -7)));
        });
        it('should not modify the quaternion', () => {
            expect(quat2A.real.equalsApproximately(new Quat(1, 2, 3, 4)));
        });
        it('should not modify the vector', () => {
            expect(vec.equalsApproximately(new Vec3(1, 2, 3)));
        });
        it('should have a translation that can be retrieved with getTranslation', () => {
            const t = result.normalize().translation;
            expect(t.equalsApproximately(new Vec3(1, 2, 3)));
        });
    });
    describe('getTranslation', () => {
        let resultVec;
        describe('without a real part', () => {
            beforeEach(() => {
                result.setFromTranslation(new Vec3(1, 2, 3));
                resultVec = result.translation;
            });
            describe('not normalized', () => {
                it('should return the same translation value', () => {
                    expect(resultVec.equalsApproximately(new Vec3(1, 2, 3)));
                });
            });
            describe('normalized', () => {
                it('should return the same translation value', () => {
                    result.normalize();
                    expect(resultVec.equalsApproximately(new Vec3(1, 2, 3)));
                });
            });
        });
        describe('with a real part', () => {
            beforeEach(() => {
                result.setFromTranslationRotation(new Quat(2, 4, 6, 2), new Vec3(1, 2, 3));
                resultVec = result.translation;
            });
            describe('not normalized', () => {
                it('should not return the same translation value', () => {
                    expect(!resultVec.equalsApproximately(new Vec3(1, 2, 3)));
                });
            });
            describe('normalized', () => {
                it('should return the same translation value', () => {
                    resultVec = result.normalize().translation;
                    expect(resultVec.equalsApproximately(new Vec3(1, 2, 3)));
                });
            });
        });
    });
    describe('normalize', () => {
        describe('when it is normalizing quat2A', () => {
            beforeEach(() => {
                quat2A.copy(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)).normalize();
            });
            it('both parts should have been normalized', () => {
                expect(result.equalsApproximately(new DualQuat(1 / 5.4772255, 2 / 5.4772255, 3 / 5.4772255, 4 / 5.4772255, 0.23126, 0.6450954, 0.693781, -0.9006993)));
            });
        });
        beforeEach(() => {
            quat2A.set([5, 0, 0, 0, 0, 0, 0, 0]);
        });
        describe('with a separate output quaternion', () => {
            beforeEach(() => {
                result.copy(quat2A).normalize();
            });
            it('should place values into out', () => {
                expect(result.equalsApproximately(new DualQuat(1, 0, 0, 0, 0, 0, 0, 0)));
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new DualQuat(5, 0, 0, 0, 0, 0, 0, 0)));
            });
        });
        describe('when it contains a translation', () => {
            beforeEach(() => {
                result.copy(new DualQuat(5, 0, 0, 0, 1, 2, 3, 5)).normalize();
            });
            it('both parts should have been normalized', () => {
                expect(result.equalsApproximately(new DualQuat(1, 0, 0, 0, 0, 0.4, 0.6, 1)));
            });
        });
    });
    describe('lerp', () => {
        beforeEach(() => {
            result.lerp(quat2A, quat2B, 0.7);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(3.8, 4.8, 5.8, 6.8, 6.9, 7.1, 6.0, -3.4)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new DualQuat(5, 6, 7, 8, 9, 8, 6, -4)));
        });
        describe('shortest path', () => {
            beforeEach(() => {
                result.lerp(new DualQuat(1, 2, 3, -4, 2, 5, 6, -2), new DualQuat(5, -6, 7, 8, 9, 8, 6, -4), 0.4);
            });
            it('should pick the shorter path', () => {
                expect(result.equalsApproximately(new DualQuat(-1.4, 3.6, -1, -5.6, -2.4, -0.2, 1.2, 0.4)));
            });
        });
    });
    describe('dot', () => {
        let d;
        beforeEach(() => {
            d = result.copy(quat2A).dot(quat2B);
        });
        it('should return the dot product', () => {
            expect(equalsApproximately(d, 70));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new DualQuat(5, 6, 7, 8, 9, 8, 6, -4)));
        });
    });
    describe('invert', () => {
        beforeEach(() => {
            result.copy(quat2A).invert();
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(-0.0333333333, -0.06666666666, -0.1, 0.13333333333, -2 / 30, -5 / 30, -6 / 30, -2 / 30)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('the real part should be equal to a inverted quaternion', () => {
            const q = new Quat(1, 2, 3, 4).invert();
            expect(result.real.equalsApproximately(q));
        });
    });
    describe('get real/dual', () => {
        let rq;
        describe('get real', () => {
            beforeEach(() => {
                rq = quat2A.real;
            });
            it('should place values into out', () => {
                expect(rq.equalsApproximately(new Quat(1, 2, 3, 4)));
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
            });
        });
        describe('get dual', () => {
            beforeEach(() => {
                rq = quat2A.dual;
            });
            it('should place values into out', () => {
                expect(rq.equalsApproximately(new Quat(2, 5, 6, -2)));
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
            });
        });
    });
    describe('set real/dual', () => {
        let rq;
        describe('set real', () => {
            beforeEach(() => {
                rq = new Quat(4, 6, 8, -100);
                result.copy(quat2A).real = rq;
            });
            it('should place values into out', () => {
                expect(quat2A.equalsApproximately(new DualQuat(4, 6, 8, -100, 2, 5, 6, -2)));
            });
            it('should not modify outQuat', () => {
                expect(rq.equalsApproximately(new Quat(4, 6, 8, -100)));
            });
        });
        describe('set dual', () => {
            beforeEach(() => {
                rq = new Quat(4.3, 6, 8, -100);
                result.copy(quat2A).dual = rq;
            });
            it('should place values into out', () => {
                expect(result.equalsApproximately(new DualQuat(1, 2, 3, 4, 4.3, 6, 8, -100)));
            });
            it('should not modify outQuat', () => {
                expect(rq.equalsApproximately(new Quat(4.3, 6, 8, -100)));
            });
        });
    });
    describe('conjugate', () => {
        beforeEach(() => {
            result.copy(quat2A).conjugate();
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new DualQuat(-1, -2, -3, 4, -2, -5, -6, -2)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
    });
    describe('str', () => {
        beforeEach(() => {
            result.copy(quat2A);
        });
        it('should return a string representation of the quaternion', () => {
            expect(result.toString()).toEqual('quat2(1, 2, 3, 4, 2, 5, 6, -2)');
        });
    });
    describe('exactEquals', () => {
        const quat2C = DualQuat.identity();
        let r0, r1;
        beforeEach(() => {
            quat2A.set([0, 1, 2, 3, 4, 5, 6, 7]);
            quat2B.set([0, 1, 2, 3, 4, 5, 6, 7]);
            quat2C.set([1, 2, 3, 4, 5, 6, 7, 8]);
            r0 = quat2A.equalsExact(quat2B);
            r1 = quat2A.equalsExact(quat2C);
        });
        it('should return true for identical quaternions', () => {
            expect(r0).toBe(true);
        });
        it('should return false for different quaternions', () => {
            expect(r1).toBe(false);
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(0, 1, 2, 3, 4, 5, 6, 7)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new DualQuat(0, 1, 2, 3, 4, 5, 6, 7)));
        });
    });
    describe('equals', () => {
        const quat2C = DualQuat.identity();
        const quat2D = DualQuat.identity();
        let r0, r1, r2;
        beforeEach(() => {
            quat2A.set([0, 1, 2, 3, 4, 5, 6, 7]);
            quat2B.set([0, 1, 2, 3, 4, 5, 6, 7]);
            quat2C.set([1, 2, 3, 4, 5, 6, 7, 8]);
            quat2D.set([1e-16, 1, 2, 3, 4, 5, 6, 7]);
            r0 = quat2A.equalsApproximately(quat2B);
            r1 = quat2A.equalsApproximately(quat2C);
            r2 = quat2A.equalsApproximately(quat2D);
        });
        it('should return true for identical dual quaternions', () => {
            expect(r0).toBe(true);
        });
        it('should return false for different dual quaternions', () => {
            expect(r1).toBe(false);
        });
        it('should return true for close but not identical quaternions', () => {
            expect(r2).toBe(true);
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new DualQuat(0, 1, 2, 3, 4, 5, 6, 7)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new DualQuat(0, 1, 2, 3, 4, 5, 6, 7)));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVhdDIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9xdWF0Mi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFDdkMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUNsQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBQ25DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFDbEMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZUFBZSxDQUFBO0FBRW5ELFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUNsQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUE7SUFDbEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3ZCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUVsQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDckMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFB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RyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMzRSxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0UsQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtZQUM3QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMs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MUUsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDdEIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNsQyxJQUFJLEVBQVcsRUFBRSxFQUFXLEVBQUUsRUFBVyxDQUFBO1FBQ3pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDeEMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN2QyxFQUFFLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3ZDLEVBQUUsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDekMsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1lBQzNELE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkIsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQzVELE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1lBQ3BFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkIsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSJ9