import { Mat4 } from "./matrix/Mat4.js";
import { Vec3 } from "./vector/Vec3.js";
import { Quaternion } from "./Quaternion.js";

export class Camera 
{
  private position: Vec3;
  private rotation: Quaternion;
  private viewMatrix: Mat4;

  constructor(initialPosition: Vec3 = new Vec3(), initialRotation: Quaternion = new Quaternion()) 
  {
    this.position = initialPosition;
    this.rotation = initialRotation;
    this.viewMatrix = this.calculateViewMatrix();
  }

  // Getters and setters for position
  get x(): number 
  {
    return this.position.x;
  }

  set x(value: number) 
  {
    this.position.x = value;
    this.updateViewMatrix();
  }

  get y(): number 
  {
    return this.position.y;
  }

  set y(value: number) 
  {
    this.position.y = value;
    this.updateViewMatrix();
  }

  get z(): number 
  {
    return this.position.z;
  }

  set z(value: number) 
  {
    this.position.z = value;
    this.updateViewMatrix();
  }

  // Getters and setters for rotation
  get rotationW(): number 
  {
    return this.rotation.w;
  }

  set rotationW(value: number) 
  {
    this.rotation.w = value;
    this.updateViewMatrix();
  }

  get rotationX(): number 
  {
    return this.rotation.x;
  }

  set rotationX(value: number) 
  {
    this.rotation.x = value;
    this.updateViewMatrix();
  }

  get rotationY(): number 
  {
    return this.rotation.y;
  }

  set rotationY(value: number) 
  {
    // Ensure rotation around Y-axis does not go beyond the UP vector
    const maxYRotation = Math.PI / 2;
    this.rotation.y = Math.max(-maxYRotation, Math.min(maxYRotation, value));
    this.updateViewMatrix();
  }

  get rotationZ(): number 
  {
    return this.rotation.z;
  }

  set rotationZ(value: number) 
  {
    this.rotation.z = value;
    this.updateViewMatrix();
  }

  // Getters for view matrix
  getViewMatrix(): Mat4 
  {
    return this.viewMatrix;
  }

  // Move the camera forward along its local Z-axis
  moveForward(distance: number): void 
  {
    const forward = this.getForwardVector();
    this.position.add(forward.multiplyScalar(distance));
    this.updateViewMatrix();
  }

  // Move the camera backward along its local Z-axis
  moveBackward(distance: number): void 
  {
    this.moveForward(-distance);
  }

  // Rotate the camera around its local X-axis
  rotateX(angle: number): void 
  {
    const axis = new Vec3(1, 0, 0);
    const rotation = new Quaternion().setFromAxisAngle(axis, angle);
    this.rotation.multiply(rotation);
    this.updateViewMatrix();
  }

  // Rotate the camera around its local Y-axis
  rotateY(angle: number): void 
  {
    const axis = new Vec3(0, 1, 0);
    const rotation = new Quaternion().setFromAxisAngle(axis, angle);
    this.rotation.multiply(rotation);
    this.updateViewMatrix();
  }

  // Helper method to calculate the forward vector based on the current rotation
  private getForwardVector(): Vec3 {
    const forward = new Vec3(0, 0, -1);
    return this.rotation.rotateVector(forward);
  }

  // Helper method to update the view matrix based on current position and rotation
  private updateViewMatrix(): void 
  {
    this.viewMatrix = this.calculateViewMatrix();
  }

  // Helper method to calculate the view matrix based on position and rotation
  private calculateViewMatrix(): Mat4 
  {
    const translationMatrix = new Mat4().identity().translate(-this.position.x, -this.position.y, -this.position.z);
    const rotationMatrix = this.rotation.toRotationMatrix();
    return rotationMatrix.multiply(translationMatrix);
  }
}