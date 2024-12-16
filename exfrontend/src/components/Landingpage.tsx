import Header from "./Header";
import HeroSection from "./HeroSection";
import Categories from "./Categories";
import Footer from "./Footer"
import About from "./About";

function Home() {
  return (
    <div className="">
      <div className="h-full md:h-screen">
      <Header />
      <HeroSection />
      </div>
      <div className="">
      <About />
      <Categories />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
