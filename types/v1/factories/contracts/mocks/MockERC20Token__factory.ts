/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  MockERC20Token,
  MockERC20TokenInterface,
} from "../../../contracts/mocks/MockERC20Token";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6101406040523480156200001257600080fd5b50604051806040016040528060058152602001643a37b5b2b760d91b81525080604051806040016040528060018152602001603160f81b815250604051806040016040528060058152602001643a37b5b2b760d91b815250604051806040016040528060058152602001642a27a5a2a760d91b8152508160039081620000999190620001e9565b506004620000a88282620001e9565b5050825160208085019190912083518483012060e08290526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81880181905281830187905260608201869052608082019490945230818401528151808203909301835260c0019052805194019390932091935091906080523060c0526101205250620002b59350505050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200016f57607f821691505b6020821081036200019057634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620001e457600081815260208120601f850160051c81016020861015620001bf5750805b601f850160051c820191505b81811015620001e057828155600101620001cb565b5050505b505050565b81516001600160401b0381111562000205576200020562000144565b6200021d816200021684546200015a565b8462000196565b602080601f8311600181146200025557600084156200023c5750858301515b600019600386901b1c1916600185901b178555620001e0565b600085815260208120601f198616915b82811015620002865788860151825594840194600190910190840162000265565b5085821015620002a55787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05160c05160e05161010051610120516114fa620003056000396000610c5901526000610ca801526000610c8301526000610bdc01526000610c0601526000610c3001526114fa6000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c806340c10f1911610097578063a457c2d711610066578063a457c2d7146101f0578063a9059cbb14610203578063d505accf14610216578063dd62ed3e1461022957600080fd5b806340c10f191461018a57806370a082311461019f5780637ecebe00146101d557806395d89b41146101e857600080fd5b806323b872dd116100d357806323b872dd1461014d578063313ce567146101605780633644e5151461016f578063395093511461017757600080fd5b806306fdde03146100fa578063095ea7b31461011857806318160ddd1461013b575b600080fd5b61010261026f565b60405161010f919061124b565b60405180910390f35b61012b6101263660046112e0565b610301565b604051901515815260200161010f565b6002545b60405190815260200161010f565b61012b61015b36600461130a565b61031b565b6040516012815260200161010f565b61013f61033f565b61012b6101853660046112e0565b61034e565b61019d6101983660046112e0565b61039a565b005b61013f6101ad366004611346565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b61013f6101e3366004611346565b6103a8565b6101026103d3565b61012b6101fe3660046112e0565b6103e2565b61012b6102113660046112e0565b6104b8565b61019d610224366004611368565b6104c6565b61013f6102373660046113db565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b60606003805461027e9061140e565b80601f01602080910402602001604051908101604052809291908181526020018280546102aa9061140e565b80156102f75780601f106102cc576101008083540402835291602001916102f7565b820191906000526020600020905b8154815290600101906020018083116102da57829003601f168201915b5050505050905090565b60003361030f818585610685565b60019150505b92915050565b600033610329858285610838565b61033485858561090f565b506001949350505050565b6000610349610bc2565b905090565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919061030f908290869061039590879061145b565b610685565b6103a48282610cf6565b5050565b73ffffffffffffffffffffffffffffffffffffffff8116600090815260056020526040812054610315565b60606004805461027e9061140e565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff87168452909152812054909190838110156104ab576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6103348286868403610685565b60003361030f81858561090f565b83421115610530576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e6500000060448201526064016104a2565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c988888861055f8c610e16565b60408051602081019690965273ffffffffffffffffffffffffffffffffffffffff94851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006105c782610e4b565b905060006105d782878787610eb4565b90508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461066e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e6174757265000060448201526064016104a2565b6106798a8a8a610685565b50505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff8316610727576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016104a2565b73ffffffffffffffffffffffffffffffffffffffff82166107ca576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f737300000000000000000000000000000000000000000000000000000000000060648201526084016104a2565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152600160209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461090957818110156108fc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016104a2565b6109098484848403610685565b50505050565b73ffffffffffffffffffffffffffffffffffffffff83166109b2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016104a2565b73ffffffffffffffffffffffffffffffffffffffff8216610a55576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016104a2565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015610b0b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016104a2565b73ffffffffffffffffffffffffffffffffffffffff808516600090815260208190526040808220858503905591851681529081208054849290610b4f90849061145b565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610bb591815260200190565b60405180910390a3610909565b60003073ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016148015610c2857507f000000000000000000000000000000000000000000000000000000000000000046145b15610c5257507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b73ffffffffffffffffffffffffffffffffffffffff8216610d73576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016104a2565b8060026000828254610d85919061145b565b909155505073ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604081208054839290610dbf90849061145b565b909155505060405181815273ffffffffffffffffffffffffffffffffffffffff8316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b73ffffffffffffffffffffffffffffffffffffffff811660009081526005602052604090208054600181018255905b50919050565b6000610315610e58610bc2565b836040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000610ec587878787610edc565b91509150610ed281610ff4565b5095945050505050565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115610f135750600090506003610feb565b8460ff16601b14158015610f2b57508460ff16601c14155b15610f3c5750600090506004610feb565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015610f90573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff8116610fe457600060019250925050610feb565b9150600090505b94509492505050565b600081600481111561100857611008611495565b036110105750565b600181600481111561102457611024611495565b0361108b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064016104a2565b600281600481111561109f5761109f611495565b03611106576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e6774680060448201526064016104a2565b600381600481111561111a5761111a611495565b036111a7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f756500000000000000000000000000000000000000000000000000000000000060648201526084016104a2565b60048160048111156111bb576111bb611495565b03611248576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c60448201527f756500000000000000000000000000000000000000000000000000000000000060648201526084016104a2565b50565b600060208083528351808285015260005b818110156112785785810183015185820160400152820161125c565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b803573ffffffffffffffffffffffffffffffffffffffff811681146112db57600080fd5b919050565b600080604083850312156112f357600080fd5b6112fc836112b7565b946020939093013593505050565b60008060006060848603121561131f57600080fd5b611328846112b7565b9250611336602085016112b7565b9150604084013590509250925092565b60006020828403121561135857600080fd5b611361826112b7565b9392505050565b600080600080600080600060e0888a03121561138357600080fd5b61138c886112b7565b965061139a602089016112b7565b95506040880135945060608801359350608088013560ff811681146113be57600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156113ee57600080fd5b6113f7836112b7565b9150611405602084016112b7565b90509250929050565b600181811c9082168061142257607f821691505b602082108103610e45577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b80820180821115610315577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fdfea2646970667358221220f274a508e36d453887c4203d32d06b80f390201b8c6003b329f3d1c9ce89140a64736f6c63430008100033";

type MockERC20TokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC20TokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC20Token__factory extends ContractFactory {
  constructor(...args: MockERC20TokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockERC20Token> {
    return super.deploy(overrides || {}) as Promise<MockERC20Token>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockERC20Token {
    return super.attach(address) as MockERC20Token;
  }
  override connect(signer: Signer): MockERC20Token__factory {
    return super.connect(signer) as MockERC20Token__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC20TokenInterface {
    return new utils.Interface(_abi) as MockERC20TokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC20Token {
    return new Contract(address, _abi, signerOrProvider) as MockERC20Token;
  }
}
