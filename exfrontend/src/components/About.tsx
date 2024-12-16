const About = () => {
    return (
        <div className="p-20 bg-transparent">
            <div className="flex justify-center text-center items-center mt-10">
                <h1 className="font-semibold text-5xl">ABOUT</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full max-w-6xl mx-auto gap-[90px] mt-10">
                <div className="h-[300px] w-full shadow-lg border border-red-300 bg-red-50 rounded-xl hover:scale-105 transition-all ease-in-out delay-200">
                </div>
                <div className="h-[300px] w-full shadow-lg border border-red-300 bg-red-50 rounded-xl hover:scale-105 transition-all ease-in-out delay-200">
                </div>
                <div className="h-[300px] w-full shadow-lg border border-red-300 bg-red-50 rounded-xl hover:scale-105 transition-all ease-in-out delay-200">
                </div>
            </div>
        </div>
    );
};

export default About;
