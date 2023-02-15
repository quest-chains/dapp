import { providers, utils } from 'ethers';
import { Base64 } from 'js-base64';
import { v4 as uuidv4 } from 'uuid';

const AUDIENCE = 'quest-chains-api';
const TOKEN_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days
const WELCOME_MESSAGE = `Welcome to Quest Chains Anon!\nPlease sign this message so we know it is you.\n\n`;

const verifySignature = (
  address: string,
  message: string,
  signature: string,
): boolean => {
  const recoveredAddress = utils.verifyMessage(message, signature);
  return address.toLowerCase() === recoveredAddress.toLowerCase();
};

export const signMessage = async (
  provider: providers.Web3Provider,
  rawMessage: string,
): Promise<string> => {
  const ethereum = provider.provider;
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  if (!ethereum.request) throw new Error('invalid ethereum provider');

  let params = [rawMessage, address.toLowerCase()];
  if (ethereum.isMetaMask) {
    params = [params[1], params[0]];
  }
  const signature = await ethereum.request({
    method: 'personal_sign',
    params,
  });
  return signature;
};

type Claim = {
  iat: number;
  exp: number;
  iss: string;
  aud: string;
  tid: string;
};

export const createToken = async (
  provider: providers.Web3Provider,
): Promise<string> => {
  const address = await provider.getSigner().getAddress();

  const iat = new Date().getTime();

  const claim: Claim = {
    iat,
    exp: iat + TOKEN_DURATION,
    iss: address.toLowerCase(),
    aud: AUDIENCE,
    tid: uuidv4(),
  };

  const serializedClaim = JSON.stringify(claim);
  const msgToSign = `${WELCOME_MESSAGE}${serializedClaim}`;
  const proof = await signMessage(provider, msgToSign);

  return Base64.encode(JSON.stringify([proof, serializedClaim]));
};

export const verifyToken = (token: string): string | null => {
  try {
    if (!token) return null;
    const rawToken = Base64.decode(token);
    const [proof, rawClaim] = JSON.parse(rawToken);
    const claim: Claim = JSON.parse(rawClaim);
    const address = claim.iss;

    const msgToVerify = `${WELCOME_MESSAGE}${rawClaim}`;
    const valid = verifySignature(address, msgToVerify, proof);
    const expired = claim.exp < new Date().getTime();
    const validAudience = claim.aud === AUDIENCE;

    if (!valid) {
      throw new Error('invalid signature');
    }
    if (expired) {
      throw new Error('token expired');
    }
    if (!validAudience) {
      throw new Error('invalid audience');
    }
    // Important, always keep address lowercase for comparisons
    return address.toLowerCase();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Token verification failed', e as Error);
    return null;
  }
};
