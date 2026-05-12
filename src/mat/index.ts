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
			Array.from({ length: dim }, () => init)
		) as MatData<Dim>;
	}

	public null(): this
	{
		const ctor = this.constructor as new(arg: any) => this;
		return new ctor(0);
	}

	public identity(): this
	{
		for (let col = 0; col < this.dim; col++)
		{
			for (let row = 0; row < this.dim; row++)
			{
				this.array[col]![row] = col === row ? 1 : 0;
			}
		}

		return this;
	}

	public *[Symbol.iterator](): Iterator<number>
	{
		for (let col = 0; col < this.dim; col++)
		{
			for (let row = 0; row < this.dim; row++)
			{
				yield this.array[col]![row]!;
			}
		}
	}

	public data(): MatData<Dim>
	{
		return this.array.map(
			col => [...col] as VecData<Dim>
		) as MatData<Dim>;
	}

	public get(row: number, col: number): number
	{
		return this.array[col]![row]!;
	}

	public setAt(row: number, col: number, value: number): this
	{
		this.array[col]![row] = value;
		return this;
	}

	public set(mat: MatData<Dim>): this
	{
		for (let col = 0; col < this.dim; col++)
		{
			for (let row = 0; row < this.dim; row++)
			{
				this.array[col]![row] = mat[col]![row]!;
			}
		}

		return this;
	}

	public multiply(other: Mat<Dim>): this
	{
		const result = this.null();

		for (let col = 0; col < this.dim; col++)
		{
			for (let row = 0; row < this.dim; row++)
			{
				let sum = 0;

				for (let k = 0; k < this.dim; k++)
				{
					sum +=
						this.array[k]![row]! *
						other.array[col]![k]!;
				}

				result.array[col]![row] = sum;
			}
		}

		return result;
	}

	public toFloat32Array(): Float32Array
	{
		return new Float32Array([...this]);
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
		}
		else
		{
			super(4, 0);
			this.set(arg);
		}
	}

	public static translation(position: Vec3): Mat4
	{
		const [x, y, z] = position;

		return new Mat4([
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[x!, y!, z!, 1],
		]);
	}

	public static scale(scale: Vec3): Mat4
	{
		const [x, y, z] = scale;

		return new Mat4([
			[x!, 0, 0, 0],
			[0, y!, 0, 0],
			[0, 0, z!, 0],
			[0, 0, 0, 1],
		]);
	}

	public static rotation(angle: number, axis: Vec3): Mat4
	{
		const [x, y, z] = axis;

		const len = Math.hypot(x!, y!, z!);

		if (len === 0)
		{
			throw new Error("Zero-length axis");
		}

		const nx = x! / len;
		const ny = y! / len;
		const nz = z! / len;

		const c = Math.cos(angle);
		const s = Math.sin(angle);
		const t = 1 - c;

		return new Mat4([
			[
				t * nx * nx + c,
				t * nx * ny - s * nz,
				t * nx * nz + s * ny,
				0
			],
			[
				t * nx * ny + s * nz,
				t * ny * ny + c,
				t * ny * nz - s * nx,
				0
			],
			[
				t * nx * nz - s * ny,
				t * ny * nz + s * nx,
				t * nz * nz + c,
				0
			],
			[
				0,
				0,
				0,
				1
			]
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
		const lr = 1 / (right - left);
		const bt = 1 / (top - bottom);
		const nf = 1 / (far - near);

		return new Mat4([
			[
				2 * lr,
				0,
				0,
				0
			],
			[
				0,
				2 * bt,
				0,
				0
			],
			[
				0,
				0,
				-2 * nf,
				0
			],
			[
				-(right + left) * lr,
				-(top + bottom) * bt,
				-(far + near) * nf,
				1
			]
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

		const f = 1 / Math.tan(fovRad / 2);

		const nf = 1 / (near - far);

		return new Mat4([
			[
				f / aspect,
				0,
				0,
				0
			],
			[
				0,
				f,
				0,
				0
			],
			[
				0,
				0,
				(far + near) * nf,
				-1
			],
			[
				0,
				0,
				2 * far * near * nf,
				0
			]
		]);
	}
}