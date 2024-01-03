import { Vec2 } from "../src/vector/Vec2.js";





const vec2 = new Vec2(0, 1);

const r = vec2.crossProduct(new Vec2(0, 1))

console.log(r.constructor.name);