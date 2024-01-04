import { Vec } from './Vec.js';

export class Vec3 extends Vec<3> 
{
  constructor(x = 0, y = 0, z = 0) 
  {
    super(3);
    this.set(x, y, z);
  }

  set(x: number, y: number, z: number): this 
  {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  clone(): this 
  {
    return new Vec3(this.x, this.y, this.z) as this;
  }

  cross(other: this): this 
  {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const ox = other.x;
    const oy = other.y;
    const oz = other.z;

    this.x = y * oz - z * oy;
    this.y = z * ox - x * oz;
    this.z = x * oy - y * ox;

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
    return this;
  }

  reflectAcross(normal: this): this 
  {
    const dotProduct = this.dot(normal);
    this.x = this.x - 2 * dotProduct * normal.x;
    this.y = this.y - 2 * dotProduct * normal.y;
    this.z = this.z - 2 * dotProduct * normal.z;
    return this;
  }

  swizzle(indices: number[]): this 
  {
    const swizzledValues = indices.map(index => this.values[index] || 0);
    this.x = swizzledValues[0]!;
    this.y = swizzledValues[1]!;
    this.z = swizzledValues[2]!;
    return this;
  }

  translate(dx: number, dy: number, dz: number): this {
    this.x += dx;
    this.y += dy;
    this.z += dz;
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

  scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

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
}
