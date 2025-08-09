import React from 'react';
import { editBillStatusDB } from '../../utils/InvoicingTables';
import { formatTime } from '../../utils/historyTable';
// import { FaMoneyBillWave, FaWhatsapp } from 'react-icons/fa';

const EditBillModal = ({setEditBillModal,detailedBill,setBills,setShowAlert,setAlertMessage,setShowSuccessNotification,setIsLoading}) => {

    if (!detailedBill) {
        return;
    }

    const {payment_status}=detailedBill
    console.log('payment status ->', payment_status);
    
    async function handleBillStatusUpdate(bill){
      setIsLoading(true)
        const response = await editBillStatusDB(bill)
        

        if (response.success) {
          setIsLoading(false)
            console.log('payment status updates');
             setBills((prevData) =>
            prevData.map((item) => {
                if (item.$id === bill.$id) {
                    console.log('update payment status here');
                    return {
                        ...item,
                        payment_status: bill.payment_status==1?"2":"1",
                    };
                }
                return item; 
            })


            
          );
          setEditBillModal(false)
          setShowSuccessNotification(true)
          setAlertMessage('Payment Status Updated')
          

            
        }else{
            
            setEditBillModal(false)
            setShowAlert(true)
            setAlertMessage(`${response.error}`)
            
        }
    }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-md ">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 relatvie">
            <button onClick={()=>setEditBillModal(false)} className="absolute -top-2 -right-1">
                <i className='ri-close-line px-1 py-1 bg-rose-500 rounded-full text-black'></i>
            </button>
          <div className="p-10 text-center text-white">

            <div className="billInfo-container flex flex-col items-start mb-4 gap-2 ">
              
              <p className='text-sm text-white'><span className='text-gray-400 font-semibold'> Name :- </span> {detailedBill.name}</p>
              <p className='text-sm text-white'><span className='text-gray-400 font-semibold'> Date :-</span> {detailedBill.$createdAt?detailedBill.$createdAt.split("T")[0]:"N|A"}</p>
              <p className='text-sm text-white'><span className='text-gray-400 font-semibold'> Time :-</span> {detailedBill.$createdAt?formatTime(detailedBill.$createdAt):"N|A"}</p>
              <p className='text-sm text-white'><span className='text-gray-400 font-semibold'>No. :- </span>{detailedBill.number}</p>

            
            </div>

          
          
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {/* Amount Paid Button */}
              <button onClick={()=>handleBillStatusUpdate(detailedBill)} className={`flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3  text-black font-semibold rounded-lg shadow-md ${payment_status==2?"bg-lime-300 ":"bg-red-400"} transition-all duration-300 ease-in-out transform hover:scale-105`}>
               
                {payment_status==1?"Amount Pending":payment_status==2?"Amount Paid":"Error"}
              </button>

         

              {/* Send Whatsapp Alert Button */}
              <button className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105">
                {/* <FaWhatsapp size={22} className="text-green-500" /> */}
                <span>Send WhatsApp Alert</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBillModal;