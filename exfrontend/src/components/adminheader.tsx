import {useState, useEffect} from "react";
import { CiSearch } from "react-icons/ci";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from "react-router-dom";


function Adminheader() {
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
  
    useEffect(() => {
      const handleScroll = () => {
        if(window.scrollY === 0){
            setIsScrolled(false);
        }else if (window.scrollY < lastScrollY) {
          setIsScrolled(true); // Scrolling up
        } else {
          setIsScrolled(false); // Scrolling down
        }
        setLastScrollY(window.scrollY); // Update the scroll position
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]); // Dependency array to track the previous scroll position
  
  return (
    <header className={`flex items-center justify-between p-4 z-50 transition-all duration-300 top-0 left-0 ${
        isScrolled ? "md:bg-white md:shadow-lg md:w-full md:sticky" : "bg-transparent"
      }`}>
      <div className="flex items-center">
        <img src="seitastic.png" alt="" className="h-12"/>
        <span className="text-lg font-bold ml-2">Hello, Seitastic</span>
      </div>
      <div className="flex items-center space-x-5">
        <button className="text-4xl">
          <CiSearch/>
        </button>
        <div className="hidden md:flex">
      <ConnectButton />
      </div>
    <button className="flex justify-center items-center lg:hidden flex-col" onClick={() => setIsClicked(!isClicked)}>
      <div className="relative w-8 h-8">
        <div className={`absolute top-0 h-[2px] w-full bg-black rounded-full transition-transform duration-300 ease-in-out ${
            isClicked ? "rotate-45 top-1/2 translate-y-[-50%]" : "top-0"}`}>
        </div>
        <div className={`absolute top-1/2 h-[2px] w-5 ml-3 bg-black rounded-full transition-all duration-300 ease-in-out ${
            isClicked ? "opacity-0" : "translate-y-[-50%]"
          }`}>
        </div>
        <div className={`absolute bottom-0 h-[2px] w-full bg-black rounded-full transition-transform duration-300 ease-in-out ${
            isClicked ? "-rotate-45 top-1/2 translate-y-[-50%]" : "bottom-0"
          }`}>
        </div>
      </div>
    </button>

      </div>

      {isClicked && (
  <div className="fixed flex top-0 left-0 w-full h-full z-50 bg-gray-200 bg-opacity-95 transition-transform duration-300 ease-in-out">

<button
      className="absolute top-4 right-4 flex justify-center items-center flex-col"
      onClick={() => setIsClicked(!isClicked)}
    >
      <div className="relative w-8 h-8">
        <div
          className={`absolute top-0 h-[2px] w-full bg-black rounded-full transition-transform duration-300 ease-in-out ${
            isClicked ? "rotate-45 top-1/2 translate-y-[-50%]" : "top-0"
          }`}
        ></div>
        <div
          className={`absolute top-1/2 h-[2px] w-full bg-black rounded-full transition-all duration-300 ease-in-out ${
            isClicked ? "opacity-0" : "translate-y-[-50%]"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 h-[2px] w-full bg-black rounded-full transition-transform duration-300 ease-in-out ${
            isClicked ? "-rotate-45 top-1/2 translate-y-[-50%]" : "bottom-0"
          }`}
        ></div>
      </div>
    </button>
    <nav className="space-y-6 font-semibold flex flex-col p-6">
      <a href="#" className="text-gray-700 text-red-700 hover:text-red-500">Dashboard</a>
      <a href="#" className="text-gray-700 hover:text-red-500">Home</a>
      <a href="#" className="text-gray-700 hover:text-red-500">Pages</a>
      <a  onClick={() => navigate('/admin/adcourse')} className="text-gray-700 hover:text-red-500">Courses</a>
      <a href="#" className="text-gray-700 hover:text-red-500">Events</a>
      <a href="#" className="text-gray-700 hover:text-red-500">Elements</a>
      <a href="#" className="text-gray-700 hover:text-red-500">Blog</a>

      
    </nav>

    <div className=" absolute left-4 bottom-10 ">
      <ConnectButton />
      </div>
    
  </div>
)}

    </header>
  );
}

export default Adminheader;
