import * as lin from "../src/index.js";

const vector = lin.vec3(0, 1, 0).cross(lin.vec3(0, 1, 0));

console.log(vector.constructor.name);


const projection = lin.Mat4.perspective(70, 1, 0.1, 100);

const eye = lin.vec3(0, 0, -1);
const target = lin.vec3();
const up = lin.vec3(0, 1, 0);

const view = lin.Mat4.lookAt(eye, target, up);

