import React, { useEffect, useState } from 'react';

const ReportSelector = ({
  payload,
  setPayload,
  userId,
  budgets,
  budgetsData,
  availableReports,
  lastHistoricalMonth,
  onGenerate
}) => {
  const [yearOptions, setYearOptions] = useState([]);

  const handleChange = (key, value) => {
    setPayload(prev => ({ ...prev, [key]: value }));
  };

  // Update year options when budget or report type changes
  useEffect(() => {
    const range = budgetsData?.[payload.budget_id]?.availableDatesForReports?.[payload.report_type];
    if (range) {
      const { from, to } = range;
      const list = Array.from({ length: to - from + 1 }, (_, i) => from + i);
      setYearOptions(list);
    } else {
      setYearOptions([]);
    }
  }, [payload.budget_id, payload.report_type, budgetsData]);

  // Auto-select default years similar to Symfony behavior
  useEffect(() => {
    if (yearOptions.length > 0) {
      const to = yearOptions[yearOptions.length - 1];
      const from = Math.max(to - 9, yearOptions[0]);

      setPayload(prev => ({
        ...prev,
        from_year: prev.from_year ?? from,
        to_year: prev.to_year ?? to,
      }));
    }
  }, [yearOptions]);

  const translateLabel = (key) => {
    switch (key) {
      case 'budget.analysis.reports.profitAndLoss': return 'Profit & Loss';
      case 'budget.analysis.reports.cashflow': return 'Cash Flow';
      case 'budget.analysis.reports.balanceSheet': return 'Balance Sheet';
      default: return key;
    }
  };

  return (
    <div id="report-container" className="bud-mt-sm">
      <div id="report-param-container" style={{ height: 30, marginBottom: 17, marginTop: -10 }}>
        <div className="bud-flex-inline bud-w-100" style={{ height: 30 }}>
          <div className="bud-flex-inline">

            <div className="question-label-container" style={{ margin: '0 10px' }}>
              <p className="select-label">Report</p>
            </div>
            <select
              value={payload.report_type}
              onChange={(e) => handleChange('report_type', Number(e.target.value))}
            >
              {Object.entries(availableReports).map(([label, val]) =>
                <option key={val} value={val}>{translateLabel(label)}</option>
              )}
            </select>

            <div className="question-label-container">
              <p className="select-label">Budget</p>
            </div>
            <select
              value={payload.budget_id}
              onChange={(e) => handleChange('budget_id', e.target.value)}
            >
              <option value="">Select Budget</option>
              {Object.entries(budgets).map(([id, name]) =>
                <option key={id} value={id}>{name}</option>
              )}
            </select>

            <div className="bud-flex-inline">
              <div className="question-label-container">
                <p className="select-label">Starting</p>
              </div>
              <select
                value={payload.from_year ?? ''}
                onChange={(e) => handleChange('from_year', Number(e.target.value))}
              >
                <option value="">Start Year</option>
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="bud-flex-inline">
              <div className="question-label-container">
                <p className="select-label">Ending</p>
              </div>
              <select
                value={payload.to_year ?? ''}
                onChange={(e) => handleChange('to_year', Number(e.target.value))}
              >
                <option value="">End Year</option>
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="bud-flex-inline">
              <div className="question-label-container" style={{ marginRight: 12 }}>
                <p className="select-label" style={{ marginRight: 14 }}>Historical</p>
                <button type="button"
                  className="help help‑historical‑dashboard help‑historical‑report"
                  title="Explanation of historical data"
                />
              </div>
              <select
                value={payload.last_month ?? ''}
                onChange={(e) => handleChange('last_month', Number(e.target.value))}
              >
                <option value="">None</option>
                {lastHistoricalMonth && <option value={lastHistoricalMonth}>{lastHistoricalMonth}</option>}
              </select>
            </div>

            <button
              className="button button--large button--green"
              style={{ marginLeft: 30 }}
              onClick={onGenerate}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
      <hr className="hr-analysis" />
    </div>
  );
};

export default ReportSelector;
