import { ResourceEnum } from 'types/resource/ResourceEnum';

/**
 * ImgResComponent의 props interface입니다.
 */
export interface IImgResProps {
  img?: ResourceEnum;
  style?: React.CSSProperties;
  width?: string;
  height?: string;
  fills?: string[];
}

/**
 * i18n으로 받은 data를 관리하는 interface 입니다.
 */
export interface ISvgData {
  viewBox: string;
  children: Array<IPathProps>;
}

/**
 * ISvgData 내부의 path 정보를 관리하는 interface 입니다.
 */
export interface IPathProps {
  className: string;
  d: string;
}
