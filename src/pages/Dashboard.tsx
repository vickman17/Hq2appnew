import { IonInput, IonModal, IonHeader, IonList, IonTextarea, IonItem, IonMenu, IonImg, IonPage, IonToolbar, IonContent, IonSkeletonText, IonCard, IonLabel, IonButton, IonMenuButton, IonIcon } from "@ionic/react";
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
import { useHistory, useLocation, useParams} from "react-router-dom";
import { searchOutline, arrowForward} from "ionicons/icons";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { createChatRoom } from '../services/ChatServices';
import search from "/assets/svg/search.svg";
import star from "/assets/svg/starOutline.svg";




interface Category {
    id: number;
    category_name: string;
    category_pics: string;
    supervisor_id: number;
  }
  
  interface Subcategory {
    id: number;
    subcategory_name: string;
  }
  
  interface RouteParams {
    serviceId?: string;
    subcategoryId?: string;
  }
  
  const fetchCategories = async (): Promise<Category[]> => {
    const url = 'http://localhost/api/fetchCategory.php';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

const backgroundImages = [
    '/assets/toolswood.jpg',
    '/assets/painttool.jpg',
    '/assets/mechtools.jpg',
    '/assets/cleantool.jpg',
    '/assets/event.jpg',
    '/assets/actool.jpg',
    '/assets/map.jpeg',
  ];

const Dashboard: React.FC = () => {
    useEffect(() => {
        document.body.style.overflowX = "hidden";
        document.body.style.fontFamily = 'Varela Round';
    }, []);

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]); // State to hold search results
    const [loading, setLoading] = useState<boolean>(false);
    const camera = "/assets/camera.png";
    const hospitality = "/assets/cook.png"
    const user = sessionStorage.getItem("userInfo");
    const history = useHistory();
      const [index, setIndex] = useState(0);
      const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
      });
    
      const [showModal, setShowModal] = useState(false);
      const [showJobRequestModal, setShowJobRequestModal] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
      const [selectedSubcategory, setSelectedSubcategory] = useState(""); 
      const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
      const [toast, setToast] = useState(false);
      const [toastText, setToastText] = useState("");
      const [showServiceModal, setShowServiceModal] = useState<boolean>(false);

      const location = useLocation<{ serviceName?: string; subcategoryName?: string }>();
      const { serviceId, subcategoryId } = useParams<RouteParams>();
      const userDetails = sessionStorage.getItem('userInfo');
      const parsedData = userDetails ? JSON.parse(userDetails) : null;
      const userId = parsedData?.user_id;
      const firstName = parsedData?.firstName || "Guest";
      const [serviceName, setServiceName] = useState<string | null>(null);
      const [subcategoryName, setSubcategoryName] = useState<string | null>(null);
      const [loader, setLoader] = useState<boolean>(false);
    
      const [address, setAddress] = useState<string>('');
      const [additionalDetails, setAdditionalDetails] = useState<string>('');
      const [images, setImages] = useState<FileList | null>(null);
    

const openService = () => {
    setShowServiceModal(true)
}

