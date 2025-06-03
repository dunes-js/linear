
export * from "./mat/index.js"
export * from "./vec/index.js"

export function radians(degrees: number): number
{
	return degrees * (Math.PI / 180.0);
}

export function degrees(radians: number): number
{
	return radians * (180.0 / Math.PI);
}