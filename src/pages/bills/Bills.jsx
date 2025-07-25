import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import {
  deleteBillDocument,
  fetchDateBills,
  getAllBills,
} from "../../utils/InvoicingTables";
import "../../components/dashboard/print.css";
import Calendar from "../../components/bills/Calendar";

import SuccessNotification from "../../components/SuccessNotification";
import LoadingNotification from "../../components/LoadingNotification";
import Alert from "../../components/Alert";


const Bill = () => {
  const currentDate = new Date();
  const [isDateModal, setIsDateModal] = useState(false);
  const [exploreBillModal, setExploreBillModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [detailedBill, setDetailedBill] = useState(null);
  const [bills, setBills] = useState(null);

  //success notification states or alert notification 
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("error");
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);


    //show processing / loading notification state
    const [isLoading, setIsLoading] = useState(false);

  const tableData = [
    {
      name: "John Michael",
      role: "Manager",
      email: "john.michael@example.com",
      location: "New York, USA",
    },
    {
      name: "Alexa Liras",
      role: "Developer",
      email: "alexa.liras@example.com",
      location: "San Francisco, USA",
    },
    {
      name: "Laurent Perrier",
      role: "Executive",
      email: "laurent.perrier@example.com",
      location: "Paris, France",
    },
    {
      name: "Michael Levi",
      role: "Developer",
      email: "michael.levi@example.com",
      location: "London, UK",
    },
  ];

  async function fetchAllBillsDB(month, year) {
    const response = await getAllBills(month, year);

    if (response.success) {
      // console.log(response.data);
      setBills(response.data);
    } else {
      console.log(response.error);
    }
  }

  const handleExploreButton = (bill) => {
    setExploreBillModal(true);
    setDetailedBill(bill);
  };

  async function deleteBill(bill) {
    console.log(bill);
    setIsLoading(true)
    const response = await deleteBillDocument(bill.$id);

    if (response.success) {
      console.log("deleted");
      setDeleteModal(false)
      setBills((prevData) => prevData.filter((otherBill) => otherBill.$id !== bill.$id));
      setShowSuccessNotification(true);
      setAlertMessage("Bill Deleted");
      setIsLoading(false)
    } else {
      setDeleteModal(false)
      console.log("failed to delete", response.error);
      setIsLoading(false)
      setShowAlert(true);
      setAlertType("error");
      setAlertMessage(response.error)
    }
  }

  async function fetchBillsForDate(date) {
    if (!date) return;
    try {
      const response = await fetchDateBills(date);

      if (response.success) {
        console.log("successfuyll fetched bills", response.data);
        setBills(response.data);
      } else {
        console.log("failed to fetch date bills", response.error);
      }
    } catch (error) {
      console.log(`catched error billsjsx ${error}`);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  // const handleDeleteBtnClick= ()=>{

  //   setDetailedBill()

  // }

  useEffect(() => {
    fetchAllBillsDB(currentMonth, currentYear);
  }, []);
  useEffect(() => {
    fetchAllBillsDB(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (selectedDate) {
      fetchBillsForDate(selectedDate);
    } else {
      fetchAllBillsDB(currentMonth, currentYear);
    }
  }, [selectedDate]);

  let total = 0;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <div>
        <section className="home">
          <div className="home__container w-full min-h-screen px-2 sm:px-4">
            <div className="home__heading pt-7 w-full flex flex-col justify-center items-center">
              <h1 className="text-center text-2xl sm:text-4xl font-bold font-protestFont font-strike">
                B<span className="text-[#D7FF9C]">i</span>lls.
              </h1>
              <div className="flex gap-10">
                <button
                  onClick={() => setIsDateModal(true)}
                  className="bg-white text-black px-3 py-2 sm:px-4 sm:py-2 rounded-lg mt-7  font-semibold tracking-wide text-sm sm:text-base"
                >
                  Select Date
                </button>
              </div>
            </div>

            <div className="px-2 sm:px-6  mt-16">
              <div className="bg-[#171717]  px-3 sm:p-6 ">
                {/* <div className="flex  justify-between items-center  mb-4 ">
                  <h2 className="text-lg sm:text-xl font-semibold text-neutral-200 ">
                    Month - {monthNames[currentMonth]}
                  </h2>
                  <p>
                    Date -{" "}
                    {selectedDate != null
                      ? selectedDate.toLocaleDateString()
                      : "N/A"}
                  </p>
                </div> */}

                <div className="overflow-x-auto -mx-3 sm:mx-0   ">
                  <table className="w-full  ">
                    <thead className="">
                      <tr className=" ">
                        <th className="text-left py-2 sm:py-3 px-3 sm:px-4 border-2 border-white text-lime-300 font-bold  text-[12px] sm:text-sm  ">
                          Sr
                        </th>
                        <th className="text-left py-2 sm:py-3 px-3 sm:px-4 border-2 border-white text-lime-300 font-bold  text-[12px] sm:text-sm">
                          Customer Info
                        </th>
                        <th className="text-left py-2 sm:py-3 px-3 sm:px-4 border-2 border-white text-lime-300 font-bold  text-[12px] sm:text-sm hidden sm:table-cell">
                          Date
                        </th>
                        <th className="text-left py-2 sm:py-3 px-3 sm:px-4 border-2 border-white text-lime-300 font-bold  text-[12px] sm:text-sm ">
                          Phone Number
                        </th>

                        <th className="text-left py-2 sm:py-3 px-3 sm:px-4 border-2 border-white text-lime-300 font-bold  text-[12px] sm:text-sm">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills && bills.length > 0 ? (
                        bills.map((entry, index) => (
                          <tr
                            key={entry.$id}
                            className="border-b border-neutral-500/30"
                          >
                            <td className="py-3 sm:py-4 px-3 sm:px-4 text-neutral-300 text-sm sm:text-base text-wrap border-r border-neutral-500/30">
                              <span>{index + 1}</span>
                            </td>
                            <td className="py-3 sm:py-4 px-3 sm:px-4 text-white capitalize text-sm sm:text-base text-wrap border-r border-neutral-500/30">
                              <div className="min-w-0">
                                <span className="font-medium block">
                                  {entry.name}
                                </span>

                                {/* Show email on mobile when date column is hidden */}
                                <span className="text-xs text-neutral-400 block  mt-1 break-all">
                                  {entry.$createdAt || "N/A"}
                                </span>
                                {/* Show email on mobile when date column is hidden */}
                                <span className="text-xs text-neutral-400 block  mt-1 break-all">
                                  {entry.$createdAt || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 sm:py-4 px-3 sm:px-4 text-white  text-sm sm:text-base text-wrap border-r border-neutral-500/30">
                              <span className="inline-flex items-center  px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                                {entry.$createdAt.split("T")[0]}
                              </span>
                            </td>
                            <td className="py-3 sm:py-4 px-3 sm:px-4 text-neutral-300 text-sm sm:text-base text-wrap border-r border-neutral-500/30 hidden sm:table-cell">
                              <span className="break-all">
                                {entry.$createdAt}
                              </span>
                            </td>
                            {/* <td className="py-3 sm:py-4 px-3 sm:px-4 text-neutral-300 text-sm sm:text-base text-wrap border-r border-neutral-500/30 hidden md:table-cell">
                              <div className="flex items-center min-w-0">
                                <svg
                                  className="w-3 h-3 text-neutral-500 mr-1.5 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="truncate">{entry.name}</span>
                              </div>
                            </td> */}
                            <td className="py-3 sm:py-4 px-3 sm:px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleExploreButton(entry)}
                                  className="px-2 py-1 bg-white text-black rounded-lg text-sm font-mono font-bold hover:bg-neutral-100 transition-colors"
                                >
                                  <i class="ri-eye-2-line"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteModal(true);
                                    setDetailedBill(entry);
                                  }}
                                  className="px-2 py-1 bg-red-400 text-black rounded-lg text-sm font-mono font-bold hover:bg-neutral-100 transition-colors"
                                >
                                  <i class="ri-delete-bin-fill"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-4 px-4 text-center text-neutral-400 text-sm"
                          >
                            No bill data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {exploreBillModal && (
        <div className="fixed inset-0 z-50 flex px-2 ">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setExploreBillModal(false)}
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
                onClick={() => setExploreBillModal(false)}
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
                      {detailedBill.$id || "N/A"}
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
                      {detailedBill.name || "N/A"}
                    </span>
                    <span>
                      {" "}
                      <span className="font-bold">Number :-</span>{" "}
                      {detailedBill.number || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex w-full ">
                  <div className="flex flex-col w-full">
                    <span>
                      <span className="font-bold">Date :-</span>{" "}
                      {detailedBill.$createdAt.split("T")[0] || "N/A"}{" "}
                    </span>
                    <span>
                      <span className="font-bold">Time :-</span>{" "}
                      {detailedBill.$createdAt.split("T")[1] || "N/A"}
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
                    {detailedBill.cart.map((entry, index) => {
                      total += entry.price * entry.qty;

                      return (
                        <Fragment key={entry.$id}>
                          <tr
                            key={entry.$id}
                            className=" last:border-0 hover:bg-slate-50"
                          >
                            <td className="p-1 border-2 sm:p-3 font-semibold">
                              {entry.size_name}
                            </td>

                            <td className="p-1 border-2 sm:p-3">
                              {entry.height_name}
                            </td>
                            <td className="p-1 border-2  sm:p-3">
                              {entry.qty}
                            </td>
                            <td className="p-1 border-2  sm:p-3">
                              {entry.price * entry.qty}
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
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

      {isDateModal && (
        <div className="fixed inset-0 z-50 flex px-2">
          <div
            onClick={() => setIsDateModal(false)}
            className="absolute inset-0 bg-black/30"
          ></div>

          <div className="relative m-auto w-full max-w-3xl   text-black rounded-lg shadow-xl flex flex-col">
            <section className="flex-1 overflow-auto p-2 ">
              <div className="w-full h-fit bg-black rounded-3xl relative mb-4">
                <Calendar
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  currentYear={currentYear}
                  setCurrentYear={setCurrentYear}
                ></Calendar>

                <button
                  className="text-black font-bold hover:text-white absolute -bottom-4 left-1/2 transform -translate-x-1/2  bg-red-400 px-3 py-2 rounded-full "
                  onClick={() => setIsDateModal(false)}
                >
                  ✕
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      {deleteModal && (
        <>
          <div
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out `}
          />

          <div
            id="deleteModal"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2    w-[90%] max-w-md mx-auto p-6 z-50
        bg-gray-900 backdrop-blur-xl
        border-2 border-red-400/30 rounded-2xl shadow-2xl
        transition-all duration-300 ease-out

        "
          >
            {/* <!-- Modal content --> */}
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold text-white"> Delete Bill ?</h2>
              <p className="text-white mt-2 text-center font-light">
                Are you sure you want to delete this bill this cannot be undone
              </p>
              {/* <!-- Buttons --> */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => deleteBill(detailedBill) }
                  id="confirmDelete"
                  className="bg-red-500 text-white hover:bg-red-400 active:bg-red-600  px-4 py-2 rounded-md transition duration-300"
                >
                  Yes
                </button>
                <button
                  onClick={() => setDeleteModal(false)}
                  id="cancelDelete"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </>
      )}

          <SuccessNotification
        showAlert={showSuccessNotification}
        alertType={alertType}
        alertMessage={alertMessage}
        onClose={() => setShowSuccessNotification(false)}
      />

            <Alert
        showAlert={showAlert}
        alertType={alertType}
        alertMessage={alertMessage}
        onClose={() => setShowAlert(false)}
      />


        <LoadingNotification showLoading={isLoading} />

    </>
  );
};

export default Bill;
