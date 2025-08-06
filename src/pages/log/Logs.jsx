import "../../index.css";
import React, { useState } from "react";
// import AllLogs from "../../components/logs/AllLogs";
import Calendar from "../../components/bills/Calendar";
import { useEffect } from "react";
import { fetchHisotryBillsPage, fetchHistory, fetchMonthHistory, formatTime } from "../../utils/historyTable";

const Logs1 = () => {
  const currentDate = new Date();
  const defaultSelectedDate = currentDate.toISOString().split("T")[0]
  
  
  const [isDateModal, setIsDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [activeFilter,setActiveFilter]=useState(0)


  //created at date format - 2025-07-25T12:41:59.645+00:00
  //0 - all bills page
  //1 - stock page
  //2 - invoicing page

  console.log('logs.jsx selected date state ->',selectedDate);
  
  

  const [history, setHistory] = useState([]);



  async function fetchFilteredHistory(page,date){
    const response = await fetchHistory(page,date);
    
    if (response) {
      // console.log(response.data);
      
        setHistory(response.data);
    }
  }

  async function fetchCurrentMonthHistory(month,year){
    const response = await fetchMonthHistory(month,year)
    

    if (response) {
        setHistory(response.data)
    }
  }


  useEffect(()=>{

    fetchFilteredHistory(activeFilter,selectedDate)

  },[activeFilter,selectedDate])

  useEffect(()=>{
    if (selectedDate === null) {
      
      fetchCurrentMonthHistory(currentMonth,currentYear)
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
      <section className="home bg-[#0B0B0B] ">
        <div className="home__container w-full h-screen">
          <div className="home__heading pt-7 w-full flex flex-col justify-center items-center mb-8">
            <h1 className=" text-center text-4xl font-bold font-protestFont font-strike">
              H<span className="text-[#D7FF9C]">is</span>tory.
            </h1>
          </div>

          <div className="w-full sm:w-[50%] mx-auto flex flex-col items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8   ">
              {/* Size Filter Section */}
              <div className="max-w-4xl sm:max-w-xl mx-auto mb-4 ">
                <div className="bg-[#171717] backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl px-4 py-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-full flex items-center justify-between ">
                      <span className="text-xs sm:text-sm text-gray-400">
                        Filter History According To Page
                      </span>

                      <button
                        onClick={() => setIsDateModal(true)}
                        className=" text-black text-lg  rounded-sm font-semibold   bg-white    "
                      >
                        <i className="ri-calendar-2-fill px-2 py-1 "></i>
                      </button>
                    </div>
                  </div>

                  <div className="flex h-fit py-2 px-1 sm:px-2 gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                    <button
                    onClick={()=>setActiveFilter(0)}
                      className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[60px] sm:min-w-[80px] ${activeFilter===0?"bg-[#BEF264] text-black":"bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-zinc-600"}`}
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
                      className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 flex-shrink-0 min-w-[60px] sm:min-w-[80px] ${activeFilter===1?"bg-[#BEF264] text-black":"bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-zinc-600"}`}
                    >
                      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                        <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                          Stock Page
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

          <div className="flex  px-7 gap-4 ">

          <div className="w-1/2 mx-auto  h-10 bg-[#171717] rounded-lg flex justify-center items-center">
          <p>{currentMonth? monthNames[currentMonth] :"N|A"}</p>
          </div>
          <div className="w-1/2 mx-auto   h-10 bg-[#171717] rounded-lg flex justify-center items-center">
          <p>{selectedDate?selectedDate.split("-")[2] + ' - '+monthNames[parseInt(selectedDate.split("-")[0])]:currentYear?currentYear:"N|A"}</p>
          </div>
          </div>
          <div className="history-section w-[90%] mx-auto bg-[#171717]  mt-4 px-2 ">
            <div className="history-container    p-4  rounded-lg h-[550px]   overflow-y-auto space-y-4 ">
              {history?history.length>0
                ? history.map((entry, index) => {
                  if (entry.action==="delete") {
                    console.log('deelte detected');
                    
                  }
                    return (
                      <div
                        key={entry.$id}
                        className={`history-entry bg-black   px-4 pb-4 rounded-lg border-2 ${entry.action==="delete" ? "border-red-400":entry.action==="create"?"border-lime-300":"border-amber-500" } `}
                      >
                        <p className={` w-fit mx-auto px-4 py-1 text-sm  text-black ${entry.action==="delete" ? "bg-red-400 ":entry.action==="create"?"bg-lime-300 ":"bg-amber-500 " }  font-semibold capitalize mb-2 rounded-b-md`}>
                          {entry.action || "N/A"}
                        </p>
                        <p className="text-sm  mb-2">
                          {entry.description
                            .split(",")
                            .map((sentence) => (
                              <p className="text-sm tracking-wider">
                                {sentence || "N/A"}
                              </p>
                            )) || "N/A"}
                        </p>
                        <p className="font-light text-gray-400 text-sm">Action Done At - {entry.$createdAt.split("T")[0]} - {formatTime(entry.$createdAt)}</p>
                        <p className=" w-full  text-sm text-gray-400 capitalize ">
                          {entry.type || "N/A"}
                        </p>
                      </div>
                    );
                  })
                : "No Data Available":""}
            </div>
          </div>
        </div>

        {/*<!--============== Select Date Modal Option ==============-->*/}
      </section>

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
                  className="text-black text-sm font-bold hover:text-white absolute -top-1 -right-1   bg-red-400 px-2 py-1 rounded-full "
                  onClick={() => setIsDateModal(false)}
                >
                  ✕
                </button>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default Logs1;
