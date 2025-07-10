import Cart from "../../components/dashboard/Cart";
import CustomerDetail from "../../components/dashboard/CustomerDetail"
import { useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
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

  const ActiveComponent = tabs[activeTab].Component;

  return (
    <>
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
    </>
  );
};

export default Dashboard;
