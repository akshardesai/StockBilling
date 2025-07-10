import { Fragment, useEffect, useState } from "react";
import { addHeight, readAllProduct } from "../../utils/StockTables";

const Cart = ({data,setData}) => {
  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  
  // const [cartProducts, setCartProducts] = useState([]);

  async function readAllProductsDB() {
    try {
      setIsLoading(true);
      const data = await readAllProduct();
      if (data) {
        setProducts(data.documents);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const AddHeightToCart = (heightToAdd) => {
    if (!selectedSize) return;

    const sId = selectedSize.$id;
    const size = selectedSize.size;

    const { $id: hId, height } = heightToAdd;

    setData((prevCart) => {

     
      
      
        
        
      //check if the size already exists in the cart
      const existingSizeInCart = prevCart.cartData.find((item) => item.$id === sId);
      // console.log('existing size index ->',existingSizeIndex);

      // (1) the size is not in the cart yet
      if (!existingSizeInCart) {
        const newProduct = {
          $id: sId,
          size: size,
          heights: [
            { $id: hId, height: height, cartQuantity: 1, price: 0 }, //add initial quantity and price
          ],
        };

        //return a new array with the old items plus the new one with unique size
        return {...prevCart, cartData : [...prevCart.cartData,newProduct]};
      } else {

        console.log('size exists',prevCart.cartData);

         const result = prevCart.cartData.map((sizeItem)=>{
          console.log('inside map returning something wrong',sizeItem);
          

          if (sizeItem.$id !==sId) {
            
            
              return sizeItem
          }
      
          
          const existingHeightInSize = sizeItem.heights.find(
            (h) => h.$id === hId
          );
          
          // 2(a) the spceific height is not in this size yet
          if (!existingHeightInSize) {
            return {
              ...sizeItem,
              heights:[
                ...sizeItem.heights,
                {$id:hId,height:height,cartQuantity:1,price:0}
              ]
            }
          }
          
          // 2(b) the height is in this size. we need to update it
          return{
            ...sizeItem,
            heights:sizeItem.heights.map((heightItem)=>{
              if (heightItem.$id !==hId) {
                  return heightItem
              }
              return {...heightItem,cartQuantity:heightItem.cartQuantity+1}
            })

          }
          
          
        })

        console.log('result',result);
        
        return {...prevCart, cartData:result}
      }
    });
  };

  useEffect(() => {
    readAllProductsDB();
  }, []);

  // Extract unique sizes from products (mock implementation)
  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center ">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#BEF264] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#BEF264] rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-[#BEF264] rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    );
  }
const {cartData}=data 

console.log('cartData->',cartData);

  return (
    <div className="h-fit bg-[#0B0B0B] text-white ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8  sm:py-6 lg:py-8">
   

        {/* Size Filter Section */}
        <div className="max-w-4xl mx-auto mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-400">
                  {products.length} sizes available
                </span>
              </div>
            </div>

            <div className="flex h-fit py-2 px-1 sm:px-2 gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
              {products.map((s) => (
                <button
                  key={s.$id}
                  onClick={() => setSelectedSize(selectedSize === s ? null : s)}
                  className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[60px] sm:min-w-[80px] ${
                    selectedSize === s
                      ? "bg-[#BEF264] text-black shadow-lg shadow-[#BEF264]/20"
                      : "bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                    <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                      {s.size}
                    </span>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BEF264]/0 to-[#BEF264]/0 group-hover:from-[#BEF264]/5 group-hover:to-[#BEF264]/10 transition-all duration-300 rounded-lg sm:rounded-xl" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/*<!--============== Selected Size Height Table ==============-->*/}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-400">
                  Size {selectedSize ? selectedSize.size : "Not"} Selected
                </span>
              </div>
            </div>

            {/*<!--==============  Height Table ==============-->*/}
            <div className="flex h-fit py-2 px-1 sm:px-2 gap-2 sm:gap-3 overflow-x-auto scrollbar-hide text-white">
              {selectedSize ? (
                <div className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b border-zinc-800">
                        <tr className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/50">
                          <th className="h-10 px-2 text-left align-middle font-medium text-zinc-400  sm:h-12 sm:px-4">
                            Height
                          </th>
                          <th className="h-10 px-2 text-left align-middle font-medium text-zinc-400  sm:h-12 sm:px-4">
                            Quantity
                          </th>
                          <th className="h-10 px-2 text-left align-middle font-medium text-zinc-400  sm:h-12 sm:px-4">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {selectedSize.heights.map((h, index) => (
                          <tr
                            key={index}
                            className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/50"
                          >
                            <td className="p-2 sm:p-4">
                              <div className="font-medium text-white">
                                {h.height}
                              </div>
                            </td>
                            <td className="p-2 align-middle sm:p-4">
                              <div className="text-zinc-300">{h.quantity}</div>
                            </td>
                            <td className="p-1  sm:p-4">
                              <button
                                onClick={() => AddHeightToCart(h)}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-50 text-zinc-900 shadow-sm hover:bg-zinc-50/90 h-fit px-2 py-1"
                              >
                                + Cart
                              </button>
                            </td>
                          </tr>
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

      {/*<!--============== Cart Container ==============-->*/}
      <div className="container mx-auto px-4  sm:px-6 lg:px-8 sm:py-6 lg:py-8">
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
  );
};

export default Cart;
