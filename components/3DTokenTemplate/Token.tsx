// @ts-nocheck
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ForwardedRef, forwardRef, Suspense } from 'react';

import { Model, TemplateProps } from './Model';

export const Token = forwardRef(
  (props: TemplateProps, ref: ForwardedRef<HTMLCanvasElement>) => {
    return (
      <Canvas ref={ref} gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <OrbitControls />
          <pointLight position={[0, 0, 15]} intensity={0.5} decay={2} />
          <pointLight position={[0, 0, -15]} intensity={0.5} decay={2} />
          <Model {...props} />
        </Suspense>
      </Canvas>
    );
  },
);
