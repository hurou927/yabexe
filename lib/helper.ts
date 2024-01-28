import {$, concatAll, contramap, getMonoid, N, Ord, S, Option as O } from "../deps.ts";

export interface YabaiQueryWindowFrameType {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface YabaiQueryWindowType {
  readonly id: number;
  readonly pid: number;
  readonly app: string;
  readonly title: string;
  readonly frame: YabaiQueryWindowFrameType;
  readonly role: string;
  readonly subrole: string;
  readonly "root-window": boolean;
  readonly display: number;
  readonly space: number;
  readonly level: number;
  readonly "sub-level": number;
  readonly layer: string;
  readonly "sub-layer": string;
  readonly opacity: number;
  readonly "split-type": string;
  readonly "split-child": string;
  readonly "stack-index": number;
  readonly "can-move": boolean;
  readonly "can-resize": boolean;
  readonly "has-focus": boolean;
  readonly "has-shadow": boolean;
  readonly "has-parent-zoom": boolean;
  readonly "has-fullscreen-zoom": boolean;
  readonly "is-native-fullscreen": boolean;
  readonly "is-visible": boolean;
  readonly "is-minimized": boolean;
  readonly "is-hidden": boolean;
  readonly "is-floating": boolean;
  readonly "is-sticky": boolean;
  readonly "is-grabbed": boolean;
}

export const ordByX = contramap((w: YabaiQueryWindowFrameType) => w.x)(N.Ord);
export const ordByY = contramap((w: YabaiQueryWindowFrameType) => w.y)(N.Ord);
export const ordByW = contramap((w: YabaiQueryWindowFrameType) => w.w)(N.Ord);
export const ordByH = contramap((w: YabaiQueryWindowFrameType) => w.h)(N.Ord);
export const M = getMonoid<YabaiQueryWindowFrameType>();
export const ordFrame = concatAll(M)([ordByX, ordByY, ordByW, ordByH]);

export const ordBySpace: Ord<YabaiQueryWindowType> = contramap((
  w: YabaiQueryWindowType,
) => w.space)(N.Ord);
export const ordByFrame: Ord<YabaiQueryWindowType> = contramap((
  w: YabaiQueryWindowType,
) => w.frame)(ordFrame);
export const ordByApp: Ord<YabaiQueryWindowType> = contramap((
  w: YabaiQueryWindowType,
) => w.app)(S.Ord);

export const isOpen = (w: YabaiQueryWindowType) => {
  return w["is-visible"] && !w["is-minimized"] && !w["is-hidden"];
};

export const isFocused = (w: YabaiQueryWindowType) => {
  return w["has-focus"];
};

const getForcusWindow = (windows: YabaiQueryWindowType[]) => {
  return O.fromNullable(windows.find(isFocused));
}
