import { Mat4 } from "./matrix/Mat4.js";
import { Plane } from "./Plane.js";
import { Vec4 } from "./vector/Vec4.js";
import { Vec3 } from "./vector/Vec3.js";

export class Frustum 
{
  #planes: Plane[] = [];

  constructor(projection: Mat4, view: Mat4) 
  {
    this.set(projection, view);
  }

  set(projection: Mat4, view: Mat4): void 
  {
    const clipMatrix = projection.clone().multiply(view.clone());

    // Right plane
    this.#planes[0].set(clipMatrix.at(0)!.subtract(clipMatrix.at(3)!));

    // Left plane
    this.#planes[1].set(clipMatrix.at(3)!.add(clipMatrix.at(0)!));

    // Bottom plane
    this.#planes[2].set(clipMatrix.at(3)!.add(clipMatrix.at(1)!));

    // Top plane
    this.#planes[3].set(clipMatrix.at(1)!.subtract(clipMatrix.at(3)!));

    // Far plane
    this.#planes[4].set(clipMatrix.at(3)!.subtract(clipMatrix.at(2)!));

    // Near plane
    this.#planes[5].set(clipMatrix.at(2)!.add(clipMatrix.at(3)!));
  }

  // Method to check if a point is inside the frustum
  pointInFrustum(point: Vec3): boolean 
  {
    for (const plane of this.#planes) 
    {
      if (!plane.isPointInFront(point)) 
      {
        return false;
      }
    }
    return true;
  }

  // Method to check if a bounding box intersects with the frustum
  boxIntersectsFrustum(min: Vec3, max: Vec3): boolean 
  {
    for (const plane of this.#planes) 
    {
      if (!plane.intersectBoundingBox(min, max)) 
      {
        return false;
      }
    }
    return true;
  }
}