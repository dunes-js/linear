import { Vec } from "./Vec.js";

export class Vec2 extends Vec {
  private _x: number;
  private _y: number;

  constructor(x = 0, y = 0) {
    super(2);
    this._x = x;
    this._y = y;
    this.updateValues();
  }

  private updateValues(): void {
    this.values[0] = this._x;
    this.values[1] = this._y;
  }

  // Getters and Setters for x and y
  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
    this.updateValues();
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
    this.updateValues();
  }

  // Concrete implementation for swizzling in 2D
  swizzle(indices: number[]): this {
    if (indices.length !== 2) {
      throw new Error("Swizzle indices must be of length 2 for Vec2.");
    }

    const [index1, index2] = indices;
    this._x = this.values[index1!]!;
    this._y = this.values[index2!]!;
    this.updateValues();

    return this;
  }

  // Concrete implementation for converting to homogeneous coordinates
  toHomogeneous(): this {
    return this; // No change for Vec2 in homogeneous coordinates
  }

  // Concrete implementation for converting from homogeneous coordinates
  fromHomogeneous(): this {
    return this; // No change for Vec2 from homogeneous coordinates
  }

  // Concrete implementation for cloning Vec2
  clone(): this {
    return new Vec2(this._x, this._y) as this;
  }

  // Concrete implementation for creating a Vec2 from a scalar
  fromScalar(scalar: number): this {
    this._x = scalar;
    this._y = scalar;
    this.updateValues();
    return this;
  }

  // Concrete implementation for 2D cross product
  crossProduct(other: Vec2): this {
    const result = this.clone();
    this._x = this._x * other._y - this._y * other._x;
    this._y = this._y * other._x - this._x * other._y;
    this.updateValues();
    return result;
  }

  // Concrete implementation for angle between two Vec2
  angleTo(other: Vec2): number {
    const dot = this.dotProduct(other as this);
    const magnitudeProduct = this.length() * other.length();

    if (magnitudeProduct === 0) {
      throw new Error("Cannot compute angle with zero-length vector.");
    }

    return Math.acos(Math.min(Math.max(dot / magnitudeProduct, -1), 1));
  }

  // Concrete implementation for projecting Vec2 onto another Vec2
  projectOnto(other: Vec2): this {
    const scalar = this.dotProduct(other as this) / other.lengthSquared();
    this._x = scalar * other._x;
    this._y = scalar * other._y;
    this.updateValues();
    return this;
  }

  // Concrete implementation for reflecting Vec2 across a normal Vec2
  reflectAcross(normal: Vec2): this {
    const scalar = -2 * this.dotProduct(normal as this) / normal.lengthSquared();
    this._x += scalar * normal._x;
    this._y += scalar * normal._y;
    this.updateValues();
    return this;
  }
}
