import { useState, useEffect } from "react";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 180);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    setProgress(0);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      {isLoading && (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-6">
          {/* Spinner amélioré avec effet de pulsation */}
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border-[6px] border-blue-100"></div>
            <div
              className="absolute inset-0 animate-spin rounded-full border-[6px] border-blue-500 border-t-transparent"
              style={{ animationDuration: "1.2s" }}
            ></div>

            {/* Pourcentage de chargement */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-medium text-blue-600">
                {progress}%
              </span>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="h-2.5 w-64 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Message avec animation de points */}
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium text-gray-700">
              Loading Dashboard
              <span className="ml-1 inline-block animate-pulse">
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "0ms" }}
                >
                  .
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "150ms" }}
                >
                  .
                </span>
                <span
                  className="inline-block animate-bounce"
                  style={{ animationDelay: "300ms" }}
                >
                  .
                </span>
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Preparing your analytics data
            </p>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-red-50 p-6 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <svg
              className="animate-shake h-10 w-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-800">
            Loading Failed
          </h3>
          <p className="mb-6 max-w-md text-gray-600">
            We couldn&apos;t load the dashboard data. Please check your
            connection and try again.
          </p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Analytics Dashboard
            </h2>
            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
              <iframe
                className="h-full w-full border-0"
                src="https://charts.mongodb.com/charts-project-0-ionjeod/public/dashboards/22f174e6-48a3-4c10-9bfd-321b93008eb6"
                allowFullScreen
                loading="eager"
                onLoad={() => {
                  setProgress(100);
                  setTimeout(() => setIsLoading(false), 300);
                }}
                onError={() => {
                  setIsError(true);
                  setIsLoading(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
