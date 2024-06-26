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
  const { Disabled, Smell } = useButtons()
  const actionRef = collection(db, "Actions");
  const smellRef = doc(db, "Conversations", "Smell");
  const [imageUrl, setImageUrl] = useState(null);
  const [distance, setDistance] = useState(null);

  const getInt = (str) => {
    console.log(str)
    const parts = str.split(' ');
    const numPart = parseInt(parts[1]);
    return numPart;
  };

  // const sendSmellUpdate = async () => {
  //   await updateDoc(smellRef, {
  //     Output: "This smells like " + Smell['smell'].get
  //   })
  // }

  const sendSmellUpdate = async (smellString) => {
    await updateDoc(smellRef, {
      Output: smellString
    });
  };

  const UpdateSmellDetection = async () => {

    let smell = "something I do not know";

    const docRef = await getDoc(doc(db, "Smell_Distance", "Default"));
    const data = docRef.data()
    let C2H5CH = data.C2H5CH
    let CO = data.CO
    let NO2 = data.NO2
    let VOC = data.VOC

    let perfume = Math.abs(getInt(C2H5CH) - 1000) + Math.abs(getInt(VOC) - 950) + Math.abs(getInt(CO) - 950) + Math.abs(getInt(NO2) - 800);
    let air = Math.abs(getInt(C2H5CH) - 660) + Math.abs(getInt(VOC) - 660) + Math.abs(getInt(CO) - 290) + Math.abs(getInt(NO2) - 270);
    let coffee = Math.abs(getInt(C2H5CH) - 700) + Math.abs(getInt(VOC) - 700) + Math.abs(getInt(CO) - 280) + Math.abs(getInt(NO2) - 300);
    let alcohol = Math.abs(getInt(C2H5CH) - 950) + Math.abs(getInt(VOC) - 950) + Math.abs(getInt(CO) - 900) + Math.abs(getInt(NO2) - 500);
    let sanitizer = Math.abs(getInt(C2H5CH) - 850) + Math.abs(getInt(VOC) - 850) + Math.abs(getInt(CO) - 700) + Math.abs(getInt(NO2) - 430);

    perfume = Math.abs(perfume);
    air = Math.abs(air);
    coffee = Math.abs(coffee);
    alcohol = Math.abs(alcohol);
    sanitizer = Math.abs(sanitizer);

    let minMAE = 255; // Arduino int max value is 255
    const limit = 300;

    if (perfume < limit && perfume < minMAE) {
        minMAE = perfume;
        Smell['smell'].set("PERFUME")
        smell = "PERFUME";
    }
    if (air < limit && air < minMAE) {
        minMAE = air
        Smell['smell'].set("AIR")
        smell = "AIR";
    }
    if (coffee < limit && coffee < minMAE) {
        minMAE = coffee
        Smell['smell'].set("COFFEE")
        smell = "COFFEE";
    }
    if (alcohol < limit && alcohol < minMAE) {
        minMAE = alcohol
        Smell['smell'].set("ALCOHOL")
        smell = "ALCOHOL"
    }
    if (sanitizer < limit && sanitizer < minMAE) {
        minMAE = sanitizer
        Smell['smell'].set("HAND SANITIZER")
        smell = "HAND SANITIZER"
    }
    if (smell == "something I do not know") {
      Smell['smell'].set("NO SMELL DETECTED")
    }

    sendSmellUpdate("This smells like " + smell)
  }

  const UpdateSmellValues = async () => {
    try {
      const docRef = await getDoc(doc(db, "Smell_Distance", "Default"));
      const data = docRef.data()
      Smell['C2H5CH'].set(data.C2H5CH)
      Smell['CO'].set(data.CO)
      Smell['NO2'].set(data.NO2)
      Smell['VOC'].set(data.VOC)
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

  const UpdateDistance = async () => {
    try {
      const docRef = await getDoc(doc(db, "Smell_Distance", "Default"));
      const data = docRef.data();
      setDistance(data.Distance)
      
      let distanceReading = "Path is something"
      distanceReading = data.Distance.split("|")
      distanceReading = distanceReading[0]
      sendSmellUpdate(distanceReading)
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

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

    const justGetDistancePlease = async () => {
      const docRef = await getDoc(doc(db, "Smell_Distance", "Default"));
      const data = docRef.data();
      setDistance(data.Distance)
    }

    justGetDistancePlease();

    const intervalIdImage = setInterval(UpdateImage, 2000);
    const intervalIdSmell = setInterval(UpdateSmellValues, 100);

    return () => {
      clearInterval(intervalIdImage);
      clearInterval(intervalIdSmell);
    };    
  }, []);
  
  const handleSmell = async () => {
    Disabled.set(true)

    sendSmellUpdate("Sniff Sniff");

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: "(",
      priority: 1,
      createdAt: serverTimestamp()
    })

    setTimeout(() => {
      UpdateSmellDetection();
      Disabled.set(false)
    }, 18000)
  }

  const handleDistance = async () => {
    Disabled.set(true)

    sendSmellUpdate("Reading distance");

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: ")",
      priority: 1,
      createdAt: serverTimestamp()
    })

    setTimeout(() => {
      UpdateDistance();
      Disabled.set(false)
    }, 3000)
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
              {Smell["NO2"].get} 
            </div>
            <div className='darkGray-box p-1 rounded-lg text-center'>
              {Smell["C2H5CH"].get}
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
              {Smell["VOC"].get}
            </div>
            <div className='darkGray-box p-1 rounded-lg text-center'>
              {Smell["CO"].get}
            </div>
          </div>
        </div>
        <div className='darkGray-box p-1 rounded-lg text-center font-bold'>
          Detected Smell | {Smell["smell"].get}
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