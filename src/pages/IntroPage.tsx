import React, { useState } from 'react';
import { useHistory } from 'react-router';
import Slider from 'react-slick'; // Import react-slick for the slider
import { IonPage, IonContent, IonText, IonIcon } from '@ionic/react'; // Only Ionic components needed
import style from "./style/IntroPage.module.css";
import { chevronForwardCircleOutline } from 'ionicons/icons';


const IntroPage: React.FC= () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const history = useHistory();

  const onFinish = () => {localStorage.setItem('introSeen', "true")}



    const handleFinish = () => {
    onFinish(); // Mark intro as seen
    history.push('/login'); // Redirect to the login page
  };

  const slides = [
    {
      title: 'Welcome to HQ2',
      description: 'Connecting you to trusted professionals for all your service needs. HQ2 makes finding and hiring the right help fast, easy, and reliable.',
      image: '/assets/electricbox.png', // Path to the image
    },
    {
      title: 'Explore a World of Services',
      description: 'From home repairs to personal errands, HQ2 offers a wide range of services tailored to your needs. Find the perfect match for your tasks in just a few clicks',
      image: '/assets/houseRepairbg.png', // Path to the image
    },
    {
      title: 'Get Started with HQ2',
      description: 'Your on-demand solution is here. Create an account, book a service, and let HQ2 handle the rest—seamlessly and efficiently.',
      image: '/assets/waiter.png', // Path to the image
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index: number) => setCurrentSlide(index),
  };

  return (
    <IonPage>
      <IonContent>
        <div className={style.sliderContainer}>
          <Slider {...settings}>
            {slides.map((slide, index) => (
              <div key={index}>
                <div className={style.slideContent}>
                  <div className={style.imgCont}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className={style.slideImage}
                    />
                  </div>
                </div>
                <div className={style.write}>
                    <IonText>
                      <h2 className={style.h2}>{slide.title}</h2>
                      <p className={style.p}>{slide.description}</p>
                    </IonText>
                  </div>
              </div>
            ))}
          </Slider>
          <div onClick={handleFinish} className={style.skip}>
            Proceed <IonIcon src={chevronForwardCircleOutline} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IntroPage;
