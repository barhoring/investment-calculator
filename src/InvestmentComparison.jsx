import React, { useState, useEffect } from "react";
import _ from "lodash";

const InvestmentComparison = () => {
  // Default state values
  const [params, setParams] = useState({
    fund1Return: 32.67,
    fund1Fee: 0.7,
    fund2Return: 23.15,
    fund2Fee: 0.6,
    years: 3,
    initialInvestment: 100000,
    monthlyDeposit: 3450,
  });

  // State to track which fund to display
  const [selectedFund, setSelectedFund] = useState("both");
  const [showMonths, setShowMonths] = useState("all");

  // States for calculated data
  const [fund1Growth, setFund1Growth] = useState([]);
  const [fund2Growth, setFund2Growth] = useState([]);

  // Calculate investment growth over months with monthly deposits
  const calculateInvestmentGrowth = (
    initialAmount,
    monthlyDeposit,
    annualReturnPercent,
    annualFeePercent,
    years
  ) => {
    const months = years * 12;
    const monthlyReturnRate =
      Math.pow(1 + annualReturnPercent / 100, 1 / months) - 1;
    const monthlyFeeRate = annualFeePercent / 12 / 100;

    const result = [];
    let currentAmount = initialAmount;
    let totalDeposits = initialAmount;
    let totalFeesPaid = 0;

    for (let month = 1; month <= months; month++) {
      // Add monthly deposit
      currentAmount += monthlyDeposit;
      totalDeposits += monthlyDeposit;

      // Calculate return for this month (after deposit)
      const monthlyReturn = currentAmount * monthlyReturnRate;

      // Calculate fee for this month (after deposit and return)
      const monthlyFee = currentAmount * monthlyFeeRate;
      totalFeesPaid += monthlyFee;

      // Update current amount after return and fee
      currentAmount = currentAmount + monthlyReturn - monthlyFee;

      // Store the data for this month
      result.push({
        month,
        startingAmount:
          currentAmount - monthlyReturn - monthlyDeposit + monthlyFee,
        deposit: monthlyDeposit,
        return: monthlyReturn,
        fee: monthlyFee,
        endingAmount: currentAmount,
        totalDeposits,
        totalFeesPaid,
        totalGain: currentAmount - totalDeposits,
      });
    }

    return result;
  };

  // Recalculate when parameters change
  useEffect(() => {
    const fund1 = calculateInvestmentGrowth(
      params.initialInvestment,
      params.monthlyDeposit,
      params.fund1Return,
      params.fund1Fee,
      params.years
    );

    const fund2 = calculateInvestmentGrowth(
      params.initialInvestment,
      params.monthlyDeposit,
      params.fund2Return,
      params.fund2Fee,
      params.years
    );

    setFund1Growth(fund1);
    setFund2Growth(fund2);
  }, [params]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: parseFloat(value),
    }));
  };

  // Filter months based on user selection
  const getMonthsToDisplay = (fundData) => {
    if (showMonths === "first6") {
      return fundData.slice(0, 6);
    } else if (showMonths === "last6") {
      return fundData.slice(-6);
    } else if (showMonths === "quarterly") {
      return _(fundData)
        .filter((item) => item.month % 3 === 0 || item.month === 1)
        .value();
    }
    return fundData;
  };

  // Filtered data for display
  const fund1Data =
    fund1Growth.length > 0 ? getMonthsToDisplay(fund1Growth) : [];
  const fund2Data =
    fund2Growth.length > 0 ? getMonthsToDisplay(fund2Growth) : [];

  // Final summary data
  const fund1Final =
    fund1Growth.length > 0 ? fund1Growth[fund1Growth.length - 1] : null;
  const fund2Final =
    fund2Growth.length > 0 ? fund2Growth[fund2Growth.length - 1] : null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Customizable Investment Funds Comparison
      </h1>

      {/* Parameter Inputs */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-4">Investment Parameters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">
              Initial Investment (₪)
            </label>
            <input
              type="number"
              name="initialInvestment"
              value={params.initialInvestment}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Monthly Deposit (₪)
            </label>
            <input
              type="number"
              name="monthlyDeposit"
              value={params.monthlyDeposit}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Investment Period (Years)
            </label>
            <input
              type="number"
              name="years"
              value={params.years}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="1"
              max="30"
              step="1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded">
            <h3 className="font-medium mb-2">Fund 1 Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Return Rate (%)</label>
                <input
                  type="number"
                  name="fund1Return"
                  value={params.fund1Return}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-2">Annual Fee (%)</label>
                <input
                  type="number"
                  name="fund1Fee"
                  value={params.fund1Fee}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-green-50 rounded">
            <h3 className="font-medium mb-2">Fund 2 Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Return Rate (%)</label>
                <input
                  type="number"
                  name="fund2Return"
                  value={params.fund2Return}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-2">Annual Fee (%)</label>
                <input
                  type="number"
                  name="fund2Fee"
                  value={params.fund2Fee}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display Controls */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-4 mb-2">
          <button
            className={`px-4 py-2 rounded ${
              selectedFund === "both" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedFund("both")}
          >
            Both Funds
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedFund === "fund1"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedFund("fund1")}
          >
            Fund 1
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedFund === "fund2"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedFund("fund2")}
          >
            Fund 2
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              showMonths === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setShowMonths("all")}
          >
            All Months
          </button>
          <button
            className={`px-4 py-2 rounded ${
              showMonths === "first6" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setShowMonths("first6")}
          >
            First 6 Months
          </button>
          <button
            className={`px-4 py-2 rounded ${
              showMonths === "last6" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setShowMonths("last6")}
          >
            Last 6 Months
          </button>
          <button
            className={`px-4 py-2 rounded ${
              showMonths === "quarterly"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setShowMonths("quarterly")}
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* Fund 1 Table */}
      {fund1Final && (selectedFund === "both" || selectedFund === "fund1") && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Fund 1 ({params.fund1Fee}% Annual Fee, {params.fund1Return}% Return
            over {params.years} years)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Month</th>
                  <th className="border p-2 text-right">Starting Amount</th>
                  <th className="border p-2 text-right">Monthly Deposit</th>
                  <th className="border p-2 text-right">Monthly Return</th>
                  <th className="border p-2 text-right">Monthly Fee</th>
                  <th className="border p-2 text-right">Ending Amount</th>
                  <th className="border p-2 text-right">Total Deposits</th>
                  <th className="border p-2 text-right">Total Gain</th>
                  <th className="border p-2 text-right">Total Fees</th>
                </tr>
              </thead>
              <tbody>
                {fund1Data.map((month) => (
                  <tr
                    key={`fund1-${month.month}`}
                    className={month.month % 12 === 0 ? "bg-blue-50" : ""}
                  >
                    <td className="border p-2">{month.month}</td>
                    <td className="border p-2 text-right">
                      {month.startingAmount.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.deposit.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.return.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.fee.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right font-medium">
                      {month.endingAmount.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.totalDeposits.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.totalGain.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.totalFeesPaid.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fund 2 Table */}
      {fund2Final && (selectedFund === "both" || selectedFund === "fund2") && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Fund 2 ({params.fund2Fee}% Annual Fee, {params.fund2Return}% Return
            over {params.years} years)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Month</th>
                  <th className="border p-2 text-right">Starting Amount</th>
                  <th className="border p-2 text-right">Monthly Deposit</th>
                  <th className="border p-2 text-right">Monthly Return</th>
                  <th className="border p-2 text-right">Monthly Fee</th>
                  <th className="border p-2 text-right">Ending Amount</th>
                  <th className="border p-2 text-right">Total Deposits</th>
                  <th className="border p-2 text-right">Total Gain</th>
                  <th className="border p-2 text-right">Total Fees</th>
                </tr>
              </thead>
              <tbody>
                {fund2Data.map((month) => (
                  <tr
                    key={`fund2-${month.month}`}
                    className={month.month % 12 === 0 ? "bg-green-50" : ""}
                  >
                    <td className="border p-2">{month.month}</td>
                    <td className="border p-2 text-right">
                      {month.startingAmount.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.deposit.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.return.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.fee.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right font-medium">
                      {month.endingAmount.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.totalDeposits.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.totalGain.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {month.totalFeesPaid.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Comparison */}
      {fund1Final && fund2Final && (
        <div className="p-4 bg-gray-100 rounded mb-4">
          <h2 className="text-xl font-semibold mb-4">
            Summary After {params.years} Years
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <h3 className="font-medium">Metric</h3>
              <p className="my-2">Final Value</p>
              <p className="my-2">Total Deposits</p>
              <p className="my-2">Total Gain</p>
              <p className="my-2">Return on Investment %</p>
              <p className="my-2">Total Fees Paid</p>
              <p className="my-2">Fees as % of Deposits</p>
              <p className="my-2">Fees as % of Gain</p>
            </div>
            <div className="col-span-1">
              <h3 className="font-medium">Fund 1</h3>
              <p className="my-2 font-bold">
                ₪{fund1Final.endingAmount.toFixed(2)}
              </p>
              <p className="my-2">₪{fund1Final.totalDeposits.toFixed(2)}</p>
              <p className="my-2">₪{fund1Final.totalGain.toFixed(2)}</p>
              <p className="my-2">
                {(
                  (fund1Final.totalGain / fund1Final.totalDeposits) *
                  100
                ).toFixed(2)}
                %
              </p>
              <p className="my-2">₪{fund1Final.totalFeesPaid.toFixed(2)}</p>
              <p className="my-2">
                {(
                  (fund1Final.totalFeesPaid / fund1Final.totalDeposits) *
                  100
                ).toFixed(2)}
                %
              </p>
              <p className="my-2">
                {(
                  (fund1Final.totalFeesPaid / fund1Final.totalGain) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
            <div className="col-span-1">
              <h3 className="font-medium">Fund 2</h3>
              <p className="my-2 font-bold">
                ₪{fund2Final.endingAmount.toFixed(2)}
              </p>
              <p className="my-2">₪{fund2Final.totalDeposits.toFixed(2)}</p>
              <p className="my-2">₪{fund2Final.totalGain.toFixed(2)}</p>
              <p className="my-2">
                {(
                  (fund2Final.totalGain / fund2Final.totalDeposits) *
                  100
                ).toFixed(2)}
                %
              </p>
              <p className="my-2">₪{fund2Final.totalFeesPaid.toFixed(2)}</p>
              <p className="my-2">
                {(
                  (fund2Final.totalFeesPaid / fund2Final.totalDeposits) *
                  100
                ).toFixed(2)}
                %
              </p>
              <p className="my-2">
                {(
                  (fund2Final.totalFeesPaid / fund2Final.totalGain) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="font-semibold">
              Difference in Final Value: ₪
              {(fund1Final.endingAmount - fund2Final.endingAmount).toFixed(2)}
            </p>
            <p>
              Fund 1{" "}
              {fund1Final.endingAmount > fund2Final.endingAmount
                ? "outperforms"
                : "underperforms"}{" "}
              Fund 2 by{" "}
              {(
                Math.abs(
                  (fund1Final.endingAmount - fund2Final.endingAmount) /
                    fund2Final.endingAmount
                ) * 100
              ).toFixed(2)}
              %
            </p>
          </div>
        </div>
      )}

      {/* CSS using the Lobotomized Owl selector for spacing between siblings */}
      <style jsx>{`
        .grid > * + * {
          margin-top: 1rem;
        }

        @media (min-width: 768px) {
          .grid > * + * {
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default InvestmentComparison;
