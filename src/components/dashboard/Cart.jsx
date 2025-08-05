import { Fragment, useEffect, useRef, useState } from "react";
import { addHeight, readAllProduct } from "../../utils/StockTables";

const Cart = ({ data, setData, additionalInfo=null,validationArray}) => {
  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [ispriceModal, setIsPriceModal] = useState(false);
  const [isEditPriceModal,setIsEditPriceModal]=useState(false);



  const [priceInput, setPriceInput] = useState("");

  const [heightToAdd, setHeightToAdd] = useState(null);

  async function readAllProductsDB() {
    try {
      setIsLoading(true);
      const data = await readAllProduct();
      if (data) {
        setProducts(data.documents);
        // (data.documents);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputPriceChange = (e) => {
    const value = e.target.value;

    if (value.trim() === "") {
      setPriceInput("");
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        setPriceInput(num);
      }
    }
  };

  const handlePriceSubmit = () => {
    event.preventDefault();

    const price = priceInput;

    if (price <= 0 || isNaN(price)) {
      // ("error he ji yo to");
      setIsPriceModal(false);
      setPriceInput("");
      return;
    }

    AddHeightToCart(heightToAdd, price);
  };

  const handlePriceEdit = (s,h,price)=>{
    //on click open modal
    //get price from modal
    //setprice to submited modal price
    setIsEditPriceModal(true)
    setPriceInput(price)
    setHeightToAdd(h)
    
    
  }
  
  const handleEditPriceSubmit = ()=>{
    // ("heighttoedit =>",heightToAdd);
    
    setData((prevData)=>{
       const oldCartData = prevData.cartData.map((sizeItem)=>{
          return{...sizeItem,
            heights:sizeItem.heights.map((heightItem)=>{
              // ('height item->',heightItem);
              
              if (heightItem.$id!==heightToAdd.$id) {
                return heightItem
              }
                return {
                ...heightItem,
                price:priceInput
              }
            })
          }
       })
      // ("old cart data returned->",oldCartData);
       
       return {...prevData,cartData:oldCartData}
       
    })

    setIsEditPriceModal(false)
    setPriceInput("")
  }

  const handleAddToCart = (h) => {
    const oldCart = data.cartData;
    const exists = oldCart.some(
      (size) =>
        size.$id === h.size_id &&
        size.heights.some((height) => height.$id === h.$id)
    );

    if (exists) {
      // ("price->", price);

      AddHeightToCart(h, h.price);
    } else {
      setIsPriceModal(true);
      setHeightToAdd(h)
    }
  };

  const AddHeightToCart = (heightAdd, priceToAdd) => {
    // ("hello", priceToAdd);

    if (!selectedSize) return;

    const sId = selectedSize.$id;
    const size = selectedSize.size;

    const { $id: hId, height } = heightAdd;

    setData((prevCart) => {
      //check if the size already exists in the cart
      const existingSizeInCart = prevCart.cartData.find(
        (item) => item.$id === sId
      );
      // ('existing size index ->',existingSizeIndex);

      // (1) the size is not in the cart yet
      if (!existingSizeInCart) {
        const newProduct = {
          $id: sId,
          size: size,
          heights: [
            { $id: hId, height: height, cartQuantity: 1, price: priceToAdd }, //add initial quantity and price
          ],
        };

        //return a new array with the old items plus the new one with unique size
        return { ...prevCart, cartData: [...prevCart.cartData, newProduct] };
      } else {
        // ("size exists", prevCart.cartData);

        const result = prevCart.cartData.map((sizeItem) => {
          // ('inside map returning something wrong',sizeItem);

          if (sizeItem.$id !== sId) {
            return sizeItem;
          }

          const existingHeightInSize = sizeItem.heights.find(
            (h) => h.$id === hId
          );

          // 2(a) the spceific height is not in this size yet
          if (!existingHeightInSize) {
            return {
              ...sizeItem,
              heights: [
                ...sizeItem.heights,
                {
                  $id: hId,
                  height: height,
                  cartQuantity: 1,
                  price: priceToAdd,
                },
              ],
            };
          }

          // 2(b) the height is in this size. we need to update it
          return {
            ...sizeItem,
            heights: sizeItem.heights.map((heightItem) => {
              if (heightItem.$id !== hId) {
                return heightItem;
              }
              return {
                ...heightItem,
                cartQuantity: heightItem.cartQuantity + 1,
              };
            }),
          };
        });

        //('result',result);

        return { ...prevCart, cartData: result };
      }
    });
    setPriceInput("");
    setIsPriceModal(false);
  };

  const RemovHeightFromCart = (heightToRemove) => {
    // ("height to remove ->", heightToRemove);
    // ("inside cart -> ", data.cartData);

    const heightId = heightToRemove.$id;
    const sizeId = heightToRemove.size_id;

    setData((prevData) => {
      const filteredCartData = prevData.cartData.map((item) => {
        if (item.$id === sizeId) {
          const filteredHeights = item.heights
            .map((height) => {
              if (height.$id === heightId) {
                if (height.cartQuantity > 0) {
                  return {
                    ...height,
                    cartQuantity: height.cartQuantity - 1,
                  };
                }
              }
              return height;
            })
            .filter((height) => height.cartQuantity > 0);
          return {
            ...item,
            heights: filteredHeights,
          };
        }
        return item;
      });

      return {
        ...prevData,
        cartData: filteredCartData,
      };
    });
  };

  useEffect(() => {
    readAllProductsDB();
  }, []);


  useEffect(() => {
    if (products) {
      
      setSelectedSize(products[0]);
    }
  }, [products]);

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
  const { cartData } = data;

  // ('cartData->',cartData);

  return (
    <>
      <div className="h-fit bg-[#0B0B0B] text-white ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8   ">
          {/* Size Filter Section */}
          <div className="max-w-4xl mx-auto mb-4 ">
            <div className="bg-[#171717] backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-400">
                    {products?products.length : "N|A"} sizes available
                  </span>
                </div>
              </div>

              <div className="flex h-fit py-2 px-1 sm:px-2 gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                {products?products.map((s) => (
                  <button
                    key={s.$id}
                    onClick={() =>
                      setSelectedSize(selectedSize === s ? null : s)
                    }
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
                )):""}
              </div>
            </div>
          </div>
        </div>

                <div className="sm:flex sm:w-[70%] sm:mx-auto">
        {/*<!--============== Selected Size Height Table ==============-->*/}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 md:w-[80%] ">
          <div className="max-w-4xl mx-auto mb-4 ">
            <div className="bg-[#171717] backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-400">
                    Size {selectedSize ? selectedSize.size : "Not"} Selected
                  </span>
                </div>
              </div>

              {/*<!--==============  Height Table ==============-->*/}
              <div className="flex h-fit sm:min-h-[255px] py-2 px-1 sm:px-2 gap-2 sm:gap-3 overflow-x-auto scrollbar-hide text-white">
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
                                <div className="text-zinc-300">
                                  {h.quantity}
                                </div>
                              </td>
                              <td className="p-1  sm:p-4">
                                {cartData.some((sizeItem) =>
                                  sizeItem.heights.some(
                                    (heightItem) => heightItem.$id === h.$id
                                  )
                                ) ? (
                                  <button
                                    onClick={() => RemovHeightFromCart(h)}
                                    className="inline-flex items-center me-3 justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-red-400 text-zinc-900 shadow-sm hover:bg-red-500 h-fit px-2 py-1"
                                  >
                                    <i className="ri-delete-bin-fill"></i>
                                  </button>
                                ) : (
                                  ""
                                )}

                                <button
                                  onClick={() => {
                                    // setHeightToAdd(h);
                                    handleAddToCart(h);
                                  }}
                                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 bg-zinc-50 text-zinc-900 shadow-sm hover:bg-zinc-50/90 h-fit px-2 py-1"
                                >
                                  <i className="ri-add-box-line"></i>
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
        <div className="container mx-auto px-4 md:w-[70%] ">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#171717] backdrop-blur-sm max-h-[320px] border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 overflow-y-auto">
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
                              {sizeItem.heights.map(
                                (heightItem, heightIndex) => (
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
                                      <button onClick={()=>handlePriceEdit(sizeItem,heightItem,heightItem.price)} className="text-zince-300 bg-gray-700 px-1 rounded-sm">
                                        {heightItem.price}
                                      </button>
                                    </td>
                                    <td className="p-1  sm:p-4">
                                      <div className="text-zinc-300">
                                        {heightItem.price *
                                          heightItem.cartQuantity}
                                      </div>
                                    </td>
                                  </tr>
                                )
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
      </div>


      {/*<!--============== Price Input MOdal ==============-->*/}

      <div
        className={`fixed    w-[90%] md:w-[25%] h-fit p-4 top-0 left-1/2  bg-white text-black rounded-b-4xl transform -translate-x-1/2 transition-all duration-500 ease-in-out ${
          ispriceModal ? "translate-y-0" : "-translate-y-160"
        }`}
      >
        <div className="input-container flex flex-col mt-4 ">
          <form
            action={handlePriceSubmit}
            className="form-container flex flex-col mt-4"
          >
            <label className="ps-1 pb-1 font-bold" htmlFor="price">
              Price
            </label>
            <input
              type="number"
               placeholder="2000"
              value={priceInput}
              onChange={(e) => handleInputPriceChange(e)}
              name="price"
              className="bg-black px-2 py-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-50"
            />
            <button
              type="submit"
              className="mt-4 w-fit bg-black mx-auto px-4 py-1 text-white rounded-sm"
            >
              Set
            </button>
          </form>
        </div>

        <button
          onClick={() => setIsPriceModal(false)}
          className="absolute top-1 right-4"
        >
          <i className="ri-close-large-line"></i>
        </button>
      </div>

      {/*<!--============== Edit Price Input Modal ==============-->*/}
      <div
        className={`fixed   w-[90%] md:w-[25%] h-fit  p-4 top-0 left-1/2 bg-[#bef264] text-black rounded-b-4xl transform -translate-x-1/2 transition-all duration-500 ease-in-out ${
          isEditPriceModal ? "translate-y-0" : "-translate-y-160"
        }`}
      >
        <div className="input-container flex flex-col mt-4 ">
          <form
            action={handleEditPriceSubmit}
            className="form-container flex flex-col mt-4"
          >
            <label className="ps-1 pb-1 font-bold" htmlFor="price">
              Edit Price
            </label>
            <input
              type="number"
             
              placeholder="N/A"
              value={priceInput}
              onChange={(e) => handleInputPriceChange(e)}
              name="price"
              className="bg-black px-2 py-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-50"
            />
            <button
              type="submit"
              className="mt-4 w-fit bg-black mx-auto px-4 py-1 text-white rounded-sm"
            >
              Set
            </button>
          </form>
        </div>

        <button
          onClick={() => setIsEditPriceModal(false)}
          className="absolute top-1 right-4"
        >
          <i className="ri-close-large-line"></i>
        </button>
      </div>
    </>
  );
};

export default Cart;
