import { Mat } from './Mat.js';
import { Vec3 } from '../vector/Vec3.js';
import { Vec4 } from '../vector/Vec4.js';
import { Quaternion } from '../Quaternion.js';
import type { Mat4Data } from '../types.js';

export class Mat4 extends Mat<4, [Vec4, Vec4, Vec4, Vec4]> 
{
  constructor(
    m11: number = 0, m12: number = 0, m13: number = 0, m14: number = 0,
    m21: number = 0, m22: number = 0, m23: number = 0, m24: number = 0,
    m31: number = 0, m32: number = 0, m33: number = 0, m34: number = 0,
    m41: number = 0, m42: number = 0, m43: number = 0, m44: number = 0
  ) 
  {
    super(4);
    this.set(
      m11, m12, m13, m14, 
      m21, m22, m23, m24,
      m31, m32, m33, m34, 
      m41, m42, m43, m44
    );
  }

  set(
    m11: number, m12: number, m13: number, m14: number,
    m21: number, m22: number, m23: number, m24: number,
    m31: number, m32: number, m33: number, m34: number,
    m41: number, m42: number, m43: number, m44: number
  ) 
  {
    this.m1 = new Vec4(m11, m12, m13, m14);
    this.m2 = new Vec4(m21, m22, m23, m24);
    this.m3 = new Vec4(m31, m32, m33, m34);
    this.m4 = new Vec4(m41, m42, m43, m44);
  }

  fill(): Vec4 
  {
    return new Vec4();
  }

  clone(): this 
  {
    return new Mat4(
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44
    ) as this;
  }

  transpose(): this 
  {
    let temp = this.m12;
    this.m12 = this.m21;
    this.m21 = temp;

    temp = this.m13;
    this.m13 = this.m31;
    this.m31 = temp;

    temp = this.m14;
    this.m14 = this.m41;
    this.m41 = temp;

    temp = this.m23;
    this.m23 = this.m32;
    this.m32 = temp;

    temp = this.m24;
    this.m24 = this.m42;
    this.m42 = temp;

    temp = this.m34;
    this.m34 = this.m43;
    this.m43 = temp;

    return this;
  }

  identity(): this 
  {
    this.m1.set(1, 0, 0, 0);
    this.m2.set(0, 1, 0, 0);
    this.m3.set(0, 0, 1, 0);
    this.m4.set(0, 0, 0, 1);
    return this;
  }

