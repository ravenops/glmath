"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quat2_1 = require("../lib/quat2");
const vec3_1 = require("../lib/vec3");
const mat44_1 = require("../lib/mat44");
const quat_1 = require("../lib/quat");
const common_1 = require("../lib/common");
describe('quat2', () => {
    const quat2A = quat2_1.DualQuat.identity();
    const quat2B = quat2_1.DualQuat.identity();
    const vec = vec3_1.Vec3.zero();
    const result = quat2_1.DualQuat.identity();
    beforeEach(() => {
        quat2A.set([1, 2, 3, 4, 2, 5, 6, -2]);
        quat2B.set([5, 6, 7, 8, 9, 8, 6, -4]);
        vec.set([1, 1, -1]);
    });
    describe('translate', () => {
        const matrixA = mat44_1.Mat4.identity();
        beforeEach(() => {
            //quat2A only seems to work when created using this function?
            quat2B.setFromTranslationRotation(new quat_1.Quat(1, 2, 3, 4), new vec3_1.Vec3(-5, 4, 10));
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
            expect(vec.equalsApproximately(new vec3_1.Vec3(1, 1, -1)));
        });
    });
    describe('rotateAroundAxis', () => {
        const matrixA = mat44_1.Mat4.identity();
        const ax = new vec3_1.Vec3(1, 4, 2);
        beforeEach(() => {
            //quat2A only seems to work when created using this function?
            quat2A.setFromTranslationRotation(new quat_1.Quat(1, 2, 3, 4), new vec3_1.Vec3(-5, 4, 10)).normalize();
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
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(0.18257418583505536, 0.3651483716701107, 0.5477225575051661, 0.7302967433402214, -2.556038601690775, 3.742770809618635, 2.37346441585572, -3.0124740662784135)));
        });
        it('should not modify ax', () => {
            expect(ax.equalsApproximately(new vec3_1.Vec3(1, 4, 2)));
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
                expect(ax.equalsApproximately(new vec3_1.Vec3(1, 4, 2)));
            });
        });
    });
    describe('rotateByQuatPrepend', () => {
        const correctResult = quat2_1.DualQuat.identity();
        const rotationQuat = quat2_1.DualQuat.identity();
        beforeEach(() => {
            rotationQuat.set([2, 5, 2, -10], 0);
            correctResult.copy(rotationQuat).multiply(quat2A);
            result.copy(quat2A).rotateByQuatPrepend(rotationQuat.real);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(correctResult));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('should not modify the rotation quaternion', () => {
            expect(rotationQuat.equalsApproximately(new quat2_1.DualQuat(2, 5, 2, -10, 0, 0, 0, 0)));
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
        const matRes = mat44_1.Mat4.identity();
        let rotationQuat;
        describe('quat to matrix and back', () => {
            beforeEach(() => {
                rotationQuat = new quat_1.Quat(1, 2, 3, 4).normalize();
                quat2A.setFromTranslationRotation(rotationQuat, new vec3_1.Vec3(1, -5, 3));
                matRes.setFromQuat2(quat2A);
                result.setFromMat4(matRes);
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new quat2_1.DualQuat(0.18257418, 0.36514836, 0.54772257, 0.73029673, -1.5518806, -1.82574184, 1.73445473, 0)));
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
            expect(result.equalsApproximately(new quat2_1.DualQuat(0, 0, 0, 1, 0, 0, 0, 0)));
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
            expect(result.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
    });
    describe('identity', () => {
        beforeEach(() => {
            result.setIdentity();
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new quat2_1.DualQuat(0, 0, 0, 1, 0, 0, 0, 0)));
        });
    });
    describe('add', () => {
        beforeEach(() => {
            result.copy(quat2A).add(quat2B);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new quat2_1.DualQuat(6, 8, 10, 12, 11, 13, 12, -6)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new quat2_1.DualQuat(5, 6, 7, 8, 9, 8, 6, -4)));
        });
    });
    describe('multiply', () => {
        describe('with a separate output quaternion', () => {
            beforeEach(() => {
                result.copy(quat2A).multiply(quat2B);
            });
            it('should place values into out', () => {
                expect(result.equalsApproximately(new quat2_1.DualQuat(24, 48, 48, -6, 25, 89, 23, -157)));
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
            });
            it('should not modify quat2B', () => {
                expect(quat2B.equalsApproximately(new quat2_1.DualQuat(5, 6, 7, 8, 9, 8, 6, -4)));
            });
        });
        describe('same as matrix multiplication', () => {
            const matrixA = mat44_1.Mat4.identity();
            const matrixB = mat44_1.Mat4.identity();
            const testQuat = quat2_1.DualQuat.identity();
            beforeEach(() => {
                //quat2A and quat2B only seem to work when created using this function?
                quat2A.setFromTranslationRotation(new quat_1.Quat(1, 2, 3, 4), new vec3_1.Vec3(-5, 4, 10)).normalize();
                matrixA.setFromQuat2(quat2A);
                quat2B.setFromTranslationRotation(new quat_1.Quat(5, 6, 7, 8), new vec3_1.Vec3(9, 8, 6)).normalize();
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
                const quatOut = quat2_1.DualQuat.identity().setFromMat4(matOut);
                expect(result.equalsApproximately(quatOut));
            });
        });
    });
    describe('scale', () => {
        beforeEach(() => {
            result.copy(quat2A).scale(2);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new quat2_1.DualQuat(2, 4, 6, 8, 4, 10, 12, -4)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
    });
    describe('length', () => {
        it('should return the length', () => {
            expect(common_1.equalsApproximately(quat2A.length, 5.477225));
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
            result.setFromRotation(new quat_1.Quat(1, 2, 3, 4));
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 0, 0, 0, 0)));
        });
        it('should not modify the quaternion', () => {
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
    });
    describe('fromTranslation', () => {
        beforeEach(() => {
            vec.set([1, 2, 3]);
            result.setFromTranslation(vec);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new quat2_1.DualQuat(0, 0, 0, 1, 0.5, 1, 1.5, 0)));
        });
        it('should not modify the vector', () => {
            expect(vec.equalsApproximately(new vec3_1.Vec3(1, 2, 3)));
        });
    });
    describe('fromRotationTranslation', () => {
        beforeEach(() => {
            vec.set([1, 2, 3]);
            result.setFromTranslationRotation(new quat_1.Quat(1, 2, 3, 4), vec);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 4, 6, -7)));
        });
        it('should not modify the quaternion', () => {
            expect(quat2A.real.equalsApproximately(new quat_1.Quat(1, 2, 3, 4)));
        });
        it('should not modify the vector', () => {
            expect(vec.equalsApproximately(new vec3_1.Vec3(1, 2, 3)));
        });
        it('should have a translation that can be retrieved with getTranslation', () => {
            const t = result.normalize().translation;
            expect(t.equalsApproximately(new vec3_1.Vec3(1, 2, 3)));
        });
    });
    describe('getTranslation', () => {
        let resultVec;
        describe('without a real part', () => {
            beforeEach(() => {
                result.setFromTranslation(new vec3_1.Vec3(1, 2, 3));
                resultVec = result.translation;
            });
            describe('not normalized', () => {
                it('should return the same translation value', () => {
                    expect(resultVec.equalsApproximately(new vec3_1.Vec3(1, 2, 3)));
                });
            });
            describe('normalized', () => {
                it('should return the same translation value', () => {
                    result.normalize();
                    expect(resultVec.equalsApproximately(new vec3_1.Vec3(1, 2, 3)));
                });
            });
        });
        describe('with a real part', () => {
            beforeEach(() => {
                result.setFromTranslationRotation(new quat_1.Quat(2, 4, 6, 2), new vec3_1.Vec3(1, 2, 3));
                resultVec = result.translation;
            });
            describe('not normalized', () => {
                it('should not return the same translation value', () => {
                    expect(!resultVec.equalsApproximately(new vec3_1.Vec3(1, 2, 3)));
                });
            });
            describe('normalized', () => {
                it('should return the same translation value', () => {
                    resultVec = result.normalize().translation;
                    expect(resultVec.equalsApproximately(new vec3_1.Vec3(1, 2, 3)));
                });
            });
        });
    });
    describe('normalize', () => {
        describe('when it is normalizing quat2A', () => {
            beforeEach(() => {
                quat2A.copy(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)).normalize();
            });
            it('both parts should have been normalized', () => {
                expect(result.equalsApproximately(new quat2_1.DualQuat(1 / 5.4772255, 2 / 5.4772255, 3 / 5.4772255, 4 / 5.4772255, 0.23126, 0.6450954, 0.693781, -0.9006993)));
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
                expect(result.equalsApproximately(new quat2_1.DualQuat(1, 0, 0, 0, 0, 0, 0, 0)));
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new quat2_1.DualQuat(5, 0, 0, 0, 0, 0, 0, 0)));
            });
        });
        describe('when it contains a translation', () => {
            beforeEach(() => {
                result.copy(new quat2_1.DualQuat(5, 0, 0, 0, 1, 2, 3, 5)).normalize();
            });
            it('both parts should have been normalized', () => {
                expect(result.equalsApproximately(new quat2_1.DualQuat(1, 0, 0, 0, 0, 0.4, 0.6, 1)));
            });
        });
    });
    describe('lerp', () => {
        beforeEach(() => {
            result.lerp(quat2A, quat2B, 0.7);
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new quat2_1.DualQuat(3.8, 4.8, 5.8, 6.8, 6.9, 7.1, 6.0, -3.4)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new quat2_1.DualQuat(5, 6, 7, 8, 9, 8, 6, -4)));
        });
        describe('shortest path', () => {
            beforeEach(() => {
                result.lerp(new quat2_1.DualQuat(1, 2, 3, -4, 2, 5, 6, -2), new quat2_1.DualQuat(5, -6, 7, 8, 9, 8, 6, -4), 0.4);
            });
            it('should pick the shorter path', () => {
                expect(result.equalsApproximately(new quat2_1.DualQuat(-1.4, 3.6, -1, -5.6, -2.4, -0.2, 1.2, 0.4)));
            });
        });
    });
    describe('dot', () => {
        let d;
        beforeEach(() => {
            d = result.copy(quat2A).dot(quat2B);
        });
        it('should return the dot product', () => {
            expect(common_1.equalsApproximately(d, 70));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new quat2_1.DualQuat(5, 6, 7, 8, 9, 8, 6, -4)));
        });
    });
    describe('invert', () => {
        beforeEach(() => {
            result.copy(quat2A).invert();
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new quat2_1.DualQuat(-0.0333333333, -0.06666666666, -0.1, 0.13333333333, -2 / 30, -5 / 30, -6 / 30, -2 / 30)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
        });
        it('the real part should be equal to a inverted quaternion', () => {
            const q = new quat_1.Quat(1, 2, 3, 4).invert();
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
                expect(rq.equalsApproximately(new quat_1.Quat(1, 2, 3, 4)));
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
            });
        });
        describe('get dual', () => {
            beforeEach(() => {
                rq = quat2A.dual;
            });
            it('should place values into out', () => {
                expect(rq.equalsApproximately(new quat_1.Quat(2, 5, 6, -2)));
            });
            it('should not modify quat2A', () => {
                expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
            });
        });
    });
    describe('set real/dual', () => {
        let rq;
        describe('set real', () => {
            beforeEach(() => {
                rq = new quat_1.Quat(4, 6, 8, -100);
                result.copy(quat2A).real = rq;
            });
            it('should place values into out', () => {
                expect(quat2A.equalsApproximately(new quat2_1.DualQuat(4, 6, 8, -100, 2, 5, 6, -2)));
            });
            it('should not modify outQuat', () => {
                expect(rq.equalsApproximately(new quat_1.Quat(4, 6, 8, -100)));
            });
        });
        describe('set dual', () => {
            beforeEach(() => {
                rq = new quat_1.Quat(4.3, 6, 8, -100);
                result.copy(quat2A).dual = rq;
            });
            it('should place values into out', () => {
                expect(result.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 4.3, 6, 8, -100)));
            });
            it('should not modify outQuat', () => {
                expect(rq.equalsApproximately(new quat_1.Quat(4.3, 6, 8, -100)));
            });
        });
    });
    describe('conjugate', () => {
        beforeEach(() => {
            result.copy(quat2A).conjugate();
        });
        it('should place values into out', () => {
            expect(result.equalsApproximately(new quat2_1.DualQuat(-1, -2, -3, 4, -2, -5, -6, -2)));
        });
        it('should not modify quat2A', () => {
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(1, 2, 3, 4, 2, 5, 6, -2)));
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
        const quat2C = quat2_1.DualQuat.identity();
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
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(0, 1, 2, 3, 4, 5, 6, 7)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new quat2_1.DualQuat(0, 1, 2, 3, 4, 5, 6, 7)));
        });
    });
    describe('equals', () => {
        const quat2C = quat2_1.DualQuat.identity();
        const quat2D = quat2_1.DualQuat.identity();
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
            expect(quat2A.equalsApproximately(new quat2_1.DualQuat(0, 1, 2, 3, 4, 5, 6, 7)));
        });
        it('should not modify quat2B', () => {
            expect(quat2B.equalsApproximately(new quat2_1.DualQuat(0, 1, 2, 3, 4, 5, 6, 7)));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVhdDIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9xdWF0Mi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXVDO0FBQ3ZDLHNDQUFrQztBQUNsQyx3Q0FBbUM7QUFDbkMsc0NBQWtDO0FBQ2xDLDBDQUFtRDtBQUVuRCxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixNQUFNLE1BQU0sR0FBRyxnQkFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQ2xDLE1BQU0sTUFBTSxHQUFHLGdCQUFRLENBQUMsUUFBUSxFQUFFLENBQUE7SUFDbEMsTUFBTSxHQUFHLEdBQUcsV0FBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3ZCLE1BQU0sTUFBTSxHQUFHLGdCQUFRLENBQUMsUUFBUSxFQUFFLENBQUE7SUFFbEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNyQixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUUvQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsNkRBQTZEO1lBQzdELE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLFdBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUM1RSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUE7WUFDbEIsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUVsQywwQkFBMEI7WUFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN0QixNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzdCLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDNUMsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1lBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxNQUFNLE9BQU8sR0FBRyxZQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDL0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUM1QixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsNkRBQTZEO1lBQzdELE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLFdBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtZQUN4RixPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBRTNDLDBCQUEwQjtZQUMxQixPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNyQixNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzdCLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDNUMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sQ0FDSixNQUFNLENBQUMsbUJBQW1CLENBQ3hCLElBQUksZ0JBQVEsQ0FDVixtQkFBbUIsRUFDbkIsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQixrQkFBa0IsRUFDbEIsQ0FBQyxpQkFBaUIsRUFDbEIsaUJBQWlCLEVBQ2pCLGdCQUFnQixFQUNoQixDQUFDLGtCQUFrQixDQUNwQixDQUNGLENBQ0YsQ0FBQTtRQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtZQUM5QixNQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksV0FBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25ELENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtZQUNwRCxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQzlCLDBCQUEwQjtnQkFDMUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQ3JCLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDN0IsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO2dCQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDNUMsQ0FBQyxDQUFDLENBQUE7WUFDRixFQUFFLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO2dCQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDNUMsQ0FBQyxDQUFDLENBQUE7WUFDRixFQUFFLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO2dCQUM5QixNQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksV0FBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ25ELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDbkMsTUFBTSxhQUFhLEdBQUcsZ0JBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUN6QyxNQUFNLFlBQVksR0FBRyxnQkFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3hDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNuQyxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM1RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO1FBQ25ELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0UsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1lBQ25ELE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYscUNBQXFDO0lBQ3JDLHFDQUFxQztJQUNyQyxnQ0FBZ0M7SUFDaEMsaUNBQWlDO0lBQ2pDLDhCQUE4QjtJQUM5QixzRUFBc0U7SUFDdEUsa0ZBQWtGO0lBQ2xGLHdDQUF3QztJQUN4Qyx3Q0FBd0M7SUFFeEMsaURBQWlEO0lBQ2pELHFDQUFxQztJQUNyQywyQ0FBMkM7SUFDM0MsMENBQTBDO0lBQzFDLFdBQVc7SUFFWCx3REFBd0Q7SUFDeEQsaURBQWlEO0lBQ2pELFdBQVc7SUFDWCw2Q0FBNkM7SUFDN0MsbUNBQW1DO0lBQ25DLFdBQVc7SUFDWCxvREFBb0Q7SUFDcEQsbURBQW1EO0lBQ25ELFdBQVc7SUFDWCxTQUFTO0lBQ1QsT0FBTztJQUVQLGdDQUFnQztJQUNoQyxxQ0FBcUM7SUFDckMsZ0NBQWdDO0lBQ2hDLGlDQUFpQztJQUNqQyx5QkFBeUI7SUFDekIsc0VBQXNFO0lBQ3RFLGtGQUFrRjtJQUNsRix3Q0FBd0M7SUFDeEMsd0NBQXdDO0lBQ3hDLGtEQUFrRDtJQUNsRCxxQ0FBcUM7SUFDckMsNENBQTRDO0lBQzVDLDBDQUEwQztJQUMxQyxXQUFXO0lBRVgsbURBQW1EO0lBQ25ELHFEQUFxRDtJQUNyRCxXQUFXO0lBRVgsK0NBQStDO0lBQy9DLG1EQUFtRDtJQUNuRCxXQUFXO0lBQ1gsU0FBUztJQUVULGdDQUFnQztJQUNoQyxxQ0FBcUM7SUFDckMsZ0NBQWdDO0lBQ2hDLGlDQUFpQztJQUNqQyx5QkFBeUI7SUFDekIsc0VBQXNFO0lBQ3RFLG9GQUFvRjtJQUNwRix3Q0FBd0M7SUFDeEMsd0NBQXdDO0lBQ3hDLGlEQUFpRDtJQUNqRCxxQ0FBcUM7SUFDckMsMkNBQTJDO0lBQzNDLDBDQUEwQztJQUMxQyxXQUFXO0lBRVgsbURBQW1EO0lBQ25ELHFEQUFxRDtJQUNyRCxXQUFXO0lBRVgsK0NBQStDO0lBQy9DLG1EQUFtRDtJQUNuRCxXQUFXO0lBQ1gsU0FBUztJQUVULFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO1FBQzNCLE1BQU0sTUFBTSxHQUFHLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUM5QixJQUFJLFlBQWtCLENBQUE7UUFDdEIsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtZQUN2QyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLFlBQVksR0FBRyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtnQkFDL0MsTUFBTSxDQUFDLDBCQUEwQixDQUFDLFlBQVksRUFBRSxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbkUsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDM0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1QixDQUFDLENBQUMsQ0FBQTtZQUNGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xDLE1BQU0sQ0FDSixNQUFNLENBQUMsbUJBQW1CLENBQ3hCLElBQUksZ0JBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUNyRyxDQUNGLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7Z0JBQ25ELE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtZQUM1QyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUN0QixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ25CLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLDZFQUE2RSxFQUFFLEdBQUcsRUFBRTtZQUNyRixNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNyQixDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQyxzRUFBc0UsRUFBRSxHQUFHLEVBQUU7WUFDOUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQzVDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNyQixDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtRQUN4QixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ3RCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtRQUNuQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDakMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoRixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0UsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLFFBQVEsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDakQsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN0QyxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BGLENBQUMsQ0FBQyxDQUFBO1lBRUYsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtnQkFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzNFLENBQUMsQ0FBQyxDQUFBO1lBQ0YsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtnQkFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzNFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1lBQzdDLE1BQU0sT0FBTyxHQUFHLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUMvQixNQUFNLE9BQU8sR0FBRyxZQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7WUFDL0IsTUFBTSxRQUFRLEdBQUcsZ0JBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUNwQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLHVFQUF1RTtnQkFDdkUsTUFBTSxDQUFDLDBCQUEwQixDQUFDLElBQUksV0FBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksV0FBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBO2dCQUN4RixPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUM1QixNQUFNLENBQUMsMEJBQTBCLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBO2dCQUN0RixPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzlCLENBQUMsQ0FBQyxDQUFBO1lBQ0YsRUFBRSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtnQkFDOUQsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO2dCQUU1QyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUM3QixNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDOUMsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO2dCQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDcEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDaEQsTUFBTSxPQUFPLEdBQUcsZ0JBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQ3ZELE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtZQUM3QyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUIsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM3RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUN0QixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyw0QkFBbUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDdEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JCLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtZQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUMxQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QyxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7WUFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNoQyxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNwRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtRQUN2QyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsQixNQUFNLENBQUMsMEJBQTBCLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMzRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7WUFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQy9ELENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLElBQUksV0FBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BELENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtZQUM3RSxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFBO1lBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsSUFBSSxTQUFlLENBQUE7UUFDbkIsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtZQUNuQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzVDLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFBO1lBQ2hDLENBQUMsQ0FBQyxDQUFBO1lBQ0YsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtnQkFDOUIsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtvQkFDbEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDMUQsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtZQUNGLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO2dCQUMxQixFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO29CQUNsRCxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUE7b0JBQ2xCLE1BQU0sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzFELENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7WUFDaEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxNQUFNLENBQUMsMEJBQTBCLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUMxRSxTQUFTLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQTtZQUNoQyxDQUFDLENBQUMsQ0FBQTtZQUNGLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7Z0JBQzlCLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7b0JBQ3RELE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDM0QsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtZQUNGLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO2dCQUMxQixFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO29CQUNsRCxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQTtvQkFDMUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDMUQsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixRQUFRLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1lBQzdDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtZQUNoRSxDQUFDLENBQUMsQ0FBQTtZQUNGLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7Z0JBQ2hELE1BQU0sQ0FDSixNQUFNLENBQUMsbUJBQW1CLENBQ3hCLElBQUksZ0JBQVEsQ0FDVixDQUFDLEdBQUcsU0FBUyxFQUNiLENBQUMsR0FBRyxTQUFTLEVBQ2IsQ0FBQyxHQUFHLFNBQVMsRUFDYixDQUFDLEdBQUcsU0FBUyxFQUNiLE9BQU8sRUFDUCxTQUFTLEVBQ1QsUUFBUSxFQUNSLENBQUMsU0FBUyxDQUNYLENBQ0YsQ0FDRixDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1lBQ2pELFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtZQUNqQyxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDMUUsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO2dCQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzFFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7WUFDL0QsQ0FBQyxDQUFDLENBQUE7WUFDRixFQUFFLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO2dCQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzlFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ3BCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDbEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMzRixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0UsQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtZQUM3QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDbEcsQ0FBQyxDQUFDLENBQUE7WUFDRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO2dCQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUM3RixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtRQUNuQixJQUFJLENBQVMsQ0FBQTtRQUNiLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckMsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZDLE1BQU0sQ0FBQyw0QkFBbUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNwQyxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0UsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQzlCLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLENBQ0osTUFBTSxDQUFDLG1CQUFtQixDQUN4QixJQUFJLGdCQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUNyRyxDQUNGLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxNQUFNLENBQUMsR0FBRyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtZQUV2QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzVDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUM3QixJQUFJLEVBQVEsQ0FBQTtRQUNaLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1lBQ3hCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUE7WUFDbEIsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO2dCQUN0QyxNQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksV0FBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN0RCxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMzRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDeEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQTtZQUNsQixDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDdkQsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO2dCQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDM0UsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7UUFDN0IsSUFBSSxFQUFRLENBQUE7UUFDWixRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUN4QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLEVBQUUsR0FBRyxJQUFJLFdBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7WUFDL0IsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO2dCQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksZ0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUM5RSxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7Z0JBQ25DLE1BQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxXQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDekQsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1lBQ3hCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsRUFBRSxHQUFHLElBQUksV0FBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtZQUMvQixDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRSxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7Z0JBQ25DLE1BQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxXQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDM0QsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDakMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNqRixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGdCQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtRQUNuQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNyQixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7WUFDakUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO1FBQ3JFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixNQUFNLE1BQU0sR0FBRyxnQkFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ2xDLElBQUksRUFBVyxFQUFFLEVBQVcsQ0FBQTtRQUM1QixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDcEMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDL0IsRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDakMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1lBQ3RELE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkIsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUUsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sTUFBTSxHQUFHLGdCQUFRLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDbEMsTUFBTSxNQUFNLEdBQUcsZ0JBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNsQyxJQUFJLEVBQVcsRUFBRSxFQUFXLEVBQUUsRUFBVyxDQUFBO1FBQ3pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDeEMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN2QyxFQUFFLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3ZDLEVBQUUsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDekMsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1lBQzNELE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkIsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQzVELE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1lBQ3BFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkIsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUUsQ0FBQyxDQUFDLENBQUE7UUFDRixFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxnQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIn0=