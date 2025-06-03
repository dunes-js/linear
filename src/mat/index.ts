import type { Tuple } from "@dunes/tools";
import { Vec3, type VecData } from "../vec/index.js";

export type MatData<Dim extends number> = Tuple<VecData<Dim>, Dim>;

export type Mat2Data = MatData<2>;
export type Mat3Data = MatData<3>;
export type Mat4Data = MatData<4>;

class Mat<Dim extends number>
{
	protected array: MatData<Dim>;

	constructor(public readonly dim: Dim, init: number = 0)
	{
		this.array = Array.from({ length: dim }, () =>
			Array.from({ length: dim }, () => init) as VecData<Dim>
		) as MatData<Dim>;
	}

	public null(): this
	{
		const ctor = this.constructor as new (arg: any) => this;
		return new ctor(0);
	}

	public identity(): this
	{
		for (let i = 0; i < this.dim; i++)
			{
			for (let j = 0; j < this.dim; j++)
				{
				this.array[i]![j] = i === j ? 1 : 0;
			}
		}
		return this;
	}

	public *[Symbol.iterator](): Iterator<number>
	{
		for (let i = 0; i < this.dim; i++)
			{
			for (let j = 0; j < this.dim; j++)
				{
				yield this.array[i]![j]!;
			}
		}
	}

	public data(): MatData<Dim>
	{
		const copy = this.array.map(row => ([...row] as VecData<Dim>));
		return copy as MatData<Dim>;
	}

	public get(row: number, col: number): number {
		return this.array[row]![col]!;
	}

	public setAt(row: number, col: number, value: number): this
	{
		this.array[row]![col] = value;
		return this;
	}

	public set(mat: MatData<Dim>): this
	{
		for (let i = 0; i < this.dim; i++)
			{
			for (let j = 0; j < this.dim; j++)
				{
				this.array[i]![j] = mat[i]![j]!;
			}
		}
		return this;
	}

	public multiply(other: Mat<Dim>): this
	{
		const result = this.null();
		for (let i = 0; i < this.dim; i++)
			{
			for (let j = 0; j < this.dim; j++)
				{
				let sum = 0;
				for (let k = 0; k < this.dim; k++)
					{
					sum += this.array[i]![k]! * other.array[k]![j]!;
				}
				result.array[i]![j] = sum;
			}
		}
		return result;
	}
}

export class Mat4 extends Mat<4>
{
	constructor(init: number);
	constructor(mat: Mat4Data);
	constructor(arg: number | Mat4Data)
	{
		if (typeof arg === "number")
		{
			super(4, arg);
		} else {
			super(4, 0);
			this.set(arg);
		}
	}

	public static translation(position: Vec3): Mat4 {
		const [x, y, z] = position;
		return new Mat4(0).set([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[x!, y!, z!, 1],
		]);
	}

	public static rotation(angle: number, axis: Vec3): Mat4 {
		const [x, y, z] = axis;
		const len = Math.hypot(x!, y!, z!);
		if (len === 0) throw new Error("Zero-length axis");

		const nx = x! / len,
			ny = y! / len,
			nz = z! / len;
		const c = Math.cos(angle),
			s = Math.sin(angle),
			t = 1 - c;

		return new Mat4([
			[
				t * nx * nx + c,
				t * nx * ny + s * nz,
				t * nx * nz - s * ny,
				0,
			],
			[
				t * nx * ny - s * nz,
				t * ny * ny + c,
				t * ny * nz + s * nx,
				0,
			],
			[
				t * nx * nz + s * ny,
				t * ny * nz - s * nx,
				t * nz * nz + c,
				0,
			],
			[0, 0, 0, 1],
		]);
	}

	public static orthographic(
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number,
		far: number
	): Mat4
	{
		const lr = 1 / (left - right);
		const bt = 1 / (bottom - top);
		const nf = 1 / (near - far);

		return new Mat4(0).set([
			[-2 * lr, 0, 0, 0],
			[0, -2 * bt, 0, 0],
			[0, 0, 2 * nf, 0],
			[(left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1]
		]);
	}

	public static perspective(
		fovDeg: number,
		aspect: number,
		near: number,
		far: number
	): Mat4
	{
		const fovRad = (fovDeg * Math.PI) / 180;
		const f = 1.0 / Math.tan(fovRad / 2);
		const nf = 1 / (near - far);

		return new Mat4(0).set([
			[f / aspect, 0, 0, 0],
			[0, f, 0, 0],
			[0, 0, (far + near) * nf, -1],
			[0, 0, (2 * far * near) * nf, 0]
		]);
	}
}
