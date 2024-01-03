import { Vec } from "./Vec.js";

export class Vec3 extends Vec {
  private _x: number;
  private _y: number;
  private _z: number;

  constructor(x = 0, y = 0, z = 0) {
    super(3);
    this._x = x;
    this._y = y;
    this._z = z;
  }

  // Getters and Setters for x, y, and z
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

  // Concrete implementation for swizzling in 3D
  swizzle(indices: number[]): this {
    if (indices.length !== 3) {
      throw new Error("Swizzle indices must be of length 3 for Vec3.");
    }

    const [index1, index2, index3] = indices;
    this._x = this.values[index1!]!;
    this._y = this.values[index2!]!;
    this._z = this.values[index3!]!;

    return this;
  }

  // Concrete implementation for converting to homogeneous coordinates
  toHomogeneous(): this {
    if (this.values.length === 3) {
      this.values.push(1);
    }
    return this;
  }

  // Concrete implementation for converting from homogeneous coordinates
  fromHomogeneous(): this {
    if (this.values.length === 4) {
      this._x /= this.values[3]!;
      this._y /= this.values[3]!;
      this._z /= this.values[3]!;
      this.values.pop();
    }
    return this;
  }

  // Concrete implementation for cloning Vec3
  clone(): this {
    return new Vec3(this._x, this._y, this._z) as this;
  }

  // Concrete implementation for creating a Vec3 from a scalar
  fromScalar(scalar: number): this {
    this._x = scalar;
    this._y = scalar;
    this._z = scalar;

    return this;
  }

  // Concrete implementation for 3D cross product
  crossProduct(other: Vec3): this {
    const result = this.clone();
    this._x = this._y * other.z - this._z * other.y;
    this._y = this._z * other.x - this._x * other.z;
    this._z = this._x * other.y - this._y * other.x;

    return result;
  }

  // Concrete implementation for the angle between two Vec3
  angleTo(other: Vec3): number {
    const dot = this.dotProduct(other as this);
    const magnitudeProduct = this.length() * other.length();

    if (magnitudeProduct === 0) {
      throw new Error("Cannot compute angle with zero-length vector.");
    }

    return Math.acos(Math.min(Math.max(dot / magnitudeProduct, -1), 1));
  }

  // Concrete implementation for projecting Vec3 onto another Vec3
  projectOnto(other: Vec3): this {
    const scalar = this.dotProduct(other as this) / other.lengthSquared();
    this._x = scalar * other.x;
    this._y = scalar * other.y;
    this._z = scalar * other.z;

    return this;
  }

  // Concrete implementation for reflecting Vec3 across a normal Vec3
  reflectAcross(normal: Vec3): this {
    const scalar = -2 * this.dotProduct(normal as this) / normal.lengthSquared();
    this._x += scalar * normal.x;
    this._y += scalar * normal.y;
    this._z += scalar * normal.z;

    return this;
  }

}
