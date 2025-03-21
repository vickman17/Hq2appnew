import React, { useEffect, useState } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/core.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './App.css';

import BottomNav from "./components/BottomNav";
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Notification from './pages/Notification';
import PayOption from './pages/PayOption';
import Inbox from './pages/Inbox';
import Security from './pages/Security';
import Jobs from './pages/Jobs';
import Profile from "./pages/Profile";
import Wallet from './pages/Wallet';
import EditProfile from './pages/EditProfile';
import Services from './pages/Services';
import Chat from './pages/Chat';
import IntroPage from './pages/IntroPage';
import Promo from "./components/Promo";
import ProfilePics from './components/ProfilePics';
import SearchComponent from './components/SearchComponent';
import PaystackPayment from './components/PaystackPayment';
import CardPayment from './components/CardPayment';
import RatingComponent from "./components/RatingComponent";

setupIonicReact();
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <IonApp style={{ fontFamily: "Quicksand" }}>
      <QueryClientProvider client={queryClient}>
        <IonReactRouter>
          <AppContent />
        </IonReactRouter>
      </QueryClientProvider>
    </IonApp>
  );
};

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const pagesWithBottomNav = ['/dashboard', '/inbox', '/jobs', '/wallet', '/profile'].map(path => path.toLowerCase());

  // App-wide styles and platform-specific class
  useEffect(() => {
    document.body.style.fontFamily = "Varela Round, sans-serif";
    document.body.style.overflowX = "hidden";

    if (isPlatform('ios')) {
      document.body.classList.add('ios');
    } else {
      document.body.classList.add('android'); // ✅ Corrected
    }
  }, []);

  // Splash screen timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <>
      <IonRouterOutlet>
        <Route exact path="/" component={IntroPage} />
        <Route exact path="/home" component={IntroPage} />
        <Route path='/login' component={Login} />
        <Route path='/verify' component={Verify} />
        <Route path='/signup' component={Signup} />
        <Route path='/intro' component={IntroPage} />
        <Route path="/splash" component={SplashScreen} />
        <Route path="/promo" component={Promo} />
        <Route path="/profilepic" component={ProfilePics} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path='/notification' component={Notification} />
        <Route path="/profile" component={Profile} />
        <Route path='/services' component={Services} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/jobs" component={Jobs} />
        <Route path='/inbox' component={Inbox} />
        <Route path='/editprofile' component={EditProfile} />
        <Route path='/rating' component={RatingComponent} />
        <Route path='/security' component={Security} />
        <Route path="/chat/:chatRoomId/:jobId" component={Chat} />
        <Route path="/userlist" component={UserList} />
        <Route path='/payoption' component={PayOption} />
        <Route path='/search' component={SearchComponent} />
        <Route path="/paystack" component={PaystackPayment} />
        <Route path='/pay' component={CardPayment} />
      </IonRouterOutlet>

      {/* ✅ Bottom Navigation - Conditionally Rendered */}
      {pagesWithBottomNav.includes(location.pathname.toLowerCase()) && <BottomNav />}
    </>
  );
};

export default App;
