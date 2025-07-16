import {
  DATABASE_ID,
  db,
  HEIGHTS_COLLECTION_ID,
  ID,
  SIZES_COLLECTION_ID,
  BILLS_COLLECTION_ID,
  CART_COLLECTION_ID,
} from "./appWrite";

export async function createBill(billInfo) {
  const billId = ID.unique();

  const billData = {
    name: billInfo.name,
    number: billInfo.number,
    totalAmount: 101,
  };

  try {
    const billResponse = await db.createDocument(
      DATABASE_ID,
      BILLS_COLLECTION_ID,
      billId,
      billData
    );

    if (!billResponse) {
      return {
        success: false,
        error: "Failed To Create Bill No Response Error",
      };
    }

    // return {success:true}

    // let verifyOperations = billInfo.cartData.length
    let verifyOperations = 0;

    billInfo.cartData.forEach(async (i) => {
      i.heights.forEach(async (j) => {
        try {
          const cartRow = {
            price: 0,
            qty: 0,
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
            console.log('Response error creating cart');
            
          }
        } catch (error) {
            console.log('catch error creating cart',error);
            
        }
      });
    });

    console.log(verifyOperations + "=" + billInfo.cartData.length);
  } catch (error) {
    return { success: false, error: `Catched An Error ${error}` };
  }
}
