import React, { useState, useEffect } from 'react'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { setDoc, getDoc, doc, serverTimestamp, collection, updateDoc } from 'firebase/firestore'
import { db } from "../firebase";
import ToPath from '../components/ToPath';
import Control from "../assets/Buttons/Control.png"
import DistanceIcon from "../assets/Buttons/Distance.png"
import SmellIcon from "../assets/Buttons/Smell.png"
import { useButtons } from '../contexts/ButtonsContext';

const Video = () => {
  const { Disabled } = useButtons()
  const actionRef = collection(db, "Actions");
  const [imageUrl, setImageUrl] = useState(null);
  const [distance, setDistance] = useState(null);
  const [C2H5CH, setC2H5CH]  = useState(null);
  const [CO, setCO] = useState(null);
  const [NO2, setNO2] = useState(null);
  const [VOC, setVOC] = useState(null);

  useEffect(() => {
    const UpdateImage = async () => {
      
      await fetch(`/objectDetection`, {
        method: "GET",
      })
        .then((response) => response.json())
        .catch((error) => console.log(error));

      const storage = getStorage();
      const storageRef = ref(storage, 'streaming/objectImage.jpg');
  
      getDownloadURL(storageRef)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((error) => {
          console.error('Error getting download URL:', error);
        });
    }

    const UpdateSmellAndDistance = async () => {
      try {
        const docRef = await getDoc(doc(db, "Smell_Distance", "Default"));
        const data = docRef.data();
          setDistance(data.Distance)
          setC2H5CH(data.C2H5CH);
          setCO(data.CO);
          setNO2(data.NO2);
          setVOC(data.VOC);
      } catch (error) {
        console.error("Error getting document:", error);
      }
    }

    const intervalIdImage = setInterval(UpdateImage, 2000);
    const intervalIdSmell = setInterval(UpdateSmellAndDistance, 100);
    
    return () => {
      clearInterval(intervalIdImage);
      clearInterval(intervalIdSmell);
    };    
  }, []);

  // const handleSmell = async () => {
  //   Disabled.set(true)
  //   const docRef = doc(db, "Smell_Distance", "Default");

  //   await updateDoc(docRef, {
  //     SmellAction: "s"
  //   });

  //   setTimeout(() => {
  //     Disabled.set(false)
  //   }, 1000)
  // }
  
  const handleSmell = async () => {
    Disabled.set(true)

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: "q",
      priority: 1,
      createdAt: serverTimestamp()
    })

    setTimeout(() => {
      Disabled.set(false)
    }, 1000)
  }

  const handleDistance = async () => {
    Disabled.set(true)

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: "Q",
      priority: 1,
      createdAt: serverTimestamp()
    })

    setTimeout(() => {
      Disabled.set(false)
    }, 1000)
  }

  return (
    <>
      <div className='mt-24 flex flex-col gap-4 justify-center items-center'>
        <div className='flex flex-center justify-center items-center darkGray-box rounded-full p-3 gap-3 font-bold w-[90%] sm:w-auto'>
          <button 
            className={`${Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] p-3 rounded-full`}
            onClick={handleDistance}
            disabled={Disabled.get}
          >
            <img src={DistanceIcon} className='w-8'/>
          </button>
          {distance}
        </div>
        <div className='flex flex-row justify-center items-center gap-3 w-[90%] sm:w-auto'>
          <div className='flex flex-col justify-between font-bold w-[50%] gap-3'>
            <div className='darkGray-box p-1 rounded-lg text-center'>
              {NO2} 
            </div>
            <div className='darkGray-box p-1 rounded-lg text-center'>
              {C2H5CH}
            </div>
          </div>
          <div className='darkGray-box rounded-full p-3'>
            <button 
              className={`${Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] p-3 rounded-full`}
              onClick={handleSmell}
              disabled={Disabled.get}
            >
              <img src={SmellIcon} className='w-12'/>
            </button>
          </div>
          <div className='flex flex-col justify-between font-bold w-[50%] gap-3'>
            <div className='darkGray-box p-1 rounded-lg text-center'>
              {VOC}
            </div>
            <div className='darkGray-box p-1 rounded-lg text-center'>
              {CO}
            </div>
        </div>
        </div>
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