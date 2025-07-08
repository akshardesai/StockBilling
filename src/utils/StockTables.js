// import { v4 as uuidv4 } from "uuid";

import {
  DATABASE_ID,
  db,
  HEIGHTS_COLLECTION_ID,
  ID,
  SIZES_COLLECTION_ID,
} from "./appWrite";

export async function addProduct(product) {
  try {
    const productData = {
      size: product,
    };

    const response = await db.createDocument(
      DATABASE_ID,
      SIZES_COLLECTION_ID,
      ID.unique(),
      productData
    );

    if (!response) {
      return {
        success: false,
        error: "Failed To Creat A New Size  ",
      };
    }

    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      error: `Got An Error In Creating A New Size - ${error}`,
    };
  }
}

export async function deleteSize(id) {
  try {
    
    const response = await db.deleteDocument(
      DATABASE_ID,
      SIZES_COLLECTION_ID,
      id
    );

    if (!response) {
      return { success: false, error: "Failed To Delete Size" };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Catched An Error ${error}` };
  }
}

export async function deleteHeight(id) {
  try {
    const response = await db.deleteDocument(
      DATABASE_ID,
      HEIGHTS_COLLECTION_ID,
      id
    );
    if (!response) {
      return {
        success: false,
        error: "Failed to delete height",
      };
    }

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: `Catched Error - ${error}` };
  }
}

export async function readAllProduct() {
  // console.log('inside readall product function');
  
  try {
    const response = await db.listDocuments(DATABASE_ID, SIZES_COLLECTION_ID);

    if (!response) {
      console.log('if condition no response');
      
      return {
        success: false,
        error: "Unable to fetch Sizes from Server",
      };
    }

    // c("returned response", response);
    // console.log('response of readall product',response);
    
    return response;
  } catch (error) {
    // console.log('direct inside catch maybe db error');
    

    return {
      success: false,
      error: `Catched An Error In Fetching Sizes - ${error}`,
    };
    // c("no data");
  }
}

export async function addHeight(product_id, height, qty) {
  try {
    // c(product_id, height, qty);

    const data = {
      height: height,
      quantity: parseInt(qty),
      sizes: product_id,
      size_id: product_id,
    };

    const response = await db.createDocument(
      DATABASE_ID,
      HEIGHTS_COLLECTION_ID,
      ID.unique(),
      data
    );

    if (!response) {
      return {
        success: false,
        error: "Unable to fetch Sizes from Server",
      };
    }

    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      error: `Caught An Error In Fetching Sizes - ${error}`,
    };
  }
}

export async function updateHeight(id, updatedHeight, updatedQuantity) {
  const row = {
    height: updatedHeight,
    quantity: parseInt(updatedQuantity),
  };

  try {
    const response = await db.updateDocument(
      DATABASE_ID,
      HEIGHTS_COLLECTION_ID,
      id,
      row
    );

    if (!response) {
      console.log("server error");
      return { success: false, error: "Server Error Failed To Update Height" };
    }

    return { success: true, data: response };
  } catch (error) {
    console.log("catched error", error);

    return { success: false, error: `Catched An Error ${error}` };
  }
}


export async function lessQuantityBy1(id,quantity){
      try {

        const row={
            quantity:parseInt(quantity-1)
        }
        const response = await db.updateDocument(DATABASE_ID,HEIGHTS_COLLECTION_ID,id,row)

        if (!response) {
            return {success:false,error:"Server Error - Failed To Update Quantity"}
        }

        return {success:true , data:response}


      } catch (error) {
          return {success:false,error:`Catched An Error - ${error}` }
      }
}

export async function addQuantityBy1(id,quantity){

      try {

        const row={
            quantity:parseInt(quantity+1)
        }
        const response = await db.updateDocument(DATABASE_ID,HEIGHTS_COLLECTION_ID,id,row)

        if (!response) {
            return {success:false,error:"Server Error - Failed To Update Quantity"}
        }

        return {success:true , data:response}


      } catch (error) {
          return {success:false,error:`Catched An Error - ${error}` }
      }

}