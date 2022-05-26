// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

interface IQuestChain {
    enum Status {
        init,
        review,
        pass,
        fail
    }

    function init(address _owner, string calldata _details) external;

    function initWithRoles(
        address _owner,
        string calldata _details,
        address[] calldata _admins,
        address[] calldata _editors,
        address[] calldata _reviewers
    ) external;

    function edit(string calldata _details) external;

    function createQuest(string calldata _details) external;

    function editQuest(uint256 _questId, string calldata _details) external;

    function submitProof(uint256 _questId, string calldata _proof) external;

    function reviewProof(
        address _quester,
        uint256 _questId,
        bool _success,
        string calldata _details
    ) external;

    function questStatus(address _quester, uint256 _questId)
        external
        view
        returns (Status);
}
