import { Mat } from "./Mat.js";
import { Vec4 } from "../vector/Vec4.js";
import { Vec3 } from "../vector/Vec3.js";
import { Quaternion } from "../Quaternion.js";

export class Mat4 extends Mat<Vec4[]> {
  constructor() {
    super(4);
  }

  // Concrete implementation for filling the matrix with Vec4 instances
  fill(): Vec4 {
    return new Vec4();
  }

  // Concrete implementation for cloning Mat4
  clone(): this {
    const mat4 = new Mat4();
    for (let i = 0; i < this.values.length; i++) {
      mat4.values[i] = this.values[i]!.clone();
    }
    return mat4 as this;
  }
  
  // Getter for accessing the elements of the matrix as a flat array
  get elements(): number[] {
    const result: number[] = [];

    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i]!.length(); j++) {
        result.push(this.values[i]!.values[j]!);
      }
    }

    return result;
  }

  // Concrete implementation for transposing Mat4
  transpose(): this {
    const tempValues: number[][] = [];

    for (let i = 0; i < this.values.length; i++) {
      tempValues[i] = [];
      for (let j = 0; j < this.values[i]!.length(); j++) {
        tempValues[i]![j] = this.values[j]!.values[i]!;
      }
    }

    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i]!.length(); j++) {
        this.values[i]!.values[j] = tempValues[i]![j]!;
      }
    }

    return this;
  }

  // Concrete implementation for creating an identity Mat4
  identity(): this {
    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i]!.length(); j++) {
        this.values[i]!.values[j] = i === j ? 1 : 0;
      }
    }

    return this;
  }

  // Concrete implementation for calculating the determinant of Mat4
  determinant(): number {
    const a11 = this.values[0]!.x;
    const a12 = this.values[0]!.y;
    const a13 = this.values[0]!.z;
    const a14 = this.values[0]!.w;
    const a21 = this.values[1]!.x;
    const a22 = this.values[1]!.y;
    const a23 = this.values[1]!.z;
    const a24 = this.values[1]!.w;
    const a31 = this.values[2]!.x;
    const a32 = this.values[2]!.y;
    const a33 = this.values[2]!.z;
    const a34 = this.values[2]!.w;
    const a41 = this.values[3]!.x;
    const a42 = this.values[3]!.y;
    const a43 = this.values[3]!.z;
    const a44 = this.values[3]!.w;

    return (
      a11 * (a22 * a33 * a44 + a23 * a34 * a42 + a24 * a32 * a43 - a24 * a33 * a42 - a23 * a32 * a44 - a22 * a34 * a43) -
      a12 * (a21 * a33 * a44 + a23 * a34 * a41 + a24 * a31 * a43 - a24 * a33 * a41 - a23 * a31 * a44 - a21 * a34 * a43) +
      a13 * (a21 * a32 * a44 + a22 * a34 * a41 + a24 * a31 * a42 - a24 * a32 * a41 - a22 * a31 * a44 - a21 * a34 * a42) -
      a14 * (a21 * a32 * a43 + a22 * a33 * a41 + a23 * a31 * a42 - a23 * a32 * a41 - a22 * a31 * a43 - a21 * a33 * a42)
    );
  }

   // Concrete implementation for calculating the inverse of Mat4 using Gauss-Jordan elimination
  inverse(): this {
    const n = this.values.length;
    const augmentedMatrix = new Mat4();

    // Augment the matrix with the identity matrix
    for (let i = 0; i < n; i++) {
      augmentedMatrix.values[i] = this.values[i]!.clone();
      augmentedMatrix.values[i + n] = new Vec4().fromScalar(i === 0 ? 1 : 0);
    }

    // Apply Gauss-Jordan elimination
    for (let i = 0; i < n; i++) {
      // Find pivot row
      let pivotRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmentedMatrix.values[j]!.values[i]!) > Math.abs(augmentedMatrix.values[pivotRow]!.values[i]!)) {
          pivotRow = j;
        }
      }

      // Swap rows
      [augmentedMatrix.values[i]!, augmentedMatrix.values[pivotRow]!] = [
        augmentedMatrix.values[pivotRow]!,
        augmentedMatrix.values[i]!,
      ];

      // Scale pivot row
      const pivotValue = augmentedMatrix.values[i]!.values[i]!;
      augmentedMatrix.values[i]!.divideScalar(pivotValue);

      // Eliminate other rows
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          const factor = augmentedMatrix.values[j]!.values[i]!;
          augmentedMatrix.values[j]!.subtract(augmentedMatrix.values[i]!.clone().multiplyScalar(factor));
        }
      }
    }

    // Extract the inverse matrix from the augmented matrix
    for (let i = 0; i < n; i++) {
      this.values[i] = augmentedMatrix.values[i + n]!.clone();
    }

    return this;
  }

   // Concrete implementation for translating the Mat4 by a vector
  translate(translation: Vec3): this;
  // Overload for translating the Mat4 by individual components
  translate(x: number, y: number, z: number): this;
  translate(xOrTranslation: number | Vec3, y?: number, z?: number): this {
    if (xOrTranslation instanceof Vec3) {
      const translationMatrix = new Mat4().identity();

      translationMatrix.values[3]!.x = xOrTranslation.x;
      translationMatrix.values[3]!.y = xOrTranslation.y;
      translationMatrix.values[3]!.z = xOrTranslation.z;

      // Multiply the current matrix by the translation matrix
      this.multiply(translationMatrix);
    } else {
      const translationMatrix = new Mat4().identity();

      translationMatrix.values[3]!.x = xOrTranslation;
      translationMatrix.values[3]!.y = y!;
      translationMatrix.values[3]!.z = z!;

      // Multiply the current matrix by the translation matrix
      this.multiply(translationMatrix);
    }

    return this;
  }

  // Concrete implementation for rotating the Mat4 using a quaternion
  rotate(rotation: Quaternion): this;
  // Overload for rotating the Mat4 by an axis and an angle
  rotate(angle: number, axis: Vec3): this;
  rotate(arg1: number | Quaternion, arg2?: Vec3): this {
    if (arg1 instanceof Quaternion) {
      const rotationMatrix = new Mat4().identity();
      const { x, y, z, w } = arg1.normalize();

      const xx = x * x;
      const yy = y * y;
      const zz = z * z;
      const xy = x * y;
      const xz = x * z;
      const yz = y * z;
      const wx = w * x;
      const wy = w * y;
      const wz = w * z;

      rotationMatrix.values[0]!.x = 1 - 2 * (yy + zz);
      rotationMatrix.values[0]!.y = 2 * (xy - wz);
      rotationMatrix.values[0]!.z = 2 * (xz + wy);

      rotationMatrix.values[1]!.x = 2 * (xy + wz);
      rotationMatrix.values[1]!.y = 1 - 2 * (xx + zz);
      rotationMatrix.values[1]!.z = 2 * (yz - wx);

      rotationMatrix.values[2]!.x = 2 * (xz - wy);
      rotationMatrix.values[2]!.y = 2 * (yz + wx);
      rotationMatrix.values[2]!.z = 1 - 2 * (xx + yy);

      // Multiply the current matrix by the rotation matrix
      this.multiply(rotationMatrix);
    } else {
      const quaternion = new Quaternion().setFromAxisAngle(arg2!, arg1 as number);
      return this.rotate(quaternion);
    }

    return this;
  }

   // Concrete implementation for rotating the Mat4 around the X-axis
  rotateX(angle: number): this {
    const rotationMatrix = new Mat4().identity();
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    rotationMatrix.values[1]!.y = cosAngle;
    rotationMatrix.values[1]!.z = -sinAngle;
    rotationMatrix.values[2]!.y = sinAngle;
    rotationMatrix.values[2]!.z = cosAngle;

    // Multiply the current matrix by the rotation matrix
    this.multiply(rotationMatrix);

    return this;
  }

  // Concrete implementation for rotating the Mat4 around the Y-axis
  rotateY(angle: number): this {
    const rotationMatrix = new Mat4().identity();
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    rotationMatrix.values[0]!.x = cosAngle;
    rotationMatrix.values[0]!.z = sinAngle;
    rotationMatrix.values[2]!.x = -sinAngle;
    rotationMatrix.values[2]!.z = cosAngle;

    // Multiply the current matrix by the rotation matrix
    this.multiply(rotationMatrix);

    return this;
  }

  // Concrete implementation for rotating the Mat4 around the Z-axis
  rotateZ(angle: number): this {
    const rotationMatrix = new Mat4().identity();
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    rotationMatrix.values[0]!.x = cosAngle;
    rotationMatrix.values[0]!.y = -sinAngle;
    rotationMatrix.values[1]!.x = sinAngle;
    rotationMatrix.values[1]!.y = cosAngle;

    // Multiply the current matrix by the rotation matrix
    this.multiply(rotationMatrix);

    return this;
  }

  // Concrete implementation for scaling the Mat4 by individual components
  scale(x: number, y: number, z: number): this;
  // Concrete implementation for scaling the Mat4 by a vector
  scale(scaling: Vec3): this;
  scale(xOrScaling: number | Vec3, y?: number, z?: number): this {
    if (xOrScaling instanceof Vec3) {
      const scaleMatrix = new Mat4().identity();

      scaleMatrix.values[0]!.x = xOrScaling.x;
      scaleMatrix.values[1]!.y = xOrScaling.y;
      scaleMatrix.values[2]!.z = xOrScaling.z;

      // Multiply the current matrix by the scale matrix
      this.multiply(scaleMatrix);
    } else {
      const scaleMatrix = new Mat4().identity();

      scaleMatrix.values[0]!.x = xOrScaling;
      scaleMatrix.values[1]!.y = y!;
      scaleMatrix.values[2]!.z = z!;

      // Multiply the current matrix by the scale matrix
      this.multiply(scaleMatrix);
    }

    return this;
  }

  // Concrete implementation for creating a look-at view matrix
  lookAt(eye: Vec3, target: Vec3, up: Vec3 = new Vec3(0, 1, 0)): this {
    const zAxis = target.clone().subtract(eye).normalize();
    const xAxis = up.clone().crossProduct(zAxis).normalize();
    const yAxis = zAxis.clone().crossProduct(xAxis);

    this.values[0] = new Vec4(xAxis.x, yAxis.x, -zAxis.x, 0);
    this.values[1] = new Vec4(xAxis.y, yAxis.y, -zAxis.y, 0);
    this.values[2] = new Vec4(xAxis.z, yAxis.z, -zAxis.z, 0);
    this.values[3] = new Vec4(-xAxis.dotProduct(eye), -yAxis.dotProduct(eye), zAxis.dotProduct(eye), 1);

    return this;
  }

  // Concrete implementation for creating a perspective projection matrix
  perspective(fovY: number, aspect: number, near: number, far: number): this {
    const f = 1.0 / Math.tan(fovY / 2);
    const nf = 1.0 / (near - far);

    this.values[0] = new Vec4(f / aspect, 0, 0, 0);
    this.values[1] = new Vec4(0, f, 0, 0);
    this.values[2] = new Vec4(0, 0, (far + near) * nf, -1);
    this.values[3] = new Vec4(0, 0, 2 * far * near * nf, 0);

    return this;
  }

  // Concrete implementation for creating an orthographic projection matrix
  orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
    const lr = 1.0 / (left - right);
    const bt = 1.0 / (bottom - top);
    const nf = 1.0 / (near - far);

    this.values[0] = new Vec4(-2 * lr, 0, 0, 0);
    this.values[1] = new Vec4(0, -2 * bt, 0, 0);
    this.values[2] = new Vec4(0, 0, 2 * nf, 0);
    this.values[3] = new Vec4((left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1);

    return this;
  }
}
