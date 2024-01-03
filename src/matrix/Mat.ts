import type { Vec } from "../vector/Vec.js";

export abstract class Mat<T extends Vec[]> {
  public values: T;

  constructor(rows: number) {
    this.values = Array.from({ length: rows }, () => this.fill()) as T;
  }

  abstract fill(): Vec;

  abstract clone(): Mat<T>;
  abstract transpose(): Mat<T>;
  abstract identity(): Mat<T>;

  // Other operations
  abstract determinant(): number;
  abstract inverse(): Mat<T>;

  // Methods for matrix operations
  addScalar(scalar: number): Mat<T> {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i]!.addScalar(scalar);
    }
    return this;
  }

  subtractScalar(scalar: number): Mat<T> {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i]!.subtractScalar(scalar);
    }
    return this;
  }

  multiplyScalar(scalar: number): Mat<T> {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i]!.multiplyScalar(scalar);
    }
    return this;
  }

  divideScalar(scalar: number): Mat<T> {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i]!.divideScalar(scalar);
    }
    return this;
  }

  // Delegated element-wise operations to Vec
  add(matrix: Mat<T>): Mat<T> {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i]!.add(matrix.values[i]!);
    }
    return this;
  }

  subtract(matrix: Mat<T>): Mat<T> {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i]!.subtract(matrix.values[i]!);
    }
    return this;
  }

  multiply(matrix: Mat<T>): Mat<T> {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i]!.multiplyBy(matrix.values[i]!);
    }
    return this;
  }

  divide(matrix: Mat<T>): Mat<T> {
    for (let i = 0; i < this.values.length; i++) {
      this.values[i]!.divideBy(matrix.values[i]!);
    }
    return this;
  }
}