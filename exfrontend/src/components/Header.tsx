import {useState, useEffect} from "react";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from "react-router-dom";
import SearchBar from "./search";

function Header() {
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isSearch, setIsSearch] = useState(false);
  
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
    <header className={`flex items-center justify-between p-4 z-50 transition-all duration-300 top-0 left-0 shadow-lg ${
        isScrolled ? "md:shadow-lg md:w-full md:sticky" : "bg-white"
      }`}>
      <div className="flex items-center">
        <img src="http://localhost:5173/seitastic.png" alt="" className="h-12"/>
        <span className="text-lg font-bold ml-2">Seitastic</span>
      </div>
      <nav className="xl:flex gap-6 hidden font-semibold">
        <a onClick={() => navigate('/')} className="text-gray-700 hover:text-red-500 cursor-pointer">Home</a>
        <a onClick={() => navigate('/courses')} className="text-gray-700 hover:text-red-500 cursor-pointer">Courses</a>
        <a href="#" className="text-gray-700 hover:text-red-500 cursor-pointer">Blog</a>
      </nav>
      <div className="flex hidden md:block md:w-[310px] xl:w-[500px]">
        <SearchBar />
      </div>
      <div className="flex items-center gap-5">
        <button className="md:hidden text-4xl" onClick={() => {setIsSearch(!isSearch)}}>
          <CiSearch/>
        </button>
        <button className=" text-4xl" onClick={() => {navigate('/user');}}>
          <CgProfile / >
        </button>
        <div className="hidden md:flex">
      <ConnectButton />
      </div>
    <button className="flex justify-center items-center xl:hidden flex-col" onClick={() => setIsClicked(!isClicked)}>
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
      
        <a onClick={() => navigate('/')} className="text-gray-700 hover:text-red-500 cursor-pointer">Home</a>
        <a onClick={() => navigate('/courses')} className="text-gray-700 hover:text-red-500 cursor-pointer">Courses</a>
        <a className="text-gray-700 hover:text-red-500 cursor-pointer">Blog</a>

      
    </nav>

    <div className=" absolute left-4 bottom-10 ">
      <ConnectButton />
      </div>
  </div>
)}

{isSearch && (
    <Modal>
      <div className="bg-white py-3 rounded-lg h-[430px] mx-5"><SearchBar /></div>
    </Modal>
)}

    </header>
  );
}

interface ModalProps {
  children: any;
}
const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 py-20 items-center">
      {children}
    </div>
  );
}

export default Header;
