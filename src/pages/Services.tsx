import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonPage, IonIcon, IonModal, IonList, IonItem, IonSkeletonText } from '@ionic/react';
import style from './style/Services.module.css';
import { chevronBack, search } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';
import Back from '../components/Back';
import '../theme/variables.css';
import { useLocation, useParams, useHistory } from 'react-router-dom';

interface Category {
  id: number;
  category_name: string;
  category_pics: string;
  supervisor_id: number; // added supervisor_id to the category
}

interface Subcategory {
  id: number;
  subcategory_name: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const url = 'https://globalbills.com.ng/api/fetchCategory.php';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Services: React.FC = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const history = useHistory(); // Move useHistory to the top

  // Fetching service and subcategory from location state or params
  const location = useLocation();
  const { serviceId, subcategoryId } = useParams();
  const userDetails = sessionStorage.getItem("userInfo");
  const parsedData = JSON.parse(userDetails);
  const [serviceName, setServiceName] = useState<string | null>(null);
  const [subcategoryName, setSubcategoryName] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    document.body.style.fontFamily = "Varela Round, sans-serif";
    document.body.style.overflowX = "hidden";
  }, []);

  useEffect(() => {
    // Dynamically set service and subcategory names from location state or params
    if (location.state) {
      setServiceName(location.state.serviceName || null);
      setSubcategoryName(location.state.subcategoryName || null);
    } else if (serviceId && subcategoryId) {
      // Fallback to use params if available
      setServiceName(`Service ID: ${serviceId}`);
      setSubcategoryName(`Subcategory ID: ${subcategoryId}`);
    }
  }, [location, serviceId, subcategoryId]);

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);

    try {
      const response = await fetch(`https://globalbills.com.ng/api/fetchSub.php?categoryId=${category.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      const subcategoriesData = await response.json();
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    // Open chat with the supervisor associated with the category
    if (selectedCategory) {
      openChatWithSupervisor(selectedCategory.supervisor_id, selectedCategory.category_name, subcategory.subcategory_name); // Now you can call the function
    }
    setShowModal(false);
  };

  const openChatWithSupervisor = async (supervisorId: number, categoryName: string, subcategoryName: string) => {
    const chatName = categoryName;
    const senderName = parsedData.firstName; // Replace with dynamic sender's name
    const senderId = parsedData.id;// Replace with dynamic sender's ID
    const subChatName = subcategoryName;
    // Save chat info to the database
    try {
      const response = await fetch('https://globalbills.com.ng/api/saveChat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatName,
          subChatName,
          senderName,
          senderId,
          receiverId: supervisorId,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save chat');
      }
  
      console.log('Chat saved successfully');
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  
    // Navigate to the chat page
    history.push(`/chat/${supervisorId}`, { chatName, subChatName });
    console.log(`${chatName} -- ${subChatName}`)
  };
  

  const closeModal = () => {
    setShowModal(false);
  };

  const closeUp = () => {
    if (showModal) {
      setShowModal(false);
    }
  };

  return (
    <IonPage className={style.page}>
      <IonHeader onClick={() => closeUp()} style={{ boxShadow: 'none', paddingBlock: "8px" }}>
        <Back />
        <div className={style.searchField}>
          <IonIcon icon={search} />
          <input type='text' placeholder='Search Services' className={style.input} />
        </div>
      </IonHeader>
      <IonContent onClick={() => closeUp()}>
        {/* Display the dynamic service name and subcategory name in the header */}
        <div className={style.headerInfo}>
          {serviceName && <h2>{serviceName}</h2>}
          {subcategoryName && <h3>{subcategoryName}</h3>}
        </div>

        <div className={style.categoryGrid}>
          {isLoading ? (
            // Skeleton loader for each category item while loading
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={style.categoryItem}>
                <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
              </div>
            ))
          ) : (
            categories?.map((category) => (
              <div
                key={category.id}
                className={style.categoryItem}
                style={{
                  backgroundImage: `url(https://globalbills.com.ng/api/${category.category_pics})`,
                }}
                onClick={() => handleCategoryClick(category)}
              >
                <div className={style.categoryName}>{category.category_name}</div>
              </div>
            ))
          )}
        </div>

        {/* Modal to display subcategories */}
        <IonModal className={style.partialModal} isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader className={style.modalHead}>
            <div className={style.searchField}>
              <IonIcon icon={search} />
              <input type='text' placeholder='Search Services' className={style.input} />
            </div>
          </IonHeader>
          <IonContent className={style.modalContent}>
            <IonList className={style.subcategoryList}>
              {subcategories.length > 0 ? (
                subcategories.map((subcategory) => (
                  <IonItem key={subcategory.id} onClick={() => handleSubcategoryClick(subcategory)} className={style.subcategoryItem}>
                    {subcategory.subcategory_name}
                  </IonItem>
                ))
              ) : (
                <p>No subcategories found.</p>
              )}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Services;
