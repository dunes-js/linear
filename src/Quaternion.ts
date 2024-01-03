import { Vec3 } from "./vector/Vec3.js";

export class Quaternion {
  private _w: number;
  private _x: number;
  private _y: number;
  private _z: number;

  constructor(w = 1, x = 0, y = 0, z = 0) {
    this._w = w;
    this._x = x;
    this._y = y;
    this._z = z;
  }

  // Getters and Setters for w, x, y, z
  get w(): number {
    return this._w;
  }

  set w(value: number) {
    this._w = value;
  }

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

  // Clone the quaternion
  clone(): Quaternion {
    return new Quaternion(this._w, this._x, this._y, this._z);
  }

  // Calculate the magnitude (norm) of the quaternion
  magnitude(): number {
    return Math.sqrt(this._w * this._w + this._x * this._x + this._y * this._y + this._z * this._z);
  }

  // Normalize the quaternion
  normalize(): this {
    const mag = this.magnitude();
    if (mag !== 0) {
      this._w /= mag;
      this._x /= mag;
      this._y /= mag;
      this._z /= mag;
    }
    return this;
  }

  // Calculate the conjugate of the quaternion
  conjugate(): this {
    this._x = -this._x;
    this._y = -this._y;
    this._z = -this._z;
    return this;
  }

  // Quaternion multiplication
  multiply(other: Quaternion): this {
    const w = this._w * other._w - this._x * other._x - this._y * other._y - this._z * other._z;
    const x = this._w * other._x + this._x * other._w + this._y * other._z - this._z * other._y;
    const y = this._w * other._y - this._x * other._z + this._y * other._w + this._z * other._x;
    const z = this._w * other._z + this._x * other._y - this._y * other._x + this._z * other._w;

    this._w = w;
    this._x = x;
    this._y = y;
    this._z = z;

    return this;
  }

  // Rotate a vector using the quaternion
  rotateVector(v: Vec3): Vec3 {
    const quaternionVec = new Quaternion(0, v.x, v.y, v.z);
    const conjugate = this.clone().conjugate();
    const rotatedQuat = this.clone().multiply(quaternionVec).multiply(conjugate);

    return new Vec3(rotatedQuat.x, rotatedQuat.y, rotatedQuat.z);
  }
  
  // Set the quaternion from an axis-angle representation
  setFromAxisAngle(axis: Vec3, angle: number): this {
    const halfAngle = angle * 0.5;
    const sinHalfAngle = Math.sin(halfAngle);

    this._w = Math.cos(halfAngle);
    this._x = axis.x * sinHalfAngle;
    this._y = axis.y * sinHalfAngle;
    this._z = axis.z * sinHalfAngle;

    return this;
  }

  // Convert the quaternion to a 4x4 rotation matrix
  toRotationMatrix(): Mat4 {
    const { _w: w, _x: x, _y: y, _z: z } = this;

    const xx = x * x;
    const xy = x * y;
    const xz = x * z;
    const xw = x * w;

    const yy = y * y;
    const yz = y * z;
    const yw = y * w;

    const zz = z * z;
    const zw = z * w;

    return new Mat4(
      1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw), 0,
      2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw), 0,
      2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy), 0,
      0, 0, 0, 1
    );
  }
}
