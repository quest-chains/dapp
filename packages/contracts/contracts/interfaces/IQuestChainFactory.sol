// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IQuestChainFactory {
    function create(string calldata _details) external returns (address);

    function createDeterministic(string calldata _details, bytes32 _salt)
        external
        returns (address);

    function predictDeterministicAddress(bytes32 _salt)
        external
        returns (address);
}
