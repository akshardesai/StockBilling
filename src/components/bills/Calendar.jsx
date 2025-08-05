import { useState } from "react";

export default function Calendar({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  currentYear,
  setCurrentYear,
}) {
  // const currentDate = new Date();
  // const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  // const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  // const [selectedDate,setSelectedDate]= useState(null)

  const eachButtonDate = (date) => {
    console.log("date selected -> ", date);

    setSelectedDate(date);
  };



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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const resetDate = () => {
    setSelectedDate(null);
    setCurrentMonth(currentMonth)
  };

  const getDateInString = (day) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    return dateString;
  };

  const getSelectedStatus = (day) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    

    if (selectedDate) {
      const selectedDateString = selectedDate

     
      
      if (dateString === selectedDateString) {
        
        
        return "selected";
      } else {
        return null;
      }
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalSlots = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

    // Add empty slots for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 text-center"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getSelectedStatus(day);

      const getDate = getDateInString(day);

      let dayClass =
        "h-12 flex items-center justify-center rounded-lg border border-neutral-700/30 cursor-pointer ";

      if (status ==="selected") {
        dayClass += "bg-lime-300 text-black";
      }else{
        dayClass += "bg-neutral-600/30 text-neutral-300";
      }

      days.push(
        <div
          onClick={() => eachButtonDate(getDate)}
          key={day}
          className={dayClass}
        >
          {day}
        </div>
      );
    }

    // Add empty slots for days after the last day of the month
    const remainingSlots = totalSlots - (daysInMonth + firstDayOfMonth);
    for (let i = 0; i < remainingSlots; i++) {
      days.push(
        <div key={`empty-end-${i}`} className="h-12 text-center"></div>
      );
    }

    return days;
  };

  return (
    <>
      <div className="bg-gray-600/40  border border-neutral-700/30 rounded-3xl p-6 ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-200 "> Calendar</h2>

          <div className="flex items-center space-x-4">
            <select
              className="bg-black border border-neutral-700/30 rounded-xl px-4 py-2 text-neutral-300"
              value={`${currentYear}-${currentMonth}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                setCurrentYear(parseInt(year));
                setCurrentMonth(parseInt(month));
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={`${currentYear}-${i}`}>
                  {monthNames[i]} {currentYear}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedDate ? (
          <div>
            <p className="text-center font-bold tracking-wider text-white text-xs">
              Selected Date - {selectedDate}
            </p>
          </div>
        ) : (
          ""
        )}

        <div className="grid grid-cols-7 gap-2 mb-2 mt-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-neutral-400 text-sm font-medium text-center"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 h-fit ">
          {renderCalendarDays()}
        </div>

        <div className="flex justify-between mt-4 ">
          <button
            onClick={prevMonth}
            className="bg-black border border-neutral-700/30 rounded-xl px-4 py-2 text-neutral-300 hover:bg-neutral-700/30"
          >
            Previous
          </button>

          <button
            onClick={resetDate}
            className="bg-black border border-neutral-700/30 rounded-xl px-5 py-2 text-neutral-300 hover:bg-neutral-700/30"
          >
          No Date
          </button>

          <button
            onClick={nextMonth}
            className="bg-black border border-neutral-700/30 rounded-xl px-5 py-2 text-neutral-300 hover:bg-neutral-700/30"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
