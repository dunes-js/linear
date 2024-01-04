
import { Vec2 } from "./Vec2.js"
import { Vec3 } from "./Vec3.js"
import { Vec4 } from "./Vec4.js"

export function vec2(...params: ConstructorParameters<typeof Vec2>): Vec2
{
  return new Vec2(...params);
}

export function vec3(...params: ConstructorParameters<typeof Vec3>): Vec3
{
  return new Vec3(...params);
}

export function vec4(...params: ConstructorParameters<typeof Vec4>): Vec4
{
  return new Vec4(...params);
}

export { Vec2, Vec3, Vec4 }