// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

// Common interface for the Pools.
interface IPool {
    function getETH() external view returns (uint);

    function getBoldDebt() external view returns (uint);

    function increaseBoldDebt(uint _amount) external;

    function decreaseBoldDebt(uint _amount) external;
}
