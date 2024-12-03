import SVGComponent from 'component/frame/control/resource/SVGComponent';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  IImgResProps,
  IPathProps,
  ISvgData,
} from 'types/component/frame/control/resource/ImgResourceTypes';

/**
 * 주어진 ImgResComponent props를 바탕으로 svg를 생성하여 반합니다.
 *
 * @param param0 IImgResProps image 정보를 담고 있는 props
 */
const ImgResComponent = ({ img, style, width, height }: IImgResProps): React.JSX.Element => {
  const { t } = useTranslation();

  const imageData: unknown = t(img ?? '', { returnObjects: true });

  if (imageData === undefined) {
    return <></>;
  }

  // svg 일 경우
  if (isValidSvgData(imageData)) {
    return (
      <svg style={style} viewBox={imageData.viewBox} width={width} height={height}>
        {imageData.children.map((child: IPathProps, index: number) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <path className={child.className} d={child.d} key={`${child.d.toString()}_${index}`} />
          );
        })}
      </svg>
    );
  }
  return <SVGComponent img={img} width={width} height={height} style={style} />;
};

/**
 * i18n을 통하여 받은 data가 valid한 svg 정보인지 확인합니다.
 *
 * @param data 검사 할 svg 정보
 * @returns data가 올바른지에 대한 여부
 */
function isValidSvgData(data: unknown): data is ISvgData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'viewBox' in data &&
    'children' in data &&
    Array.isArray(data.children)
  );
}

ImgResComponent.defaultProps = {
  style: {},
  width: '100%',
  height: '100%',
  fills: [],
};

export default React.memo(ImgResComponent);