  determinant(): number 
  {
    const [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = this.data() as [
        number, number, number, number,
        number, number, number, number,
        number, number, number, number,
        number, number, number, number,
      ];

    return (
      m11 * m22 * m33 * m44 -
      m11 * m22 * m34 * m43 -
      m11 * m23 * m32 * m44 +
      m11 * m23 * m34 * m42 +
      m11 * m24 * m32 * m43 -
      m11 * m24 * m33 * m42 -
      m12 * m21 * m33 * m44 +
      m12 * m21 * m34 * m43 +
      m12 * m23 * m31 * m44 -
      m12 * m23 * m34 * m41 -
      m12 * m24 * m31 * m43 +
      m12 * m24 * m33 * m41 +
      m13 * m21 * m32 * m44 -
      m13 * m21 * m34 * m42 -
      m13 * m22 * m31 * m44 +
      m13 * m22 * m34 * m41 +
      m13 * m24 * m31 * m42 -
      m13 * m24 * m32 * m41 -
      m14 * m21 * m32 * m43 +
      m14 * m21 * m33 * m42 +
      m14 * m22 * m31 * m43 -
      m14 * m22 * m33 * m41 -
      m14 * m23 * m31 * m42 +
      m14 * m23 * m32 * m41
    );
  }

  inverse(): this 
  {
    const det = this.determinant();

    if (det !== 0) {
      const invDet = 1 / det;

      const [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = this.data() as [
        number, number, number, number,
        number, number, number, number,
        number, number, number, number,
        number, number, number, number,
      ];

      this.values[0]!.set(
        (m22 * m33 * m44 - m22 * m34 * m43 - m23 * m32 * m44 + m23 * m34 * m42 + m24 * m32 * m43 - m24 * m33 * m42) * invDet,
        (-m12 * m33 * m44 + m12 * m34 * m43 + m13 * m32 * m44 - m13 * m34 * m42 - m14 * m32 * m43 + m14 * m33 * m42) * invDet,
        (m12 * m23 * m44 - m12 * m24 * m43 - m13 * m22 * m44 + m13 * m24 * m42 + m14 * m22 * m43 - m14 * m23 * m42) * invDet,
        (-m12 * m23 * m34 + m12 * m24 * m33 + m13 * m22 * m34 - m13 * m24 * m32 - m14 * m22 * m33 + m14 * m23 * m32) * invDet
      );

      this.values[1]!.set(
        (-m21 * m33 * m44 + m21 * m34 * m43 + m23 * m31 * m44 - m23 * m34 * m41 - m24 * m31 * m43 + m24 * m33 * m41) * invDet,
        (m11 * m33 * m44 - m11 * m34 * m43 - m13 * m31 * m44 + m13 * m34 * m41 + m14 * m31 * m43 - m14 * m33 * m41) * invDet,
        (-m11 * m23 * m44 + m11 * m24 * m43 + m13 * m21 * m44 - m13 * m24 * m41 - m14 * m21 * m43 + m14 * m23 * m41) * invDet,
        (m11 * m23 * m34 - m11 * m24 * m33 - m13 * m21 * m34 + m13 * m24 * m31 + m14 * m21 * m33 - m14 * m23 * m31) * invDet
      );

      this.values[2]!.set(
        (m21 * m32 * m44 - m21 * m34 * m42 - m22 * m31 * m44 + m22 * m34 * m41 + m24 * m31 * m42 - m24 * m32 * m41) * invDet,
        (-m11 * m32 * m44 + m11 * m34 * m42 + m12 * m31 * m44 - m12 * m34 * m41 - m14 * m31 * m42 + m14 * m32 * m41) * invDet,
        (m11 * m22 * m44 - m11 * m24 * m42 - m12 * m21 * m44 + m12 * m24 * m41 + m14 * m21 * m42 - m14 * m22 * m41) * invDet,
        (-m11 * m22 * m34 + m11 * m24 * m32 + m12 * m21 * m34 - m12 * m24 * m31 - m14 * m21 * m32 + m14 * m22 * m31) * invDet
      );

      this.values[3]!.set(
        (-m21 * m32 * m43 + m21 * m33 * m42 + m22 * m31 * m43 - m22 * m33 * m41 - m23 * m31 * m42 + m23 * m32 * m41) * invDet,
        (m11 * m32 * m43 - m11 * m33 * m42 - m12 * m31 * m43 + m12 * m33 * m41 + m13 * m31 * m42 - m13 * m32 * m41) * invDet,
        (-m11 * m22 * m43 + m11 * m23 * m42 + m12 * m21 * m43 - m12 * m23 * m41 - m13 * m21 * m42 + m13 * m22 * m41) * invDet,
        (m11 * m22 * m33 - m11 * m23 * m32 - m12 * m21 * m33 + m12 * m23 * m31 + m13 * m21 * m32 - m13 * m22 * m31) * invDet
      );
    }

    return this;
  }

  translate(x: number, y: number, z: number): this;
  translate(translation: Vec3): this;
  translate(arg1: number | Vec3, arg2?: number, arg3?: number): this 
  {
    const translationMatrix = new Mat4().identity();
    if (arg1 instanceof Vec3) 
    {
      translationMatrix.put(3, new Vec4(arg1.x, arg1.y, arg1.z, 1));
    } 
    else 
    {
      translationMatrix.put(3, new Vec4(arg1, arg2!, arg3!, 1));
    }
    return this.multiply(translationMatrix as this);
  }

  rotateX(angleInRadians: number): this 
  {
    const rotationMatrix = new Mat4().identity();
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);

    rotationMatrix.put(1, 1, cos);
    rotationMatrix.put(2, 2, cos);
    rotationMatrix.put(1, 2, -sin);
    rotationMatrix.put(2, 1, sin);

    return this.multiply(rotationMatrix as this);
  }

  rotateY(angleInRadians: number): this 
  {
    const rotationMatrix = new Mat4().identity();
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);

    rotationMatrix.put(0, 0, cos);
    rotationMatrix.put(2, 2, cos);
    rotationMatrix.put(0, 2, sin);
    rotationMatrix.put(2, 0, -sin);

    return this.multiply(rotationMatrix as this);
  }

