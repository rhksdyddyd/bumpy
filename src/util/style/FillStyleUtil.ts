import Color from 'style/color/Color';
import { ColorType } from 'style/color/ColorTypes';
import FillBase from 'style/fill/FillBase';
import SolidFill from 'style/fill/SolidFill';

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

export default null;
