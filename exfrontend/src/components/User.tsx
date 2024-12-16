import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer"
import { useAccount, useReadContract } from "wagmi"
import { getUser } from "./auth";
import  userabi  from "../../userAbi"
import { USER_ADDRESS } from "../../course.json"
import { useNavigate } from "react-router-dom"
import { Usercourses } from "./popular"

export type User = {
  name: string;
  address: string;
  isRegistered: boolean;
  enrolled: number;
}

 function UserProfile() {

  

 const account = useAccount();
  const navigate = useNavigate();
  const address = account?.address || '';

    const { data, isLoading, error} = useReadContract({
      address: `0x${USER_ADDRESS}`,
      abi: userabi,
      functionName: 'getUser',
      args: [address],
    });

    const user = data as [string, string, boolean, number];

    useEffect(() => {

      async function checkuser (){
      if (!isLoading && error) {

        try{
          const guser = getUser();
          if(await guser){
            navigate('../gsign');
          }
        }
        catch(error){
          if(error){
              navigate('../sign-up');
          }
        } 
      }
    }

    if(error){
    }
    checkuser();
    }, [user, isLoading, navigate, error]);
  
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
  if (account.isDisconnected) {
    return <div>Please Create your account.</div>;
  }

  if (!isLoading && !error) {

    
    const [name, walletAddress, , balance] = user;
    const b = balance.toString();

  return (
    <div className="h-full ">
        <Header />
        <div className="h-[180px] flex flex-col bg-red-700 w-full p-8 pt-10 items-center">
            <h1 className="text-4xl text-gray-100">{name}</h1>
            <p className="text-gray-100 p-3">{walletAddress}</p>
        </div>
        <Usercourses balance={b} />
        <Footer />
    </div>
  );
}

}

export default UserProfile;
