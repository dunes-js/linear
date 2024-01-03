import { Vec3 } from "./vector/Vec3.js";
import { Vec4 } from "./vector/Vec4.js";

export class Plane {
  normal: Vec3;
  distance: number;

  constructor(normal: Vec4) {
    this.normal = new Vec3(normal.x, normal.y, normal.z);
    this.distance = normal.w;
  }

  // Method to check if a point is in front of the plane
  isPointInFront(point: Vec3): boolean {
    return this.normal.dotProduct(point) + this.distance > 0;
  }

  // Method to check if a bounding box intersects with the plane
  intersectBoundingBox(min: Vec3, max: Vec3): boolean {
    const p = new Vec3();

    for (let i = 0; i < 3; i++) {
      if (this.normal.values[i] > 0) {
        p.values[i] = max.values[i];
      } else {
        p.values[i] = min.values[i];
      }
    }

    return this.normal.dotProduct(p) + this.distance >= 0;
  }
}