import {
  DATABASE_ID,
  db,
  HEIGHTS_COLLECTION_ID,
  ID,
  SIZES_COLLECTION_ID,
  BILLS_COLLECTION_ID,
  CART_COLLECTION_ID,
  Query,
} from "./appWrite";

async function checkItemsInStock(billinfo) {
  let doesNotExist = 0;

  const cart = billinfo.cartData;

  console.log("cart data inside checkstock funciton ->", cart);

  for (const size of cart) {
    for (const height of size.heights) {
  

      const existing = await db.getDocument(DATABASE_ID,HEIGHTS_COLLECTION_ID,height.$id,)

      if (existing.quantity<height.cartQuantity) {
        
          throw new Error(`Insufficient stock for height - ${height.height} id - ${height.$id}`)
          
      }

    }
  }
}

export async function createBill(billInfo) {
  //first find size and height exists if yes deduct the stock validate that it is not less than 1 and then proceed with creating bill
  try {
    const inStock = await checkItemsInStock(billInfo);


    
    // log('instock variable value ->',inStock);

    const billId = ID.unique();

    const billData = {
      name: billInfo.name,
      number: parseInt(billInfo.number),
      totalAmount: 101,
    };

      const billResponse = await db.createDocument(
        DATABASE_ID,
        BILLS_COLLECTION_ID,
        billId,
        billData
      );

      if (!billResponse) {
        //throw error
        return {
          success: false,
          error: "Failed To Create Bill No Response Error",
        };
      }


     for(const i of billInfo.cartData){
      

      for(const j of i.heights){
        try{
          const cartRow = {
            price:j.price,
            qty:j.cartQuantity,
            total:0,
            bills:billId,
            size_name:i.size,
            size_id:i.$id,
            height_name:j.height,
            height_id:j.$id

          }

          const response = await db.createDocument(
            DATABASE_ID,
            CART_COLLECTION_ID,
            ID.unique(),
            cartRow
          )

          if (!response) {
            //have to delete the bill
              console.log("response error creating cart");
              throw new Error('Failed to Insert a item in Cart')

          }


        }catch(error){
         
        throw new Error(`catched error ${error}`);
        

        }
      }

    }

    //cart also created now update stock

    try {
      
      for (const size of billInfo.cartData) {
          for (const height of size.heights) {

            const existing = await db.getDocument(DATABASE_ID,HEIGHTS_COLLECTION_ID,height.$id)
            const newQuantity = existing.quantity - height.cartQuantity

            const responseUpdateStock = await db.updateDocument(DATABASE_ID,HEIGHTS_COLLECTION_ID,height.$id,{
              quantity:newQuantity
            })

            if (!responseUpdateStock) {
               throw new Error(`catched error ${error}`);
            }

          }
      }
    } catch (error) {
       throw new Error(`catched error ${error}`);
    }


     return {success:true,data:billResponse}
  } catch (error) {
    throw new Error(`catched error ${error}`);
    return { success: false, error: `Catched An Error ${error}` };
  }
}

// fetch bills based on month
export async function getAllBills(month, year) {
  console.log("month ->", month);
  console.log("year ->", year);

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

export async function deleteBillDocument(id) {
  try {
    const response = await db.deleteDocument(
      DATABASE_ID,
      BILLS_COLLECTION_ID,
      id
    );

    if (!response) {
      return { success: false, error: "Failed to delete Bill Server Error!" };
    }

    return { success: true, error: "Deleted Bill" };
  } catch (error) {
    return {
      success: false,
      error: `Catched Error in deleteing bill ${error}`,
    };
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
