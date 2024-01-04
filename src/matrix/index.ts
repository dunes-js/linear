
import { Mat2 } from "./Mat2.js"
import { Mat3 } from "./Mat3.js"
import { Mat4 } from "./Mat4.js"

export function mat2(...params: ConstructorParameters<typeof Mat2>): Mat2
{
  return new Mat2(...params);
}

export function mat3(...params: ConstructorParameters<typeof Mat3>): Mat3
{
  return new Mat3(...params);
}

export function mat4(...params: ConstructorParameters<typeof Mat4>): Mat4
{
  return new Mat4(...params);
}

export { Mat2, Mat3, Mat4 }
