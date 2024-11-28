import { IonInput, IonHeader, IonMenu, IonPage, IonToolbar, IonContent, IonCard, IonLabel, IonButton, IonMenuButton, IonIcon } from "@ionic/react";
import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import styles from './style/Dashboard.module.css';
import ProfilePics from "../components/ProfilePics";
import Menu from "../components/Menu";
import DarkMode from "../components/DarkMode";
import Theme from "../components/Theme";
import '../theme/variables.css';
import { useUser } from "../hooks/UserContext";
import { Storage } from "@ionic/storage";
import { useHistory } from "react-router-dom";
import { searchOutline } from "ionicons/icons";

const Dashboard: React.FC = () => {
    useEffect(() => {
        document.body.style.overflowX = "hidden";
        document.body.style.fontFamily = 'Varela Round';
    }, []);

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]); // State to hold search results
    const [loading, setLoading] = useState<boolean>(false);

    const user = sessionStorage.getItem("userInfo");
    const parsedData = user ? JSON.parse(user) : null;
    const firstName = parsedData?.firstName || "Guest";
    const history = useHistory();

    const handleMenuOpen = () => {
        setMenuIsOpen(true);
    }

    const handleMenuClose = () => {
        setMenuIsOpen(false);
    }

    // Search handler to fetch job categories and subcategories
 /*   const handleSearch = async (query: string) => {
        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost/hq2endpooint/search.php?query=${query}`);
            const data = await response.json();

            if (response.ok) {
                setSearchResults(data); // Update with search results
            } else {
                setSearchResults([]); // In case of no results
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]); // Handle error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only trigger search if the query length is greater than 2 to avoid unnecessary calls
        if (searchQuery.length > 2) {
            handleSearch(searchQuery);
        } else {
            setSearchResults([]); // Reset search results if query is empty or too short
        }
    }, [searchQuery]);*/

    const electrical = './Electricianbg.png';
    const baker = './Bakerbg.png';
    const eng = './Engbg.png';
    const painter = './Painter2bg.png';

  

    return (
        <>
            <Menu contentId="dashboard-content" onMenuOpen={handleMenuOpen} onMenuClose={handleMenuClose} />
            <IonPage id="dashboard-content" className={styles.page}>
                <IonHeader style={{ border: "none", boxShadow: "none", padding: "4px", }}>
                    <div style={{ display: 'flex', justifyContent: "space-between", border: "0px solid black", width: "100%", alignItems: "center", margin: "auto" }}>
                        <div className="menu" style={{ border: "0px solid black", justifyItems: "left", width: "fit-content" }}>
                            <IonMenuButton className={styles.menu} />
                        </div>
                        {!menuIsOpen && (
                            <div style={{ display: "flex", border: "0px solid", marginLeft: "auto", alignItems: "center" }} className={`${styles.transitionFade} ${!menuIsOpen ? styles.visible : styles.hidden}`}>
                                <div style={{ border: "0px solid black", marginLeft: "auto", paddingRight: "1em" }}>
                                    <h3>Hi <span style={{ color: "#27f316" }}>{firstName}!</span></h3>
                                </div>
                                <div style={{ marginLeft: "auto", border: "0px solid yellow" }}>
                                    <div onClick={()=>history.push('/profile')}><ProfilePics/></div>
                                </div>
                            </div>
                        )}
                    </div>
                </IonHeader>
                <IonContent style={{ '--background': "transparent" }}>
                    <div style={{ textAlign: "center", marginTop: "1em" }}>
                        <div className={styles.what}>What service are you lookng for?</div>
                        <div className={styles.inputContainer}>
                            <IonIcon icon={searchOutline}></IonIcon>
                            <IonInput
                                type="search"
                                value={searchQuery}
                                placeholder="I am looking for..."
                                className={styles.search}
                             //  {/* onIonInput={(e) => setSearchQuery(e.detail.value!)} */}//
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        searchResults.length > 0 && (
                            <div className={styles.searchResults}>
                                {searchResults.map((result, index) => (
                                    <IonCard key={index} style={{ marginBottom: "10px" }}>
                                        <h4>{result.category}</h4>
                                        <p>{result.subcategory}</p>
                                    </IonCard>
                                ))}
                            </div>
                        )
                    )}

                    
                    <div className={styles.horizontalScroll}>
                        <div className={styles.scrollContainer}>
                            <IonCard style={{ flex: "0 0 auto", width: "290px", height: "130px", marginRight: "10px", backgroundColor: "#0f0f2b", display: "flex", color: "white", alignItems: "center", justifyContent: "space-between", textAlign: "center", borderRadius: "6px" }}>
                                <div style={{ width: "50%", border: "0px solid white", color:"white", paddingBottom: "13px"}}>
                                    <h4 style={{ marginLeft: "-20px" }}>25% OFF</h4>
                                    <p style={{color:"white"}}>On first painting order</p>
                                    <button className={styles.book}>Book now</button>
                                </div>
                                <div style={{ width: "70%", marginTop: "auto" }}>
                                    <img src={painter} alt="Painter" />
                                </div>
                            </IonCard>
                            <IonCard style={{ flex: "0 0 auto", width: "290px", height: "130px", marginRight: "10px", backgroundColor: "green", display: "flex", color: "white", alignItems: "center", justifyContent: "center", textAlign: "center", borderRadius: "6px" }}>
                                <div style={{ width: "50%", border: "0px solid white", paddingBottom: "13px" }}>
                                    <h4 style={{ marginLeft: "-20px" }}>15% OFF</h4>
                                    <p style={{color:"white"}}>On first electrical order</p>
                                    <button className={styles.book}>Book now</button>
                                </div>
                                <div style={{ width: "70%", marginTop: "auto" }}>
                                    <img src={electrical} alt="Electrical" />
                                </div>
                            </IonCard>
                            <IonCard style={{ flex: "0 0 auto", width: "290px", height: "130px", marginRight: "10px", backgroundColor: "green", display: "flex", color: "white", alignItems: "center", justifyContent: "center", textAlign: "center", borderRadius: "6px" }}>
                                <div style={{ width: "50%", border: "0px solid white", paddingBottom: "13px" }}>
                                    <h4 style={{ marginLeft: "-10px" }}>10% OFF</h4>
                                    <p style={{color:"white"}}>On first baking order</p>
                                    <button className={styles.book}>Book now</button>
                                </div>
                                <div style={{ width: "70%", marginTop: "auto" }}>
                                    <img src={baker} alt="Baker" />
                                </div>
                            </IonCard>
                        </div>
                    </div>
                    <div style={{ border: "0px solid black" }}>
                        <IonLabel className={styles.lab}>
                            Category<p onClick={()=>history.push('/services')}>see all</p>
                        </IonLabel>
                    </div>
                    <div className={styles.category}>
                        <p style={{ background: '' }}>All</p>
                        <p>Electronics</p>
                        <p>Carpenters</p>
                        <p>Plumbers</p>
                    </div>
                    <div style={{ border: "0px solid black" }}>
                        <IonLabel className={styles.lab}>
                            Trending
                        </IonLabel>
                    </div>
                    <div className={styles.horizontalScroll2}>
                        <div className={styles.scrollContainer2}>
                            <IonCard style={{ flex: "0 0 auto", width: "300px", height: "200px", marginRight: "10px", backgroundColor: "#0f0f2b", display: "flex", color: "white", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                <div style={{ textAlign: "center", width: "250px", display: "block", border: "0px solid white", paddingLeft: "1rem" }}>
                                    <h1 style={{ paddingBottom: "2rem", fontSize: "2.2rem" }}>Electronics</h1>
                                    <button style={{ padding: "2px", borderRadius: "12px", width: "50%", background: "white", color: "black" }}>Check it out</button>
                                </div>
                                <div style={{ width: "60%", border: "0px solid white" }}>
                                    <img style={{ width: "100%", }} src={eng} alt="Electronics" />
                                </div>
                            </IonCard>
                            <IonCard style={{ flex: "0 0 auto", width: "300px", height: "200px", marginRight: "10px", backgroundColor: "#0f0f2b", display: "flex", color: "white", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                <div style={{ textAlign: "center", width: "250px", display: "block", border: "0px solid white", paddingLeft: "1rem" }}>
                                    <h1 style={{ paddingBottom: "2rem", fontSize: "2.2rem" }}>Electronics</h1>
                                    <button style={{ padding: "2px", borderRadius: "12px", width: "50%", background: "white", color: "black" }}>Check it out</button>
                                </div>
                                <div style={{ width: "60%", border: "0px solid white" }}>
                                    <img style={{ width: "100%", }} src={eng} alt="Electronics" />
                                </div>
                            </IonCard>
                            <IonCard style={{ flex: "0 0 auto", width: "300px", height: "200px", marginRight: "10px", backgroundColor: "#0f0f2b", display: "flex", color: "white", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                <div style={{ textAlign: "center", width: "250px", display: "block", border: "0px solid white", paddingLeft: "1rem" }}>
                                    <h1 style={{ paddingBottom: "2rem", fontSize: "2.2rem" }}>Electronics</h1>
                                    <button style={{ padding: "2px", borderRadius: "12px", width: "50%", background: "white", color: "black" }}>Check it out</button>
                                </div>
                                <div style={{ width: "60%", border: "0px solid white" }}>
                                    <img style={{ width: "100%", }} src={eng} alt="Electronics" />
                                </div>
                            </IonCard>
                        </div>
                    </div>
                    <div style={{ borderTop: "0px solid black" }} className="verified">
                        <div style={{border:"0px solid black", paddingLeft:"10px"}}>View our office Branches</div>
                    </div>
                </IonContent>
                <BottomNav />
            </IonPage>
        </>
    )
}

export default Dashboard
