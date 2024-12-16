interface gprops{
  title:any,
  text:any,
  subtitle: any
}

const GraphCard: React.FC<gprops> = ({ title, text, subtitle }) => {
    return (
      <div className="p-6 h-[320px] bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="">
            {text}
        </div>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    );
  }
  
  export default GraphCard;