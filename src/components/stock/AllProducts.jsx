import React, { useState, useRef } from "react";
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

  const [id, setId] = useState(null);
  const [heightId, setHeightId] = useState(null);
  const [height, setHeight] = useState(null);
  const [quantity, setQuantity] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const heightInputRef = useRef();
  const quantityInputRef = useRef();

  function handleEditHeightModal(id, sizeId, height, quantity) {
    //modal open already
    if (isOpenEditHeightModal) {
      console.log("modal closed reseting state");

      setIsOpenEditHeightModal(false);
    }
    //modal is close
    else {
      console.log("opening modal", id, sizeId, height, quantity);

      setHeightId(id);
      setId(sizeId);
      setHeight(height);
      setQuantity(quantity);
      setIsOpenEditHeightModal(true);
    }
  }

  function handleDeleteModal(id) {
    if (isOpenDeleteSizeModal) {
      setIsOpenDeleteSizeModal(false);
      document.body.style.overflow = "auto";
      if (id) {
        setId(null);
      }
    } else {
      setId(id);
      setIsOpenDeleteSizeModal(true);
      document.body.style.overflow = "hidden";
    }
  }

  function handleDeleteHeightModal(id, sizeId) {
    if (isOpenDeleteHeightModal) {
      setIsOpenHeightDeleteModal(false);
      document.body.style.overflow = "auto";
      if (heightId) {
        setHeightId(null);
        setId(null);
      }
    } else {
      setHeightId(id);
      setId(sizeId);
      setIsOpenHeightDeleteModal(true);
      document.body.style.overflow = "hidden";
    }
  }

  function openHeightModal(sizeId) {
    setIsOpenHeightModal(true);

    setId(sizeId);
    //("size id->", sizeId);
  }

  function closeHeightModal() {
    setIsOpenHeightModal(false);
    setId(null);
  }

  function handleHeightSubmit() {
    event.preventDefault();
    const height = heightInputRef.current.value.trim();
    const quantity = quantityInputRef.current.value.trim();

    if (!height) return;
    if (!quantity) return;

    insertHeight(id, height, quantity);
  }

  function deductQuantity(id, quantity, sizeId) {
    deductQuantityDB(id, quantity, sizeId);
  }

  function addQuantity(id, quantity, sizeId) {
    addQuantityDB(id, quantity, sizeId);
  }

  async function deductQuantityDB(hid, quantity, size_id) {
    setIsLoading(true);
    const response = await lessQuantityBy1(hid, quantity);

    if (response.success) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          if (product.$id === size_id) {
            return {
              ...product,
              heights: product.heights
                ? product.heights.map((h) =>
                    h.$id === hid
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

  async function addQuantityDB(hid, quantity, size_id) {
    setIsLoading(true);
    const response = await addQuantityBy1(hid, quantity);

    if (response.success) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          if (product.$id === size_id) {
            return {
              ...product,
              heights: product.heights
                ? product.heights.map((h) =>
                    h.$id === hid
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

  async function insertHeight(id, height, quantity) {
    try {
      setIsLoading(true);
      const response = await addHeight(id, height, quantity);

      if (response.success) {
        const newHeight = {
          $id: response.data.$id,
          height: height,
          quantity: parseInt(quantity),
          sizes: id,
          size_id: id,
        };

        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            // Find the product that matches the ID
            if (product.$id === id) {
              return {
                ...product,
                // Add the new height to the existing heights array
                heights: product.heights
                  ? [...product.heights, newHeight]
                  : [newHeight],
              };
            }
            // Return unchanged product if it doesn't match
            return product;
          })
        );

        // Clear the input fields after successful addition
        heightInputRef.current.value = "";
        quantityInputRef.current.value = "";

        // Close the modal after successful addition
        closeHeightModal();
        setIsLoading(false);
        setShowSuccessNotification(true);
        setAlertMessage("Height Added");
        // ("Height added successfully and DOM updated");
      } else {
        setIsLoading(false);
        setShowAlert(true);
        setAlertMessage(response.error);
      }
    } catch (error) {
      // ("catched an error in allproducts.jsx ->", error);
      setIsLoading(false);
      setShowAlert(true);
      setAlertMessage(error);
    }
  }

  // ("inside products page", products);

  if (products.length === 0) {
    return <p className="text-center mt-4">No products yet.</p>;
  }

  return (
    <>
      <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-[1240px] mx-auto px-2 sm:px-4">
        {products.map((product, index) => (
          <div
            key={index}
            id={product.$id}
            className="home__table-container mb-8 md:mb-14 flex flex-col items-center"
          >
            <div className="home__size-container w-full h-12 sm:h-16 flex items-center justify-center px-2 sm:px-7">
              <div className="home__size w-full h-full pt-2 sm:pt-4 bg-[#171717] text-black rounded-t-xl flex items-center justify-center gap-2 border-l-2 border-r-2 border-t-2 border-[#DD9F67]">
                <button
                  disabled={isLoading}
                  onClick={() => openHeightModal(product.$id)}
                  className="addHeightBtn px-2 py-1 rounded-full bg-black text-white text-xs sm:text-sm"
                >
                  <i className="fa-duotone fa-solid fa-box-open-full"></i>
                </button>
                <p className="font-bold text-white text-sm sm:text-base truncate max-w-[200px]">
                  {product.size}
                </p>
                <button
                  disabled={isLoading}
                  onClick={() => handleDeleteModal(product.$id)}
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
                                onClick={() =>
                                  deductQuantity(
                                    height.$id,
                                    height.quantity,
                                    product.$id
                                  )
                                }
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
                                <span
                                  onClick={() =>
                                    handleEditHeightModal(
                                      height.$id,
                                      product.$id,
                                      height.height,
                                      height.quantity
                                    )
                                  }
                                  className="bg-gray-700 w-10 sm:w-14 border border-gray-600 text-white text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block text-center py-1 cursor-pointer"
                                >
                                  {height.quantity || "N/A"}
                                </span>
                              </div>
                              <button
                                disabled={isLoading}
                                onClick={() =>
                                  addQuantity(
                                    height.$id,
                                    height.quantity,
                                    product.$id
                                  )
                                }
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
                                onClick={() =>
                                  handleEditHeightModal(
                                    height.$id,
                                    product.$id,
                                    height.height,
                                    height.quantity
                                  )
                                }
                                className="editHeightBtn text-white bg-black px-2 py-1 rounded-lg text-xs sm:text-sm"
                              >
                                <i className="fa-solid fa-file-pen"></i>
                              </button>
                              <button
                                disabled={isLoading}
                                onClick={() =>
                                  handleDeleteHeightModal(
                                    height.$id,
                                    product.$id
                                  )
                                }
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
        ))}
      </div>

      <div
        id="addHeightModal"
        className={`AddHeight__container w-full max-w-full sm:max-w-md md:max-w-lg  bg-[#D7FF9C] fixed top-0 left-1/2 transform -translate-x-1/2  z-50 p-4 shadow-lg rounded-b-3xl  transition-transform duration-500 ease-in-out ${
          isOpenHeightModal ? "translate-y-0" : "-translate-y-160"
        }`}
      >
        {/* Close button (cross) */}
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

        {/* Form */}
        <form
          onSubmit={handleHeightSubmit}
          className="flex flex-col items-center gap-4"
        >
          {/* Height Input */}
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

          {/* Quantity Input */}
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

          {/* Add height Button */}
          <button
            type="submit"
            className="bg-white w-full sm:w-1/2 text-[#2F2F2F] rounded-md p-3 hover:bg-[#b5e87b] transition duration-300 font-extrabold text-sm sm:text-base mt-2"
          >
            Add
          </button>
        </form>
      </div>

      {isOpenDeleteSizeModal && (
        <DeleteModal
          setIsOpenDeleteModal={handleDeleteModal}
          id={id}
          size_id={null}
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
          id={heightId}
          size_id={id}
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
          id={heightId}
          sizeId={id}
          height={height}
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
