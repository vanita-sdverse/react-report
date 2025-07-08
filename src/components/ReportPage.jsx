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
    const json = await authFetch('http://localhost/api/v1/rest/reports/generation/json', {
      method: 'POST',
      body: JSON.stringify({
        report_type: 0,
        user_id: userId,
        company_id: companyId,
      }),
    });
  
    setAvailableReports(json.data.availableReports);
    setBudgets(json.data.budgets);
    setBudgetsData(json.data.budgetsData);
    setPayload({
      report_type: json.data.reportType,
      budget_id: json.data.budget_id,
      from_year: json.data.from_year,
      to_year: json.data.to_year,
      last_month: json.data.last_month,
    });
    setReportData(json.reportData);
  };

  const handleGenerate = async () => {
    const requestBody = {
      ...payload,
      user_id: userId,
      company_id: companyId,
    };
  
    const json = await authFetch('http://localhost/api/v1/rest/reports/generation/json', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  
    setReportData(json.reportData);
  
    const firstYear = Object.keys(json.reportData || {})[0];
    const firstRow = Object.values(json.reportData?.[firstYear] || {})[0] || {};
    const monthKeys = Object.keys(firstRow).filter(
      (k) => !['type', 'active', 'variation', 'partOfRevenue'].includes(k)
    );
    setMonthHeaders({ [firstYear]: monthKeys });
  };

  return (
    <div>
      <ReportSelector
        payload={payload}
        setPayload={setPayload}
        userId={userId}
        budgets={budgets}
        budgetsData={budgetsData}
        availableReports={availableReports}
        lastHistoricalMonth={payload.last_month}
        onGenerate={handleGenerate}
      />

      {reportData && (
        <div id="analysis-container" style={{ marginTop: 6 }}>
          <div className="bud-flex-inline detail-line bud-w-100 advanced-report-parameters but-sticky-questions" style={{ display: 'flex' }}>
            <div className="bud-flex-inline" style={{ marginRight: 4 }}>
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
            </div>
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