import { Vec3 } from "./vector/Vec3.js";
import { Vec4 } from "./vector/Vec4.js";

export class Plane 
{
  #normal = new Vec3();
  #distance = 0;

  constructor(normal?: Vec4) 
  {
    if (normal)
      this.set(normal);
  }

  set(normal: Vec4)
  {
    this.#normal.set(normal.x, normal.y, normal.z);
    this.#distance = normal.w;
  }

  isPointInFront(point: Vec3): boolean 
  {
    return this.#normal.dot(point) + this.#distance > 0;
  }

  intersectBoundingBox(min: Vec3, max: Vec3): boolean 
  {
    const p = new Vec3();

    for (let i = 0; i < 3; i++) 
    {
      if (this.#normal.at(i)! > 0) 
      {
        p.put(i, max.at(i)!);
      } 
      else 
      {
        p.put(i, min.at(i)!);
      }
    }

    return this.#normal.dot(p) + this.#distance >= 0;
  }

  get normal()
  {
    return this.#normal;
  }

  set normal(normal: Vec3)
  {
    this.#normal.set(normal.x, normal.y, normal.z);
  }

  get distance()
  {
    return this.#distance;
  }

  set distance(d: number)
  {
    this.#distance = d;
  }
}