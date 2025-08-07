import { useEffect } from "react";


const LoadingNotification = ({showLoading}) => {


  return (
    <>
      
      
      {/* Modal */}
      <div className={`
        backdrop-blur-2xl
        fixed top-[21.5%] md:top-[15%] -right-3 
        w-[40%] px-3 py-2 md:w-[10%] md:px-4  z-50
        bg-gray-900 
          rounded-xl shadow-2xl
        transition-all duration-300 ease-out border
        border-gray-600 
        ${showLoading ? 'translate-x-0' : 'translate-x-80 '}
      `}>
        
     

        
        <div className="flex  items-center gap-2 ">
          
      

       
          {/* Message */}
          <p className="text-lime-400  font-bold  animate-spin ">
          
            <i class="ri-loader-4-fill text-xl "></i>
          
          </p> 
        
        <p>

           Processing
        </p>

   
          
        </div>
      </div>
    </>
  );
};

export default LoadingNotification;