import { Vec } from "./Vec.js";

export class Vec4 extends Vec {
  private _x: number;
  private _y: number;
  private _z: number;
  private _w: number;

  constructor(x = 0, y = 0, z = 0, w = 0) {
    super(4);
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  // Getters and Setters for x, y, z, and w
  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get z(): number {
    return this._z;
  }

  set z(value: number) {
    this._z = value;
  }

  get w(): number {
    return this._w;
  }

  set w(value: number) {
    this._w = value;
  }

  // Concrete implementation for swizzling in 4D
  swizzle(indices: number[]): this {
    if (indices.length !== 4) {
      throw new Error("Swizzle indices must be of length 4 for Vec4.");
    }

    const [index1, index2, index3, index4] = indices;
    this._x = this.values[index1!]!;
    this._y = this.values[index2!]!;
    this._z = this.values[index3!]!;
    this._w = this.values[index4!]!;

    return this;
  }

  // Concrete implementation for converting to homogeneous coordinates
  toHomogeneous(): this {
    if (this.values.length === 4) {
      this.values.push(1);
    }
    return this;
  }

  // Concrete implementation for converting from homogeneous coordinates
  fromHomogeneous(): this {
    if (this.values.length === 5) {
      this._x /= this.values[4]!;
      this._y /= this.values[4]!;
      this._z /= this.values[4]!;
      this._w /= this.values[4]!;
      this.values.pop();
    }
    return this;
  }

  // Concrete implementation for cloning Vec4
  clone(): this {
    return new Vec4(this._x, this._y, this._z, this._w) as this;
  }

  // Concrete implementation for creating a Vec4 from a scalar
  fromScalar(scalar: number): this {
    this._x = scalar;
    this._y = scalar;
    this._z = scalar;
    this._w = scalar;

    return this;
  }

  // Concrete implementation for 4D cross product
  crossProduct(other: Vec4): this {
    const result = this.clone();
    this._x = this._y * other.z * other.w - this._z * other.y * other.w + this._w * other.y * other.z;
    this._y = -this._x * other.z * other.w + this._z * other.x * other.w - this._w * other.x * other.z;
    this._z = this._x * other.y * other.w - this._y * other.x * other.w + this._w * other.x * other.y;
    this._w = -this._x * other.y * other.z + this._y * other.x * other.z - this._z * other.x * other.y;

    return result;
  }

  // Concrete implementation for the angle between two Vec4
  angleTo(other: Vec4): number {
    const dot = this.dotProduct(other as this);
    const magnitudeProduct = this.length() * other.length();

    if (magnitudeProduct === 0) {
      throw new Error("Cannot compute angle with zero-length vector.");
    }

    return Math.acos(Math.min(Math.max(dot / magnitudeProduct, -1), 1));
  }

  // Concrete implementation for projecting Vec4 onto another Vec4
  projectOnto(other: Vec4): this {
    const scalar = this.dotProduct(other as this) / other.lengthSquared();
    this._x = scalar * other.x;
    this._y = scalar * other.y;
    this._z = scalar * other.z;
    this._w = scalar * other.w;

    return this;
  }

  // Concrete implementation for reflecting Vec4 across a normal Vec4
  reflectAcross(normal: Vec4): this {
    const scalar = -2 * this.dotProduct(normal as this) / normal.lengthSquared();
    this._x += scalar * normal.x;
    this._y += scalar * normal.y;
    this._z += scalar * normal.z;
    this._w += scalar * normal.w;

    return this;
  }

}
