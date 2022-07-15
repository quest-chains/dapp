// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Text3D } from '@react-three/drei';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import boldFontJson from '@/assets/fonts/bold.json';
import { wordWrapText } from '@/utils/stringHelpers';

export default function Text({
  children,
  vAlign = 'top',
  hAlign = 'right',
  size = 2,
  ...props
}) {
  const config = useMemo(
    () => ({
      size: 40,
      height: 30,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: 4,
      bevelSize: 2,
      bevelOffset: -1,
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
    <group {...props} scale={[0.01 * size, 0.01 * size, 0.005]}>
      <Text3D ref={mesh} font={boldFontJson} {...config}>
        {children}
        <meshStandardMaterial />
      </Text3D>
    </group>
  );
}

export const WrapText = ({
  children,
  size = 2,
  length = 20,
  spill = 2,
  ...props
}) => {
  if (typeof children !== 'string') return null;

  const wrapArray = wordWrapText(children, length, spill);
  return (
    <group {...props}>
      {wrapArray.map((line, i) => (
        <Text
          position={[0, size * i * -1 * Math.pow(0.84, size), 0]}
          key={line + '-' + i}
          size={size}
        >
          {line}
        </Text>
      ))}
    </group>
  );
};
