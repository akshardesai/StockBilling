import React, { useEffect, useRef, useState } from "react";
import AllProducts from "../../components/stock/AllProducts";
import { addProduct, readAllProduct } from "../../utils/StockTables";
import Alert from "../../components/Alert";

import SuccessNotification from "../../components/SuccessNotification";

const Stock = () => {
  const [isOpen, setProductModal] = useState(false);

  const [products, setProducts] = useState([]);

  const sizeInputRef = useRef();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  function openProductModal() {
    setProductModal(true);
  }

  function closeProductModal() {
    setProductModal(false);
  }

  // add size form submit
  const handleAddSize = (e) => {
    e.preventDefault();
    const newSize = sizeInputRef.current.value.trim();
    // (newSize);

    if (!newSize) return;

    //add product in DOM

    //add product in appwrite
    addProductInDB(newSize);

    sizeInputRef.current.value = "";
  };

  //supabase add product function import
  async function addProductInDB(newsize) {
    const response = await addProduct(newsize);

    if (response.success) {
      setProducts((prev) => [...prev, response.data]);

      closeProductModal();

      setShowSuccessNotification(true);
      setAlertType("success");
      setAlertMessage("Size Added");
    } else {
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage(response.error);
    }
  }

  //fetch all products from appwrite
  async function readAllProductsDB() {
    const response = await readAllProduct();
    if (response.success) {
      // c("got the data stock page");
      // c(data.documents);

      //   const sizes = data.map((row) => c(row));

      setProducts(response.data.documents);
    } else {
      setShowAlert(true)
      setAlertType("error")
      setAlertMessage(response.error)
    }
  }

  useEffect(() => {
    readAllProductsDB();
    // c(
    //   products.map((entry) => {
    //     entry.Height;
    //   })
    // );
  }, []);

  // c(products);

  return (
    <>
      <section className="home w-full ">
        <div className="home__container w-full min-h-screen z-50 bg-[#0B0B0B]">
          {/*<!--============== Add Product Modal ==============-->*/}

          <div className="AddProduct md:w-full md:flex md:justify-center">
            <div
              id="addProductModal"
              className={`AddProduct__container w-full md:max-w-[25vw] bg-[#D7FF9C] fixed top-0 z-50 p-4 shadow-lg rounded-b-3xl transform  transition-transform duration-500 ease-in-out ${
                isOpen ? "translate-y-0" : "-translate-y-160"
              }`}
            >
              {/* <!-- Close button  --> */}
              <div className="w-full flex items-center justify-between px-2">
                <i className="fa-regular fa-parachute-box text-black text-2xl"></i>
                <button
                  onClick={closeProductModal}
                  id="closeModalBtn"
                  className="closeModalBtn text-black text-2xl "
                >
                  <i class="ri-close-line"></i>
                </button>
              </div>

              {/* <!-- Form --> */}
              <form
                onSubmit={handleAddSize}
                id="addSize"
                className="flex flex-col items-center mt-6 space-y-4"
              >
                {/* <!-- Input Field --> */}
                <input
                  ref={sizeInputRef}
                  type="text"
                  className="bg-[#1F1F1F] w-full text-white placeholder-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D7FF9C]"
                  placeholder="Enter product size"
                />

                {/* <!-- Add Product Button --> */}
                <div className="button-container flex w-full gap-10 justify-center">
                  <button
                    type="submit"
                    className="bg-white w-[25%] text-[#2F2F2F] rounded-md p-2 hover:bg-black hover:text-white border-2 border-black transition duration-300 font-extrabold"
                  >
                    Add
                  </button>

                  <button
                    onClick={closeProductModal}
                    className="bg-white w-[25%] text-[#2F2F2F] rounded-md p-2 hover:bg-black hover:text-white border-2 border-black transition duration-300 font-extrabold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* <!--============== Stock Heading   ===============--> */}
          <div className="home__heading pt-7 w-full flex flex-col justify-center items-center">
            <h1 className="text-center text-4xl font-bold font-mono font-strike underline px-2 py-1 rounded-lg">
              Manage S<span className="text-[#BEF264]">toc</span>k.
            </h1>

            <div className="home__buttons">
              {/*<!--stock__heading============== Add Product Button ==============-->*/}
              <button
                onClick={openProductModal}
                id="addProductBtn"
                className="text-center mt-7 p-3 rounded-md font-mono bg-white text-black"
              >
                <i class="ri-function-add-fill me-2"></i>
                Create Size
              </button>
            </div>
          </div>

          {/*<!--==============  Products Listed Inside This Container ==============-->*/}
          <div className="home__table-box  px-3   sm:px-24 sm:gap-x-10   ">
            <AllProducts
              products={products}
              setProducts={setProducts}
            ></AllProducts>
          </div>
        </div>
      </section>

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
    </>
  );
};

export default Stock;
