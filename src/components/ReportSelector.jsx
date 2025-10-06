import React, { useEffect, useState } from 'react';

const ReportSelector = ({
  payload,
  setPayload,
  userId,
  budgets,
  budgetsData,
  availableReports,
  lastHistoricalMonth,
  onGenerate,
  apiYearRange // Add this new prop
}) => {
  const [yearOptions, setYearOptions] = useState([]);

  const handleChange = (key, value) => {
    setPayload(prev => ({ ...prev, [key]: value }));
  };

  // Generate year options based on API response or default range
  useEffect(() => {
    let fromYear, toYear;

    // First try to get years from the API response
    if (apiYearRange && apiYearRange.from_year && apiYearRange.to_year) {
      fromYear = apiYearRange.from_year;
      toYear = apiYearRange.to_year;
    }
    // Fallback to payload if available
    else if (payload.from_year && payload.to_year) {
      fromYear = payload.from_year;
      toYear = payload.to_year;
    }
    // Default range if nothing else works
    else {
      const currentYear = new Date().getFullYear();
      fromYear = currentYear - 1;
      toYear = currentYear + 10;
    }

    // Generate year options
    if (fromYear && toYear && fromYear <= toYear) {
      const list = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);
      setYearOptions(list);
      
      // Auto-select default years if not already set
      if (!payload.from_year || !payload.to_year) {
        const defaultTo = toYear;
        const defaultFrom = Math.max(toYear - 9, fromYear); // Show last 10 years or available range
        
        setPayload(prev => ({
          ...prev,
          from_year: prev.from_year || defaultFrom,
          to_year: prev.to_year || defaultTo,
        }));
      }
    }
  }, [apiYearRange, payload.budget_id, payload.report_type]);

  // Generate filtered year options for ending year
  const getEndingYearOptions = () => {
    if (!payload.from_year) return yearOptions;
    return yearOptions.filter(year => year >= parseInt(payload.from_year));
  };

  // Generate filtered year options for starting year
  const getStartingYearOptions = () => {
    if (!payload.to_year) return yearOptions;
    return yearOptions.filter(year => year <= parseInt(payload.to_year));
  };

  const translateLabel = (key) => {
    switch (key) {
      case 'budget.analysis.reports.profitAndLoss': return 'Profit & Loss';
      case 'budget.analysis.reports.cashflow': return 'Cash Flow';
      case 'budget.analysis.reports.balanceSheet': return 'Balance Sheet';
      default: return key;
    }
  };

  // Handle starting year change
  const handleStartingYearChange = (value) => {
    const startYear = Number(value);
    let updatedPayload = { from_year: startYear };
    
    if (payload.to_year && payload.to_year < startYear) {
      updatedPayload.to_year = startYear;
    }
    
    setPayload(prev => ({ ...prev, ...updatedPayload }));
  };

  // Handle ending year change
  const handleEndingYearChange = (value) => {
    const endYear = Number(value);
    let updatedPayload = { to_year: endYear };
    
    if (payload.from_year && payload.from_year > endYear) {
      updatedPayload.from_year = endYear;
    }
    
    setPayload(prev => ({ ...prev, ...updatedPayload }));
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
                onChange={(e) => handleStartingYearChange(e.target.value)}
                disabled={yearOptions.length === 0}
              >
                <option value="">Start Year</option>
                {getStartingYearOptions().map(y => 
                  <option key={`start-${y}`} value={y}>{y}</option>
                )}
              </select>
            </div>

            <div className="bud-flex-inline">
              <div className="question-label-container">
                <p className="select-label">Ending</p>
              </div>
              <select
                value={payload.to_year ?? ''}
                onChange={(e) => handleEndingYearChange(e.target.value)}
                disabled={yearOptions.length === 0}
              >
                <option value="">End Year</option>
                {getEndingYearOptions().map(y => 
                  <option key={`end-${y}`} value={y}>{y}</option>
                )}
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
              disabled={!payload.budget_id || !payload.from_year || !payload.to_year}
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