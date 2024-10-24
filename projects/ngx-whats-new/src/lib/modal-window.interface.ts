export interface ModalWindow {
  imageSrc?: string;
  title?: string;
  text?: string;
  html?: string;
  imageHeight?: number;
  imageBgColor?: string;
  button?: {
    text: string;
    textColor: string;
    bgColor: string;
    position?: 'left' | 'center' | 'right';
  };
}
