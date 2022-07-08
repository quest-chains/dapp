// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Text3D } from '@react-three/drei';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import boldFontJson from '@/assets/fonts/bold.json';

export default function Text({
  children,
  vAlign = 'center',
  hAlign = 'center',
  size = 2,
  ...props
}) {
  const config = useMemo(
    () => ({
      size: 40,
      height: 30,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 6,
      bevelSize: 2.5,
      bevelOffset: 0,
      bevelSegments: 8,
    }),
    [],
  );
  const mesh = useRef(null);
  useLayoutEffect(() => {
    const size = new THREE.Vector3();
    if (mesh.current) {
      mesh.current.geometry.computeBoundingBox();
      mesh.current.geometry.boundingBox.getSize(size);
      mesh.current.position.x =
        hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x;
      mesh.current.position.y =
        vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y;
    }
  }, [children, hAlign, vAlign]);
  return (
    <group {...props} scale={[0.01 * size, 0.01 * size, 0.01]}>
      <Text3D ref={mesh} font={boldFontJson} {...config}>
        {children}
        <meshNormalMaterial />
      </Text3D>
    </group>
  );
}
