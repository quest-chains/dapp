import { Spinner, SpinnerProps } from '@chakra-ui/react';

export const LoadingState: React.FC<SpinnerProps> = props => {
  const customProps = {
    color: 'main',
    speed: '0.67s',
    thickness: '3px',
    w: !props.w && !props.width && !props.size ? '5rem' : undefined,
    h: !props.h && !props.height && !props.size ? '5rem' : undefined,
  };
  return <Spinner {...customProps} {...props} />;
};
