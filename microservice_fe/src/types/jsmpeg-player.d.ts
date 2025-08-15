declare module '@cycjimmy/jsmpeg-player' {
  export interface JSMpegStatic {
    VideoElement: new (
      canvas: HTMLCanvasElement,
      url: string,
      options?: any
    ) => {
      destroy?: () => void;
      source?: { socket?: { close?: () => void } };
    };
    Player: new (
      url: string,
      options?: any
    ) => {
      destroy?: () => void;
    };
  }

  const JSMpeg: JSMpegStatic;
  export default JSMpeg;
}
