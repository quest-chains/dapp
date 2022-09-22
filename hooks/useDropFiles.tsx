import { useCallback, useState } from 'react';
import { DropzoneInputProps, DropzoneProps, useDropzone } from 'react-dropzone';

export const useDropFiles = (
  options: DropzoneProps = {},
): {
  onOpenFiles: () => void;
  onResetFiles: () => void;
  dropzoneProps: { className: string };
  inputProps: DropzoneInputProps;
  onRemoveFile: (file: File) => void;
  files: File[];
} => {
  const [files, setFiles] = useState<File[]>([]);

  const onResetFiles = useCallback(() => setFiles([]), []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) =>
      setFiles(oldFiles => [...oldFiles, ...acceptedFiles]),
    [],
  );

  const onRemoveFile = useCallback(
    (file: File) =>
      setFiles(oldFiles => {
        const newFiles = [...oldFiles];
        newFiles.splice(newFiles.indexOf(file), 1);
        return newFiles;
      }),
    [],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop,
    ...options,
  });

  return {
    dropzoneProps: getRootProps({ className: 'dropzone' }),
    inputProps: getInputProps(),
    files,
    onRemoveFile,
    onResetFiles,
    onOpenFiles: open,
  };
};
