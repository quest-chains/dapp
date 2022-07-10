// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ForwardedRef, forwardRef, Suspense } from 'react';

import { Model, TemplateProps } from './Model';

export const Token = forwardRef(
  (props: TemplateProps, ref: ForwardedRef<HTMLCanvasElement>) => {
    return (
      <Canvas ref={ref} gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <OrbitControls />
          <pointLight position={[0, 0, 15]} intensity={0.5} />
          <pointLight position={[0, 0, -15]} intensity={0.5} />
          <PerspectiveCamera makeDefault />
          <Model {...props} />
        </Suspense>
      </Canvas>
    );
  },
);
