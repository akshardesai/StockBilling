import { useState } from "react";
import { deleteHeight, deleteSize } from "../../utils/StockTables";
import LoadingNotification from "../LoadingNotification";
LoadingNotification


const DeleteModal = ({
  setIsOpenDeleteModal,
  selectedThing,
  size,
  setProducts,
  title,
  message,
  setShowAlert,
  alertMessage,
  setShowSuccessNotification

}) => {

  const [isLoading,setIsLoading]=useState(false)

  function handleConfirmDelete(selectedThing) {
    // ("delete id",id);

    if (title === "Size") {
      confirmedDeleteSize(selectedThing);
    } else if (title === "Height") {
      console.log("deleting height", selectedThing);

      confirmedDeleteHeight(selectedThing,size);
    }
  }

  async function confirmedDeleteSize(selectedThing) {
      try {
        setIsLoading(true)
      const response = await deleteSize(selectedThing);

      if (response.success) {
       

        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.$id !== selectedThing.$id)
        );

       
        
        setIsOpenDeleteModal();
        setIsLoading(false)
        setShowSuccessNotification(true)
        alertMessage('Size Deleted')
       


      } else {
          setIsLoading(false)
          setShowAlert(true)
         alertMessage(response.error)


      }
    } catch (error) {
          setIsLoading(false)
          setShowAlert(true)
         alertMessage(error)
  
    }
  }

  async function confirmedDeleteHeight(selectedThing,size) {
    try {
      setIsLoading(true)
      const response = await deleteHeight(selectedThing,size);

      if (response.success) {
        console.log("height deleted");

        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            // Find the product that matches the ID
            if (product.$id === size.$id) {
              return {
                ...product,
                // Remove the height with the matching ID/value
                heights: product.heights
                  ? product.heights.filter((height) => height.$id !== selectedThing.$id)
                  : [],
              };
            }
            // Return unchanged product if it doesn't match
            return product;
          })
        );

        setIsOpenDeleteModal();
        setIsLoading(false)
         setShowSuccessNotification(true)
        alertMessage('Height Deleted')
      }else{
        setIsLoading(false)
          setShowAlert(true)
         alertMessage(response.error)
      }
    } catch (error) {
      setIsLoading(false)
       setShowAlert(true)
         alertMessage(error)
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out `}
      />

      <div
        id="deleteModal"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2    w-[90%] max-w-md mx-auto p-6 z-50
        bg-gray-900 backdrop-blur-xl
        border-2 border-red-400/30 rounded-2xl shadow-2xl
        transition-all duration-300 ease-out

        "
      >
        {/* <!-- Modal content --> */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-white"> Delete {title} ?</h2>
          <p className="text-white mt-2 text-center font-light">{message}</p>
          {/* <!-- Buttons --> */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => handleConfirmDelete(selectedThing)}
              id="confirmDelete"
              className="bg-red-500 text-white hover:bg-red-400 active:bg-red-600  px-4 py-2 rounded-md transition duration-300"
            >
              Yes
            </button>
            <button
              onClick={setIsOpenDeleteModal}
              id="cancelDelete"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
            >
              No
            </button>
          </div>
        </div>
      </div>

   <LoadingNotification
        showLoading={isLoading}
      />

      



    </>
  );
};

export default DeleteModal;
