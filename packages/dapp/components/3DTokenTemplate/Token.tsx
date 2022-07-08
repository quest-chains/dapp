import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import Model from './Model';

export const Token = () => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <OrbitControls />
        <hemisphereLight />
        <ambientLight />
        <directionalLight position={[0, 0, 5]} intensity={0.1} />
        <PerspectiveCamera makeDefault />
        <Model />
      </Suspense>
    </Canvas>
  );
};
