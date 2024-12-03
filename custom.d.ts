type Nullable<T> = T | undefined;

declare module '*.svg';

declare module '*.module.scss' {
  const content: { [className: string]: string };
  export = content;
}
