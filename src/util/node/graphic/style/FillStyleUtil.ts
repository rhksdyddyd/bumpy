import Color from 'model/color/Color';
import FillBase from 'model/node/graphic/info/fill/FillBase';
import SolidFill from 'model/node/graphic/info/fill/SolidFill';
import { ColorType } from 'types/model/color/ColorTypes';

/**
 * 도형의 기본 채우기 fill을 생성합니다.
 *
 * @returns 도형의 기본 채우기 fill
 */
export function createDefaultFill(): FillBase {
  const color = new Color(ColorType.PRESET, 'dodgerblue');
  return new SolidFill(color);
}

/**
 * 도형의 기본 윤곽선 fill을 생성합니다.ㅣ
 *
 * @returns 도형의 기본 윤곽선 fill
 */
export function createDefaultStrokeFill(): FillBase {
  const color = new Color(ColorType.PRESET, 'darkslateblue');
  return new SolidFill(color);
}
