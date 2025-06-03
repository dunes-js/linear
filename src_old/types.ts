
export type Vec2Data = [
  number, number,
];

export type Vec3Data = [
  number, number, number,
];

export type Vec4Data = [
  number, number, number, number,
];

export type Mat2Data = [
  ...Vec2Data,
  ...Vec2Data,
];

export type Mat3Data = [
  ...Vec3Data,
  ...Vec3Data,
  ...Vec3Data,
];

export type Mat4Data = [
  ...Vec4Data,
  ...Vec4Data,
  ...Vec4Data,
  ...Vec4Data,
];