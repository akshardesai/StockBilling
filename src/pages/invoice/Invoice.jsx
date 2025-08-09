import Cart from "../../components/invoice/Cart";
import CustomerDetail from "../../components/invoice/CustomerDetail";
import { useState } from "react";
// import PreviewBillModal from "../../components/dashboard/PreviewBillModal";
import { createBill, recordBillHistory } from "../../utils/InvoicingTables";
import PrintBill from "../../components/invoice/PrintBill";

// import LoadingNotification from "../../components/LoadingNotification";
import Alert from "../../components/Alert";

const Invoice = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [billDocument, setBillDocument] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [validationArray, setValidationArray] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const tabs = [
    {
      name: "cart",
      Component: Cart,
    },
    { name: "CustomerDetail", Component: CustomerDetail },
    { name: "print", Component: PrintBill },
  ];

  const [data, setData] = useState({
    name: "",
    number: null,
    total:0,
    payment_status:0,
    cartData: [],
  });

  function handleNextBtn() {
    setActiveTab(activeTab + 1);
  }

  function handlePreviousBtn() {
    setActiveTab(activeTab - 1);
  }

  function handleSubmitBtn() {
    //db success remove submit option
    //db success then open // allow  print option / modal
    setActiveTab(2);
    setIsLoading(true);

    createBillDB(data);
  }

  const calculatedTotal = (cart) => {

     if (!Array.isArray(cart)) return 0;

   return  cart.reduce((total, item) => {
     
      
      const sizeTotal =  item.heights.reduce((sum,h)=>{return sum+(h.price*h.cartQuantity)},0)

      return total+sizeTotal
    },0);
  };

  async function createBillDB(data) {
    console.log("find total from here ->", data);

    const total = calculatedTotal(data.cartData);

  

    const response = await createBill(data, total);
    if (response.success) {
      console.log("bill created show print", response.data);

      setBillDocument(response.data);

      //show print modal with id,time date every important small detail
      setIsLoading(false);
      setValidationArray(response.validation);

      if (response.validation.length >= 2) {
        const createHistory = await recordBillHistory(
          response.data,
          response.cartData
        );
      }
    } else {
      console.log("Failed to create bill", response.error);
      setIsLoading(false);
      setValidationArray(response.validation);
      setShowAlert(true);
      setAlertMessage(response.error);
    }
  }

  const ActiveComponent = tabs[activeTab].Component;

  return (
    <>
      <div className="min-h-screen w-full  md:mx-auto flex flex-col ">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-4 lg:mb-7 mt-7 sm:w-[70%] mx-auto">
          <div className="inline-flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono tracking-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Inv
              </span>
              <span className="bg-gradient-to-r from-[#BEF264] to-[#84CC16] bg-clip-text text-transparent">
                oic
              </span>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ing.
              </span>
            </h1>
          </div>

          <div className="tabUI-container w-full  h-2 flex px-4  gap-4">
            <div
              className={`tab-1 ${
                activeTab === 0 ? "bg-lime-300" : "bg-[#171717]"
              } w-full h-full rounded-lg  transition-colors duration-700`}
            ></div>
            <div
              className={`tab-2   ${
                activeTab === 1 ? "bg-lime-300" : "bg-[#171717]"
              } w-full h-full rounded-lg transition-colors duration-700`}
            ></div>
            <div
              className={`tab-3   ${
                activeTab === 2 ? "bg-lime-300" : "bg-[#171717]"
              } w-full h-full rounded-lg transition-colors duration-700`}
            ></div>
          </div>
        </div>
        {/* Header Section End */}

        {isLoading ? (
          <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center ">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#BEF264] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#BEF264] rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-[#BEF264] rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        ) : (
          <>
            <ActiveComponent
              data={data}
              setData={setData}
              additionalInfo={billDocument}
              setActiveTab={setActiveTab}
              validationArray={validationArray}
            />

            <div className="btn-container w-full flex justify-around mt-7 sm:w-[30%] sm:mx-auto ">
              {activeTab < 1 && data.cartData.length > 0 && (
                <button
                  disabled={data.cartData.length === 0}
                  onClick={handleNextBtn}
                  className="px-4 py-2 text-black bg-white  cursor-pointer font-semibold rounded-md"
                >
                  Next
                </button>
              )}
              {activeTab > 0 && activeTab <= 1 && (
                <button
                  onClick={handlePreviousBtn}
                  className="p-2 text-black bg-white font-semibold  cursor-pointer rounded-md"
                >
                  Previous
                </button>
              )}
              {activeTab === 1 && data.name.length>0 && data.payment_status!=0   && (
                <button
                  onClick={handleSubmitBtn}
                  className="px-4 p-2 text-black bg-white cursor-pointer font-semibold rounded-md"
                >
                  Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <Alert
        showAlert={showAlert}
        alertType={alertType}
        alertMessage={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
};

export default Invoice;
