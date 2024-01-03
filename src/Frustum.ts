import { Mat4 } from "./matrix/Mat4.js";
import { Plane } from "./Plane.js";
import { Vec4 } from "./vector/Vec4.js";
import { Vec3 } from "./vector/Vec3.js";

export class Frustum {
  private planes: Plane[] = [];

  constructor(projectionMatrix: Mat4, viewMatrix: Mat4) {
    this.calculateFrustum(projectionMatrix, viewMatrix);
  }

  private calculateFrustum(projectionMatrix: Mat4, viewMatrix: Mat4): void {
    const clipMatrix = projectionMatrix.clone().multiply(viewMatrix.clone());

    // Right plane
    this.planes[0] = this.extractPlane(clipMatrix.values[0]!.subtract(clipMatrix.values[3]!));

    // Left plane
    this.planes[1] = this.extractPlane(clipMatrix.values[3]!.add(clipMatrix.values[0]!));

    // Bottom plane
    this.planes[2] = this.extractPlane(clipMatrix.values[3]!.add(clipMatrix.values[1]!));

    // Top plane
    this.planes[3] = this.extractPlane(clipMatrix.values[1]!.subtract(clipMatrix.values[3]!));

    // Far plane
    this.planes[4] = this.extractPlane(clipMatrix.values[3]!.subtract(clipMatrix.values[2]!));

    // Near plane
    this.planes[5] = this.extractPlane(clipMatrix.values[2]!.add(clipMatrix.values[3]!));
  }

  private extractPlane(row: Vec4): Plane {
    return new Plane(row);
  }

  // Method to check if a point is inside the frustum
  pointInFrustum(point: Vec3): boolean {
    for (const plane of this.planes) {
      if (!plane.isPointInFront(point)) {
        return false;
      }
    }
    return true;
  }

  // Method to check if a bounding box intersects with the frustum
  boxIntersectsFrustum(min: Vec3, max: Vec3): boolean {
    for (const plane of this.planes) {
      if (!plane.intersectBoundingBox(min, max)) {
        return false;
      }
    }
    return true;
  }
}