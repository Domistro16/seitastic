function HeroSection() {
  return (
    <div className="relative bg-transparent p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center text-center md:text-left">
        {/* Text Section */}
        <div className="flex flex-col w-full">
          <p className="text-5xl xl:text-6xl font-extrabold text-gray-700 uppercase mb-5 leading-tight">
            Seitastic is the
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-4">
            key to <span className="text-gray-700">success</span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg md:w-3/4 mx-auto md:mx-0">
            Moving forward, you will be paired with a highly vetted
            professional who will get to know your goals and help you succeed.
          </p>
          {/* Call-to-Actions */}
          <div className="mt-10 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5 justify-center md:justify-start">
            <button className="px-8 py-4 bg-transparent text-gray-700 border rounded-full font-semibold shadow hover:bg-red-500 hover:text-white border-gray-700 transition ease-in-out">
              Learn More
            </button>
            <button className="px-8 py-4 bg-red-500 text-white rounded-full shadow border hover:bg-white hover:text-red-500 border-red-500 transition ease-in-out">
              Apply Now
            </button>
          </div>
        </div>
        {/* Image Section */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0 hidden md:flex justify-center">
          <img src="s.png" alt="Student" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
