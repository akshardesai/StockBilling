import "../../index.css";
import React, { useState } from "react";
// import AllLogs from "../../components/logs/AllLogs";
import Calendar from "../../components/bills/Calendar";
import { useEffect } from "react";
import { fetchHisotryBillsPage, fetchHistory, fetchMonthHistory, formatTime } from "../../utils/historyTable";
import LoadingNotification from "../../components/LoadingNotification";
import SuccessNotification from "../../components/SuccessNotification";
import Alert from "../../components/Alert";

const Logs = () => {
  const currentDate = new Date();
  const defaultSelectedDate = currentDate.toISOString().split("T")[0]
  
  
  const [isDateModal, setIsDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [activeFilter,setActiveFilter]=useState(0)

  //success notification states or alert notification 
      const [showAlert, setShowAlert] = useState(false);
      const [alertMessage, setAlertMessage] = useState("");
      const [alertType, setAlertType] = useState("error");
      const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  
  
      //show processing / loading notification state
      const [isLoading, setIsLoading] = useState(false);


  //created at date format - 2025-07-25T12:41:59.645+00:00
  //0 - all bills page
  //1 - stock page
  //2 - invoicing page

  console.log('logs.jsx selected date state ->',selectedDate);
  
  

  const [history, setHistory] = useState([]);

  async function fetchFilteredHistory(page,date){
     setIsLoading(true)
    const response = await fetchHistory(page,date);
    
    if (response.success) {
      // console.log(response.data);
     
      setHistory(response.data);
      setIsLoading(false)
    }else{
      setShowAlert(true)
      setAlertType("error")
      setAlertMessage(response.error)
      setIsLoading(false)
    }
  }

  async function fetchCurrentMonthHistory(month,year,type){
    setIsLoading(true)
    const response = await fetchMonthHistory(month,year,type)
    

    if (response.success) {
        setHistory(response.data)
        setIsLoading(false)
    }else{
      setShowAlert(true)
      setAlertType("error")
      setAlertMessage(response.error)
      setIsLoading(false)
    }
  }


  useEffect(()=>{

    fetchFilteredHistory(activeFilter,selectedDate)

  },[activeFilter,selectedDate])

  useEffect(()=>{
    if (selectedDate === null) {
      
      fetchCurrentMonthHistory(currentMonth,currentYear,activeFilter)
    }
  },[currentMonth,selectedDate,currentYear])

  // console.log("billspageHsitory -> ", history);

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
      <section className="home bg-[#0B0B0B] min-h-screen">
        <div className="home__container w-full min-h-screen sm:w-[90%] mx-auto">
          <div className="home__heading pt-7 w-full flex flex-col justify-center items-center mb-8">
            <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold font-protestFont font-strike">
              H<span className="text-[#D7FF9C]">is</span>tory.
            </h1>
          </div>

          <div className="w-full sm:w-[50%] mx-auto flex flex-col items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Size Filter Section */}
              <div className="max-w-4xl sm:max-w-xl mx-auto">
                <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl px-4 py-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-400">
                        Filter History According To Page
                      </span>

                      <button
                        onClick={() => setIsDateModal(true)}
                        className="text-black text-lg rounded-lg font-semibold bg-white hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        <i className="ri-calendar-2-fill px-2 py-1"></i>
                      </button>
                    </div>
                  </div>

                  <div className="flex h-fit py-2 px-1 sm:px-2 gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                    <button
                      onClick={()=>setActiveFilter(0)}
                      className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[60px] sm:min-w-[80px] shadow-md ${activeFilter===0?"bg-[#BEF264] text-black":"bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-zinc-600"}`}
                    >
                      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                        <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                          All Bills Page
                        </span>
                      </div>

                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#BEF264]/0 to-[#BEF264]/0 group-hover:from-[#BEF264]/5 group-hover:to-[#BEF264]/10 transition-all duration-300 rounded-lg sm:rounded-xl" />
                    </button>
                    <button
                      onClick={()=>setActiveFilter(1)}
                      className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[60px] sm:min-w-[80px] shadow-md ${activeFilter===1?"bg-[#BEF264] text-black":"bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-zinc-600"}`}
                    >
                      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                        <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                          Stock Page
                        </span>
                      </div>

                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#BEF264]/0 to-[#BEF264]/0 group-hover:from-[#BEF264]/5 group-hover:to-[#BEF264]/10 transition-all duration-300 rounded-lg sm:rounded-xl" />
                    </button>
                    <button
                      onClick={()=>setActiveFilter(2)}
                      className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[60px] sm:min-w-[80px] shadow-md ${activeFilter===2?"bg-[#BEF264] text-black":"bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-zinc-600"}`}
                    >
                      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                        <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                           Invoicing Page
                        </span>
                      </div>

                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#BEF264]/0 to-[#BEF264]/0 group-hover:from-[#BEF264]/5 group-hover:to-[#BEF264]/10 transition-all duration-300 rounded-lg sm:rounded-xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:w-[40%] mx-auto flex px-7 gap-4 mt-7">
            <div className="w-1/2 mx-auto h-10 bg-[#1E2228] rounded-lg border border-zinc-800 flex justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-300">{currentMonth? monthNames[currentMonth] :"N|A"}</p>
            </div>
            <div className="w-1/2 mx-auto h-10 bg-[#1E2228] rounded-lg border border-zinc-800 flex justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-300">{selectedDate?selectedDate.split("-")[2] + ' - '+monthNames[parseInt(selectedDate.split("-")[1])-1]:currentYear?currentYear:"N|A"}</p>
            </div>
          </div>

          <div className="history-section w-[90%] sm:w-[60%] mx-auto bg-[#1E2228] mt-7 px-2 sm:p-7 rounded-xl border border-zinc-800 shadow-lg">
            <div className="history-container p-4 sm:px-0 rounded-xl h-[400px] sm:h-[320px] overflow-y-auto space-y-4 custom-scrollbar sm:grid sm:grid-cols-2 sm:gap-4">
              {history?history.length>0
                ? history.map((entry, index) => {
                  if (entry.action==="delete") {
                    console.log('deelte detected');
                  }
                    return (
                      <div
                        key={entry.$id}
                        className={`history-entry bg-black px-4 pb-4 rounded-lg border-2 transition-all duration-300 hover:transform hover:scale-[1.02] shadow-md hover:shadow-lg ${entry.action==="delete" ? "border-red-400":entry.action==="create"?"border-lime-300":"border-amber-500" } `}
                      >
                        <p className={`w-fit mx-auto px-4 py-1 text-sm text-black ${entry.action==="delete" ? "bg-red-400 ":entry.action==="create"?"bg-lime-300 ":"bg-amber-500 " } font-semibold capitalize mb-2 rounded-b-md`}>
                          {entry.action || "N/A"}
                        </p>
                        <p className="text-sm mb-2">
                          {entry.description
                            .split(",")
                            .map((sentence, idx) => (
                              <p key={idx} className="text-sm tracking-wider">
                                {sentence || "N/A"}
                              </p>
                            )) || "N/A"}
                        </p>

                            <hr className="text-gray-400 mt-3 mb-2 " />

                        <p className="font-light text-gray-300 text-sm "><span className="text-white">Action done at -</span> {entry.$createdAt.split("T")[0]} - {formatTime(entry.$createdAt)}</p>
                        <p className="font-light text-gray-300 text-sm"><span className="text-white">Done by -</span> {entry.user || "Unknown"}</p>
                        <p className="w-full text-sm text-gray-300 capitalize">
                          {entry.type || "N/A"}
                        </p>
                      </div>
                    );
                  })
                : <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="text-4xl mb-4 opacity-50">📝</div>
                    <p className="text-base">No Data Available</p>
                  </div>
                :""}
            </div>
          </div>
        </div>

        {/*<!--============== Select Date Modal Option ==============-->*/}
      </section>

      {isDateModal && (
        <div className="fixed inset-0 z-50 flex px-2">
          <div
            onClick={() => setIsDateModal(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          ></div>

          <div className="relative m-auto w-full max-w-3xl text-black rounded-lg shadow-xl flex flex-col">
            <section className="flex-1 overflow-auto p-2">
              <div className="w-full h-fit bg-black rounded-3xl relative mb-4 shadow-2xl">
                <Calendar
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  currentYear={currentYear}
                  setCurrentYear={setCurrentYear}
                ></Calendar>

                <button
                  className="text-black text-sm font-bold hover:text-white absolute -top-1 -right-1 bg-red-400 hover:bg-red-500 px-2 py-1 rounded-full transition-all duration-200 transform hover:scale-110"
                  onClick={() => setIsDateModal(false)}
                >
                  ✕
                </button>
              </div>
            </section>
          </div>
        </div>
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

      

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(190, 242, 100, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(190, 242, 100, 0.5);
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Logs;