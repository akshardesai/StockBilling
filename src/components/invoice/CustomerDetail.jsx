import { Fragment, useEffect, useRef, useState } from "react";

const CustomerDetail = ({data,setData,additionalInfo=null,validationArray}) => {

  const {cartData}=data
  const {name}=data
  const{number}=data
 let total = 0 
 

  
 function handleInputUpdate(e){
  setData((prevData)=>{

    if (e.target.name==="number") {
      const onlyNumbers = e.target.value.replace(/\D/g,"");
      return{
      ...prevData,
      [e.target.name]:onlyNumbers
    }
    }

    if (e.target.name==="name") {
      return{
      ...prevData,
      [e.target.name]:e.target.value
    }
    }

    
  })
 }

 function handlePaymentStatus(status){


        setData((prevData)=>{
          console.log(prevData);
          return{
            ...prevData,
            payment_status:status
          }
        
          
        })


 }
  

  return (
    <div className=" px-4">

      {/*<!--============== Customer Info Container ==============-->*/}
      <div className="bg-[#1E2228] sm:w-[30%] mx-auto backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-4">
      
      <div className="form-container">
        <form  className=''>
          <div className="flex flex-col   px-4 mb-4 ">

          <label htmlFor="name" className='mb-1 ps-1 font-semibold'>Name</label>
          <input  type="text" placeholder="John" value={name?name:""} onChange={(e)=>handleInputUpdate(e)} name='name' className='w-ful px-2 bg-black  rounded-lg py-2 text-white border-2 border-gray-400/40 focus:border-lime-300/60  focus:outline-none  '/>
          </div>

          <div className="flex flex-col  px-4 mb-2">

          <label htmlFor="number" className='mb-1 ms-1 font-semibold'>Number</label>
          <input type="text" placeholder="9825076985" value={number?number:""} name="number"  onChange={(e)=> handleInputUpdate(e)
 }  className='w-ful px-2 bg-black  rounded-lg py-2 text-white  focus:border-lime-300/60 focus:outline-none border-2 border-gray-400/40' />
          </div>

          <div className="flex flex-col  px-4 mb-2">

          <label htmlFor="number" className='mb-2 ms-1 font-semibold'>Payment</label>
   
              <div className="w-full">


<ul className=" w-full flex gap-4   ">
    <li>
        <input onClick={()=>handlePaymentStatus(1)} type="radio" id="hosting-small" name="hosting" value="1" className="hidden peer"   />
        <label htmlFor="hosting-small" className="inline-flex items-center justify-between w-full px-3 py-1 text-white bg-black border-2 border-gray-400/40 rounded-lg cursor-pointer  peer-checked:border-lime-300/30  peer-checked:text-lime-200 hover:text-white hover:bg-gray-900 ">                           
            <div className="pe-4">
                <div className="w-full text-lg font-semibold">Paid</div>
               
            </div>
           <i className="ri-emotion-happy-line text-lg"></i>
        </label>
    </li>
    <li>
        <input onClick={()=>handlePaymentStatus(2)} type="radio" id="hosting-big" name="hosting" value="2" className="hidden peer"  />
        <label htmlFor="hosting-big" className="inline-flex items-center justify-between w-full px-3 py-1 text-white bg-black border-2 border-gray-400/40 rounded-lg cursor-pointer  peer-checked:border-red-300/30   peer-checked:text-red-200 hover:text-white hover:bg-gray-900 ">
            <div className="pe-4">
                <div className="w-full text-lg font-semibold">Pending</div>
                
            </div>
          <i className="ri-emotion-unhappy-line text-lg "></i>
        </label>
    </li>
</ul>

              </div>

          </div>


        </form>
      </div>

    
      
      </div>

        {/*<!--============== Cart Container ==============-->*/}
           <div className="container mx-auto   ">
             <div className="max-w-4xl mx-auto">
               <div className="bg-[#1E2228] backdrop-blur-sm max-h-[320px] border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 overflow-y-auto">
                 
                 <div className="flex  items-center justify-between mb-2 sm:mb-3">
                   <div className="flex w-full items-center justify-between  px-4">
                     <span className="text-xs sm:text-sm text-gray-400">
                       {cartData ? cartData.length : "No"} item in Cart
                     </span>
                     <span className="text-xs sm:text-sm text-gray-400">
                       Total Amount - {data.total ? data.total : "0"} 
                     </span>
                   </div>
                 </div>
     
                 {/*<!--==============  items Table ==============-->*/}
                 <div className="flex h-full py-2 px-1 sm:px-2 gap-2 sm:gap-3 overflow-x-auto scrollbar-hide text-white">
                   {cartData && cartData.length > 0 ? (
                     <div className="w-full rounded-lg border border-zinc-800 bg-black">
                       <div className="relative w-full overflow-auto">
                         <table className="w-full caption-bottom text-sm">
                           <thead className="[&_tr]:border-b border-zinc-800">
                             <tr className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/50">
                               <th className="h-10 px-2 text-left align-middle font-medium text-zinc-400  sm:h-12 sm:px-4">
                                 Size
                               </th>
                               <th className="h-10 px-2 text-left align-middle font-medium text-zinc-400  sm:h-12 sm:px-4">
                                 Height
                               </th>
                               <th className="h-10 px-2 text-left align-middle font-medium text-zinc-400  sm:h-12 sm:px-4">
                                 Quantity
                               </th>
                               <th className="h-10 px-2 text-left align-middle font-medium text-zinc-400  sm:h-12 sm:px-4">
                                 Price
                               </th>
                               <th className="h-10 px-2 text-left align-middle font-medium text-zinc-400  sm:h-12 sm:px-4">
                                 Total
                               </th>
                             </tr>
                           </thead>
                           <tbody className="[&_tr:last-child]:border-0">
                             {cartData.map((sizeItem) => (
                               <Fragment key={sizeItem.$id}>
                                 {sizeItem.heights.map((heightItem, heightIndex) => 
                                 
                                 {  total+=heightItem.price * heightItem.cartQuantity
                                return  (
                                   <tr
                                     key={heightItem.$id}
                                     className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/50"
                                   >
                                     {heightIndex === 0 && (
                                       <td
                                         className="p-2 align-middle sm:p-4 font-medium"
                                         rowSpan={sizeItem.heights.length}
                                       >
                                         {sizeItem.size}
                                       </td>
                                     )}
                                     <td className="p-2 sm:p-4">
                                       <div className="font-medium text-white">
                                         {heightItem.height}
                                       </div>
                                     </td>
                                     <td className="p-2 align-middle sm:p-4">
                                       <div className="text-zinc-300">
                                         {heightItem.cartQuantity}
                                       </div>
                                     </td>
                                     <td className="p-1  sm:p-4">
                                       <div className="text-zinc-300">
                                         {heightItem.price}
                                       </div>
                                     </td>
                                     <td className="p-1  sm:p-4">
                                       <div className="text-zinc-300">
                                        
                                         {heightItem.price * heightItem.cartQuantity}
                                       </div>
                                     </td>
                                     
                                   </tr>
                                 )
                                }
                                 
                                 
                                 )}
                               </Fragment>
                             ))}
                           </tbody>
                         </table>

                       </div>
                     </div>
                   ) : (
                     ""
                    )}
                 </div>
                   
               </div>
             </div>
           </div>

    </div>
  )
}

export default CustomerDetail
