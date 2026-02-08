'use client';

import { useEffect, useState } from 'react';

interface DbStatus {
  status: string;
  message: string;
  userCount?: number;
}

export default function ApiStatus() {
  const [apiStatus, setApiStatus] = useState<string>('Loading...');
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);

  useEffect(() => {
    // Test Go API
    fetch('http://localhost:8080/health')
      .then(res => res.json())
      .then(data => setApiStatus(data.status))
      .catch(() => setApiStatus('Error'));

    // Test Database
    fetch('/api/test-db')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(() => setDbStatus({ status: 'error', message: 'DB Error' }));
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm">
        <strong>Go API Status:</strong>{' '}
        <span className={apiStatus === 'healthy' ? 'text-green-600' : 'text-red-600'}>
          {apiStatus}
        </span>
      </p>
      
      <p className="text-sm">
        <strong>Database Status:</strong>{' '}
        <span className={dbStatus?.status === 'success' ? 'text-green-600' : 'text-red-600'}>
          {dbStatus?.message || 'Loading...'}
        </span>
      </p>

      {dbStatus?.userCount !== undefined && (
        <p className="text-xs text-gray-500">
          Users in database: {dbStatus.userCount}
        </p>
      )}
    </div>
  );
}