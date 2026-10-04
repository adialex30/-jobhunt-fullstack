import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobsCatalogPage from './pages/JobsCatalogPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import CreateJobPage from './pages/CreateJobPage';
import EditJobPage from './pages/EditJobPage';
import JobApplicantsPage from './pages/JobApplicantsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import PostJobModal from './components/PostJobModal';
import RecruiterJobsModal from './components/RecruiterJobsModal';
import AuraApplyModal from './components/AuraApplyModal';
import AuraBookmarksModal from './components/AuraBookmarksModal';
import { AURA_JOBS } from './data/auraJobsData';

// Class Error Boundary to prevent blank screen crashes
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
            <h2 className="font-heading text-xl font-bold mb-2 text-[#ba1a1a]">Terjadi Kendala Tampilan</h2>
            <p className="text-xs text-[#57534e] mb-4">
              {this.state.error?.message || 'Terjadi kesalahan runtime tak terduga.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#1c1917] text-[#F9F8F6] text-xs font-mono uppercase tracking-wider"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [savedJobIds, setSavedJobIds] = useState(['1', '2']);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateJob = () => {
    setJobToEdit(null);
    setIsPostModalOpen(true);
  };

  const handleOpenEditJob = (job) => {
    setJobToEdit(job);
    setIsPostModalOpen(true);
  };

  const handleToggleBookmark = (e, jobId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const strId = String(jobId);
    setSavedJobIds((prev) => {
      const exists = prev.includes(strId);
      if (exists) {
        showToast('Lowongan dihapus dari daftar tersimpan.');
        return prev.filter((id) => id !== strId);
      } else {
        showToast('Lowongan disimpan ke arsip tersimpan Anda.');
        return [...prev, strId];
      }
    });
  };

  const savedJobsObjects = savedJobIds.map((id) => {
    const existing = AURA_JOBS.find((j) => j.id === id);
    if (existing) return existing;
    return {
      id,
      title: `Lowongan Pekerjaan #${id}`,
      company: 'Verified Partner Studio',
      location: 'Remote / Jakarta',
      package: 'Kompensasi Kompetitif',
      type: 'Full-Time',
      tags: ['Engineering', 'Design']
    };
  });

  return (
    <div className="bg-[#faf9f7] text-[#1a1c1b] min-h-screen flex flex-col font-mono selection:bg-[#f2dcc2] selection:text-[#1c1917]">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1917] text-[#F9F8F6] px-5 py-3 rounded-none shadow-2xl border-l-4 border-[#C9B59C] font-mono text-xs flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#C9B59C] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header */}
      <Header
        savedJobsCount={savedJobIds.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        showToast={showToast}
      />

      {/* Application Main Router Area */}
      <main className="w-full bg-[#faf9f7] min-h-[calc(100vh-140px)] flex flex-col flex-1">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          {/* 1. / (Home) */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenPostModal={handleOpenCreateJob}
                showToast={showToast}
              />
            }
          />

          {/* 2. /jobs (Katalog Lowongan) */}
          <Route
            path="/jobs"
            element={
              <JobsCatalogPage
                savedJobIds={savedJobIds}
                onToggleBookmark={handleToggleBookmark}
                showToast={showToast}
              />
            }
          />

          {/* 3. /jobs/:id (Detail Lowongan) */}
          <Route
            path="/jobs/:id"
            element={
              <JobDetailPage
                onApply={(job) => {
                  setSelectedJobToApply(job);
                  setIsApplyModalOpen(true);
                }}
                onEditJob={handleOpenEditJob}
                savedJobIds={savedJobIds}
                onToggleBookmark={handleToggleBookmark}
                showToast={showToast}
              />
            }
          />

          {/* 4. /login */}
          <Route
            path="/login"
            element={<LoginPage showToast={showToast} />}
          />

          {/* 5. /register */}
          <Route
            path="/register"
            element={<RegisterPage showToast={showToast} />}
          />

          {/* ================= JOB SEEKER PROTECTED ROUTES ================= */}
          {/* 1. /applications (Riwayat Lamaran) */}
          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={['job_seeker']}>
                <ApplicationsPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* 2. /profile (Profil User) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* ================= RECRUITER PROTECTED ROUTES ================= */}
          {/* 1. /dashboard (Dashboard Recruiter) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboardPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* 2. /jobs/create (Form Posting Lowongan Baru) */}
          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <CreateJobPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* 3. /jobs/:id/edit (Form Edit Lowongan) */}
          <Route
            path="/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <EditJobPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* 4. /jobs/:id/applicants (Tabel Pelamar & Update Status) */}
          <Route
            path="/jobs/:id/applicants"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <JobApplicantsPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer showToast={showToast} />

      {/* Modal Pasang / Edit Lowongan (Quick modal option) */}
      <PostJobModal
        isOpen={isPostModalOpen}
        jobToEdit={jobToEdit}
        onClose={() => {
          setIsPostModalOpen(false);
          setJobToEdit(null);
        }}
        onJobCreated={(newJob) => {
          showToast(`Lowongan '${newJob?.title || 'Baru'}' berhasil dipublikasikan!`);
        }}
        onJobUpdated={(updatedJob) => {
          showToast(`Lowongan '${updatedJob?.title || 'Pekerjaan'}' berhasil diperbarui!`);
        }}
        showToast={showToast}
      />

      {/* Modal Kelola Lowongan Recruiter */}
      <RecruiterJobsModal
        isOpen={isRecruiterModalOpen}
        onClose={() => setIsRecruiterModalOpen(false)}
        onOpenCreateJob={handleOpenCreateJob}
        onEditJob={handleOpenEditJob}
        showToast={showToast}
      />

      {/* Modal Lamar Lowongan */}
      {isApplyModalOpen && (
        <AuraApplyModal
          job={selectedJobToApply || { title: 'Posisi Karir', company: 'Perusahaan Terverifikasi' }}
          onClose={() => setIsApplyModalOpen(false)}
          onConfirm={(company) => showToast(`Lamaran berhasil dikirim ke ${company}!`)}
        />
      )}

      {/* Modal Saved Bookmarks */}
      {isSavedModalOpen && (
        <AuraBookmarksModal
          savedJobs={savedJobsObjects}
          onClose={() => setIsSavedModalOpen(false)}
          onSelectJob={() => setIsSavedModalOpen(false)}
          onRemoveBookmark={(id) => handleToggleBookmark({ stopPropagation: () => {} }, id)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}