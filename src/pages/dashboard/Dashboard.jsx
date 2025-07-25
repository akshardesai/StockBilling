import Cart from "../../components/dashboard/Cart";
import CustomerDetail from "../../components/dashboard/CustomerDetail";
import { useState } from "react";
// import PreviewBillModal from "../../components/dashboard/PreviewBillModal";
import { createBill } from "../../utils/InvoicingTables";
import PrintBill from "../../components/dashboard/PrintBill";

import LoadingNotification from "../../components/LoadingNotification";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [billDocument,setBillDocument]=useState(null)
  
  const [isLoading,setIsLoading]=useState(false)
 

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
    // billId:null,
    // date:null,
    // time:null,

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
   setIsLoading(true)

   

    createBillDB(data);
  }

  async function createBillDB(data) {
   
    const response = await createBill(data);
    if (response.success) {
      console.log("bill created show print");

      setBillDocument(response.data)
      
      //show print modal with id,time date every important small detail
      setIsLoading(false)
      setActiveTab(2);
    } else {
      console.log("Failed to create bill", response.error);
      setIsLoading(false)
      setActiveTab(2)
    }
  }

  const ActiveComponent = tabs[activeTab].Component;

  return (
    <>
      <div className="min-h-screen w-full flex flex-col ">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-4 lg:mb-7 mt-7">
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
        </div>
        {/* Header Section End */}
        <ActiveComponent data={data} setData={setData} additionalInfo={billDocument } setActiveTab = {setActiveTab} />

        <div className="btn-container w-full flex justify-center mt-4 ">
          {activeTab < 1 && data.cartData.length > 0 &&(
            <button
              disabled={data.cartData.length === 0}
              onClick={handleNextBtn}
              className="p-4 text-black bg-white  cursor-pointer"
            >
              Next
            </button>
          )}
          {activeTab > 0 && activeTab<=1 && (
            <button
              onClick={handlePreviousBtn}
              className="p-4 text-black bg-white cursor-pointer"
            >
              Previous
            </button>
          )}
          {activeTab === 1 && data.name.length>0 && (
            <button
              onClick={handleSubmitBtn}
              className="p-4 text-black bg-white cursor-pointer"
            >
              Submit
            </button>
          )}
        </div>


      </div>


 <LoadingNotification
      showLoading={isLoading}
      />
   

  
    </>
  );
};

export default Dashboard;
