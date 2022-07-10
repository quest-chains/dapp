import * as THREE from 'three';

import { GLTFExporter } from './GLTFExporter';

export const renderSceneToGLB = async (
  scene: THREE.Scene,
): Promise<ArrayBuffer> => {
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, { binary: true });
  return result as ArrayBuffer;
};
