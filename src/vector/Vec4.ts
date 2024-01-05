import type { Vec4Data } from '../types.js';
import { Vec } from './Vec.js';

export class Vec4 extends Vec<4> 
{
  constructor(x = 0, y = 0, z = 0, w = 0) 
  {
    super(4);
    this.set(x, y, z, w);
  }

  set(x: number, y: number, z: number, w: number): this 
  {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  clone(): this 
  {
    return new Vec4(this.x, this.y, this.z, this.z) as this;
  }

  cross(other: this): this 
  {
    const {x, y, z} = this;
    const {x: ox, y: oy, z: oz} = other;

    this.x = y * oz - z * oy;
    this.y = z * ox - x * oz;
    this.z = x * oy - y * ox;
    this.w = 0;

    return this;
  }

  angleTo(other: this): number 
  {
    const dotProduct = this.dot(other);
    const magnitudeProduct = this.length() * other.length();
    return Math.acos(dotProduct / magnitudeProduct);
  }

  projectOnto(other: this): this 
  {
    const scalar = this.dot(other) / other.lengthSquared();
    this.x = scalar * other.x;
    this.y = scalar * other.y;
    this.z = scalar * other.z;
    this.w = scalar * other.w;
    return this;
  }

  reflectAcross(normal: this): this 
  {
    const dotProduct = this.dot(normal);
    this.x = this.x - 2 * dotProduct * normal.x;
    this.y = this.y - 2 * dotProduct * normal.y;
    this.z = this.z - 2 * dotProduct * normal.z;
    this.w = this.w - 2 * dotProduct * normal.w;
    return this;
  }

  swizzle(indices: Vec4Data): this 
  {
    const swizzledValues = indices.map(index => this.values[index] || 0) as Vec4Data;
    this.x = swizzledValues[0]!;
    this.y = swizzledValues[1]!;
    this.z = swizzledValues[2]!;
    this.w = swizzledValues[3]!;
    return this;
  }
  
  translate(dx: number, dy: number, dz: number, dw: number): this {
    this.x += dx;
    this.y += dy;
    this.z += dz;
    this.w += dw;
    return this;
  }

  rotateX(angle: number): this {
    const newY = this.y * Math.cos(angle) - this.z * Math.sin(angle);
    const newZ = this.y * Math.sin(angle) + this.z * Math.cos(angle);
    this.y = newY;
    this.z = newZ;
    return this;
  }

  rotateY(angle: number): this {
    const newX = this.z * Math.sin(angle) + this.x * Math.cos(angle);
    const newZ = this.z * Math.cos(angle) - this.x * Math.sin(angle);
    this.x = newX;
    this.z = newZ;
    return this;
  }

  rotateZ(angle: number): this {
    const newX = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const newY = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = newX;
    this.y = newY;
    return this;
  }

  rotateW(angle: number): this {
    const newX = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const newY = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = newX;
    this.y = newY;
    return this;
  }

  scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }

  // Additional methods specific to Vec4
  get x(): number 
  {
    return this.values[0]!;
  }

  set x(value: number) 
  {
    this.values[0] = value;
  }

  get y(): number 
  {
    return this.values[1]!;
  }

  set y(value: number) 
  {
    this.values[1] = value;
  }

  get z(): number 
  {
    return this.values[2]!;
  }

  set z(value: number) 
  {
    this.values[2] = value;
  }

  get w(): number 
  {
    return this.values[3]!;
  }

  set w(value: number) 
  {
    this.values[3] = value;
  }
}