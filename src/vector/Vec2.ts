import { Vec } from './Vec.js';

export class Vec2 extends Vec<2> 
{
  constructor(x = 0, y = 0) 
  {
    super(2);
    this.set(x, y);
  }

  set(x: number, y: number): this 
  {
    this.x = x;
    this.y = y;
    return this;
  }

  clone(): this 
  {
    return new Vec2(this.x, this.y) as this;
  }

  cross(other: this): this 
  {
    const x = this.x;
    const y = this.y;
    const ox = other.x;
    const oy = other.y;

    this.x = x * oy - y * ox;
    this.y = y * ox - x * oy;

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
    return this;
  }

  reflectAcross(normal: this): this 
  {
    const dotProduct = this.dot(normal);
    this.x = this.x - 2 * dotProduct * normal.x;
    this.y = this.y - 2 * dotProduct * normal.y;
    return this;
  }

  swizzle(indices: number[]): this 
  {
    const swizzledValues = indices.map(index => this.values[index] || 0);
    this.x = swizzledValues[0]!;
    this.y = swizzledValues[1]!;
    return this;
  }

  translate(dx: number, dy: number): this {
    this.x += dx;
    this.y += dy;
    return this;
  }

  rotate(angle: number): this {
    const newX = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const newY = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = newX;
    this.y = newY;
    return this;
  }

  scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
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
}
