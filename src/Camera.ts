import { Vec3 } from "./vector/Vec3.js";
import { Quaternion } from "./Quaternion.js";

export class Camera {
  private position: Vec3;
  private orientation: Quaternion;

  constructor(initialPosition: Vec3 = new Vec3(), initialOrientation: Quaternion = new Quaternion()) {
    this.position = initialPosition;
    this.orientation = initialOrientation;
  }

  // Move the camera forward (along the view direction)
  moveForward(distance: number): void {
    const forward = this.orientation.rotateVector(new Vec3(0, 0, -1)).normalize();
    this.position = this.position.add(forward.multiplyScalar(distance));
  }

  // Move the camera backward
  moveBackward(distance: number): void {
    this.moveForward(-distance);
  }

  // Move the camera to the right
  moveRight(distance: number): void {
    const right = this.orientation.rotateVector(new Vec3(1, 0, 0)).normalize();
    this.position = this.position.add(right.multiplyScalar(distance));
  }

  // Move the camera to the left
  moveLeft(distance: number): void {
    this.moveRight(-distance);
  }

  // Move the camera up
  moveUp(distance: number): void {
    const up = this.orientation.rotateVector(new Vec3(0, 1, 0)).normalize();
    this.position = this.position.add(up.multiplyScalar(distance));
  }

  // Move the camera down
  moveDown(distance: number): void {
    this.moveUp(-distance);
  }

  // Rotate the camera based on mouse movement
  rotate(mouseDeltaX: number, mouseDeltaY: number): void {
    const sensitivity = 0.002;

    const pitchQuat = new Quaternion().setFromAxisAngle(new Vec3(1, 0, 0), mouseDeltaY * sensitivity);
    const yawQuat = new Quaternion().setFromAxisAngle(new Vec3(0, 1, 0), mouseDeltaX * sensitivity);

    this.orientation = this.orientation.multiply(pitchQuat).multiply(yawQuat).normalize();
  }

  // Set the camera position
  setPosition(position: Vec3): void {
    this.position = position;
  }

  // Set the camera orientation
  setOrientation(orientation: Quaternion): void {
    this.orientation = orientation.normalize();
  }

  // Get the camera position
  getPosition(): Vec3 {
    return this.position;
  }

  // Get the camera orientation
  getOrientation(): Quaternion {
    return this.orientation;
  }
}
