import React from 'react'

const PreviewBillModal = ({data,setData,handleModal}) => {

    const {name,number}=data
    const {cartData}=data
  return (
    <div className='fixed inset-0 z-100 p-4 '>
        <div className="bg-gray-500 w-full h-full">
            <div className="header-container w-full flex justify-end px-4 py-2 ">
               <button onClick={handleModal}>
                 <i class="ri-close-large-line"></i>
               </button>
            </div>
            <div className="customer-info-container w-full flex ">

                          <div className="form-container">
        <form  className=''>
          <div className="flex flex-col  px-4 mb-2">

          <label htmlFor="name" className='mb-1 ps-1'>Name</label>
          <input  type="text" value={name} onChange={(e)=>handleInputUpdate(e)} name='name' className='w-ful px-2 bg-white  rounded-xl py-2 text-black focus:border-none focus:ring-3 focus:outline-none focus:ring-lime-500'/>
          </div>

          <div className="flex flex-col  px-4 mb-2">

          <label htmlFor="number" className='mb-1 ms-1'>Number</label>
          <input type="number" value={number}  onChange={(e)=>handleInputUpdate(e)} name='number' className='w-ful px-2 bg-white  rounded-xl py-2 text-black  focus:border-none focus:ring-3 focus:outline-none focus:ring-lime-500' />
          </div>

        </form>
      </div>

            </div>
        </div>
    </div>
  )
}

export default PreviewBillModal
