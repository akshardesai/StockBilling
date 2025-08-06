import React, { useState, useRef, useMemo } from "react";
import {
  addHeight,
  addQuantityBy1,
  lessQuantityBy1,
} from "../../utils/StockTables";
import DeleteModal from "./DeleteModal";
import EditHeightModal from "./EditHeightModal";
import Alert from "../Alert";
import SuccessNotification from "../SuccessNotification";
import LoadingNotification from "../LoadingNotification";

const AllProducts = ({ products, setProducts }) => {
  const [isOpenHeightModal, setIsOpenHeightModal] = useState(false);
  const [isOpenDeleteSizeModal, setIsOpenDeleteSizeModal] = useState(false);
  const [isOpenDeleteHeightModal, setIsOpenHeightDeleteModal] = useState(false);
  const [isOpenEditHeightModal, setIsOpenEditHeightModal] = useState(false);

  const [selectedThing, setSelectedThing] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [heightId, setHeightId] = useState(null);
  const [height, setHeight] = useState(null);
  const [quantity, setQuantity] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState(0);
  const [searchContainer, setSearchContainer] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const heightInputRef = useRef();
  const quantityInputRef = useRef();

  // Enhanced search functionality with real-time filtering (only for product sizes)
  const filteredProducts = useMemo(() => {
    if (!searchInput.trim()) {
      return products;
    }

    const searchTerm = searchInput.toLowerCase().trim();
    
    return products.filter(product => {
      // Search only in product size
      const sizeMatch = product.size?.toLowerCase().includes(searchTerm);
      
      return sizeMatch;
    });
  }, [products, searchInput]);

  // Filter products based on active filter and search
  const displayProducts = useMemo(() => {
    let result = searchInput ? filteredProducts : products;
    
    if (activeFilter === 0) {
      return result; // Show all
    } else if (activeFilter >= 2) {
      // Filter by specific size (activeFilter - 2 gives us the index in products array)
      const filterIndex = activeFilter - 2;
      const selectedProduct = products[filterIndex];
      if (selectedProduct && searchInput) {
        // If searching and filter is active, show only matching products of that size
        return filteredProducts.filter(p => p.$id === selectedProduct.$id);
      } else if (selectedProduct) {
        return [selectedProduct];
      }
    }
    
    return result;
  }, [products, filteredProducts, activeFilter, searchInput]);

  // Search input handler with debouncing effect
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Auto-show results when typing
    if (value.trim() && !searchContainer) {
      setSearchContainer(true);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput("");
    setSearchContainer(false);
    setActiveFilter(0);
  };

  // Toggle search container
  const toggleSearchContainer = () => {
    if (searchContainer) {
      clearSearch();
    } else {
      setSearchContainer(true);
    }
  };

  // Highlight matching text in search results
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.toString().split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-400 text-black px-1 rounded">{part}</span> : 
        part
    );
  };

  function handleEditHeightModal(height, size) {
    console.log('handle edit modal', height, size);
    
    if (isOpenEditHeightModal) {
      console.log("modal closed reseting state");
      setIsOpenEditHeightModal(false);
    } else {
      setSelectedHeight(height);
      setSelectedThing(size);
      setHeight(height.height);
      setQuantity(height.quantity);
      setIsOpenEditHeightModal(true);
    }
  }

  function handleDeleteModal(size) {
    if (isOpenDeleteSizeModal) {
      setIsOpenDeleteSizeModal(false);
      document.body.style.overflow = "auto";
      if (selectedThing) {
        setSelectedThing(null);
      }
    } else {
      setSelectedThing(size);
      setIsOpenDeleteSizeModal(true);
      document.body.style.overflow = "hidden";
    }
  }

  function handleDeleteHeightModal(height, size) {
    if (isOpenDeleteHeightModal) {
      setIsOpenHeightDeleteModal(false);
      document.body.style.overflow = "auto";
      if (height) {
        setSelectedHeight(null);
        setSelectedThing(null);
      }
    } else {
      setSelectedHeight(height);
      setSelectedThing(size);
      setIsOpenHeightDeleteModal(true);
      document.body.style.overflow = "hidden";
    }
  }

  function openHeightModal(size) {
    setIsOpenHeightModal(true);
    setSelectedThing(size);
  }

  function closeHeightModal() {
    setIsOpenHeightModal(false);
    setSelectedThing(null);
  }

  function handleHeightSubmit(event) {
    event.preventDefault();
    const height = heightInputRef.current.value.trim();
    const quantity = quantityInputRef.current.value.trim();

    if (!height) return;
    if (!quantity) return;

    insertHeight(selectedThing, height, quantity);
  }

  function deductQuantity(height, size) {
    deductQuantityDB(height, size);
  }

  function addQuantity(height, size) {
    addQuantityDB(height, size);
  }

  async function deductQuantityDB(height, size) {
    setIsLoading(true);
    const response = await lessQuantityBy1(height, size);

    if (response.success) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          if (product.$id === size.$id) {
            return {
              ...product,
              heights: product.heights
                ? product.heights.map((h) =>
                    h.$id === height.$id
                      ? { ...h, quantity: response.data.quantity }
                      : h
                  )
                : [],
            };
          }
          return product;
        })
      );

      setIsLoading(false);
      setShowSuccessNotification(true);
      setAlertMessage("Subtracted Quantity by 1");
    } else {
      setIsLoading(false);
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage(response.error);
    }
  }

  async function addQuantityDB(height, size) {
    setIsLoading(true);
    const response = await addQuantityBy1(height, size);

    if (response.success) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          if (product.$id === size.$id) {
            return {
              ...product,
              heights: product.heights
                ? product.heights.map((h) =>
                    h.$id === height.$id
                      ? { ...h, quantity: response.data.quantity }
                      : h
                  )
                : [],
            };
          }
          return product;
        })
      );

      setIsLoading(false);
      setShowSuccessNotification(true);
      setAlertMessage("Added Quantity by 1");
    } else {
      setIsLoading(false);
      setShowAlert(true);
      setAlertMessage(response.error);
    }
  }

  async function insertHeight(size, height, quantity) {
    try {
      setIsLoading(true);
      const response = await addHeight(size, height, quantity);

      if (response.success) {
        const newHeight = {
          $id: response.data.$id,
          height: height,
          quantity: parseInt(quantity),
          sizes: size.$id,
          size_id: size.$id,
        };

        console.log('new height add response ->', newHeight);
        
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product.$id === size.$id) {
              console.log('prev product ->', product);
              console.log('if condition true');
              
              return {
                ...product,
                heights: product.heights
                  ? [...product.heights, newHeight]
                  : [newHeight],
              };
            }
            return product;
          })
        );

        heightInputRef.current.value = "";
        quantityInputRef.current.value = "";
        closeHeightModal();
        setIsLoading(false);
        setShowSuccessNotification(true);
        setAlertMessage("Height Added");
        console.log("Height added successfully and DOM updated");
      } else {
        setIsLoading(false);
        setShowAlert(true);
        setAlertMessage(response.error);
      }
    } catch (error) {
      setIsLoading(false);
      setShowAlert(true);
      setAlertMessage(`catched error - ${error}`);
    }
  }

  if (products.length === 0) {
    return <p className="text-center mt-4">No products yet.</p>;
  }

  return (
    <>
      {/* Search Container - Enhanced */}
      {searchContainer && (
        <div className="search-container bg-[#292929] fixed top-0 left-0 right-0 h-auto px-6 py-4 shadow-lg z-50 border-b border-gray-600">
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <i className="ri-search-line text-lg text-gray-400"></i>
              </span>
              
              <input
                type="text"
                placeholder="Search by size..."
                value={searchInput}
                onChange={handleSearchInput}
                className="w-full pl-12 pr-12 py-3 bg-black border-2 border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BEF264] focus:border-[#BEF264] text-white text-sm transition duration-150 ease-in-out placeholder-gray-400"
                autoFocus
              />

              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
              >
                <i className="ri-close-large-line text-lg"></i>
              </button>
            </div>
            
            {/* Search Results Count */}
            {searchInput && (
              <div className="mt-2 text-sm text-gray-400 text-center">
                {displayProducts.length} result{displayProducts.length !== 1 ? 's' : ''} found
                {searchInput && (
                  <span className="ml-2">
                    for "<span className="text-[#BEF264]">{searchInput}</span>"
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Container */}
      <div className={`filter-container mt-4 transition-all duration-300`}>
        <div className="w-full sm:w-[50%] mx-auto flex flex-col items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl sm:max-w-xl mx-auto mb-4">
              <div className="bg-[#171717] backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl px-4 py-4">
                <div className="flex h-fit py-2 px-1 sm:px-2 gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setActiveFilter(0)}
                    className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[60px] sm:min-w-[80px] ${
                      activeFilter === 0
                        ? "bg-[#BEF264] text-black"
                        : "bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                      <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                        All
                      </span>
                      {searchInput && (
                        <span className="text-xs text-gray-500">
                          ({filteredProducts.length})
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#BEF264]/0 to-[#BEF264]/0 group-hover:from-[#BEF264]/5 group-hover:to-[#BEF264]/10 transition-all duration-300 rounded-lg sm:rounded-xl" />
                  </button>

                  <button
                    onClick={toggleSearchContainer}
                    className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[60px] sm:min-w-[80px] ${
                      searchContainer
                        ? "bg-[#BEF264] text-black"
                        : "bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                      <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                        <i className={searchContainer ? "ri-close-line" : "ri-search-line"}></i>
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#BEF264]/0 to-[#BEF264]/0 group-hover:from-[#BEF264]/5 group-hover:to-[#BEF264]/10 transition-all duration-300 rounded-lg sm:rounded-xl" />
                  </button>

                  {products &&
                    products.map((entry, index) => {
                      const isFiltered = searchInput && !filteredProducts.find(p => p.$id === entry.$id);
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveFilter(index + 2)}
                          disabled={isFiltered}
                          className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[60px] sm:min-w-[80px] ${
                            activeFilter === index + 2
                              ? "bg-[#BEF264] text-black"
                              : isFiltered
                              ? "bg-zinc-900/30 border border-zinc-800 opacity-50 cursor-not-allowed"
                              : "bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-zinc-600"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                            <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                              {entry.size || "N/A"}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#BEF264]/0 to-[#BEF264]/0 group-hover:from-[#BEF264]/5 group-hover:to-[#BEF264]/10 transition-all duration-300 rounded-lg sm:rounded-xl" />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full products-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-[1240px] mx-auto sm:px-4">
        {displayProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <i className="ri-search-line text-4xl text-gray-500 mb-4 block"></i>
            <p className="text-gray-400 text-lg mb-2">No products found</p>
            <p className="text-gray-500 text-sm">
              Try adjusting your search terms or clear the search to see all products
            </p>
            {searchInput && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-[#BEF264] text-black rounded-lg hover:bg-[#b5e87b] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          displayProducts.map((product, index) => (
            <div
              key={product.$id || index}
              id={product.size}
              className="home__table-container mb-8 md:mb-14 flex flex-col items-center"
            >
              <div className="home__size-container w-full h-12 sm:h-16 flex items-center justify-center px-2 sm:px-7">
                <div className="home__size w-full h-full pt-2 sm:pt-4 bg-[#171717] text-black rounded-t-xl flex items-center justify-center gap-2 border-l-2 border-r-2 border-t-2 border-[#DD9F67]">
                  <button
                    disabled={isLoading}
                    onClick={() => openHeightModal(product)}
                    className="addHeightBtn px-2 py-1 rounded-full bg-black text-white text-xs sm:text-sm"
                  >
                    <i className="fa-duotone fa-solid fa-box-open-full"></i>
                  </button>
                  <p className="font-bold text-white text-sm sm:text-base truncate max-w-[200px]">
                    {searchInput ? highlightText(product.size, searchInput) : product.size}
                  </p>
                  <button
                    disabled={isLoading}
                    onClick={() => handleDeleteModal(product)}
                    className="removeProductBtn px-2 py-1 rounded-full bg-black text-white text-xs sm:text-sm"
                  >
                    <i className="fa-duotone fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg rounded-lg border-x-2 border-b-2 border-gray-600">
                <table className="w-full text-sm text-left rtl:text-right text-gray-400 shadow-2xl min-w-[300px]">
                  <thead className="text-xs text-white uppercase bg-[#171717]">
                    <tr>
                      <th scope="col" className="px-2 sm:px-6 text-center py-3">
                        height
                      </th>
                      <th scope="col" className="px-2 sm:px-6 py-3 text-center">
                        Qty
                      </th>
                      <th scope="col" className="px-2 sm:px-6 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.heights
                      ? product.heights.map((height) => (
                          <tr
                            key={height.$id}
                            className="bg-[#171717] hover:bg-gray-700"
                          >
                            <td className="px-2 sm:px-6 py-4 font-semibold text-white text-center">
                              <span className="font-bold bg-black px-2 py-1 rounded-lg text-xs sm:text-sm">
                                {height.height || "N/A"}
                              </span>
                            </td>
                            <td className="px-2 sm:px-6 py-4">
                              <div className="flex items-center justify-center">
                                <button
                                  disabled={isLoading}
                                  onClick={() => deductQuantity(height, product)}
                                  className="inline-flex items-center justify-center p-1 me-1 sm:me-3 text-sm font-medium h-6 w-6 text-gray-400 bg-gray-800 border border-gray-600 rounded-full focus:outline-none hover:bg-gray-700 hover:border-gray-600 focus:ring-4 focus:ring-gray-700 cursor-pointer"
                                  type="button"
                                >
                                  <svg
                                    className="w-2 h-2 sm:w-3 sm:h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 2"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M1 1h16"
                                    />
                                  </svg>
                                </button>
                                <div className="mx-1 sm:mx-0">
                                  <span className="bg-gray-700 w-10 sm:w-14 border border-gray-600 text-white text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block text-center py-1 cursor-pointer">
                                    {searchInput 
                                      ? highlightText(height.quantity || "N/A", searchInput)
                                      : height.quantity || "N/A"
                                    }
                                  </span>
                                </div>
                                <button
                                  disabled={isLoading}
                                  onClick={() => addQuantity(height, product)}
                                  className="inline-flex items-center justify-center h-6 w-6 p-1 ms-1 sm:ms-3 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-600 rounded-full focus:outline-none hover:bg-gray-700 hover:border-gray-600 focus:ring-4 focus:ring-gray-700"
                                  type="button"
                                >
                                  <svg
                                    className="w-2 h-2 sm:w-3 sm:h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 18"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 1v16M1 9h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td className="px-2 sm:px-6 py-4">
                              <div className="flex items-center justify-center gap-1 sm:gap-3">
                                <button
                                  disabled={isLoading}
                                  onClick={() => handleEditHeightModal(height, product)}
                                  className="editHeightBtn text-white bg-black px-2 py-1 rounded-lg text-xs sm:text-sm"
                                >
                                  <i className="fa-solid fa-file-pen"></i>
                                </button>
                                <button
                                  disabled={isLoading}
                                  onClick={() => handleDeleteHeightModal(height, product)}
                                  className="removeHeightBtn text-rose-400 bg-black px-2 py-1 rounded-lg text-xs sm:text-sm"
                                >
                                  <i className="fa-solid fa-file-circle-xmark"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      : ""}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Height Modal */}
      <div
        id="addHeightModal"
        className={`AddHeight__container w-full max-w-full sm:max-w-md md:max-w-lg bg-[#D7FF9C] fixed top-0 left-1/2 transform -translate-x-1/2 z-50 p-4 shadow-lg rounded-b-3xl transition-transform duration-500 ease-in-out ${
          isOpenHeightModal ? "translate-y-0" : "-translate-y-160"
        }`}
      >
        <div className="w-full flex items-center justify-between px-2 mb-4">
          <i className="fa-solid fa-arrow-down-big-small text-black text-xl sm:text-2xl"></i>
          <button
            onClick={closeHeightModal}
            id="closeHeightModalBtn"
            className="text-black text-xl font-bold hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleHeightSubmit}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-full">
            <label
              htmlFor="height"
              className="text-black font-semibold block mb-2 text-sm sm:text-base"
            >
              Height
            </label>
            <input
              ref={heightInputRef}
              id="heightInput"
              type="text"
              className="bg-[#1F1F1F] w-full text-white placeholder-gray-400 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#D7FF9C] text-sm sm:text-base"
              placeholder="4/6/8"
              required
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="Quantity"
              className="text-black font-semibold block mb-2 text-sm sm:text-base"
            >
              Quantity
            </label>
            <input
              id="quantityInput"
              ref={quantityInputRef}
              type="number"
              className="bg-[#1F1F1F] w-full text-white placeholder-gray-400 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#D7FF9C] text-sm sm:text-base"
              placeholder="10"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-white w-full sm:w-1/2 text-[#2F2F2F] rounded-md p-3 hover:bg-[#b5e87b] transition duration-300 font-extrabold text-sm sm:text-base mt-2"
          >
            Add
          </button>
        </form>
      </div>

      {/* Modals */}
      {isOpenDeleteSizeModal && (
        <DeleteModal
          setIsOpenDeleteModal={handleDeleteModal}
          selectedThing={selectedThing}
          size={null}
          setProducts={setProducts}
          title={"Size"}
          message={
            "Are you sure you want to delete this size? The heights associated with it will also be deleted."
          }
          setShowAlert={setShowAlert}
          alertMessage={setAlertMessage}
          setShowSuccessNotification={setShowSuccessNotification}
        />
      )}

      {isOpenDeleteHeightModal && (
        <DeleteModal
          setIsOpenDeleteModal={handleDeleteHeightModal}
          selectedThing={selectedHeight}
          size={selectedThing}
          setProducts={setProducts}
          title={"Height"}
          message={
            "Are you sure you want to delete this height? This cannot be undone."
          }
          setShowAlert={setShowAlert}
          alertMessage={setAlertMessage}
          setShowSuccessNotification={setShowSuccessNotification}
        />
      )}

      {isOpenEditHeightModal && (
        <EditHeightModal
          heightObject={selectedHeight}
          sizeObject={selectedThing}
          heightName={height}
          quantity={quantity}
          handleEditHeightModal={() => setIsOpenEditHeightModal(false)}
          setProducts={setProducts}
          modalState={isOpenEditHeightModal}
          setShowAlert={setShowAlert}
          alertMessage={setAlertMessage}
          setShowSuccessNotification={setShowSuccessNotification}
        />
      )}

      <Alert
        showAlert={showAlert}
        alertType={alertType}
        alertMessage={alertMessage}
        onClose={() => setShowAlert(false)}
      />

      <SuccessNotification
        showAlert={showSuccessNotification}
        alertType={alertType}
        alertMessage={alertMessage}
        onClose={() => setShowSuccessNotification(false)}
      />

      <LoadingNotification showLoading={isLoading} />
    </>
  );
};

export default AllProducts;