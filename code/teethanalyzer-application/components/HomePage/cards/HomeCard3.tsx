import Image from "next/image";
import YouTubePreview from "../../ScanPage/videoComponent/preview";


const HomeCard3 = ({ className = "" }) => {
    return (
        <div className={`bg-gradient-to-br from-[#4fa1f2] via-[#74b0f0] to-[#d3eaff] 
            backdrop-blur-md bg-opacity-30 rounded-3xl p-6 shadow-md hover:shadow-blue-300 
            transition-shadow duration-500 ${className}`}>
            <h2 className="text-2xl font-semibold text-white mb-2">Check out these Health Tips to take better care of your Teeth!</h2>
            
            <div className="flex justify-center item-center gap-5 flex-wrap mt-8">
                <YouTubePreview videoId="B35jRf4EKPA" />
                <YouTubePreview videoId="3zL4Hou1P-c" />
                <YouTubePreview videoId="SCP38MrccsI" />
            </div>
        </div>
    );
  };
  
  export default HomeCard3;
  