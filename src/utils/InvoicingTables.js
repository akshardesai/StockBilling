import {
  DATABASE_ID,
  db,
  HEIGHTS_COLLECTION_ID,
  ID,
  SIZES_COLLECTION_ID,
  BILLS_COLLECTION_ID,
  CART_COLLECTION_ID,
  HISTORY_COLLECTION_ID,
  Query,
  getCurrentUser,
} from "./appWrite";
import { formatTime } from "./historyTable";

async function checkItemsInStock(billinfo) {
  try {
    let doesNotExist = 0;

    const cart = billinfo.cartData;

    console.log("cart data inside checkstock funciton ->", cart);

    for (const size of cart) {
      for (const height of size.heights) {
        const existing = await db.getDocument(
          DATABASE_ID,
          HEIGHTS_COLLECTION_ID,
          height.$id
        );

        if (existing.quantity < height.cartQuantity) {
          return { success: false };
        }
      }
    }
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function createBill(billInfo,total) {

 
  

  //first find size and height exists if yes deduct the stock validate that it is not less than 1 and then proceed with creating bill
  let validationArray = [];
  try {
    const inStock = await checkItemsInStock(billInfo);

    if (inStock.success) {
      validationArray.push(1);
      // log('instock variable value ->',inStock);

      const billId = ID.unique();

      const billData = {
        name: billInfo.name,
        number: parseInt(billInfo.number),
        totalAmount: parseInt(total),
        payment_status:`${billInfo.payment_status}`
      };

      const billResponse = await db.createDocument(
        DATABASE_ID,
        BILLS_COLLECTION_ID,
        billId,
        billData
      );

      if (!billResponse) {
        return {
          success: false,
          error: "Failed to create bill server error",
          validation: validationArray,
        };
      }

      validationArray.push(2);

      let cartData = [];

      for (const i of billInfo.cartData) {
        for (const j of i.heights) {
          try {
            const cartRow = {
              price: j.price,
              qty: j.cartQuantity,
              total: 0,
              bills: billId,
              size_name: i.size,
              size_id: i.$id,
              height_name: j.height,
              height_id: j.$id,
            };

            const response = await db.createDocument(
              DATABASE_ID,
              CART_COLLECTION_ID,
              ID.unique(),
              cartRow
            );

            if (!response) {
              //have to delete the bill

              return {
                success: false,
                error: 'Failed to add items in bill "DELETE BILL" ',
                validation: validationArray,
              };
            }

            cartData.push(response);
          } catch (error) {
            return {
              success: false,
              error: 'Failed to add items in bill "DELETE BILL" ',
              validation: validationArray,
            };
          }
        }
      }
      validationArray.push(3);
      //cart also created now update stock

      try {
        for (const size of billInfo.cartData) {
          for (const height of size.heights) {
            const existing = await db.getDocument(
              DATABASE_ID,
              HEIGHTS_COLLECTION_ID,
              height.$id
            );
            const newQuantity = existing.quantity - height.cartQuantity;

            const responseUpdateStock = await db.updateDocument(
              DATABASE_ID,
              HEIGHTS_COLLECTION_ID,
              height.$id,
              {
                quantity: newQuantity,
              }
            );

            if (!responseUpdateStock) {
              return {
                success: false,
                error: "Failed to update stock",
                validation: validationArray,
              };
            }
          }
        }
      } catch (error) {
        return {
          success: false,
          error: "Failed to update stock",
          validation: validationArray,
        };
      }

      validationArray.push(4);
      return {
        success: true,
        data: billResponse,
        validation: validationArray,
        cartData: cartData,
      };
    } else {
      return {
        success: false,
        error: "insufficient stock",
        validation: validationArray,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Catched An Error ${error}`,
      validation: validationArray,
    };
  }
}

// fetch bills based on month
export async function getAllBills(month, year) {
 

  const startDate = new Date(year, month, 1);
  console.log("start date->", startDate);

  const endDate = new Date(year, month + 1, 1);

  console.log("end date ->", endDate);

  try {
    const response = await db.listDocuments(DATABASE_ID, BILLS_COLLECTION_ID, [
      Query.greaterThanEqual("$createdAt", startDate.toISOString()),
      Query.lessThan("$createdAt", endDate.toISOString()),
      Query.orderDesc(),
    ]);

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

export async function deleteBillDocument(bill) {
  
  const user = await getCurrentUser()

  if (user) {
      try {
    const deletedAt = new Date()
    const date = deletedAt.toISOString().split("T")[0]
    const time = formatTime(deletedAt.toISOString())
    const response = await db.deleteDocument(
      DATABASE_ID,
      BILLS_COLLECTION_ID,
      bill.$id
    );

    if (!response) {
      return { success: false, error: "Failed to delete Bill Server Error!" };
    }

    const data = {
      description: `Bill Deleted of name - ${bill.name} , number - ${bill.number} , totalAmount - ${bill.totalAmount} , deleted at - ${date} - ${time} , created at - ${bill.$createdAt}`,
      type: "billsPage",
      action: "delete",
      user:user.name
    };

    const historyResponse = await db.createDocument(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      ID.unique(),
      data
    );

    if (!historyResponse) {
      alert("Failed to record history of Deleting Bill");
    }

    return { success: true, error: "Deleted Bill" };
  } catch (error) {
    return {
      success: false,
      error: `Catched Error in deleteing bill ${error}`,
    };
  }
  }else{
    return {success:false,error:'Failed to define User'}
  }

}

// fetch bills based on specific date
export async function fetchDateBills(date) {

 
  
  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    console.log("querying start date ->", startDate);
    console.log("querying End date ->", endDate);

    const response = await db.listDocuments(DATABASE_ID, BILLS_COLLECTION_ID, [
      Query.greaterThanEqual("$createdAt", startDate.toISOString()),
      Query.lessThan("$createdAt", endDate.toISOString()),
      Query.orderDesc(),
    ]);

    if (!response) {
      return { success: false, error: `Failed to fetch bills server error` };
    }

    return { success: true, data: response.documents };
  } catch (error) {
    return { success: false, error: `catched an error ${error}` };
  }
}

export async function recordBillHistory(bill, cart) {


  const user = await  getCurrentUser()

  

  if (user) {
    
    
    try {
      const historyData = {
        description: `New Bill Name - ${bill.name} , Number - ${bill.number} , TotalAmount - ${bill.TotalAmount} , Payment Status ${bill.payment_status==1?"Paid":"Pending"} ,  Created At - ${bill.$createdAt.split("T")[0]} - ${formatTime(bill.$createdAt)} , Cart : ${cart.map((entry)=> entry.height_name + "|"+ entry.price + "|"+ entry.qty + "|"+ entry.total)}`,
        type: "invoicingPage",
        action: "create",
        user:user.name,
      };
      
      
      const historyResponse = await db.createDocument(DATABASE_ID,HISTORY_COLLECTION_ID,ID.unique(),historyData)
      
      if (!historyResponse) {
        alert ('Failed to record history of bill')
      }
    } catch (error) {
      alert (`Failed to record history of bill Error - ${error}`)
    }
  }else{
    return {success:false,error:'Failed to define User'}
  }
}

export async function editBillStatusDB(bill){

  
  

  const user = await getCurrentUser()

  if (user) {
    
  

  try {

    if (bill.payment_status>2 || bill.payment_status<1) {
      return {success:false,error:'Failed to fetch payment_status from Server'}
    }

    const data={
      payment_status:bill.payment_status==1?"2":"1"
    }


    const response = await db.updateDocument(DATABASE_ID,BILLS_COLLECTION_ID,bill.$id,data)

    if (!response) {
      return {success:false,error:'Failed to update payment_status server error !'}
    }



     const historyData = {
        description: `Updated Bill Payment Status of , Name - ${bill.name} , Number - ${bill.number} , TotalAmount - ${bill.totalAmount} , Payment Status - ${bill.payment_status==1?"From Paid To Pending":"From Pending To Paid"} , Created At - ${bill.$createdAt.split("T")[0]} - ${formatTime(bill.$createdAt)} , Updated At - ${response.$updatedAt.split("T")[0]} - ${formatTime(response.$updatedAt)}  , Cart : ${bill.cart.map((entry)=> entry.height_name + "|"+ entry.price + "|"+ entry.qty + "|"+ entry.total)}`,
        type: "billsPage",
        action: "edit",
        user:user.name
      };
      
      
    const historyResponse = await db.createDocument(DATABASE_ID,HISTORY_COLLECTION_ID,ID.unique(),historyData)

    if (!historyResponse) {
      alert ("Failed to record history of updating bill")
    }
    
    
    return {success:true}




  } catch (error) {
    return {success:false,error:`Found Error - ${error} `}    
  } }else{
    return {success:false,error:"Failed to define User"}
  }
}
