import React, { Fragment, useState } from "react";
import "./print.css";

const PrintBill = ({ data, setData, additionalInfo = null, setActiveTab,validationArray}) => {
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const { cartData } = data;
  const { name, number } = data;
  const { $id, $createdAt } = additionalInfo||1;
  /* Dummy data so we can loop */
  const invoices = [
    {
      id: "INV-1001",
      customer: "John Doe",
      amount: 1200,
      issued: "2024-08-01",
      due: "2024-08-15",
    },
    {
      id: "INV-1002",
      customer: "Jane Smith",
      amount: 850,
      issued: "2024-08-05",
      due: "2024-08-20",
    },
    {
      id: "INV-1003",
      customer: "Acme Corp",
      amount: 2500,
      issued: "2024-08-07",
      due: "2024-08-21",
    },
    {
      id: "INV-1004",
      customer: "Global Inc",
      amount: 4750,
      issued: "2024-08-10",
      due: "2024-08-25",
    },
  ];

  console.log("data->", cartData);
  console.log("customer name", name);
  console.log("customer number", number);
  // console.log("additional info -> ",additionalInfo);
  let total = 0;

  const handlePrint = () => {
    window.print();
  };

  const handleNewBill = () => {
    setActiveTab(0);

    setData({ name: "", number: null, cartData: [] });
  };

  console.log('validation array -> ',validationArray);
  

  return (
    <>
      {!isBillModalOpen && (
        <div className="w-full  h-fit flex justify-center mt-[30%] sm:mt-[10%]">
          <div className="flex flex-col items-center w-full sm:w-[50%] gap-4">

            <div className="history-entry w-[60%] flex justify-between  bg-[#171717] border-2 border-gray-600 p-2 rounded-lg    ">
              <p className="text-md font-medium ">
              <span className="text-gray-400">1.</span> Items In Stock
              </p>
             
              {
                validationArray.includes(1)?( <i class="ri-checkbox-circle-fill text-md text-lime-300 "></i>):( <i class="ri-close-circle-fill text-md text-rose-400"></i>)
              }
            </div>
            <div className="history-entry w-[60%] flex justify-between bg-[#171717] border-2 border-gray-600 p-2 rounded-lg   ">
              <p className="text-md font-medium ">
           <span className="text-gray-400">2.</span>  Bill Submitted
              </p>
             {
                validationArray.includes(2)?( <i class="ri-checkbox-circle-fill text-md text-lime-300 "></i>):( <i class="ri-close-circle-fill text-md text-rose-400"></i>)
              }
            </div>
            <div className="history-entry w-[60%] flex justify-between bg-[#171717] border-2 border-gray-600 p-2 rounded-lg   ">
              <p className="text-md font-medium ">
            <span className="text-gray-400">3.</span>  Cart Submitted
              </p>
             {
                validationArray.includes(3)?( <i class="ri-checkbox-circle-fill text-md text-lime-300 "></i>):( <i class="ri-close-circle-fill text-md text-rose-400"></i>)
              }
            </div>
            <div className="history-entry w-[60%]  flex justify-between bg-[#171717] border-2 border-gray-600 p-2 rounded-lg   ">
              <p className="text-md font-medium ">
            <span className="text-gray-400">4.</span>  Stock Reduced
              </p>
             {
                validationArray.includes(4)?( <i class="ri-checkbox-circle-fill text-md text-lime-300 "></i>):( <i class="ri-close-circle-fill text-md text-rose-400"></i>)
              }

            </div>

            {/* <div className="history-entry w-[80%] mt-[40%] bg-[#212121] border-2 border-red-500/30 p-4 rounded-lg border-2 border-gray-800  ">
                        <p className="text-lg font-medium text-center">Failed To Submite Bill In  <span className="text-red-500">Database</span>. Deleting Bill Is advised </p>
                       
                    </div> */}

            <div className="flex full gap-10 justify-center mt-10  ">
              <button
                onClick={handleNewBill}
                className="bg-white font-semibold text-black px-4 py-2 rounded-md shadow text-sm"
              >
                Create New Bill
              </button>

              <button
                onClick={() => setIsBillModalOpen(true)}
                className="bg-lime-300 font-semibold  text-black px-4 py-2 rounded-md shadow text-sm"
              >
                Preview Bill
              </button>
            </div>

           
          </div>
        </div>
      )}

      {/* ============== Bill Modal ============== */}
      {isBillModalOpen && (
        <div className="fixed inset-0 z-50 flex px-2 ">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsBillModalOpen(false)}
          />

          {/* Modal box */}
          <div className="relative m-auto w-full max-w-3xl min-h-[95vh] bg-white text-black rounded-lg shadow-xl flex flex-col ">
            {/* Header */}
            <header className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg tracking-wide font-bold">
                ShivHandiCraft
              </h2>
              <button
                className="no-print text-black hover:text-red-600"
                onClick={() => setIsBillModalOpen(false)}
              >
                ✕
              </button>
            </header>

            {/* Scrollable body */}
            <section className="flex-1 overflow-y-auto p-4">
              {/*<!--============== Bill Info Wrapper ==============-->*/}
              <div className="w-full h-fit flex flex-col justify-between text-xs  flex-nowrap gap-4 mb-4  ">
                <div className="flex w-full ">
                  <div className="flex flex-col gap-1 w-full">
                    <span>
                      <span className="font-bold">Bill ID :- </span>
                      {$id ? $id : "N/A"}{" "}
                    </span>
                    <span>
                      {" "}
                      <span className="font-bold">Website :-</span>{" "}
                      shivHandicraft.com
                    </span>
                  </div>
                  <div className="flex flex-col w-full">
                    <span>
                      {" "}
                      <span className="font-bold">Name :-</span>{" "}
                      {name ? name : "N/A"}
                    </span>
                    <span>
                      {" "}
                      <span className="font-bold">Number :-</span>{" "}
                      {number ? number : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex w-full ">
                  <div className="flex flex-col w-full">
                    <span>
                      <span className="font-bold">Date :-</span>{" "}
                      {$createdAt ? $createdAt.split("T")[0] : "N/A"}{" "}
                    </span>
                    <span>
                      <span className="font-bold">Time :-</span>{" "}
                      {$createdAt ? $createdAt.split("T")[1] : "N/A"}
                    </span>
                  </div>
                  {/* <div className="flex flex-col w-full">
                  <span>Name :- julelal</span>
                  <span>Number :- 6354747777 </span>
                </div> */}
                </div>
              </div>
              {/* Table wrapper */}
              <div className="table-wrapper">
                <table className="w-full text-xs text-left">
                  <thead className="border-2">
                    <tr>
                      <th className="p-1 sm:p-3 border-2">Size</th>
                      <th className="p-1 sm:p-3 border-2">Height</th>
                      <th className="p-1 sm:p-3 border-2">Qty</th>
                      <th className="p-1 sm:p-3 border-2">Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartData.map((sizeItem) => (
                      <Fragment key={sizeItem.$id}>
                        {sizeItem.heights.map((heightItem, heightIndex) => {
                          total += heightItem.price * heightItem.cartQuantity;

                          return (
                            <tr
                              key={heightItem.$id}
                              className=" last:border-0 hover:bg-slate-50"
                            >
                              {heightIndex === 0 && (
                                <td
                                  rowSpan={sizeItem.heights.length}
                                  className="p-1 border-2 sm:p-3 font-semibold"
                                >
                                  {sizeItem.size}
                                </td>
                              )}
                              <td className="p-1 border-2 sm:p-3">
                                {heightItem.height}
                              </td>
                              <td className="p-1 border-2  sm:p-3">
                                {heightItem.cartQuantity}
                              </td>
                              <td className="p-1 border-2  sm:p-3">
                                {heightItem.price * heightItem.cartQuantity}
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    ))}
                  </tbody>
                </table>

                <p className="w-full flex justify-end px-4">
                  {" "}
                  <span className="font-bold">Total :- </span> {total}
                </p>
              </div>
            </section>
            <button
              onClick={handlePrint}
              className="no-print mb-4 w-1/2  border-2 mx-auto font-bold  "
            >
              Print Bill
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PrintBill;
