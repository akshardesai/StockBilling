import { Fragment } from "react";

const CustomerDetail = ({data,setData}) => {

  const {cartData}=data

  const {name}=data
  const{number}=data

 function handleInputUpdate(e){
  setData((prevData)=>{


    return{
      ...prevData,
      [e.target.name]:e.target.value
    }
  })
 }

  return (
    <div className=" px-4">

      {/*<!--============== Customer Info Container ==============-->*/}
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4">
      
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

        {/*<!--============== Cart Container ==============-->*/}
           <div className="container mx-auto   sm:px-6 lg:px-8 sm:py-6 lg:py-8">
             <div className="max-w-4xl mx-auto">
               <div className="bg-zinc-900/50 backdrop-blur-sm max-h-[320px] border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 overflow-y-auto">
                 <div className="flex items-center justify-between mb-2 sm:mb-3">
                   <div className="flex items-center space-x-2">
                     <span className="text-xs sm:text-sm text-gray-400">
                       {cartData ? cartData.length : "No"} item in Cart
                     </span>
                   </div>
                 </div>
     
                 {/*<!--==============  items Table ==============-->*/}
                 <div className="flex h-full py-2 px-1 sm:px-2 gap-2 sm:gap-3 overflow-x-auto scrollbar-hide text-white">
                   {cartData && cartData.length > 0 ? (
                     <div className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50">
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
                                 {sizeItem.heights.map((heightItem, heightIndex) => (
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
                                 ))}
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