  rotateZ(angleInRadians: number): this 
  {
    const rotationMatrix = new Mat4().identity();
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);

    rotationMatrix.put(0, 0, cos);
    rotationMatrix.put(1, 1, cos);
    rotationMatrix.put(0, 1, -sin);
    rotationMatrix.put(1, 0, sin);

    return this.multiply(rotationMatrix as this);
  }

  scale(sx: number, sy: number, sz: number): this;
  scale(scaling: Vec3): this;
  scale(arg1: number | Vec3, arg2?: number, arg3?: number): this 
  {
    const scalingMatrix = new Mat4().identity();
    if (arg1 instanceof Vec3) 
    {
      scalingMatrix.put(0, 0, arg1.x);
      scalingMatrix.put(1, 1, arg1.y);
      scalingMatrix.put(2, 2, arg1.z);
    } 
    else 
    {
      scalingMatrix.put(0, 0, arg1);
      scalingMatrix.put(1, 1, arg2!);
      scalingMatrix.put(2, 2, arg3!);
    }
    return this.multiply(scalingMatrix as this);
  }

  // Additional method for 3D transformations using Quaternion
  rotateByQuaternion(quaternion: Quaternion): this 
  {
    const rotationMatrix = quaternion.toRotationMatrix();
    return this.multiply(rotationMatrix as this);
  }

  slerp(target: this, alpha: number): this 
  {
    // Spherical linear interpolation is not applicable to Mat4 directly
    // For 3D rotations, use Quaternions and convert them to Mat4
    const quat1 = new Quaternion().setFromRotationMatrix(this);
    const quat2 = new Quaternion().setFromRotationMatrix(target);
    quat1.slerp(quat2, alpha);
    const resultMat = new Mat4();
    resultMat.fromQuaternion(quat1);
    this.values = resultMat.values;
    return this;
  }

  fromQuaternion(quaternion: Quaternion): this 
  {
    const { w, x, y, z } = quaternion;

    const xx = x * x;
    const xy = x * y;
    const xz = x * z;
    const xw = x * w;

    const yy = y * y;
    const yz = y * z;
    const yw = y * w;

    const zz = z * z;
    const zw = z * w;

    this.values[0]!.set(1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw), 0);
    this.values[1]!.set(2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw), 0);
    this.values[2]!.set(2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy), 0);
    this.values[3]!.set(0, 0, 0, 1);

    return this;
  }  


  // Getters and Setters for rows
  get m1(): Vec4 
  {
    return this.values[0];
  }

  set m1(value: Vec4) 
  {
    this.values[0] = value;
  }

  get m2(): Vec4 
  {
    return this.values[1];
  }

  set m2(value: Vec4) 
  {
    this.values[1] = value;
  }

  get m3(): Vec4 
  {
    return this.values[2];
  }

  set m3(value: Vec4) 
  {
    this.values[2] = value;
  }

  get m4(): Vec4 
  {
    return this.values[3];
  }

  set m4(value: Vec4) 
  {
    this.values[3] = value;
  }

  // Getters and Setters for individual elements
  get m11(): number 
  {
    return this.values[0]!.x;
  }

  set m11(value: number) 
  {
    this.values[0]!.x = value;
  }

  get m12(): number 
  {
    return this.values[0]!.y;
  }

  set m12(value: number) 
  {
    this.values[0]!.y = value;
  }

  get m13(): number 
  {
    return this.values[0]!.z;
  }

  set m13(value: number) 
  {
    this.values[0]!.z = value;
  }

  get m14(): number 
  {
    return this.values[0]!.w;
  }

  set m14(value: number) 
  {
    this.values[0]!.w = value;
  }

  get m21(): number 
  {
    return this.values[1]!.x;
  }

  set m21(value: number) 
  {
    this.values[1]!.x = value;
  }

  get m22(): number 
  {
    return this.values[1]!.y;
  }

  set m22(value: number) 
  {
    this.values[1]!.y = value;
  }

  get m23(): number 
  {
    return this.values[1]!.z;
  }

  set m23(value: number) 
  {
    this.values[1]!.z = value;
  }

  get m24(): number 
  {
    return this.values[1]!.w;
  }

  set m24(value: number) 
  {
    this.values[1]!.w = value;
  }

  get m31(): number 
  {
    return this.values[2]!.x;
  }

  set m31(value: number) 
  {
    this.values[2]!.x = value;
  }

  get m32(): number 
  {
    return this.values[2]!.y;
  }

  set m32(value: number) 
  {
    this.values[2]!.y = value;
  }

  get m33(): number 
  {
    return this.values[2]!.z;
  }

  set m33(value: number) 
  {
    this.values[2]!.z = value;
  }

  get m34(): number 
  {
    return this.values[2]!.w;
  }

  set m34(value: number) 
  {
    this.values[2]!.w = value;
  }

  get m41(): number 
  {
    return this.values[3]!.x;
  }

  set m41(value: number) 
  {
    this.values[3]!.x = value;
  }

  get m42(): number 
  {
    return this.values[3]!.y;
  }

  set m42(value: number) 
  {
    this.values[3]!.y = value;
  }

  get m43(): number 
  {
    return this.values[3]!.z;
  }

  set m43(value: number) 
  {
    this.values[3]!.z = value;
  }

  get m44(): number 
  {
    return this.values[3]!.w;
  }

  set m44(value: number) 
  {
    this.values[3]!.w = value;
  }

  static identity() 
  {
    return new Mat4().set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    )
  }

  static orthographic( left: number, right: number, top: number, bottom: number, near: number, far: number, coords = false) 
  {
    const w = 1.0 / ( right - left );
    const h = 1.0 / ( top - bottom );
    const p = 1.0 / ( far - near );

    const x = ( right + left ) * w;
    const y = ( top + bottom ) * h;

    let z, zInv;

    if (coords)
    {
      z = ( far + near ) * p;
      zInv = - 2 * p;
    }
    else
    {
      z = near * p;
      zInv = - 1 * p;
    }

    const te: number[] = [];
    
    te[ 0 ] = 2 * w;  te[ 4 ] = 0;    te[ 8 ] = 0;    te[ 12 ] = - x;
    te[ 1 ] = 0;    te[ 5 ] = 2 * h;  te[ 9 ] = 0;    te[ 13 ] = - y;
    te[ 2 ] = 0;    te[ 6 ] = 0;    te[ 10 ] = zInv;  te[ 14 ] = - z;
    te[ 3 ] = 0;    te[ 7 ] = 0;    te[ 11 ] = 0;   te[ 15 ] = 1;

    const mat = new Mat4();
    mat.set(...te as Mat4Data)
    return mat;
  }

  static perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
    const mat = new Mat4();
    const tanHalfFov = Math.tan(fov / 2);

    mat.m1.set(1 / (aspect * tanHalfFov), 0, 0, 0);
    mat.m2.set(0, 1 / tanHalfFov, 0, 0);
    mat.m3.set(0, 0, -(far + near) / (far - near), -(2 * far * near) / (far - near));
    mat.m4.set(0, 0, -1, 0);

    return mat;
  }

  static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
    const mat = new Mat4();
    const zAxis = target.clone().subtract(eye).normalize();
    const xAxis = up.clone().cross(zAxis).normalize();
    const yAxis = zAxis.clone().cross(xAxis);

    mat.m1.set(xAxis.x, xAxis.y, xAxis.z, -xAxis.dot(eye));
    mat.m2.set(yAxis.x, yAxis.y, yAxis.z, -yAxis.dot(eye));
    mat.m3.set(-zAxis.x, -zAxis.y, -zAxis.z, zAxis.dot(eye));
    mat.m4.set(0, 0, 0, 1);

    return mat;
  }
}