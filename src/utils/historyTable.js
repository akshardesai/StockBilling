import { DATABASE_ID, db, HISTORY_COLLECTION_ID, Query } from "./appWrite";


export async function fetchHisotryBillsPage() {
  try {
    const response = await db.listDocuments(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      [Query.equal("type", "billsPage"), Query.orderDesc()]
    );

    if (!response) {
      return { success: false, error: "Failed to fetch bills page history" };
    }

    return { success: true, data: response.documents };
  } catch (error) {
    return { success: false, error: `Catched Error - ${error}` };
  }
}

export async function fetchHistory(page, date) {
  console.log("fetching for date -> ", date);

  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    let type = "";

    if (page == 0) {
      type = "billsPage";
    } else if (page == 1) {
      type = "stockPage";
    } else if (page == 2) {
      type = "invoicingPage";
    } else {
      return { success: false, error: "Failed to Filter" };
    }

    const response = await db.listDocuments(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      [
        Query.equal("type", type),
        Query.greaterThanEqual("$createdAt", startDate.toISOString()),
        Query.lessThan("$createdAt", endDate.toISOString()),
        Query.orderDesc(),
      ]
    );

    if (!response) {
      return { success: false, error: "Failed to fetch history" };
    }

    return { success: true, data: response.documents };
  } catch (error) {
    return { success: false, error: `Catched Error - ${error}` };
  }
}

export async function fetchMonthHistory(month, year,page) {
  try {
    
    let type = "";

    if (page == 0) {
      type = "billsPage";
    } else if (page == 1) {
      type = "stockPage";
    } else if (page == 2) {
      type = "invoicingPage";
    } else {
      return { success: false, error: "Failed to Filter" };
    }


    const startDate = new Date(year, month, 1);

    const endDate = new Date(year, month + 1, 1);

    const response = await db.listDocuments(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      [
        Query.equal("type", type),
        Query.greaterThanEqual("$createdAt", startDate.toISOString()),
        Query.lessThan("$createdAt", endDate.toISOString()),
        Query.orderDesc(),
      ]
    );

    if (!response) {
      return { success: false, error: "Failed to fetch bills server error!" };
    }

    console.log("response");

    return { success: true, data: response.documents };
  } catch (error) {
    return {
      success: false,
      error: `Catched Error in fetching bills ${error}`,
    };
  }
}

export  function formatTime(fullUtc){
  const date = new Date(fullUtc);

const local = date.toLocaleString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

console.log('local>', local);


return local
}
