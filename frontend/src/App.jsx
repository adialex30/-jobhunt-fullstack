import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OpportunitiesPage from './pages/OpportunitiesPage';

import ApplicationsHistoryPage from './pages/ApplicationsHistoryPage';
import ProfilePage from './pages/ProfilePage';

import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import JobCreatePage from './pages/JobCreatePage';
import JobEditPage from './pages/JobEditPage';
import JobApplicantsPage from './pages/JobApplicantsPage';

import AuraApplyModal from './components/AuraApplyModal';
import AuraBookmarksModal from './components/AuraBookmarksModal';
import { jobService } from './services/jobService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Unhandled runtime error in App:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center p-8 font-mono text-[#1c1917] text-center">
          <div className="max-w-md p-6 bg-[#F9F8F6] border border-[#D9CFC7] shadow-lg">
            <h2 className="font-heading text-xl font-bold mb-2 text-[#ba1a1a]">Display Error Occurred</h2>
            <p className="text-xs text-[#57534e] mb-4">
              {this.state.error?.message || 'An unexpected runtime error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#1c1917] text-[#F9F8F6] text-xs font-mono uppercase tracking-wider"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainAppContent() {
  const navigate = useNavigate();
  const { isLoggedIn, isRecruiter, isJobSeeker } = useAuth();

  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem('saved_job_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [dbJobs, setDbJobs] = useState([]);

  React.useEffect(() => {
    jobService.getJobs({ limit: 50 })
      .then((res) => {
        if (res?.data?.jobs) setDbJobs(res.data.jobs);
      })
      .catch(() => { });
  }, []);

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleBookmark = (e, jobId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const strId = String(jobId);
    setSavedJobIds((prev) => {
      const exists = prev.includes(strId);
      let updated;
      if (exists) {
        showToast('Job removed from saved list.');
        updated = prev.filter((id) => id !== strId);
      } else {
        showToast('Job saved to your bookmarks.');
        updated = [...prev, strId];
      }
      try {
        localStorage.setItem('saved_job_ids', JSON.stringify(updated));
      } catch (e) {

      }
      return updated;
    });
  };

  const handleApplyClick = (job) => {
    if (!isLoggedIn) {
      showToast('Please log in first to apply for jobs.');
      navigate('/login');
      return;
    }

    if (isRecruiter) {
      showToast('Recruiter accounts cannot apply for jobs. Please use a Job Seeker account.');
      return;
    }

    setSelectedJobToApply(job);
    setIsApplyModalOpen(true);
  };

  const handleOpenPostJob = () => {
    if (!isLoggedIn) {
      showToast('Please log in as a Recruiter to post a job.');
      navigate('/login');
      return;
    }
    if (!isRecruiter) {
      showToast('Only Recruiter accounts can post jobs.');
      navigate('/opportunities');
      return;
    }
    navigate('/jobs/create');
  };

  const savedJobsObjects = savedJobIds.map((id) => {
    const existing = dbJobs.find((j) => String(j.id) === String(id));
    if (existing) return existing;
    return {
      id,
      title: `Job Opening #${id}`,
      company: 'Company',
      location: 'Remote',
      package: 'Competitive Salary',
      type: 'Full-time',
      tags: ['Engineering']
    };
  });

  return (
    <div className="bg-[#faf9f7] text-[#1a1c1b] min-h-screen flex flex-col font-mono selection:bg-[#f2dcc2] selection:text-[#1c1917]">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1917] text-[#F9F8F6] px-5 py-3 rounded-none shadow-2xl border-l-4 border-[#C9B59C] font-mono text-xs flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#C9B59C] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Header
        savedJobsCount={savedJobIds.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        showToast={showToast}
      />

      <main className="w-full bg-[#faf9f7] min-h-[calc(100vh-140px)] flex flex-col flex-1">
        <Routes>

          <Route
            path="/"
            element={
              <HomePage
                onOpenPostModal={handleOpenPostJob}
                showToast={showToast}
              />
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <JobDetailPage
                onApply={handleApplyClick}
                onEditJob={(job) => navigate(`/jobs/${job.id}/edit`)}
                savedJobIds={savedJobIds}
                onToggleBookmark={handleToggleBookmark}
                showToast={showToast}
              />
            }
          />

          <Route path="/login" element={<LoginPage showToast={showToast} />} />
          <Route path="/register" element={<RegisterPage showToast={showToast} />} />

          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={['job_seeker']}>
                <ApplicationsHistoryPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboardPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <JobCreatePage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <JobEditPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/applicants"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <JobApplicantsPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/opportunities"
            element={
              <OpportunitiesPage
                onApply={handleApplyClick}
                onOpenPostModal={handleOpenPostJob}
                savedJobIds={savedJobIds}
                onToggleBookmark={handleToggleBookmark}
                showToast={showToast}
              />
            }
          />

          <Route
            path="/candidates"
            element={<Navigate to="/opportunities?tab=candidates" replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer showToast={showToast} />

      {isApplyModalOpen && (
        <AuraApplyModal
          job={selectedJobToApply}
          onClose={() => setIsApplyModalOpen(false)}
          onConfirm={(company) => showToast(`Application successfully sent to ${company}!`)}
        />
      )}

      {isSavedModalOpen && (
        <AuraBookmarksModal
          savedJobs={savedJobsObjects}
          onClose={() => setIsSavedModalOpen(false)}
          onSelectJob={(j) => {
            setIsSavedModalOpen(false);
            navigate(`/jobs/${j.id}`);
          }}
          onRemoveBookmark={(id) => handleToggleBookmark({ stopPropagation: () => { } }, id)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}