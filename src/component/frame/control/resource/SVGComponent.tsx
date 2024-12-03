import useImgRes from 'hook/resource/useImgRes';
import React from 'react';
import { IImgResProps } from 'types/component/frame/control/resource/ImgResourceTypes';

/**
 * 주어진 정보를 바탕으로 svg를 render 하는 component 입니다.
 *
 * @param param0 IImgResProps svg 정보를 담고 있는 props
 * img: ResourceEnum\
 * width: 가로 길이\
 * height: 세로 길이\
 * style: svg에 적용하고 싶은 style
 */
const SVGComponent = ({ img, width, height, style }: IImgResProps): React.JSX.Element => {
  const res = useImgRes(img);
  // 해당하는 리소스가 없는 경우 id가 그대로 반환 됨
  if (typeof res !== 'string' || (typeof res === 'string' && (res === '' || img === res))) {
    return <></>;
  }
  const svg = new DOMParser().parseFromString(res, 'text/xml').firstChild as SVGSVGElement;
  const originWidth = svg.width && svg.width.baseVal.value ? svg.width.baseVal.value : width;
  const originHeight = svg.height && svg.height.baseVal.value ? svg.height.baseVal.value : height;
  const fill = svg.getAttribute('fill') ?? undefined;

  const firstTagEnd = res.indexOf('>'); // end of svg tag
  const result = res.slice(firstTagEnd + 1);

  return (
    <svg
      width={width || originWidth}
      height={height || originHeight}
      viewBox={`0 0 ${originWidth} ${originHeight}`}
      style={style}
      fill={fill}
      // 코드베이스 내부에 포함되어있는 것으로 XSS 문제는 고려하지 않음
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: result }}
    />
  );
};

export default SVGComponent;
