import React, { useState, useEffect } from 'react';
import ReportSelector from './ReportSelector';
import ReportTable from './ReportTable';
import { authFetch } from '../utils/authFetch'; // ✅ import the wrapper

const ReportPage = () => {
  const root = document.getElementById('report-react-root');
  const accessToken = root?.dataset.accessToken;
  localStorage.setItem('access_token', accessToken);
  const userId = parseInt(root?.dataset.userId);
  const companyId = 1;

  const [budgets, setBudgets] = useState({});
  const [budgetsData, setBudgetsData] = useState({});
  const [availableReports, setAvailableReports] = useState({});
  const [reportData, setReportData] = useState(null);
  const [monthHeaders, setMonthHeaders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiYearRange, setApiYearRange] = useState(null);

  const [payload, setPayload] = useState({
    report_type: 0,
    budget_id: '',
    from_year: '',
    to_year: '',
    last_month: ''
  });

  const [detailLevel, setDetailLevel] = useState(1);
  const [isYearView, setIsYearView] = useState(true);

  useEffect(() => {
    fetchInitialReport();
  }, []);

  const fetchInitialReport = async () => {
    try {
      setIsLoading(true);
      
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost';
      const apiUrl = `${apiBaseUrl}/api/v1/rest/reports/generation/json`;
      
      const json = await authFetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          report_type: 0,
          budget_id: '',
          from_year: '',
          to_year: '',
          last_month: '',
          user_id: userId,
          company_id: companyId,
        }),
      });

      console.log('API Response:', json);

      // Extract data from your API structure
      const data = json.data || {};
      
      // Set the basic data
      setAvailableReports(data.availableReports || {});
      setBudgets(data.budgets || {});
      setBudgetsData(data.budgetsData || {});

      // Get year range from API response
      const yearRange = {
        from_year: data.from_year || json.from_year,
        to_year: data.to_year || json.to_year
      };
      setApiYearRange(yearRange);

      // Get default values
      const defaultBudgetId = Object.keys(data.budgets || {})[0] ?? '';
      const defaultReportType = data.reportType ?? 0;
      const lastMonth = data.last_month ?? '';

      // Set the payload with default values
      setPayload({
        report_type: defaultReportType,
        budget_id: defaultBudgetId,
        from_year: yearRange.from_year || '',
        to_year: yearRange.to_year || '',
        last_month: lastMonth,
      });

      // Set initial report data if available
      if (json.reportData) {
        setReportData(json.reportData);
        generateMonthHeaders(json.reportData);
      }
      
    } catch (error) {
      console.error('Error fetching initial report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMonthHeaders = (reportData) => {
    if (!reportData) return;
    
    const firstYear = Object.keys(reportData)[0];
    if (firstYear) {
      const firstRow = Object.values(reportData[firstYear] || {})[0] || {};
      const monthKeys = Object.keys(firstRow).filter(
        (k) => !['type', 'active', 'variation', 'partOfRevenue', 'total'].includes(k)
      );
      setMonthHeaders({ [firstYear]: monthKeys });
    }
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost';
      const apiUrl = `${apiBaseUrl}/api/v1/rest/reports/generation/json`;
      
      const requestBody = {
        ...payload,
        user_id: userId,
        company_id: companyId,
      };

      console.log('Generating report with payload:', requestBody);

      const json = await authFetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      setReportData(json.reportData);
      generateMonthHeaders(json.reportData);
      
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until we have the basic data loaded
  if (isLoading && !payload.budget_id) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {payload.budget_id && budgetsData && (
        <ReportSelector
          payload={payload}
          setPayload={setPayload}
          userId={userId}
          budgets={budgets}
          budgetsData={budgetsData}
          availableReports={availableReports}
          lastHistoricalMonth={payload.last_month}
          apiYearRange={apiYearRange} // Pass the year range from API
          onGenerate={handleGenerate}
        />
      )}

      {isLoading && reportData && <div>Generating report...</div>}

      {reportData && (
        <div id="analysis-container" style={{ marginTop: 6 }}>
          <div className="bud-flex-inline detail-line bud-w-100 advanced-report-parameters but-sticky-questions" style={{ display: 'flex' }}>
            {/* <div className="bud-flex-inline" style={{ marginRight: 4 }}>
              <div className="question-label-container" style={{ margin: '0 10px' }}>
                <p className="select-label">Detail Level</p>
              </div>
              {['overview', 'standard', 'full'].map((mode, idx) => (
                <button
                  key={mode}
                  className={`detail-level ${mode} ${detailLevel === idx ? 'active' : ''}`}
                  onClick={() => setDetailLevel(idx)}
                  style={{ marginLeft: idx > 0 ? 2 : 0 }}
                >
                  <img
                    className="bud-header--logo"
                    src={`/bundles/iplanneditbudget/img/detail-level-${idx + 1}.png`}
                    alt={`Detail level ${idx + 1}`}
                    height="22"
                  />
                </button>
              ))}
            </div>

            <div className="button-group button-group-left" style={{ marginLeft: 30 }}>
              <button
                id="show_year_month"
                className="button button--large button--green button--right"
                onClick={() => setIsYearView(!isYearView)}
              >
                {isYearView ? 'View by month' : 'View by year'}
              </button>
            </div> */}
          </div>

          <ReportTable
            reportData={reportData}
            monthHeaders={monthHeaders}
            isYearView={isYearView}
            detailLevel={detailLevel}
          />
        </div>
      )}
    </div>
  );
};

export default ReportPage;