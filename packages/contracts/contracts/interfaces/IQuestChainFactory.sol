// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IQuestChainFactory {
    function create(address _admin, string calldata _details)
        external
        returns (address);

    function createDeterministic(
        address _admin,
        string calldata _details,
        bytes32 _salt
    ) external returns (address);

    function predictDeterministicAddress(bytes32 _salt)
        external
        returns (address);
}
