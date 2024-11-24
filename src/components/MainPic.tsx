import Reac, {useEffect, useState} from "react";
import style from './MainPic.module.css';

const MainPic: React.FC =()=>{
    const userInfo = sessionStorage.getItem("userInfo");
    const parse = JSON.parse(userInfo);
    const userId = parse.id;
    const [profileImage, setProfileImage] = useState<string | null>(null);



    useEffect(() => {
        // Fetch profile image on component mount
        const fetchProfileImage = async () => {
          try {
            const response = await fetch(`https://globalbills.com.ng/api/getProfile.php?userId=${userId}`);
            const data = await response.json();
    
            if (data.status === "success") {
              // Set the base64 image string as the source
              setProfileImage(`data:image/*;base64,${data.profile_picture}`);
            } else {
              console.error("Error fetching profile picture:", data.message);
            }
          } catch (error) {
            console.error("Error fetching profile picture:", error);
          }
        };
    
        if (userId) {
          fetchProfileImage();
        }
      }, [userId]);
    return(
        <div className={style.profile}>
            <img className={style.img} src={profileImage}/>
        </div>

    )
}

export default MainPic;