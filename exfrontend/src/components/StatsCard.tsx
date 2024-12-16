import React from "react";

interface sprps{
  title: any,
  value: any,
}

const StatsCard: React.FC<sprps> = ({ title, value}) => {

  const v = value.toString();
    return (
      <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-2xl font-bold text-red-700">{v}</p>
      </div>
    );
  }
  
  export default StatsCard;
  