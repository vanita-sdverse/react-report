import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const el = document.getElementById('report-react-root');
if (el) {
  const userId = parseInt(el.dataset.userId);
  const companyId = parseInt(el.dataset.companyId);
  const budgetId = parseInt(el.dataset.budgetId);
  const accessToken = el.dataset.accessToken;

  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }

  const root = createRoot(el);
  root.render(
    <App userId={userId} companyId={companyId} budgetId={budgetId} />
  );
}
