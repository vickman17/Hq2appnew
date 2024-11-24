import React, {useEffect, useState} from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, IonLabel, setupIonicReact } from '@ionic/react';
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




setupIonicReact();

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [storage, setStorage] = useState<Storage | null>(null); // useState is now correctly imported

  // Initialize Ionic Storage
  useEffect(() => {
    const initStorage = async () => {
      const newStorage = new Storage(); // No arguments needed in the constructor
      const createdStorage = await newStorage.create(); // Await the storage creation
      setStorage(createdStorage); // Set storage once it's initialized
    };

    initStorage(); // Call the initStorage function
  }, []);
  useEffect(()=>{
    document.body.style.fontFamily = "Varela Round";
  },[])

  if (!storage) {
    return <div><Loading/></div>; // You can show a loading screen while storage is being initialized
  }
  return(
    <IonApp>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <IonReactRouter>     
              <IonRouterOutlet>
                <Route exact path="/" component={Login} />
                <Route path='/login' component={Login} />
                <Route path='/verify' component={Verify} />
                <Route path='/Signup' component={Signup} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path='/notification' component={Notification}/>
                <ProtectedRoute path="/profile" component={Profile} />
                <ProtectedRoute path='/services' component={Services} />
                <ProtectedRoute path="/wallet" component={Wallet} />
                <ProtectedRoute path="/jobs" component={Jobs} />
                <ProtectedRoute path='/inbox' component={Inbox}/>
                <ProtectedRoute path='/editprofile' component={EditProfile}/>
                <ProtectedRoute path='/security' component={Security} /> 
                <ProtectedRoute path="/chat/:chatWithID" component={Chat} /> 
                <ProtectedRoute path="/userlist" component={UserList} />            
                </IonRouterOutlet>
          </IonReactRouter>
        </UserProvider>
      </QueryClientProvider>
    </IonApp>
  )

};

export default App;