const closeService = () => {
    setShowServiceModal(false)
}

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change background every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.state) {
      setServiceName(location.state.serviceName || null);
      setSubcategoryName(location.state.subcategoryName || null);
    } else if (serviceId && subcategoryId) {
      setServiceName(`Service ID: ${serviceId}`);
      setSubcategoryName(`Subcategory ID: ${subcategoryId}`);
    }
  }, [location, serviceId, subcategoryId]);



  const handleCreateChat = async (jobId: string, adminId: string, userId: string) => {
    try {
      const chatRoomId = await createChatRoom(jobId, adminId, userId);
      console.log(`Created chat room with ID: ${chatRoomId}`);
      return chatRoomId; // Return the chat room ID for further use
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  };





  const handleCategoryClick = async (category: Category) => {
    setShowModal(true);
    setSelectedCategory(category);
    setLoader(true);

    try {
      const response = await fetch(`http://localhost/api/fetchSub.php?categoryId=${category.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }

      const responseBody = await response.text();
      console.log('Raw Response:', responseBody);
      if (!responseBody) {
        throw new Error('Response body is empty');
      }

      try {
        const subcategoriesData = JSON.parse(responseBody);
        setSubcategories(subcategoriesData);
        console.log(subcategoriesData);
      } catch (error) {
        throw new Error('Error parsing JSON: ' + error);
      }
      setLoader(false);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setLoader(false);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    setShowJobRequestModal(true);
    setSelectedSubcategory(subcategory.subcategory_name);
    console.log(subcategory.subcategory_name)
    setShowModal(false);
  };

  const handleSubmitJobRequest = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!additionalDetails) {
      alert('Please fill in address and additional details fields');
      return;
    }
  
    if (!images) {
      alert('Please upload at least one image');
      return;
    }
  
    // Convert images to base64 strings
    const convertImagesToBase64 = async (fileList: FileList) => {
      const promises = Array.from(fileList).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      });
      return Promise.all(promises);
    };
  
    try {
      const base64Images = await convertImagesToBase64(images);
  
      // Create JSON payload
      const payload = {
        userId,
        address,
        selectedState,
        selectedLga,
        skill: selectedSubcategory,
        additionalDetails,
        images: base64Images,
      };
  
      const response = await fetch('http://localhost/api/saveJobRequest.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save job request');
      }
  
      const responseData = await response.json();
      console.log('Job request saved successfully:', responseData);
  
      // Fetch supervisors by profession
      const supervisorsResponse = await fetch(
        `http://localhost/api/supervisors.php?profession=${encodeURIComponent(selectedCategory?.category_name || '')}`,
        {
          method: 'GET',
        }
      );
  
      if (!supervisorsResponse.ok) {
        throw new Error('Failed to fetch supervisors');
      }
  
      const supervisors = await supervisorsResponse.json();
  
      if (!Array.isArray(supervisors) || supervisors.length === 0) {
        throw new Error('No supervisors available for the selected category');
      }
  
      // Randomly select a supervisor
      const randomSupervisor = supervisors[Math.floor(Math.random() * supervisors.length)];
      const adminId = randomSupervisor.id.toString(); // Get the supervisor's ID
  
      // Create a chat room with the job ID, admin ID, and user ID
      await handleCreateChat(responseData.jobId, adminId, userId);
  
      // Redirect to the chat room or show a success message
      history.push(`/chat/${responseData.jobId}`); // Example: Redirect to the chat room
  
    } catch (error) {
      console.error('Error saving job request or fetching supervisors:', error);
      alert('An error occurred. Please try again.');
    }
  };
   
  const closeModal = () => {
    setShowModal(false);
  };

  const closeJobRequestModal = () => {
    setShowJobRequestModal(false);
  };


/***********************LOCATION API ***********************/

const [states, setStates] = useState<string[]>([]); // Stores list of states
const [lgas, setLgas] = useState<string[]>([]); // Stores list of LGAs for residential


const [selectedState, setSelectedState] = useState<string>(''); // Stores selected state (residential)
const [selectedLga, setSelectedLga] = useState<string>(''); // Stores selected LGA (residential)

const [loadingStates, setLoadingStates] = useState<boolean>(true); // State for states loading
const [loadingLgas, setLoadingLgas] = useState<boolean>(false); // State for LGAs loading (residential)
const [loadingWorkLgas, setLoadingWorkLgas] = useState<boolean>(false); // State for work LGAs loading

// Fetch states from API
const getStatesFromApi = async () => {
  try {
    const response = await fetch('https://nga-states-lga.onrender.com/fetch');
    const json = await response.json();
    return json || []; // Ensure empty array if no states
  } catch (error) {
    setToast(true)
    setToastText('Check your internet connection!');
    return []; // Return an empty array in case of error
  }
};

// Fetch all states on component mount
useEffect(() => {
  const fetchStates = async () => {
    const states = await getStatesFromApi();
    setStates(states); // Set the states
    console.log(states)
    setLoadingStates(false); // Stop the loading indicator
  };

  fetchStates();
}, []);

// Fetch LGAs for residential address when a state is selected
useEffect(() => {
  if (selectedState) {
    const fetchLgas = async () => {
      setLoadingLgas(true); // Start loading indicator for residential LGAs
      try {
        const response = await fetch(`https://nga-states-lga.onrender.com/?state=${selectedState}`);
        const json = await response.json();
        setLgas(json || []); // Ensure empty array if no LGAs
      } catch (error) {
        setToast(true)
        setToastText('Check your internet connection!');
        setLgas([]); // Ensure empty array if error occurs
      } finally {
        setLoadingLgas(false); // Stop the loading indicator for residential LGAs
      }
    };

    fetchLgas();
  } else {
    setLgas([]); // Clear LGAs when no state is selected for residential address
  }
}, [selectedState]);


    const [isSearchActive, setIsSearchActive] = useState(false);
const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

const handleFocus = () => {
    setIsSearchActive(true);
    // Example suggestions (replace with API call)
    setSearchSuggestions(["Electrician", "Plumber", "Painter", "AC Repair", "Cleaning Service", "Cleaning Service", "Cleaning Service", "Cleaning Service", "Cleaning Service", "Cleaning Service"]);
};

const handleBlur = () => {
    setTimeout(() => setIsSearchActive(false), 200); // Delay to allow click on suggestion
};



  

    return (
        <IonPage >
            <IonContent className={styles.page}>
            <motion.div
          key={index}
          className={styles.background}
          style={{ backgroundImage: `url(${backgroundImages[index]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />

        <div className={styles.topCont}>
            <div style={{border: "0px solid", width: "95%", margin: "auto", display: "flex", justifyContent: "space-between"}}>
                <div style={{display: "flex", border: "0px solid black", width: "60%", alignItems: "center"}}>
                    <div style={{width: "45px", height: "45px"}}>
                        <ProfilePics/>
                    </div>
                    <div className={styles.id}>
                        <div style={{fontSize: "17px", fontWeight:"600"}} className={styles.name}>Victory Madumere jkkkkkk</div>
                        <div style={{fontSize: "14px", marginTop: "2px"}}>Premium</div>
                    </div>
                </div>

                <div>
                    bell
                </div>
            </div>    

            {/* Overlay (Covers full page except search bar) */}
            {isSearchActive && <div className={styles.overlay}></div>}

            {/* Search Input */}
            <div className={styles.searchCont}>
                <div style={{ paddingInline: "6px", alignItems: "baseline" }}>
                    <img src={search} width={30} />
                </div>
                <input
                    placeholder="Search services"
                    className={styles.search}
                    type="text"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {/* Suggestions Box */}
                {isSearchActive && (
                    <div className={styles.suggestions}>
                        {searchSuggestions.map((suggestion, index) => (
                            <div key={index} className={styles.suggestionItem}>
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>    
          <div className={styles.backCont}>
              <div className={styles.itemCont}>
              {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className={styles.categoryItem}>
                          <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
                      </div>
                  ))
              ) : (
                  Array.isArray(categories) && categories.length > 0 ? (
                      categories.slice(0, 3).map((category) => ( // Slice first 3 items
                          <div
                              key={category.id}
                              className={styles.item}
                              onClick={() => handleCategoryClick(category)}
                          >
                              <div className={styles.imgCont}>
                                  <img 
                                      style={{
                                          width: "100%", 
                                          height: "100%",  
                                          objectFit: "cover", 
                                          objectPosition: "center", 
                                          borderRadius: ".6rem", 
                                          margin: "auto"
                                      }}  
                                      src={`http://localhost/api/${category.category_pics}`} 
                                      alt={category.category_name}
                                  />
                              </div>
                              <div style={{ border: "0px solid", width: "95%", margin: "auto", marginTop: "5px", textAlign: "right" }}>0</div>
                              <div className={styles.categoryName}>{category.category_name}</div>
                          </div>
                      ))
                  ) : (
                      <p>No categories found.</p>
                  )
              )}
              <div onClick={openService} style={{background: "transparent", color: "black", display: "flex", justifyContent: "center", alignItems: "center"}}>
                      see all
                      <IonIcon icon={arrowForward} />
                  </div>
              </div>
          </div>
          <IonModal isOpen={showServiceModal} onDidDismiss={closeService}>
              <IonContent>
                            {/* Overlay (Covers full page except search bar) */}
            {isSearchActive && <div className={styles.overlay}></div>}
                <div onClick={closeService} style={{border: "0px solid black", paddingBlock: ".5rem", marginLeft: "auto", marginTop: ".3rem", paddingInline: "10px", width: "fit-content"}}>Close</div>

            {/* Search Input */}
            <div style={{background: "rgba(0, 0, 0, 0.587)"}} className={styles.searchContMod}>
                <div style={{ paddingInline: "6px", alignItems: "baseline" }}>
                    <img src={search} width={30} />
                </div>
                <input
                    placeholder="Search services"
                    className={styles.search}
                    type="text"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {/* Suggestions Box */}
                {isSearchActive && (
                    <div className={styles.suggestions}>
                        {searchSuggestions.map((suggestion, index) => (
                            <div key={index} className={styles.suggestionItem}>
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
                </div>
                <div 
                    // className={styles.itemCont}
                >
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className={styles.categoryItem}>
                            <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
                        </div>
                    ))
                ) : (
                    Array.isArray(categories) && categories.length > 0 ? (
                        categories.map((category) => ( // Slice first 3 items
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                style={{ position: "relative", cursor: "pointer" }}
                            >
                                <div className={styles.imgCont} style={{ position: "relative" }}>
                                    <img
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                            borderRadius: ".6rem",
                                            margin: "auto",
                                            display: "block",
                                        }}
                                        src={`http://localhost/api/${category.category_pics}`}
                                        alt={category.category_name}
                                    />

                                    {/* Black transparent overlay */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "rgba(0, 0, 0, 0.5)", // 50% transparent black
                                            borderRadius: ".6rem",
                                        }}
                                    >
                                      <div style={{border: "0px solid", width: "95%", height: "30px", textAlign: "right", margin: "auto", marginTop: "10px"}}>
                                        <img width={20} src={star} />
                                      </div>
                                    </div>

                                    {/* Category Name on Image */}
                                    <div
                                        style={{
                                            border: "0px solid #f5f5f5",
                                            width: "90%",
                                            position: "absolute",
                                            top: "85%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            color: "#fff",
                                            fontWeight: "800",
                                            fontSize: "1.2rem",
                                            textAlign: "center",
                                            zIndex: 2, // Ensure it appears above the overlay
                                        }}
                                    >
                                        {category.category_name}
                                    </div>
                                </div>
{/* 
                                <div
                                    style={{
                                        borderBottom: "0.5px solid rgb(238, 238, 238)",
                                        width: "95%",
                                        margin: "auto",
                                        marginTop: "5px",
                                        textAlign: "right",
                                        paddingBottom: ".5rem",
                                        marginBottom: ".5rem",
                                    }}
                                >
                                    0
                                </div> */}
                            </div>

                        ))
                    ) : (
                        <p>No categories found.</p>
                    )
                )}
                </div>
                </IonContent>
          </IonModal>
          <IonModal className={styles.partialModal} isOpen={showModal} onDidDismiss={closeModal}>
            <IonContent className={styles.modal}>
            {selectedCategory && (
              <div style={{height: "270px", backgroundImage:  `url(http://localhost/api/${selectedCategory.category_pics})`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover"}}>
                                   {/* Overlay (Covers full page except search bar) */}
              <div style={{background: "rgba(0, 0, 0, 0.587)", height: "100%", paddingTop: "5rem"}}>
                {isSearchActive && 
                  <div className={styles.overlay} >
                    <div style={{color: "rgba(255, 255, 255, 0.56)", marginTop: "2rem"}}>
                       close search
                    </div>
                  </div>
                  }
                {/* Search Input */}
                <div style={{background: "rgba(0, 0, 0, 0.587)", marginTop: "0"}} className={styles.searchCont}>
                    <div style={{ paddingInline: "6px", alignItems: "baseline" }}>
                        <img src={search} width={30} />
                    </div>
                    <input
                        placeholder="Search services"
                        className={styles.search}
                        type="text"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    {/* Suggestions Box */}
                    {isSearchActive && (
                        <div className={styles.suggestions}>
                            {searchSuggestions.map((suggestion, index) => (
                                <div key={index} className={styles.suggestionItem}>
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div onClick={closeModal} style={{color: "white"}}>
                  Close
                </div>
                {selectedCategory && (
                  <div style={{margin: "auto", color: "white", border: "0px solid", fontWeight: "700", fontSize: "25px", marginTop: "3rem", width: "95%", wordWrap: "break-word"}}>
                    {selectedCategory.category_name}
                  </div>
                )}
                
                </div>
              </div>)}
              <div className={styles.randomContainer}>
                {loader ? (
                  <IonSkeletonText animated />
                ) : (
                  Array.isArray(subcategories) && subcategories.length > 0 ? (
                    subcategories.map((subcategory) => (
                      <div 
                      key={subcategory.id}
                      className={styles.box}
                      style={{
                        width: "fit-content", // Adjust width based on text length
                        // height: '40px',  Fixed height
                        textAlign: 'center',
                        border: "1px solid"
                      }}                        
                      onClick={() => handleSubcategoryClick(subcategory)}
                      >
                        <div >{subcategory.subcategory_name}</div>
                      </div>
                    ))
                  ) : (
                    <p>No subcategories found.</p>
                  )
                )}
              </div>
            </IonContent>
            </IonModal>
              <IonModal
                isOpen={showJobRequestModal}
                onDidDismiss={closeJobRequestModal}
                className={styles.modalContent}
              >
                <IonHeader className={styles.modalHead}>
                  <h2>Request for {selectedSubcategory} from {selectedCategory ? selectedCategory.category_name : 'Not Selected'}</h2>
                </IonHeader>
                <IonContent className={styles.modalContent}>
                  <div onClick={closeJobRequestModal}>
                      x
                  </div>
                    <div>
                    <select
                      id="state"
                      value={selectedState}
                      className={styles.input}
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      <option value="" hidden>--Choose a State--</option>
                      {loadingStates ? (
                        <option disabled>Loading States...</option>
                      ) : (
                        states.length > 0 ? (
                          states.map((state, index) => (
                            <option key={index} value={state}>{state}</option>
                          ))
                        ) : (
                          <option disabled>No states available</option>
                        )
                      )}
                    </select>
                    </div>

                    <div>
                    <select className={styles.input} id="lga"
                      disabled={!selectedState || loadingLgas}
                      onChange={(e) => setSelectedLga(e.target.value)}>
                      <option value="" hidden>--Choose an LGA--</option>
                      {loadingLgas ? (
                        <option disabled>Loading LGAs...</option>
                      ) : (
                        lgas.length > 0 ? (
                          lgas.map((lga, index) => (
                            <option key={index} value={lga}>{lga}</option>
                          ))
                        ) : (
                          <option disabled>No LGAs available</option>
                        )
                      )}
                    </select>

                    </div>

                    <div className={styles.formGroup}>
                      <label>Address</label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value!)}
                        placeholder="Enter your address"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Additional Details</label>
                      <input
                        value={additionalDetails}
                        onChange={(e) => setAdditionalDetails(e.target.value!)}
                        placeholder="Provide additional details if necessary"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Upload Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setImages(e.target.files)}
                      />
                    </div>

                    <IonButton onClick={handleSubmitJobRequest} type="submit" expand="full">
                      Submit Request
                    </IonButton>
                  
                </IonContent>
              </IonModal>
            </IonContent>
        </IonPage>
    )
}

export default Dashboard
