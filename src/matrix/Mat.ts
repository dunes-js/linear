import type { Vec } from "../vector/Vec.js";

export abstract class Mat<Dimension extends number, T extends Vec<Dimension>[]> implements Iterable<number> 
{
  protected values: T;

  constructor(readonly size: number) 
  {
    this.values = Array.from({ length: size }, () => this.fill()) as T;
  }

  abstract fill(): Vec<Dimension>;

  abstract clone(): this;
  abstract transpose(): this;
  abstract identity(): this;

  // Other operations
  abstract determinant(): number;
  abstract inverse(): this;

  // Symbol.iterator implementation
  *[Symbol.iterator](): Iterator<number> 
  {
    for (const value of this.data()) 
    {
      yield value;
    }
  }

  at(n: number): T[number] | null
  {
    return this.values[n] || null;
  }


  put(i: number, x: T[number]): this
  put(i: number, x: number, n: number): this
  put(i: number, x: number | T[number] = this.fill(), n = 0): this
  {
    if (typeof x == "number")
    {
      this.values[i]?.put(x, n);
    }
    else
    {
      this.values[i] = x;
    }
    return this;
  }

  data(): number[] 
  {
    return this.values.flatMap(vec => vec!.data());
  }


  // Methods for matrix operations
  addScalar(scalar: number): this 
  {
    for (let i = 0; i < this.size; i++) 
    {
      this.values[i]!.addScalar(scalar);
    }
    return this;
  }

  subtractScalar(scalar: number): this 
  {
    for (let i = 0; i < this.size; i++) 
    {
      this.values[i]!.subtractScalar(scalar);
    }
    return this;
  }

  multiplyScalar(scalar: number): this 
  {
    for (let i = 0; i < this.size; i++) 
    {
      this.values[i]!.multiplyScalar(scalar);
    }
    return this;
  }

  divideScalar(scalar: number): this 
  {
    for (let i = 0; i < this.size; i++) 
    {
      this.values[i]!.divideScalar(scalar);
    }
    return this;
  }

  // Delegated element-wise operations to Vec
  add(matrix: this): this 
  {
    for (let i = 0; i < this.size; i++) 
    {
      this.values[i]!.add(matrix.values[i]!);
    }
    return this;
  }

  subtract(matrix: this): this 
  {
    for (let i = 0; i < this.size; i++) 
    {
      this.values[i]!.subtract(matrix.values[i]!);
    }
    return this;
  }

  multiply(matrix: this): this 
  {
    for (let i = 0; i < this.size; i++) 
    {
      this.values[i]!.multiplyBy(matrix.values[i]!);
    }
    return this;
  }

  divide(matrix: this): this 
  {
    for (let i = 0; i < this.size; i++) 
    {
      this.values[i]!.divideBy(matrix.values[i]!);
    }
    return this;
  }

  lerp(target: this, alpha: number): this 
  {
    for (let i = 0; i < this.size; i++) 
    {
      this.values[i]!.lerp(target.values[i]!, alpha);
    }
    return this;
  }
}