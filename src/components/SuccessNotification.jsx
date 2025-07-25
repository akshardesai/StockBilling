import { useEffect } from "react";


const SuccessNotification = ({ showAlert, alertType, alertMessage, onClose }) => {
 


  useEffect(()=>{
    const timeout = setTimeout(() => {
    onClose(); // <-- Call it!
  }, 3000);

  return () => clearTimeout(timeout);
  },[showAlert])



  return (
    <>
      
      
      {/* Modal */}
      <div className={`
        backdrop-blur-2xl
        fixed top-[21.5%] md:top-[15%] -right-3 
        w-[60%] p-3 md:w-[20%] md:p-4  z-50
        bg-gray-900 
          rounded-xl shadow-2xl
        transition-all duration-300 ease-out border
        border-gray-600 
        ${showAlert ? 'translate-x-0' : 'translate-x-80'}
      `}>
        
     

        
        <div className="flex flex-col items-center text-center space-y-4">
          
      

       
          {/* Message */}
          <p className="text-gray-300 text-sm leading-relaxed max-w-sm font-bold tracking-wide pe-2">
            <span className="bg-lime-400 px-2 py-1 rounded-full me-2">

            <i class="ri-check-line text-black font-bold"></i>
            </span>
            {alertMessage || "Done"}
          </p>

   
          
        </div>
      </div>
    </>
  );
};

export default SuccessNotification;