const Categories = () => {
    return (
        <div className="p-8 bg-transparent">
            <div className="flex justify-center text-center items-center mt-10">
                <h1 className="font-semibold text-5xl">WELCOME PACK</h1>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full max-w-6xl mx-auto gap-10 mt-10">
                <div className="h-[350px] bg-white w-full shadow-lg">
                    <div className="h-[150px] z-50 bg-red-500 w-full rounded-t-lg"></div>
                </div>
                <div className="h-[350px] bg-white w-full shadow-lg">
                    <div className="h-[150px] z-50 bg-red-500 w-full rounded-t-lg"></div>
                </div>
                <div className="h-[350px] bg-white w-full shadow-lg">
                    <div className="h-[150px] z-50 bg-red-500 w-full rounded-t-lg"></div>
                </div>
            </div>
        <div className="w-full flex justify-center items-center">
            <button className="px-6 py-3 bg-white-500 w-40 text-red-500 rounded-full shadow border hover:bg-red-500 hover:text-[white] border-red-500 transition ease-in-out delay-150 mt-10 font-semibold">
              See more
            </button>
        </div>
        </div>
    );
};

export default Categories;
