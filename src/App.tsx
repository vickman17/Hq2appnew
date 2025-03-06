import React, {useEffect, useState} from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, IonLabel, setupIonicReact, getPlatforms, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Notification from './pages/Notification';
import Inbox from './pages/Inbox';
import Security from './pages/Security';
import '../src/theme/variables.css';
import Jobs from './pages/Jobs';
import Loading from "./components/Loading";
import {homeOutline, wallet} from 'ionicons/icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import BottomNav from "./components/BottomNav";

//import ionic CSS
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/core.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import Menu from './components/Menu';
import Profile from "./pages/Profile";
import Wallet from './pages/Wallet';
import EditProfile from './pages/EditProfile';
import Services from './pages/Services';
import { UserProvider } from './hooks/UserContext';
import { Storage } from '@ionic/storage';
import ProtectedRoute from './hooks/ProtectedRouteProps';
import Transition from './components/Transition';
import Chat from './pages/Chat';
import SplashScreen from './components/SplashScreen';
import IntroPage from './pages/IntroPage';
import Promo from "./components/Promo";
import ProfilePics from './components/ProfilePics';

setupIonicReact()




const queryClient = new QueryClient();

const App: React.FC = () => {
  const [storage, setStorage] = useState<Storage | null>(null); // useState is now correctly imported
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getIntro, setGetIntro] = useState<React.FC>(() => IntroPage);
  const location = useLocation();
  const pagesWithBottomNav = ['/dashboard', '/inbox', '/notificationpage', '/setting', '/wallet'];


  useEffect(() => {
    document.body.style.fontFamily = "Varela Round, sans-serif";
    document.body.style.overflowX = "hidden";
  }, []);

  useEffect(() => {
    // Check if the platform is iOS
    if (isPlatform('ios')) {
      document.body.classList.add('ios');
    } else {
      document.body.classList.add('ios'); // Apply iOS styles even if not iOS
    }
  }, []);


  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Set a timeout to hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 6000);

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  if (showSplash) {
    return (
      <SplashScreen/>
    );
  }

  return(
    <IonApp style={{fontFamily: "Quicksand"}}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <IonReactRouter>     
              <IonRouterOutlet>
                <Route exact path="/" component={getIntro} />
                <Route path='/login' component={Login} />
                <Route path='/verify' component={Verify} />
                <Route path='/Signup' component={Signup} />
                <Route path='/intro' component={IntroPage}/>
                <Route path="/splash" component={SplashScreen}/>
                <Route path="/promo" component={Promo} />
                <Route path="/profilepic" component={ProfilePics} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path='/notification' component={Notification}/>
                <ProtectedRoute path="/profile" component={Profile} />
                <ProtectedRoute path='/services' component={Services} />
                <ProtectedRoute path="/wallet" component={Wallet} />
                <ProtectedRoute path="/jobs" component={Jobs} />
                <ProtectedRoute path='/inbox' component={Inbox}/>
                <ProtectedRoute path='/editprofile' component={EditProfile}/>
                <ProtectedRoute path='/security' component={Security} /> 
                <ProtectedRoute path="/chat/:chatRoomId/:jobId" component={Chat} />
                <ProtectedRoute path="/userlist" component={UserList} />            
              </IonRouterOutlet>
                    {/* Bottom Nav visibility */}
                    {pagesWithBottomNav.includes(location.pathname) && (
                <BottomNav />
              )}
          </IonReactRouter>
        </UserProvider>
      </QueryClientProvider>
    </IonApp>
  )

};

export default App;
