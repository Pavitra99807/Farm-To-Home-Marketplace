import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
      <p className="text-lg mt-2">Something went wrong</p>

      <p className="mt-4 text-gray-600">
        {error?.statusText || error?.message}
      </p>
    </div>
  );
};

export default ErrorPage;