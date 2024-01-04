import { Mat } from './Mat.js';
import { Vec3 } from '../vector/Vec3.js';

export class Mat3 extends Mat<3, [Vec3, Vec3, Vec3]> 
{
  constructor(
    m11: number = 0, m12: number = 0, m13: number = 0,
    m21: number = 0, m22: number = 0, m23: number = 0,
    m31: number = 0, m32: number = 0, m33: number = 0
  ) 
  {
    super(3);
    this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
  }

  set(
    m11: number, m12: number, m13: number,
    m21: number, m22: number, m23: number,
    m31: number, m32: number, m33: number
  ) 
  {
    this.m1 = new Vec3(m11, m12, m13);
    this.m2 = new Vec3(m21, m22, m23);
    this.m3 = new Vec3(m31, m32, m33);
  }

  fill(): Vec3 
  {
    return new Vec3();
  }

  clone(): this 
  {
    return new Mat3(
      this.m11, this.m12, this.m13,
      this.m21, this.m22, this.m23,
      this.m31, this.m32, this.m33
    ) as this;
  }

  transpose(): this 
  {
    [this.m12, this.m21] = [this.m21, this.m12];
    [this.m13, this.m31] = [this.m31, this.m13];
    [this.m23, this.m32] = [this.m32, this.m23];
    return this;
  }

  identity(): this 
  {
    this.m1.set(1, 0, 0);
    this.m2.set(0, 1, 0);
    this.m3.set(0, 0, 1);
    return this;
  }

  determinant(): number 
  {
    const [m11, m12, m13, m21, m22, m23, m31, m32, m33] = this.data();
    return m11! * (m22! * m33! - m23! * m32!) - m12! * (m21! * m33! - m23! * m31!) + m13! * (m21! * m32! - m22! * m31!);
  }

  inverse(): this 
  {
    const det = this.determinant();

    if (det !== 0) {
      const invDet = 1 / det;
      const [m11, m12, m13, m21, m22, m23, m31, m32, m33] = this.data();

      this.values[0]!.set(
        (m22! * m33! - m23! * m32!) * invDet,
        (m13! * m32! - m12! * m33!) * invDet,
        (m12! * m23! - m13! * m22!) * invDet
      );

      this.values[1]!.set(
        (m23! * m31! - m21! * m33!) * invDet,
        (m11! * m33! - m13! * m31!) * invDet,
        (m13! * m21! - m11! * m23!) * invDet
      );

      this.values[2]!.set(
        (m21! * m32! - m22! * m31!) * invDet,
        (m12! * m31! - m11! * m32!) * invDet,
        (m11! * m22! - m12! * m21!) * invDet
      );
    }

    return this;
  }

  // Additional methods for 3x3 matrices
  translate(x: number, y: number, z: number): this;
  translate(translation: Vec3): this;
  translate(arg1: number | Vec3, arg2?: number, arg3?: number): this 
  {
    const translationMatrix = new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    if (arg1 instanceof Vec3) 
    {
      translationMatrix.put(2, arg1);
    } 
    else 
    {
      translationMatrix.put(2, new Vec3(arg1, arg2!, arg3!));
    }
    return this.multiply(translationMatrix as this);
  }

  rotateX(angleInRadians: number): this 
  {
    const rotationMatrix = new Mat3(
      1, 0, 0,
      0, Math.cos(angleInRadians), -Math.sin(angleInRadians),
      0, Math.sin(angleInRadians), Math.cos(angleInRadians)
    );
    return this.multiply(rotationMatrix as this);
  }

  rotateY(angleInRadians: number): this 
  {
    const rotationMatrix = new Mat3(
      Math.cos(angleInRadians), 0, Math.sin(angleInRadians),
      0, 1, 0,
      -Math.sin(angleInRadians), 0, Math.cos(angleInRadians)
    );
    return this.multiply(rotationMatrix as this);
  }

  rotateZ(angleInRadians: number): this 
  {
    const rotationMatrix = new Mat3(
      Math.cos(angleInRadians), -Math.sin(angleInRadians), 0,
      Math.sin(angleInRadians), Math.cos(angleInRadians), 0,
      0, 0, 1
    );
    return this.multiply(rotationMatrix as this);
  }

  scale(sx: number, sy: number, sz: number): this;
  scale(scaling: Vec3): this;
  scale(arg1: number | Vec3, arg2?: number, arg3?: number): this 
  {
    const scalingMatrix = new Mat3();
    if (arg1 instanceof Vec3) 
    {
      scalingMatrix.put(0, arg1);
    } 
    else 
    {
      scalingMatrix.put(0, new Vec3(arg1, arg2!, arg3!));
    }
    return this.multiply(scalingMatrix as this);
  }

  // Getters and Setters for rows
  get m1(): Vec3 
  {
    return this.values[0];
  }

  set m1(value: Vec3) 
  {
    this.values[0] = value;
  }

  get m2(): Vec3 
  {
    return this.values[1];
  }

  set m2(value: Vec3) 
  {
    this.values[1] = value;
  }

  get m3(): Vec3 
  {
    return this.values[2];
  }

  set m3(value: Vec3) 
  {
    this.values[2] = value;
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
}
