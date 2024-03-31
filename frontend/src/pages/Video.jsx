import React, { useState, useEffect } from 'react'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ToPath from '../components/ToPath';
import Control from "../assets/Buttons/Control.png"

const Video = () => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const UpdateImage = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, 'streaming/latestImage.jpg');
  
      getDownloadURL(storageRef)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((error) => {
          console.error('Error getting download URL:', error);
        });
    }

    UpdateImage()

    const intervalId = setInterval(UpdateImage, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className='mt-24 flex flex-col justify-center items-center'>
        {imageUrl ? (
          <img src={imageUrl} className='max-w-[90%]'/>
        ) : (
          <p>Loading...</p>
        )}
				<div className='flex justify-end my-3'>
          <ToPath Path={"/"} Icon={Control} Name={"Dashboard"}/>
				</div>
      </div>
    </>
  )
}

export default Video