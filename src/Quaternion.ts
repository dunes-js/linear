import { Vec3 } from "./vector/Vec3.js";
import { Mat4 } from "./matrix/Mat4.js";

export class Quaternion 
{
  #w: number;
  #x: number;
  #y: number;
  #z: number;

  constructor(w = 1, x = 0, y = 0, z = 0) 
  {
    this.#w = w;
    this.#x = x;
    this.#y = y;
    this.#z = z;
  }

  // Clone the quaternion
  clone(): Quaternion 
  {
    return new Quaternion(this.#w, this.#x, this.#y, this.#z);
  }

  // Calculate the magnitude (norm) of the quaternion
  magnitude(): number 
  {
    return Math.sqrt(this.#w * this.#w + this.#x * this.#x + this.#y * this.#y + this.#z * this.#z);
  }

  // Normalize the quaternion
  normalize(): this 
  {
    const mag = this.magnitude();
    if (mag !== 0) {
      this.#w /= mag;
      this.#x /= mag;
      this.#y /= mag;
      this.#z /= mag;
    }
    return this;
  }

  // Calculate the conjugate of the quaternion
  conjugate(): this 
  {
    this.#x = -this.#x;
    this.#y = -this.#y;
    this.#z = -this.#z;
    return this;
  }

  // Quaternion multiplication
  multiply(other: Quaternion): this 
  {
    const w = this.#w * other.#w - this.#x * other.#x - this.#y * other.#y - this.#z * other.#z;
    const x = this.#w * other.#x + this.#x * other.#w + this.#y * other.#z - this.#z * other.#y;
    const y = this.#w * other.#y - this.#x * other.#z + this.#y * other.#w + this.#z * other.#x;
    const z = this.#w * other.#z + this.#x * other.#y - this.#y * other.#x + this.#z * other.#w;

    this.#w = w;
    this.#x = x;
    this.#y = y;
    this.#z = z;

    return this;
  }


  // Dot product of two quaternions
  dot(other: Quaternion): number 
  {
    return this.#w * other.#w + this.#x * other.#x + this.#y * other.#y + this.#z * other.#z;
  }

  // Multiply quaternion by a scalar
  multiplyScalar(scalar: number): this 
  {
    this.#w *= scalar;
    this.#x *= scalar;
    this.#y *= scalar;
    this.#z *= scalar;
    return this;
  }

  // Rotate a vector using the quaternion
  rotateVector(v: Vec3): Vec3 
  {
    const quaternionVec = new Quaternion(0, v.x, v.y, v.z);
    const conjugate = this.clone().conjugate();
    const rotatedQuat = this.clone().multiply(quaternionVec).multiply(conjugate);

    return new Vec3(rotatedQuat.#x, rotatedQuat.#y, rotatedQuat.#z);
  }
  
  // Set the quaternion from an axis-angle representation
  setFromAxisAngle(axis: Vec3, angle: number): this 
  {
    const halfAngle = angle * 0.5;
    const sinHalfAngle = Math.sin(halfAngle);

    this.#w = Math.cos(halfAngle);
    this.#x = axis.x * sinHalfAngle;
    this.#y = axis.y * sinHalfAngle;
    this.#z = axis.z * sinHalfAngle;

    return this;
  }

  // Convert the quaternion to a 4x4 rotation matrix
  toRotationMatrix(): Mat4 
  {
    const { #w: w, #x: x, #y: y, #z: z } = this;

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


  setFromRotationMatrix(matrix: Mat4): this 
  {
    const m = matrix.data() as [
      number, number, number, number,
      number, number, number, number,
      number, number, number, number,
      number, number, number, number,
    ];

    const trace = m[0] + m[5] + m[10];

    if (trace > 0) 
    {
      const s = 0.5 / Math.sqrt(trace + 1.0);
      this.#w = 0.25 / s;
      this.#x = (m[6] - m[9]) * s;
      this.#y = (m[8] - m[2]) * s;
      this.#z = (m[1] - m[4]) * s;
    } 
    else if (m[0] > m[5] && m[0] > m[10]) 
    {
      const s = 2.0 * Math.sqrt(1.0 + m[0] - m[5] - m[10]);
      this.#w = (m[6] - m[9]) / s;
      this.#x = 0.25 * s;
      this.#y = (m[1] + m[4]) / s;
      this.#z = (m[8] + m[2]) / s;
    } 
    else if (m[5] > m[10]) 
    {
      const s = 2.0 * Math.sqrt(1.0 + m[5] - m[0] - m[10]);
      this.#w = (m[8] - m[2]) / s;
      this.#x = (m[1] + m[4]) / s;
      this.#y = 0.25 * s;
      this.#z = (m[6] + m[9]) / s;
    } 
    else 
    {
      const s = 2.0 * Math.sqrt(1.0 + m[10] - m[0] - m[5]);
      this.#w = (m[1] - m[4]) / s;
      this.#x = (m[8] + m[2]) / s;
      this.#y = (m[6] + m[9]) / s;
      this.#z = 0.25 * s;
    }

    return this;
  }  

  // Spherical linear interpolation
  slerp(target: Quaternion, alpha: number): this 
  {
    const dot = this.dot(target);
    const theta = Math.acos(dot);
    const sinTheta = Math.sin(theta);

    if (sinTheta !== 0) 
    {
      const factorA = Math.sin((1 - alpha) * theta) / sinTheta;
      const factorB = Math.sin(alpha * theta) / sinTheta;

      const result = this.clone();

      // Interpolating using slerp formula
      result.#w = factorA * this.#w + factorB * target.#w;
      result.#x = factorA * this.#x + factorB * target.#x;
      result.#y = factorA * this.#y + factorB * target.#y;
      result.#z = factorA * this.#z + factorB * target.#z;

      this.#w = result.#w;
      this.#x = result.#x;
      this.#y = result.#y;
      this.#z = result.#z;
    }

    return this;
  }

  // Getters and Setters for w, x, y, z
  get w(): number 
  {
    return this.#w;
  }

  set w(value: number) 
  {
    this.#w = value;
  }

  get x(): number 
  {
    return this.#x;
  }

  set x(value: number) 
  {
    this.#x = value;
  }

  get y(): number 
  {
    return this.#y;
  }

  set y(value: number) 
  {
    this.#y = value;
  }

  get z(): number 
  {
    return this.#z;
  }

  set z(value: number) 
  {
    this.#z = value;
  }
}
