import type { Line } from "./Line.js";
import type { Plane } from "./Plane.js";
import { Vec } from "./vector/Vec.js";

export abstract class AABB<T extends Vec> {
  min: T;
  max: T;

  constructor(minCorner: T, maxCorner: T) {
    this.min = minCorner;
    this.max = maxCorner;
  }

  // Abstract method to get the center of the AABB
  abstract getCenter(): T;

  // Abstract method to get the size (dimensions) of the AABB
  abstract getSize(): T;

  // Check if a point is inside the AABB
  containsPoint(point: T): boolean {
    for (let i = 0; i < point.length(); i++) {
      if (point.values[i]! < this.min.values[i]! || point.values[i]! > this.max.values[i]!) {
        return false;
      }
    }
    return true;
  }

  // Check if another AABB intersects with this AABB
  intersectsAABB(other: AABB<T>): boolean {
    for (let i = 0; i < this.min.length(); i++) {
      if (this.max.values[i]! < other.min.values[i]! || this.min.values[i]! > other.max.values[i]!) {
        return false;
      }
    }
    return true;
  }

  intersectsLine(line: Line<T>): boolean {
    const lineDirection = line.getDirection();
    const linePoint = line.getPointAt(0.5); // Use the midpoint of the line for testing

    const aabbCenter = this.getCenter();
    const aabbSize = this.getSize();
    const halfExtents = aabbSize.clone().multiplyScalar(0.5);

    // Get the vector from the AABB center to the line point
    const fromAABBtoLine = linePoint.clone().subtract(aabbCenter);

    // Check for intersection along each axis
    for (let i = 0; i < aabbCenter.length(); i++) {
      const axis = lineDirection.values[i]!;
      const distance = Math.abs(fromAABBtoLine.dotProduct(lineDirection));
      
      if (distance > halfExtents.values[i]! + 0.5) {
        return false;
      }
    }

    return true;
  }

  // Check if the AABB intersects with a plane
  intersectsPlane(plane: Plane<T>): boolean {
    const normal = plane.getNormal();
    const point = normal.clone().multiplyBy(this.max).add(normal.clone().multiplyBy(this.min)).multiplyScalar(0.5);

    const extents = this.max.clone().subtract(this.min).multiplyScalar(0.5);
    const r = extents.dotProduct(normal.abs());

    const distance = plane.calculateSignedDistanceToPoint(point);

    return Math.abs(distance) <= r;
  }
}
