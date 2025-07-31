// WebGL support check and JSMpeg options
export const checkWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

export const getJSMpegOptions = (canvas, wsUrl, customOptions = {}) => {
  const baseOptions = {
    canvas: canvas,
    autoplay: true,
    audio: false,
    loop: false,
    pauseWhenHidden: false,
    disableGl: !checkWebGLSupport(),
    disableWebAssembly: false,
    preserveDrawingBuffer: false,
    videoBufferSize: 2 * 1024 * 1024, // 2MB buffer
    audioBufferSize: 512 * 1024, // 512KB buffer
    onPlay: () => {
      console.log('JSMpeg player started');
    },
    onError: (error) => {
      console.error('JSMpeg error:', error);
    },
    onSourceEstablished: () => {
      console.log('JSMpeg WebSocket connected');
    },
    onDisconnect: () => {
      console.log('JSMpeg WebSocket disconnected');
    }
  };

  return { ...baseOptions, ...customOptions };
}; 