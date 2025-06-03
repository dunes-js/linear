import type { Tuple } from "@dunes/tools";

export type VecData<Dim extends number> = Tuple<number, Dim>;

export type Vec2Data = VecData<2>;
export type Vec3Data = VecData<3>;
export type Vec4Data = VecData<4>;

abstract class Vec<Dim extends number>
{
	protected array: VecData<Dim>;

	constructor(public readonly dim: Dim, init = 0)
	{
		this.array = Array.from({ length: dim }, () => init) as VecData<Dim>;
	}

	public null(): this
	{
		return this.constructor(this.dim, 0);
	}

	public identity(): this
	{
		return this.constructor(this.dim, 1);
	}

	public *[Symbol.iterator](): Iterator<number>
	{
		yield* this.array;
	}

	public data(): VecData<Dim>
	{
		return [...this.array] as VecData<Dim>;
	}

	public get(i: number): number
	{
		return this.array[i]!;
	}

	public set_at(i: number, value: number): this
	{
		this.array[i] = value;
		return this;
	}

	public set(vec: VecData<Dim>): this
	{
		for (let i = 0; i < this.dim; i++)
		{
			this.array[i] = vec[i]!;
		}
		
		return this;
	}

	public add(other: this): this
	{
		const result = this.null();

		for (let i = 0; i < this.dim; i++)
		{
			result.array[i]! = this.array[i]! + other.array[i]!;
		}

		return result;
	}

	public subtract(other: this): this
	{
		const result = this.null();

		for (let i = 0; i < this.dim; i++)
		{
			result.array[i]! = this.array[i]! - other.array[i]!;
		}

		return result;
	}

	public add_scalar(scalar: number): this
	{
		const result = this.null();

		for (let i = 0; i < this.dim; i++)
		{
			result.array[i]! = this.array[i]! + scalar;
		}

		return result;
	}

	public subtract_scalar(scalar: number): this
	{
		const result = this.null();

		for (let i = 0; i < this.dim; i++)
		{
			result.array[i]! = this.array[i]! - scalar;
		}

		return result;
	}

	public divide_scalar(scalar: number): this
	{
		const result = this.null();

		for (let i = 0; i < this.dim; i++)
		{
			result.array[i]! = this.array[i]! / scalar;
		}

		return result;
	}

	public multiply_scalar(scalar: number): this
	{
		const result = this.null();

		for (let i = 0; i < this.dim; i++)
		{
			result.array[i]! = this.array[i]! * scalar;
		}

		return result;
	}

	public modulo_scalar(scalar: number): this
	{
		const result = this.null();

		for (let i = 0; i < this.dim; i++)
		{
			result.array[i]! = this.array[i]! % scalar;
		}

		return result;
	}
	
  public dot(other: this): number
  {
    let result = 0;
    
    for (let i = 0; i < this.dim; i++)
    {
      result += this.array[i]! * other.array[i]!;
    }

    return result;
  }

  public normalize(): this
  {
    return this.divide_scalar(this.magnitude());
  }

  public magnitude(): number
  {
    return Math.sqrt(this.magnitude_sq());
  }

  public magnitude_sq(): number
  {
    return this.dot(this);
  }

  public angle(other: this): number
  {
    return Math.acos(this.dot(other) / (this.magnitude() * other.magnitude()));
  }

  public distance(other: this) : number
  {
    return other.subtract(this).magnitude();
  }
  
  public project(other: this): this
  {
    let dot_product = this.dot(other);
    let other_magnitude_sq = other.magnitude_sq();
    
    if (other_magnitude_sq == 0) 
      return this.null();

    return other.multiply_scalar(dot_product / other_magnitude_sq);
  }

  negate(): this
  {
    for (let i = 0; i < this.dim; i++) 
    {
      this.array[i] = -this.array[i]!;
    }
    return this;
  }

  abs(): this 
  {
    for (let i = 0; i < this.dim; i++) 
    {
      this.array[i] = Math.abs(this.array[i]!);
    }
    return this;
  }

  round(): this
  {
    for (let i = 0; i < this.dim; i++) 
    {
      this.array[i] = Math.round(this.array[i]!);
    }
    return this;
  }

  floor(): this
  {
    for (let i = 0; i < this.dim; i++) 
    {
      this.array[i] = Math.floor(this.array[i]!);
    }
    return this;
  }

  ceil(): this
  {
    for (let i = 0; i < this.dim; i++) 
    {
      this.array[i] = Math.ceil(this.array[i]!);
    }
    return this;
  }

  trunc(): this
  {
    for (let i = 0; i < this.dim; i++) 
    {
      this.array[i] = Math.trunc(this.array[i]!);
    }
    return this;
  }
}

export class Vec2 extends Vec<2>
{
	constructor(init: number)
	constructor(vec: Vec2Data)
	constructor(init: number | Vec2Data)
	{
		if (typeof(init) == "number")
			super(2, init);
		else
		{
			super(2)
			this.set(init);
		}
	}

	get x(): number
	{
		return this.array[0]!;
	}

	get y(): number
	{
		return this.array[1]!;
	}

	set x(value: number)
	{
		this.array[0] = value;
	}

	set y(value: number)
	{
		this.array[1] = value;
	}
}

export class Vec3 extends Vec<3>
{
	constructor(init: number)
	constructor(vec: Vec3Data)
	constructor(init: number | Vec3Data)
	{
		if (typeof(init) == "number")
			super(3, init);
		else
		{
			super(3)
			this.set(init);
		}
	}

	get x(): number
	{
		return this.array[0]!;
	}

	get y(): number
	{
		return this.array[1]!;
	}

	get z(): number
	{
		return this.array[2]!;
	}

	get r(): number
	{
		return this.array[0]!;
	}

	get g(): number
	{
		return this.array[1]!;
	}

	get b(): number
	{
		return this.array[2]!;
	}

	set x(value: number)
	{
		this.array[0] = value;
	}

	set y(value: number)
	{
		this.array[1] = value;
	}

	set z(value: number)
	{
		this.array[2] = value;
	}

	set r(value: number)
	{
		this.array[0] = value;
	}

	set g(value: number)
	{
		this.array[1] = value;
	}

	set b(value: number)
	{
		this.array[2] = value;
	}

	public cross(other: Vec3)
	{
    return new Vec3(0).set([
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    ]);
	}
}

export class Vec4 extends Vec<4>
{
	constructor(init: number)
	constructor(vec: Vec4Data)
	constructor(init: number | Vec4Data)
	{
		if (typeof(init) == "number")
			super(4, init);
		else
		{
			super(4)
			this.set(init);
		}
	}

	get x(): number
	{
		return this.array[0]!;
	}

	get y(): number
	{
		return this.array[1]!;
	}

	get z(): number
	{
		return this.array[2]!;
	}

	get w(): number
	{
		return this.array[3]!;
	}

	get r(): number
	{
		return this.array[0]!;
	}

	get g(): number
	{
		return this.array[1]!;
	}

	get b(): number
	{
		return this.array[2]!;
	}

	get a(): number
	{
		return this.array[3]!;
	}

	set x(value: number)
	{
		this.array[0] = value;
	}

	set y(value: number)
	{
		this.array[1] = value;
	}

	set z(value: number)
	{
		this.array[2] = value;
	}

	set w(value: number)
	{
		this.array[3] = value;
	}

	set r(value: number)
	{
		this.array[0] = value;
	}

	set g(value: number)
	{
		this.array[1] = value;
	}

	set b(value: number)
	{
		this.array[2] = value;
	}

	set a(value: number)
	{
		this.array[3] = value;
	}
}