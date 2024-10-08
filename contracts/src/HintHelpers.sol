// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.18;

import "./Interfaces/ICollateralRegistry.sol";
import "./Dependencies/LiquityMath.sol";
import "./Dependencies/Constants.sol";

contract HintHelpers {
    string public constant NAME = "HintHelpers";

    ICollateralRegistry public immutable collateralRegistry;

    constructor(ICollateralRegistry _collateralRegistry) {
        collateralRegistry = _collateralRegistry;
    }

    /* getApproxHint() - return id of a Trove that is, on average, (length / numTrials) positions away in the
    sortedTroves list from the correct insert position of the Trove to be inserted. 
    
    Note: The output id is worst-case O(n) positions away from the correct insert position, however, the function
    is probabilistic. Input can be tuned to guarantee results to a high degree of confidence, e.g:

    Submitting numTrials = k * sqrt(length), with k = 15 makes it very, very likely that the ouput id will
    be <= sqrt(length) positions away from the correct insert position.
    */
    function getApproxHint(uint256 _collIndex, uint256 _interestRate, uint256 _numTrials, uint256 _inputRandomSeed)
        external
        view
        returns (uint256 hintId, uint256 diff, uint256 latestRandomSeed)
    {
        ITroveManager troveManager = collateralRegistry.getTroveManager(_collIndex);
        ISortedTroves sortedTroves = troveManager.sortedTroves();

        uint256 arrayLength = troveManager.getTroveIdsCount();

        if (arrayLength == 0) {
            return (0, 0, _inputRandomSeed);
        }

        hintId = sortedTroves.getLast();
        diff = LiquityMath._getAbsoluteDifference(_interestRate, troveManager.getTroveAnnualInterestRate(hintId));
        latestRandomSeed = _inputRandomSeed;

        for (uint256 i = 1; i < _numTrials; ++i) {
            latestRandomSeed = uint256(keccak256(abi.encodePacked(latestRandomSeed)));

            uint256 arrayIndex = latestRandomSeed % arrayLength;
            uint256 currentId = troveManager.getTroveFromTroveIdsArray(arrayIndex);

            // Skip this Trove if it's unredeeamable and not in the sorted list
            if (!sortedTroves.contains(currentId)) continue;

            uint256 currentInterestRate = troveManager.getTroveAnnualInterestRate(currentId);

            // check if abs(current - IR) > abs(closest - IR), and update closest if current is closer
            uint256 currentDiff = LiquityMath._getAbsoluteDifference(currentInterestRate, _interestRate);

            if (currentDiff < diff) {
                diff = currentDiff;
                hintId = currentId;
            }
        }
    }

    function _calcUpfrontFee(uint256 _debt, uint256 _avgInterestRate) internal pure returns (uint256) {
        return _debt * _avgInterestRate * UPFRONT_INTEREST_PERIOD / ONE_YEAR / DECIMAL_PRECISION;
    }

    function predictOpenTroveUpfrontFee(uint256 _collIndex, uint256 _borrowedAmount, uint256 _interestRate)
        external
        view
        returns (uint256)
    {
        ITroveManager troveManager = collateralRegistry.getTroveManager(_collIndex);
        IActivePool activePool = troveManager.activePool();

        TroveChange memory openTrove;
        openTrove.debtIncrease = _borrowedAmount;
        openTrove.newWeightedRecordedDebt = openTrove.debtIncrease * _interestRate;

        uint256 avgInterestRate = activePool.getNewApproxAvgInterestRateFromTroveChange(openTrove);
        return _calcUpfrontFee(openTrove.debtIncrease, avgInterestRate);
    }

    function predictAdjustInterestRateUpfrontFee(uint256 _collIndex, uint256 _troveId, uint256 _newInterestRate)
        external
        view
        returns (uint256)
    {
        ITroveManager troveManager = collateralRegistry.getTroveManager(_collIndex);
        IActivePool activePool = troveManager.activePool();
        LatestTroveData memory trove = troveManager.getLatestTroveData(_troveId);

        if (block.timestamp >= trove.lastInterestRateAdjTime + INTEREST_RATE_ADJ_COOLDOWN) {
            return 0;
        }

        TroveChange memory troveChange;
        troveChange.appliedRedistBoldDebtGain = trove.redistBoldDebtGain;
        troveChange.newWeightedRecordedDebt = trove.entireDebt * _newInterestRate;
        troveChange.oldWeightedRecordedDebt = trove.weightedRecordedDebt;

        uint256 avgInterestRate = activePool.getNewApproxAvgInterestRateFromTroveChange(troveChange);
        return _calcUpfrontFee(trove.entireDebt, avgInterestRate);
    }

    function predictAdjustTroveUpfrontFee(uint256 _collIndex, uint256 _troveId, uint256 _debtIncrease)
        external
        view
        returns (uint256)
    {
        if (_debtIncrease == 0) return 0;

        ITroveManager troveManager = collateralRegistry.getTroveManager(_collIndex);
        IActivePool activePool = troveManager.activePool();
        LatestTroveData memory trove = troveManager.getLatestTroveData(_troveId);

        TroveChange memory troveChange;
        troveChange.appliedRedistBoldDebtGain = trove.redistBoldDebtGain;
        troveChange.debtIncrease = _debtIncrease;
        troveChange.newWeightedRecordedDebt = (trove.entireDebt + _debtIncrease) * trove.annualInterestRate;
        troveChange.oldWeightedRecordedDebt = trove.weightedRecordedDebt;

        uint256 avgInterestRate = activePool.getNewApproxAvgInterestRateFromTroveChange(troveChange);
        return _calcUpfrontFee(_debtIncrease, avgInterestRate);
    }
}
