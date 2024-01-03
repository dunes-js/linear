import { Mat } from "./Mat.js";
import { Vec3 } from "../vector/Vec3.js";

export class Mat3 extends Mat<Vec3[]> {
  constructor() {
    super(3);
  }

  // Concrete implementation for filling the matrix with Vec3 instances
  fill(): Vec3 {
    return new Vec3();
  }

  // Concrete implementation for cloning Mat3
  clone(): this {
    const mat3 = new Mat3();
    for (let i = 0; i < this.values.length; i++) {
      mat3.values[i] = this.values[i]!.clone();
    }
    return mat3 as this;
  }

  // Concrete implementation for transposing Mat3
  transpose(): this {
    const tempValues: number[][] = [];

    for (let i = 0; i < this.values.length; i++) {
      tempValues[i] = [];
      for (let j = 0; j < this.values[i]!.length(); j++) {
        tempValues[i]![j] = this.values[j]!.values[i]!;
      }
    }

    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i]!.length(); j++) {
        this.values[i]!.values[j] = tempValues[i]![j]!;
      }
    }

    return this;
  }

  // Concrete implementation for creating an identity Mat3
  identity(): this {
    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i]!.length(); j++) {
        this.values[i]!.values[j] = i === j ? 1 : 0;
      }
    }

    return this;
  }

  // Concrete implementation for calculating the determinant of Mat3
  determinant(): number {
    const a11 = this.values[0]!.x;
    const a12 = this.values[0]!.y;
    const a13 = this.values[0]!.z;
    const a21 = this.values[1]!.x;
    const a22 = this.values[1]!.y;
    const a23 = this.values[1]!.z;
    const a31 = this.values[2]!.x;
    const a32 = this.values[2]!.y;
    const a33 = this.values[2]!.z;

    return (
      a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31)
    );
  }

  // Concrete implementation for calculating the inverse of Mat3
  inverse(): this {
    const det = this.determinant();
    if (det === 0) {
      throw new Error("Matrix is not invertible.");
    }

    const invDet = 1 / det;

    const tempValues: number[][] = [
      [
        (this.values[1]!.y * this.values[2]!.z - this.values[1]!.z * this.values[2]!.y) * invDet,
        (this.values[0]!.z * this.values[2]!.y - this.values[0]!.y * this.values[2]!.z) * invDet,
        (this.values[0]!.y * this.values[1]!.z - this.values[0]!.z * this.values[1]!.y) * invDet,
      ],
      [
        (this.values[1]!.z * this.values[2]!.x - this.values[1]!.x * this.values[2]!.z) * invDet,
        (this.values[0]!.x * this.values[2]!.z - this.values[0]!.z * this.values[2]!.x) * invDet,
        (this.values[0]!.z * this.values[1]!.x - this.values[0]!.x * this.values[1]!.z) * invDet,
      ],
      [
        (this.values[1]!.x * this.values[2]!.y - this.values[1]!.y * this.values[2]!.x) * invDet,
        (this.values[0]!.y * this.values[2]!.x - this.values[0]!.x * this.values[2]!.y) * invDet,
        (this.values[0]!.x * this.values[1]!.y - this.values[0]!.y * this.values[1]!.x) * invDet,
      ],
    ];

    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i]!.length(); j++) {
        this.values[i]!.values[j] = tempValues[i]![j]!;
      }
    }

    return this;
  }
}
