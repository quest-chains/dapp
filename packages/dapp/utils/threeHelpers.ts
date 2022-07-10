import * as THREE from 'three';
import { GLTFExporter } from 'three-stdlib';

export const renderSceneToGLB = async (
  scene: THREE.Scene,
): Promise<ArrayBuffer> => {
  const exporter = new GLTFExporter();
  const result = await new Promise(r =>
    exporter.parse(scene, r, { binary: true }),
  );
  return result as ArrayBuffer;
};

export const arrayBufferToFile = (buffer: ArrayBuffer, filename: string) => {
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const file = new File([blob], filename);
  return file;
};
