
export abstract class Vec implements Iterable<number> {
  values: number[];

  // Symbol.iterator implementation
  *[Symbol.iterator](): Iterator<number> {
    for (const value of this.values) {
      yield value;
    }
  }

  constructor(length: number) {
    this.values = Array.from({ length }, () => 0);
  }

  // Swizzling
  abstract swizzle(indices: number[]): this;

  // Conversion methods
  abstract toHomogeneous(): this;
  abstract fromHomogeneous(): this;
  
  abstract clone(): this;

  // Helper method to create a this with a scalar value
  abstract fromScalar(scalar: number): this;

  // Other operations
  abstract crossProduct(other: this): this;
  abstract angleTo(other: this): number;
  abstract projectOnto(other: this): this;
  abstract reflectAcross(normal: this): this;

  // Delegated array methods
  add(other: this): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] += other.values[i]!;
    }
    return this;
  }

  subtract(other: this): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] -= other.values[i]!;
    }
    return this;
  }

  multiplyBy(vector: this): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] *= vector.values[i]!;
    }
    return this;
  }

  divideBy(vector: this): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] /= vector.values[i]!;
    }
    return this;
  }

  addScalar(scalar: number): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] += scalar;
    }
    return this;
  }

  subtractScalar(scalar: number): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] -= scalar;
    }
    return this;
  }

  multiplyScalar(scalar: number): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] *= scalar;
    }
    return this;
  }

  divideScalar(scalar: number): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] /= scalar;
    }
    return this;
  }

  dotProduct(other: this): number {
    let result = 0;
    for (let i = 0; i < this.length(); i++) {
      result += this.values[i]! * other.values[i]!;
    }
    return result;
  }

  lengthSquared(): number {
    let result = 0;
    for (const value of this) {
      result += value * value;
    }
    return result;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  normalize(): this {
    const len = this.length();
    if (len !== 0) {
      for (let i = 0; i < this.length(); i++) {
        this.values[i] /= len;
      }
    }
    return this;
  }

  // Interpolation methods
  lerp(target: this, alpha: number): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] += (target.values[i]! - this.values[i]!) * alpha;
    }
    return this;
  } 

  // Spherical linear interpolation with default implementation
  slerp(target: this, alpha: number): this {
    const dot = this.dotProduct(target);
    const theta = Math.acos(dot);
    const sinTheta = Math.sin(theta);

    if (sinTheta === 0) {
      // If sin(theta) is zero, the vectors are collinear.
      // Use linear interpolation instead of slerp to avoid division by zero.
      return this.lerp(target, alpha);
    }

    const factorA = Math.sin((1 - alpha) * theta) / sinTheta;
    const factorB = Math.sin(alpha * theta) / sinTheta;

    const result = this.clone();

    // Interpolating using slerp formula
    for (let i = 0; i < this.length(); i++) {
      result.values[i] = factorA * this.values[i]! + factorB * target.values[i]!;
    }

    return result;
  }

  // Element-wise operations
  abs(): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] = Math.abs(this.values[i]!);
    }
    return this;
  }

  negate(): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] = -this.values[i]!;
    }
    return this;
  }

  round(): this {
    for (let i = 0; i < this.length(); i++) {
      this.values[i] = Math.round(this.values[i]!);
    }
    return this;
  }
}