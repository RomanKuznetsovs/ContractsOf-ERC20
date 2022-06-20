//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingToken is ERC20 {
    
    struct User{
        bool isStakeHolder;
        uint256 stakes;
        uint256 stakeStartTime;
        uint256 rewards;
    }

    address public immutable stakingToken;
    address public rewardToken;

    constructor(uint256 initialSupply, address _stakingToken, address _rewardToken) ERC20("romari", "RMR") {
        _mint(msg.sender, initialSupply);
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
    }

    mapping(address => User) public userMap;

    function isStakeHolder(address _address) public view returns(bool) {
        if(!userMap[_address].isStakeHolder){
            return false;
        }
        return true;
    }

    function addStakeHolder(address _stakeHolder) public{ 
         bool isHolder = isStakeHolder(_stakeHolder);
         if(!isHolder) userMap[_stakeHolder].isStakeHolder = true;
    }

    function removeStakeHolder(address _stakeHolder) private {
        userMap[_stakeHolder].isStakeHolder = false;
    }

    function stakeOf(address _stakeHolder) public view returns(uint256) {
        return userMap[_stakeHolder].stakes;
    }

    function stake(uint256 _stake) public {
        require(IERC20(stakingToken).balanceOf(msg.sender) >= _stake, "Not enought tokens for stake");
        if(!userMap[msg.sender].isStakeHolder){
            addStakeHolder(msg.sender);
            userMap[msg.sender].stakes = _stake;
            userMap[msg.sender].rewards = calculateReward(msg.sender);
            userMap[msg.sender].stakeStartTime = block.timestamp;
        } else {
            userMap[msg.sender].stakes += _stake;
        }
        IERC20(stakingToken).transferFrom(msg.sender, address(this), _stake);
    }

    function rewardOf(address _stakeHolder) public view returns(uint256) {
        return userMap[_stakeHolder].rewards;
    }

    function calculateReward(address _stakeHolder) public view returns(uint256) {
        return userMap[_stakeHolder].stakes / 5;
    }

    function unStake(uint256 _stake) public {
        require(_stake <= userMap[msg.sender].stakes,"Not enought tokens for remove");
        userMap[msg.sender].stakes -= _stake;

        if(userMap[msg.sender].stakes == 0) {
            removeStakeHolder(msg.sender);
            userMap[msg.sender].rewards = 0;
            userMap[msg.sender].stakeStartTime = 0;
        }
        IERC20(stakingToken).transfer(msg.sender,_stake);
    }

    function claimReward() public {
        require(userMap[msg.sender].isStakeHolder,"Not a stakeholder");
        require(block.timestamp >= userMap[msg.sender].stakeStartTime + 10 minutes,"Too early to claim");
        uint256 reward = rewardOf(msg.sender);
        _mint(msg.sender, reward);

        userMap[msg.sender].rewards = calculateReward(msg.sender);
        userMap[msg.sender].stakeStartTime = block.timestamp;
    }

}
