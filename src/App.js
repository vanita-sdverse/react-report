import React from 'react';
import ReportPage from './components/ReportPage';

/**
 * The App component is the main entry point.
 * It receives props from Symfony via `data-*` attributes embedded in the HTML.
 * These props are passed to ReportPage, which renders the UI.
 */
const App = ({ userId, companyId, budgetId }) => {
  return (
    <div className="report-container bud-mt-sm">
      <ReportPage
        userId={userId}
        companyId={companyId}
        defaultBudgetId={budgetId}
      />
    </div>
  );
};

export default App;