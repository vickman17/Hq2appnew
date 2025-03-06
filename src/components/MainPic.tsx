import React, { useEffect, useState } from "react";
import style from './MainPic.module.css';

const MainPic: React.FC = () => {
  const userInfo = sessionStorage.getItem("userInfo");
  const parse = userInfo ? JSON.parse(userInfo) : null; // Handle potential null value
  const userId = parse?.id || ""; // Fallback to an empty string if parse or parse.id is null
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined); // Allow undefined
  const fallback = "/assets/blueplace.jpg";

  useEffect(() => {
    // Fetch profile image on component mount
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`http://localhost/api/getProfile.php?userId=${userId}`);
        const data = await response.json();

        if (data.status === "success" && data.profile_picture) {
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

  return (
    <div className={style.profile}>
      {/* Use a fallback image if profileImage is undefined */}
      {profileImage ? (<img
        className={style.img}
        src={profileImage || "https://via.placeholder.com/150"} // Fallback placeholder image
        alt="Profile"
      />):(
        <img className={style.img} src={fallback} />
      )}
    </div>
  );
};

export default MainPic;
