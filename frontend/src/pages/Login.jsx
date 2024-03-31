import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RobotCat from "../assets/Logos/RobotCatIcon.png"
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState('')
  const { loading, setLoading, setLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    if (emailRef.current.value == process.env.REACT_APP_USERNAME && passwordRef.current.value == process.env.REACT_APP_PASSWORD) {
      console.log("Successfully logged in wooooo")
      setLoggedIn(true)
      navigate('/')
    } else {
      setError("Failed to login")
    }

    setLoading(false)
  }

  return (
    <>
      <div className="lg:h-[100vh] md:m-0">
        <div className="flex flex-col item-center justify-center lg:h-full lg:my-0 my-10 lg:px-24">
          <div className="flex lg:flex-row flex-col w-full items-center justify-center">
            
            <div className="lg:w-[50%] w-[90%] lg:px-20">
              <div className="flex flex-col justify-center item-center h-full lg:gap-5 gap-1">
                <img src={RobotCat} className="w-[70%] lg:block hidden"/>
                <div className="flex flex-row items-center justify-center">
                  <img src={RobotCat} className="md:w-[250px] w-[150px] lg:hidden"/>
                </div>
                <div className="font-bold text-title text-center lg:text-start">
                  Stair Climbing Robot Cat <br /> ELE70A/B F2024 📌
                </div>
                <div className="text-header text-center lg:text-start md:block hidden">
                  Login to interact with and use the control page of our Robot
                </div>
              </div>
            </div>

            <div className="lg:w-[50%] w-[100%] flex items-center justify-center lg:my-0 my-8">
              <div className="lg:w-[100%] w-[90%] lg:px-10">
                <form onSubmit={handleSubmit}>
                  <div className="rounded-3xl darkGray-box lg:px-20 px-8 lg:py-12 py-6">
                    <div className="text-center font-bold text-bigHeader lg:mb-16 mb-12">
                      Login
                    </div>
                    {error && <div className="rounded-lg bg-red-100 p-2 text-red-700 text-center mb-4">{error}</div>}
                    <div className="mb-4 flex flex-col">
                      <label className="text-norm mb-2">
                        Username
                      </label>
                      <input 
                        className="rounded-2xl w-full p-4 text-norm bg-white placeholder-[#b0b0b0] text-black outline-none"
                        type="text" 
                        ref={emailRef}
                        placeholder="CatLover123"
                        required />
                    </div>
                    <div className="mb-4 flex flex-col">
                      <label className="text-norm mb-2">
                        Password
                      </label>
                      <input 
                        className="rounded-2xl w-full p-4 text-norm bg-white placeholder-[#b0b0b0] text-black outline-none"
                        type="password" 
                        ref={passwordRef}
                        placeholder="*****"
                        required />
                    </div>

                    <div className='flex lg:flex-row flex-col justify-end mt-[30px] items-center'>
                      <div>
                        <button
                          className="bg-[#F5C3AF] hover:bg-[#b69082] text-norm text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full lg:block hidden"
                          type="submit"
                          disabled={loading}
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-[#F5C3AF] hover:bg-[#b69082] text-norm text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-8 lg:hidden"
                    type="submit"
                    disabled={loading}
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
            <div className="text-header text-center w-[90%] mb-10 lg:hidden">
              Login to interact with and use the control page of our Robot
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;