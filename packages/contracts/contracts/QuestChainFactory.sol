// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IQuestChainFactory.sol";
import "./interfaces/IQuestChain.sol";

contract QuestChainFactory is IQuestChainFactory {
    uint256 public questChainCount = 0;
    mapping(uint256 => address) internal _questChains;

    event NewQuestChain(uint256 indexed index, address questChain);

    address public immutable implementation;

    constructor(address _implementation) {
        require(_implementation != address(0), "invalid implementation");
        implementation = _implementation;
    }

    function _newQuestChain(
        address _questChainAddress,
        string calldata _details
    ) internal {
        IQuestChain(_questChainAddress).init(msg.sender, _details);

        _questChains[questChainCount] = _questChainAddress;
        emit NewQuestChain(questChainCount, _questChainAddress);

        questChainCount++;
    }

    function create(string calldata _details)
        external
        override
        returns (address)
    {
        address questChainAddress = Clones.clone(implementation);

        _newQuestChain(questChainAddress, _details);

        return questChainAddress;
    }

    function predictDeterministicAddress(bytes32 _salt)
        external
        view
        override
        returns (address)
    {
        return Clones.predictDeterministicAddress(implementation, _salt);
    }

    function createDeterministic(string calldata _details, bytes32 _salt)
        external
        override
        returns (address)
    {
        address questChainAddress = Clones.cloneDeterministic(
            implementation,
            _salt
        );

        _newQuestChain(questChainAddress, _details);

        return questChainAddress;
    }

    function getQuestChainAddress(uint256 _index)
        public
        view
        returns (address)
    {
        return _questChains[_index];
    }
}
