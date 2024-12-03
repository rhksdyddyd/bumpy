import { useTranslation } from 'react-i18next';
import { IImgResProps, ISvgData } from 'types/component/frame/control/resource/ImgResourceTypes';
import { ResourceEnum } from 'types/resource/ResourceEnum';

/**
 * svg image에 해당하는 resource 를 반환하는 hook 입니다.
 *
 * @param resourceId 찾고 싶은 svg image의 id
 * @returns id에 해당하는 resource 값
 */
export default function useImgRes(resourceId?: ResourceEnum): ISvgData | string {
  const { t } = useTranslation();
  const result = t(resourceId ?? '', { returnObjects: true });
  return isValidSvgData(result) ? result : '';
}

/**
 * i18n으로 받은 data가 svg로 사용할 수 있는 것인지 확인합니다.
 *
 * @param data 확인 할 data
 * @returns 사용할 수 있는 경우 true
 */
function isValidSvgData(data: unknown): data is ISvgData | string {
  return (
    typeof data === 'string' ||
    (typeof data === 'object' && data !== null && 'viewBox' in data && 'children' in data)
  );
}

/**
 * resource에 포함되어 있는 svg 정보를 dataurl로 변환하여 반환합니다.
 * mouse의 cursor로 설정할 수 있습니다.
 *
 * @param imgResProps image 정보를 담고 있는 props
 * @returns sring으로 변환 한 svg 정보 또는 undefined
 */
export function useImageResourceToDataURLString(imgResProps: IImgResProps): string | undefined {
  const { img } = imgResProps;
  const svgData = useImgRes(img);
  if (typeof svgData === 'string') {
    if (svgData.length === 0) {
      return undefined;
    }
    return `url(data:image/svg+xml;base64,${window.btoa(svgData)})`;
  }

  return convertSvgDataToString(imgResProps, svgData);
}

/**
 * svg data를 string으로 변환합니다.
 *
 * @param imgResProps image 정보를 담고 있는 props
 * @param svgData svg 정보
 * @returns string으로 변환 한 svg 정보
 */
function convertSvgDataToString(imgResProps: IImgResProps, svgData: ISvgData): string {
  if (svgData.children !== undefined) {
    const { width, height, fills } = imgResProps;
    const open = `url('data:image/svg+xml;utf8,<svg width="${width}" height="${height}" viewBox="${svgData.viewBox}" xmlns="http://www.w3.org/2000/svg">`;
    const accPath = svgData.children.reduce((acc, path, idx) => {
      if (fills !== undefined && fills[idx] !== undefined) {
        return `${acc}<path fill="${fills[idx]}" d="${path.d}"/>`;
      }
      return `${acc}<path d="${path.d}"/>`;
    }, '');
    const close = `</svg>') ${width} ${height}, pointer`;
    return open + accPath + close;
  }
  return '';
}
