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
}