// Canvas reference testing utilities
export const testCanvasRef = (canvasRef) => {
  if (canvasRef.current) {
    console.log('Canvas ref is available:', canvasRef.current);
    return true;
  }
  console.log('Canvas ref is not available yet');
  return false;
};

export const waitForCanvasRef = (canvasRef, callback, maxWaitTime = 5000) => {
  const startTime = Date.now();
  
  const checkCanvas = () => {
    if (canvasRef.current) {
      console.log('Canvas ref found after waiting');
      callback(canvasRef.current);
      return;
    }
    
    if (Date.now() - startTime > maxWaitTime) {
      console.error('Canvas ref not available after waiting');
      callback(null);
      return;
    }
    
    setTimeout(checkCanvas, 100);
  };
  
  checkCanvas();
}; 