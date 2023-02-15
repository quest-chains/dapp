import { PrimaryButton } from '@/components/PrimaryButton';
import { useWallet } from '@/web3';

export const ConnectWallet: React.FC = () => {
  const { connectWallet, isConnecting, isConnected, disconnect } = useWallet();

  return (
    <PrimaryButton
      role="group"
      isLoading={isConnecting}
      loadingText="Connecting..."
      onClick={isConnected ? disconnect : connectWallet}
      px={4}
      background="rgba(255, 255, 255, 0.05)"
      fontWeight="bold"
      backdropFilter="blur(40px)"
      borderRadius="full"
      boxShadow="inset 0px 0px 0px 1px #AD90FF"
      letterSpacing={1}
      color="main"
      fontSize={14}
      height={10}
    >
      {!isConnected ? 'Connect Wallet' : 'Disconnect Wallet'}
    </PrimaryButton>
  );
};
