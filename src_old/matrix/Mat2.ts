import { Mat } from './Mat.js';
import { Vec2 } from '../vector/Vec2.js';

export class Mat2 extends Mat<2, [Vec2, Vec2]> 
{
  constructor(
    m11: number = 0, m12: number = 0,
    m21: number = 0, m22: number = 0
  ) 
  {
    super(2);
    this.set(m11, m12, m21, m22);
  }

  set(
    m11: number, m12: number,
    m21: number, m22: number
  ) 
  {
    this.m1 = new Vec2(m11, m12);
    this.m2 = new Vec2(m21, m22);
  }

  fill(): Vec2 
  {
    return new Vec2();
  }

  clone(): this 
  {
    return new Mat2(
      this.m11, this.m12,
      this.m21, this.m22
    ) as this;
  }

  transpose(): this 
  {
    [this.m12, this.m21] = [this.m21, this.m12];
    return this;
  }

  identity(): this 
  {
    this.m1.set(1, 0);
    this.m2.set(0, 1);
    return this;
  }

  determinant(): number 
  {
    return this.m11 * this.m22 - this.m12 * this.m21;
  }

  inverse(): this 
  {
    const det = this.determinant();

    if (det !== 0) 
    {
      const invDet = 1 / det;
      const [m11, m12, m21, m22] = this.data();

      this.values[0]!.set(m22! * invDet, -m12! * invDet);
      this.values[1]!.set(-m21! * invDet, m11! * invDet);
    }

    return this;
  }

  translate(x: number, y: number): this;
  translate(translation: Vec2): this;
  translate(arg1: number | Vec2, arg2?: number): this 
  {
    const translationMatrix = new Mat2(1, 0, 0, 1);
    if (arg1 instanceof Vec2) 
    {
      translationMatrix.put(0, arg1);
    } 
    else 
    {
      translationMatrix.put(0, new Vec2(arg1, arg2!));
    }
    return this.multiply(translationMatrix as this);
  }

  rotate(angleInRadians: number): this 
  {
    const rotationMatrix = new Mat2(Math.cos(angleInRadians), -Math.sin(angleInRadians), Math.sin(angleInRadians), Math.cos(angleInRadians));
    return this.multiply(rotationMatrix as this);
  }

  scale(sx: number, sy: number): this;
  scale(scaling: Vec2): this;
  scale(arg1: number | Vec2, arg2?: number): this 
  {
    const scalingMatrix = new Mat2();
    if (arg1 instanceof Vec2) 
    {
      scalingMatrix.put(0, arg1);
    } 
    else 
    {
      scalingMatrix.put(0, new Vec2(arg1, arg2!));
    }
    return this.multiply(scalingMatrix as this);
  }

  // Getters and Setters for rows
  get m1(): Vec2 
  {
    return this.values[0];
  }

  set m1(value: Vec2) 
  {
    this.values[0] = value;
  }

  get m2(): Vec2 
  {
    return this.values[1];
  }

  set m2(value: Vec2) 
  {
    this.values[1] = value;
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
}
