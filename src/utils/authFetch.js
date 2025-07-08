export async function authFetch(url, options = {}) {
    const root = document.getElementById('report-react-root');
    let accessToken = root?.dataset.accessToken || localStorage.getItem('access_token');

    console.log('Access token before request:', accessToken);
  
    // Set Authorization header
    options.headers = {
      ...(options.headers || {}),
      Authorization: `${accessToken}`,
      'Content-Type': 'application/json'
    };
  
    // First attempt
    let res = await fetch(url, options);
  
    // If access token expired, attempt refresh
    if (res.status === 401) {
      console.warn('Access token expired, attempting refresh…');
  
      const refreshRes = await fetch('/analysis/report/api/token/refresh', {
        method: 'GET',
        credentials: 'include', // Only if cookies used
      });
  
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newAccessToken = data.token;
  
        // Save new token
        localStorage.setItem('access_token', newAccessToken);
  
        // Retry original request with new token
        options.headers.Authorization = `Bearer ${newAccessToken}`;
        res = await fetch(url, options);
      } else {
        console.error('Refresh token failed. Redirecting to login.');
        localStorage.clear();
        window.location.href = '/app_dev.php/en/login'; // adjust this if you're using prod or `/login`
        return;
      }
    }
  
    // Handle other responses
    if (!res.ok) {
      console.error('Request failed:', res.status);
      throw new Error(`API request failed with status ${res.status}`);
    }
  
    return res.json();
  }