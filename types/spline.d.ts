// types/spline.d.ts
declare module '@splinetool/react-spline' {
  import { ComponentType } from 'react';

  interface SplineProps {
    scene: string;
    onLoad?: () => void;
    onError?: (error: Error) => void;
    className?: string;
  }

  const Spline: ComponentType<SplineProps>;
  export default Spline;
}