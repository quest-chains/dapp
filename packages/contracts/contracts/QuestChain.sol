// SPDX-License-Identifier: MIT
// solhint-disable max-states-count

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./interfaces/IQuestChain.sol";

contract QuestChain is
    IQuestChain,
    Initializable,
    Context,
    ReentrancyGuard,
    AccessControl
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EDITOR_ROLE = keccak256("EDITOR_ROLE");
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");

    uint256 public questCount;

    mapping(address => mapping(uint256 => Status)) public completions;

    event QuestChainCreated(address indexed _admin, string details);
    event QuestCreated(
        address indexed editor,
        uint256 indexed questId,
        string details
    );
    event QuestEdited(
        address indexed editor,
        uint256 indexed questId,
        string details
    );
    event QuestProofSubmitted(
        address indexed quester,
        uint256 indexed questId,
        string proof
    );
    event QuestProofReviewed(
        address indexed reviewer,
        address indexed quester,
        uint256 indexed questId,
        bool success
    );

    // solhint-disable-next-line no-empty-blocks
    constructor() initializer {}

    function init(address _admin, string calldata _details)
        external
        override
        initializer
    {
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setRoleAdmin(EDITOR_ROLE, ADMIN_ROLE);
        _setRoleAdmin(REVIEWER_ROLE, ADMIN_ROLE);

        _setupRole(ADMIN_ROLE, _admin);
        _setupRole(EDITOR_ROLE, _admin);
        _setupRole(REVIEWER_ROLE, _admin);

        emit QuestChainCreated(_admin, _details);
    }

    function createQuest(string calldata _details)
        external
        override
        onlyRole(EDITOR_ROLE)
    {
        emit QuestCreated(msg.sender, questCount, _details);

        questCount += 1;
    }

    function editQuest(uint256 _questId, string calldata _details)
        external
        override
        onlyRole(EDITOR_ROLE)
    {
        require(_questId < questCount, "QuestChain: quest not created");

        emit QuestEdited(msg.sender, _questId, _details);
    }

    function submitProof(uint256 _questId, string calldata _proof)
        external
        override
    {
        Status status = completions[msg.sender][_questId];
        require(
            status == Status.init || status == Status.fail,
            "QuestChain: in review or passed"
        );

        completions[msg.sender][_questId] = Status.review;

        emit QuestProofSubmitted(msg.sender, _questId, _proof);
    }

    function reviewProof(
        address _quester,
        uint256 _questId,
        bool _success
    ) external override onlyRole(REVIEWER_ROLE) {
        Status status = completions[_quester][_questId];
        require(status == Status.review, "QuestChain: quest not in review");
        completions[msg.sender][_questId] = _success
            ? Status.pass
            : Status.fail;

        emit QuestProofReviewed(msg.sender, _quester, _questId, _success);
    }

    function getStatus(address _quester, uint256 _questId)
        external
        view
        override
        returns (Status status)
    {
        status = completions[_quester][_questId];
    }
}
