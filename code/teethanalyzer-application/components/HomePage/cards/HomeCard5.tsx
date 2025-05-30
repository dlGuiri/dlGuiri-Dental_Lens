const HomeCard5 = ({ className = "" }) => {
    return (
        <div 
            className={`bg-[url('/assets/Teeth%20Goals%20Image%20V2.png')] bg-cover bg-center
                backdrop-blur-md bg-opacity-30 rounded-3xl p-6 shadow-md hover:shadow-blue-300
                transition-shadow duration-500 text-white ${className}`}
        >
            <h2 className="text-2xl font-semibold text-white mb-2">Create your Teeth Goals to achieve Better Oral Health!</h2>
        </div>
    );
  };
  
  export default HomeCard5;
  