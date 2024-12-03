/**
 * 도형 Path를 생성, 편집하는 util 함수들의 모음입니다.
 */

/**
 * Z segment를 생성합니다.
 *
 * @returns Z segment
 */
export function makeClose(): string {
  return `Z `;
}

/**
 * M segment를 생성합니다.
 *
 * @returns M segment
 */
export function makeMove(x: number, y: number): string {
  return `M ${x} ${y} `;
}

/**
 * L segment를 생성합니다.
 *
 * @returns L segment
 */
export function makeLine(x: number, y: number): string {
  return `L ${x} ${y} `;
}
