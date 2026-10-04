<<<<<<< HEAD
import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobsCatalogPage from './pages/JobsCatalogPage';
import JobDetailPage from './pages/JobDetailPage';
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
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeNav, setActiveNav] = useState(() => {
    try {
      if (location && location.pathname && location.pathname.startsWith('/jobs')) return 'curated-roles';
    } catch {
      // fallback
    }
    return 'discover';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Bookmarked Jobs
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

  // Convert saved job IDs to mock objects for BookmarksModal preview if needed
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
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
        savedJobsCount={savedJobIds.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenPostModal={handleOpenCreateJob}
        onOpenManageJobs={() => setIsRecruiterModalOpen(true)}
        showToast={showToast}
      />

      {/* Application Main Router Area */}
      <main className="w-full bg-[#faf9f7] min-h-[calc(100vh-140px)] flex flex-col flex-1">
        <Routes>
          {/* / (Home): Hero section, ringkasan total jobs, CTA 'Cari Kerja' dan 'Pasang Lowongan' */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenPostModal={handleOpenCreateJob}
                showToast={showToast}
              />
            }
          />

          {/* /jobs: Katalog semua lowongan aktif dengan search, filter, dan pagination */}
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

          {/* /jobs/:id: Detail lowongan — deskripsi, perusahaan, tipe, tombol 'Lamar Sekarang' */}
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

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer showToast={showToast} />

      {/* Modal Pasang / Edit Lowongan (Recruiter: POST & PUT) */}
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

      {/* Modal Kelola Lowongan Recruiter (GET /api/jobs/mine & DELETE) */}
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
          onSelectJob={(j) => setIsSavedModalOpen(false)}
          onRemoveBookmark={(id) => handleToggleBookmark({ stopPropagation: () => {} }, id)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
=======
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthView from './components/AuthView';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import Footer from './components/Footer';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('profile');
  const [toastNotification, setToastNotification] = useState(null);

  useEffect(() => {
    async function initializeAuthSession() {
      const authenticatedProfile = await api.getMe();
      if (authenticatedProfile) {
        setCurrentUser(authenticatedProfile);
      }
    }
    initializeAuthSession();
  }, []);

  const displayToast = (notificationText) => {
    setToastNotification(notificationText);
    setTimeout(() => setToastNotification(null), 4000);
  };

  const handleUserLogout = () => {
    api.logout();
    setCurrentUser(null);
    displayToast('LOGOUT BERHASIL');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1c1917] flex flex-col font-serif selection:bg-[#C9B59C] selection:text-black">

      {toastNotification && (
        <div className="fixed top-4 right-4 z-50 bg-[#1c1917] text-[#F9F8F6] px-4 py-3 font-mono text-xs border border-[#C9B59C] shadow-lg animate-bounce">
          [{toastNotification}]
        </div>
      )}

      <Header
        user={currentUser}
        onLogout={handleUserLogout}
        currentView={currentView}
        onChangeView={setCurrentView}
      />

      <main className="flex-1 flex flex-col">
        {currentView === 'profile' ? (
          <ProfilePage
            user={currentUser}
            onLogout={handleUserLogout}
            showToast={displayToast}
          />
        ) : currentView === 'home' ? (
          currentUser ? (
            <HomePage
              user={currentUser}
              onLogout={handleUserLogout}
            />
          ) : (
            <AuthView
              setUser={(user) => {
                setCurrentUser(user);
                setCurrentView('profile');
              }}
              showToast={displayToast}
            />
          )
        ) : (
          <AuthView
            setUser={(user) => {
              setCurrentUser(user);
              setCurrentView('profile');
            }}
            showToast={displayToast}
          />
        )}
      </main>

      <Footer showToast={displayToast} />
    </div>
  );
>>>>>>> feature/auth-system
}