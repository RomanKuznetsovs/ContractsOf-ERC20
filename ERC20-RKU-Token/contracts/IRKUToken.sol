//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

interface IRkuToken {
    
    event Trancfer(address indexed seller, address indexed buyer, uint256 amount);

    event Approval(address indexed owner, address indexed delegate, uint256 amount);

    function balanceOf(address account) external view returns(uint256);

    function allowance(address account, address delegate) external view returns(uint256);

    function name() external view returns(string memory);

    function symbol() external view returns(string memory);

    function demicals() external view returns(uint8);

    function totalSupply() external view returns(uint256);

    function trancfer(address buyer, uint256 amount) external returns(bool);

    function trancferFrom(address seller, address buyer,uint256 amount) external returns(bool);

    function approve(address delegate, uint256 amount) external returns(bool);

    function burn(address account, uint256 amount) external returns(bool);

    function mint(address account, uint256 amount) external returns(bool);
    
}