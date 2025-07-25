import React, { useState } from "react";
import { updateHeight } from "../../utils/StockTables";
import LoadingNotification from "../LoadingNotification";


const EditHeightModal = ({
  id,
  sizeId,
  height,
  quantity,
  handleEditHeightModal,
  setProducts,
  modalState,
  setShowAlert,
  alertMessage,
  setShowSuccessNotification


}) => {
  const [updatedHeight, setUpdatedHeight] = useState(height||"");
  const [updatedQuantity, setUpdatedQuantity] = useState(quantity||0);
  const [isLoading,setIsLoading]=useState(false)

  function handleUpdateForm(event) {
    event.preventDefault();
    if (!updatedHeight || updatedHeight.trim().length === 0) {
      //show error no values
      //close modal
      return;
    }

    if (updatedHeight==height && updatedQuantity==quantity) {
      // show error same value no changes
      // close modal
        return;
    } 
    updateHeightDB(id, updatedHeight,updatedQuantity);
  }

  async function updateHeightDB(id, h=height,q=quantity) {
    setIsLoading(true)
    const response = await updateHeight(id,h,q);

    if (response.success) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          if (product.$id === sizeId) {
            return {
              ...product,
              heights: product.heights
                ? product.heights.map((h) => h.$id === id ? {...h,height:response.data.height,quantity:response.data.quantity}:h)
                : [],
            };
          }
          return product;
        })

      );

      handleEditHeightModal()
      setIsLoading(false)
      setShowSuccessNotification(true)
        alertMessage('Height Updated')
    } else {
      handleEditHeightModal()
      setIsLoading(false)
         setShowAlert(true)
         alertMessage(response.error)
    }
  }

 
  

  return (
    <>
      <div className="editHeight w-full md:flex md:justify-center ease-in-out">
        <div
          id="editHeightModal"
          className={`EDITHeight__container  w-full md:max-w-[25vw]  bg-[#D7FF9C] fixed top-0  z-50 p-4 shadow-lg rounded-b-4xl transform  transition-transform duration-500 ease-in-out ${modalState?"translate-y-0":"translate-y-full"}`}
        >
          {/* <!-- Close button (cross) --> */}
          <div className="w-full flex items-center justify-between px-2">
            <i className="fa-duotone fa-solid fa-highlighter text-xl text-black"></i>

            <button
              onClick={handleEditHeightModal}
              id="closeEditModalBtn"
              className="text-black text-xl"
            >
              ✖
            </button>
          </div>

          {/* <!-- Form --> */}
          <form
            onSubmit={handleUpdateForm}
            className="flex flex-col items-center mt-6 gap-4"
          >
            {/* <!-- Input Field --> */}
            <label
              htmlFor="height"
              className="text-black font-semibold -mb-4 w-full ps-1 font-mono text-lg"
            >
             Height 

            <span className="ms-2 text-xs text-gray-600 font-mono font-medium">
              Current Value = {height}
            </span>

            </label>
            <input
              type="text"

              value={updatedHeight}
              onChange={(e) => setUpdatedHeight(e.target.value)}
              className="bg-[#1F1F1F] w-full text-white placeholder-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D7FF9C]"
              placeholder={height} required
           
            />

            <div className="form__quantity w-full ">
              {/* <!-- Input Field --> */}
                <label htmlFor="quantity" className="text-black font-semibold -mb-4 w-full ps-1 font-mono text-lg "
                  >Quantity
                  
                    <span className="ms-2 text-xs text-gray-600 font-mono font-medium">
              Current Value = {quantity}
            </span>

                  </label>
                <input
                  
                  type="number"
                  value={updatedQuantity}
                  onChange={(e)=>setUpdatedQuantity(e.target.value)}
                  className="bg-[#1F1F1F] w-full text-white placeholder-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D7FF9C]"
                  placeholder={quantity} required

                />
            </div>

            <div className="button-cotainer flex w-full gap-10">

          
            <button
              disabled={isLoading}
              type="submit"
              className="bg-white w-1/2 text-[#2F2F2F] rounded-md p-2 hover:bg-black hover:text-white border-2  transition duration-300 font-extrabold"
              >
              Edit
            </button>
            <button
              onClick={handleEditHeightModal}
              className="bg-white w-1/2 text-[#2F2F2F] rounded-md p-2 hover:bg-black hover:text-white border-2 transition duration-300 font-extrabold"
              >
              Cancel
            </button>
              </div>
          </form>
        </div>
      </div>

      <LoadingNotification
        showLoading={isLoading}
      />



    </>
  );
};

export default EditHeightModal;
