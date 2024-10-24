export interface ModalWindow {
  title?: string;
  text?: string;
  html?: string;
  image?: {
    src: string;
    height?: number;
    bgColor?: string;
    altText: string;
  };
  button?: {
    text: string;
    textColor: string;
    bgColor: string;
    position?: 'left' | 'center' | 'right';
  };
}
