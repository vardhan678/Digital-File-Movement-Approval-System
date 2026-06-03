import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiFolder } from 'react-icons/fi';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-300 p-4">
      <div className="text-center max-w-md animate-fade-in">
        {/* Big 404 */}
        <div className="relative mb-6">
          <div className="text-[120px] font-black text-primary-100 dark:text-primary-900/30 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
              <FiFolder className="w-10 h-10 text-primary-400" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link to="/dashboard" className="btn-primary flex items-center gap-2">
            <FiHome className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
