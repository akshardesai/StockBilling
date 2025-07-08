const Alert = ({ showAlert, alertType='error', alertMessage, onClose }) => {
  

  return (
    <>
      {/* Backdrop overlay */}
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out ${showAlert?"":"hidden"}`} />
      
      {/* Modal */}
      <div className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 
        w-[90%] max-w-md mx-auto p-6 z-50
        bg-gray-900 backdrop-blur-xl
        border border-gray-800 rounded-2xl shadow-2xl
        transition-all duration-300 ease-out
        ${showAlert ? '-translate-y-1/2' : '-translate-y-170'}
        ${alertType === 'success' ? 'border-lime-400/30' : 'border-red-400/30'}
      `}>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors duration-200"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* Icon */}
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${alertType === 'success' 
              ? 'bg-lime-400/10 text-lime-400' 
              : 'bg-red-400/10 text-red-400'
            }
          `}>
            <i className={`
              ${alertType === 'success' ? 'ri-check-line' : 'ri-close-line'} 
              text-2xl
            `}></i>
          </div>

          {/* Title */}
          <h2 className="text-xl font-medium text-white">
            {alertType === 'success' ? 'Success' : 'Error'}
          </h2>

          {/* Message */}
          <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
            {alertMessage || "Operation completed successfully."}
          </p>

          {/* Action button */}
          <button 
            onClick={onClose}
            className={`
              mt-4 px-6 py-2.5 rounded-lg font-medium text-sm
              transition-all duration-200
              ${alertType === 'success'
                ? 'bg-lime-400 text-black hover:bg-lime-300 active:bg-lime-500'
                : 'bg-red-500 text-white hover:bg-red-400 active:bg-red-600'
              }
            `}
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
};

export default Alert;