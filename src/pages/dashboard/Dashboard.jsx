import Cart from "../../components/dashboard/Cart";
import CustomerDetail from "../../components/dashboard/CustomerDetail"
import { useState } from "react";
import PreviewBillModal from "../../components/dashboard/PreviewBillModal";
import { createBill } from "../../utils/InvoicingTables";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPreviewModalOpen,setIsPreviewModalOpen]=useState(false)

  const tabs = [
    {
      name: "cart",
      Component: Cart,
    },
    { name: "CustomerDetail", Component: CustomerDetail },
  ];

  const [data,setData]=useState({
    name:'dummy name',
    number:0,
    cartData:[]


  })

  function handleNextBtn(){
        setActiveTab(activeTab+1)
  }

  function handlePreviousBtn(){
    setActiveTab(activeTab-1)
  }

  function handleSubmitBtn(){
    //send to db 
    //add confirm option before submit
    //db success remove submit option
    //db success then open // allow  print option / modal

    createBillDB(data)
    console.log('bill created ',data);
    
  }

  async function createBillDB(data){
    const response = await createBill(data)
    console.log('response->',response);
    
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
      <ActiveComponent data={data} setData={setData}/>

      <div className="btn-container w-full flex justify-center mt-4 ">
        {activeTab<1&& <button onClick={handleNextBtn} className="p-4 text-black bg-white  cursor-pointer">Next</button>}
        {activeTab>0&&<button onClick={handlePreviousBtn} className="p-4 text-black bg-white cursor-pointer">Previous</button>}
        {activeTab===1&&<button onClick={handleSubmitBtn} className="p-4 text-black bg-white cursor-pointer">Submit</button>}

      </div>
          </div>


    {isPreviewModalOpen &&

      <PreviewBillModal data={data} setData={setData} handleModal={()=>setIsPreviewModalOpen(!isPreviewModalOpen)}/>
    }
    </>
  );
};

export default Dashboard;
