import{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle,  } from "./auth";
import { useWriteContract, } from "wagmi"
import Header from "./Header.tsx";
import userabi from "../../userAbi.ts"
import { USER_ADDRESS } from "../../course.json"

function Signup() {
  const [isMigrate, setIsMigrate] = useState(true);
  const navigate = useNavigate();


  
  async function handleLogin() {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Error during login or saving user:", error);
    }
  }


  
  const { 
    data: hash,
    isPending: isLoading,
    writeContract , error
  } = useWriteContract() 

  async function submit(e: any) { 
    e.preventDefault();
    const formData = new FormData(e.target);
    try{
    writeContract({
      address: `0x${USER_ADDRESS}`,
      abi: userabi,
      functionName: 'register',
      args: [formData.get('name')]
    
    
    });}
  catch(error){
    console.log('error:', error)
  }
  }
useEffect(() => {
  if(hash){
    console.log('Transaction successful:', hash);
    navigate('/user')
  }

  if(error){
    console.log('Error:', error)
  }
}, [hash, error])
if (isLoading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-4 bg-gray-900">
      <img
        src="/seitastic.png"
        className="h-20 animate-bounce"
        alt="Loading"
      />
    </div>
  );
}
  return (
    <div>
       <Header />
    <div className="max-w-4xl flex items-center mx-auto md:h-screen p-4 my-auto">
      {isMigrate && (
        <div className="grid md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
          <div className="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-gradient-to-r from-red-900 to-red-700 lg:px-8 px-4 py-4">
            <div>
              <h4 className="text-white text-lg font-semibold">
                Create Your Account
              </h4>
              <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">
                Welcome to our registration page! Get started by creating your
                account.
              </p>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold">
                Simple & Secure Registration
              </h4>
              <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">
                Our registration process is designed to be straightforward and
                secure. We prioritize your privacy and data security.
              </p>
            </div>
          </div>

          <form className="md:col-span-2 w-full py-6 px-6 sm:px-16" onSubmit={submit}>
            <div className="mb-6">
              <h3 className="text-gray-800 text-2xl font-bold">
                Create an account with your wallet
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Name</label>
                <div className="relative flex items-center">
                  <input
                    name="name"
                    type="text"
                    required
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter name"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm text-gray-800"
                >
                  I accept the{" "}
                  <a
                    href="javascript:void(0);"
                    className="text-blue-600 font-semibold hover:underline ml-1"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>

            <div className="!mt-12">
              <button
                type="submit"
                className="w-full py-3 px-4 tracking-wider text-sm rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none"
              >
                Create an account
              </button>
            </div>
            <div className="mx-auto text-center p-5 text-gray-700">OR</div>
            <button
              type="button"
              className="w-full py-3 px-4 tracking-wider text-sm rounded-md text-gray-800 border border-gray-700 focus:outline-none"
              onClick={handleLogin}
            >
              Login with Google
            </button>

            <p className="text-gray-800 text-sm mt-6 text-center">
              Want to migrate to the blockchain?{" "}
              <a
                href="javascript:void(0);"
                className="text-blue-600 font-semibold hover:underline ml-1"
                onClick={() => setIsMigrate(false)}
              >
                Click here
              </a>
            </p>
          </form>
        </div>
      )}
      {!isMigrate && (
        <div className="grid md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden ease-in-out transition-all delay-200">
          {/* Migration Form Code */}
        </div>
      )}
    </div>
  </div>
  );
}

export default Signup;
