export const generateReportData = async (
    reportType, fromYear, toYear, historical, budgetId, companyId = 1
  ) => {
    const accessToken = localStorage.getItem('access_token');  
    try {
      const response = await fetch('http://localhost/api/v1/rest/reports/generation/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${accessToken}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          report_type: reportType,
          from_year: fromYear,
          to_year: toYear,
          last_month: historical,
          company_id: companyId,
          budget_id: budgetId,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error fetching report");
  
      const firstYear = Object.keys(data?.reportData ?? {})[0];
      const firstRow = Object.values(data?.reportData?.[firstYear] || {})[0] || {};
      const monthKeys = Object.keys(firstRow).filter(k => !['type', 'active', 'variation', 'partOfRevenue'].includes(k));
  
      return {
        reportData: data?.reportData ?? null,
        monthHeaders: { [firstYear]: monthKeys }
      };
    } catch (err) {
      console.error("API Error:", err);
      return { reportData: null, monthHeaders: null };
    }
  };
  