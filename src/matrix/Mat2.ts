import { Mat } from "./Mat.js";
import { Vec2 } from "../vector/Vec2.js";

export class Mat2 extends Mat<Vec2[]> {
  constructor() {
    super(2);
  }

  // Concrete implementation for filling the matrix with Vec2 instances
  fill(): Vec2 {
    return new Vec2();
  }

  // Concrete implementation for cloning Mat2
  clone(): this {
    const mat2 = new Mat2();
    for (let i = 0; i < this.values.length; i++) {
      mat2.values[i] = this.values[i]!.clone();
    }
    return mat2 as this;
  }

  // Concrete implementation for transposing Mat2
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

  // Concrete implementation for creating an identity Mat2
  identity(): this {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i]!.values[i] = 1;
    }
    return this;
  }

  // Concrete implementation for calculating the determinant of Mat2
  determinant(): number {
    return this.values[0]!.x * this.values[1]!.y - this.values[0]!.y * this.values[1]!.x;
  }

  // Concrete implementation for calculating the inverse of Mat2
  inverse(): this {
    const det = this.determinant();
    if (det === 0) {
      throw new Error("Matrix is not invertible.");
    }

    const invDet = 1 / det;

    const tempValues: number[][] = [
      [this.values[1]!.y * invDet, -this.values[0]!.y * invDet],
      [-this.values[1]!.x * invDet, this.values[0]!.x * invDet],
    ];

    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i]!.length(); j++) {
        this.values[i]!.values[j] = tempValues[i]![j]!;
      }
    }

    return this;
  }
}
