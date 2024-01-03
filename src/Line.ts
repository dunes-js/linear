import type { AABB } from "./AABB.js";
import type { Plane } from "./Plane.js";
import { Vec } from "./vector/Vec.js";

export abstract class Line<T extends Vec> {
  protected point1: T;
  protected point2: T;

  constructor(point1: T, point2: T) {
    this.point1 = point1;
    this.point2 = point2;
  }

  // Abstract method to get the direction vector of the line
  abstract getDirection(): T;

  // Abstract method to get a point on the line given a parameter t
  abstract getPointAt(t: number): T;

  // Calculate the distance between a point and the line
  calculateDistanceToPoint(point: T): number {
    const direction = this.getDirection();
    const vectorToPoint = point.clone().subtract(this.point1);

    const crossProduct = direction.crossProduct(vectorToPoint);
    const distance = crossProduct.length() / direction.length();

    return distance;
  }

  intersectsAABB(aabb: AABB<T>): boolean {
    const aabbCenter = aabb.getCenter();
    const aabbSize = aabb.getSize();

    // Calculate half extents of the AABB
    const halfExtents = aabbSize.clone().multiplyScalar(0.5);

    // Calculate the vector from the line's point1 to the AABB's center
    const fromLineToPoint = aabbCenter.clone().subtract(this.point1);

    // Get the direction vector of the line
    const lineDirection = this.getDirection();

    // Check for intersection along each axis
    for (let i = 0; i < aabbCenter.length(); i++) {
      const axis = lineDirection.values[i]!;
      const distance = Math.abs(fromLineToPoint.dotProduct(lineDirection));
      
      if (distance > halfExtents.values[i]! + 0.5) {
        return false;
      }
    }

    return true;
  }

  // Check if the line intersects with a plane
  intersectsPlane(plane: Plane<T>): boolean {
    const distance1 = plane.calculateSignedDistanceToPoint(this.point1);
    const distance2 = plane.calculateSignedDistanceToPoint(this.point2);

    // If the two points are on opposite sides of the plane, the line intersects
    return (distance1 >= 0 && distance2 <= 0) || (distance1 <= 0 && distance2 >= 0);
  }
}
