// import { v4 as uuidv4 } from "uuid";

import {
  DATABASE_ID,
  db,
  getCurrentUser,
  HEIGHTS_COLLECTION_ID,
  HISTORY_COLLECTION_ID,
  ID,
  Query,
  SIZES_COLLECTION_ID,
} from "./appWrite";
import { formatTime } from "./historyTable";

export async function addProduct(product) {
  const user  = await getCurrentUser()
  if (user) {
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

    // console.log('response  add size ->',response);
    

    const historyData = {
      description: `Size created of name - ${product} , At - ${response.$createdAt.split("T")[0]} - ${formatTime(response.$createdAt)}`,
      type: "stockPage",
      action: "create",
      user:user.name
    };

    const historyResponse = await db.createDocument(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      ID.unique(),
      historyData
    );

    if (!historyResponse) {
      alert("Failed to record history of Creating Size");
    }

    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      error: `Got An Error In Creating A New Size - ${error}`,
    };
  }
}else{
  return {success:false,error:'Failed to define User'}
}
}

export async function deleteSize(size) {
 const user = await getCurrentUser()

 if (user) {
   try {
     const deletedAt = new Date()
    const date = deletedAt.toISOString().split("T")[0]
    const time = formatTime(deletedAt.toISOString())

    console.log("size to be deleted -> ", size);

    const response = await db.deleteDocument(
      DATABASE_ID,
      SIZES_COLLECTION_ID,
      size.$id
    );

    if (!response) {
      return { success: false, error: "Failed To Delete Size" };
    }

    const historyData = {
      description: `Size deleted of name - ${size.size} , heights - ${
        size.heights.map((height) => height.height + "|" + height.quantity) ||
        "N|A"
      } , Size Deleted At - ${date} - ${time}`  ,
      type: "stockPage",
      action: "delete",
      user:user.name
    };

    const historyResponse = await db.createDocument(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      ID.unique(),
      historyData
    );

    if (!historyResponse) {
      alert("Failed to record history of Creating Size");
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Catched An Error ${error}` };
  }
 }else{
  return {success:false,error:'Failed to define user'}
 }
}

export async function deleteHeight(height,size) {
  
  const user = await getCurrentUser()
  if (user) {
      try {
       const deletedAt = new Date()
    const date = deletedAt.toISOString().split("T")[0]
    const time = formatTime(deletedAt.toISOString())

    const response = await db.deleteDocument(
      DATABASE_ID,
      HEIGHTS_COLLECTION_ID,
      height.$id
    );
    if (!response) {
      return {
        success: false,
        error: "Failed to delete height",
      };
    }

    const historyData={

       description: `Height deleted of name - ${height.height} , of Size - ${size.size} , with Quantity - ${height.quantity} , At - ${date} - ${time} `,
      type: "stockPage",
      action: "delete",
      user:user.name

    }

    const historyResponse = await db.createDocument(DATABASE_ID,HISTORY_COLLECTION_ID,ID.unique(),historyData)


    if (!historyResponse) {
        alert('Failed to record the history of deleting height')
    }

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: `Catched Error - ${error}` };
  }
  }else{
    return {success:false,error:'Failed to define User'}
  }
}

export async function readAllProduct() {
  // c('inside readall product function');

  try {
    const response = await db.listDocuments(DATABASE_ID, SIZES_COLLECTION_ID,[Query.orderDesc()]);

    if (!response) {
      // c("if condition no response");

      return {
        success: false,
        error: "Unable to fetch Sizes from Server",
      };
    }

    // c("returned response", response);
    // c('response of readall product',response);

      return {success:true,data:response}
  } catch (error) {
    // c('direct inside catch maybe db error');

    return {
      success: false,
      error: `Catched An Error In Fetching Sizes - ${error}`,
    };
    // c("no data");
  }
}

export async function addHeight(size, height, qty) {
  const user = await getCurrentUser()

  if (user) {
      try {
    // c(product_id, height, qty);

    const data = {
      height: height,
      quantity: parseInt(qty),
      sizes: size.$id,
      size_id: size.$id,
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

      const historyData = {
      description: `Height created of name - ${height} , Quantity - ${qty} , In Size - ${size.size} , At - ${response.$createdAt.split("T")[0]} - ${formatTime(response.$createdAt)} ,  sizeId - ${size.$id} , size Created At - ${size.$createdAt.split("T")[0]} - ${formatTime(size.$createdAt)}`,
      type: "stockPage",
      action: "create",
      user:user.name

    };

    const historyResponse = await db.createDocument(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      ID.unique(),
      historyData
    );

    if (!historyResponse) {
      alert("Failed to record history of Creating Size");
    }

    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      error: `Caught An Error In Fetching Sizes - ${error}`,
    };
  }
  }else{
    return {success:false,error:'Failed to define User'}
  }
}

export async function updateHeight(heightObject, updatedHeight, updatedQuantity) {

  const user = await getCurrentUser()

  if (user) {
      const row = {
    height: updatedHeight,
    quantity: parseInt(updatedQuantity),
  };

  try {
    const response = await db.updateDocument(
      DATABASE_ID,
      HEIGHTS_COLLECTION_ID,
      heightObject.$id,
      row
    );

    if (!response) {
      console.log("server error");
      return { success: false, error: "Server Error Failed To Update Height" };
    }


    const historyData = {
      description:`Updated Height Name -  ${heightObject.height} to ${updatedHeight} , Quantity - ${heightObject.quantity} to ${updatedQuantity} , At - ${response.$updatedAt.split("T")[0]} - ${formatTime(response.$updatedAt)}`,
      type:'stockPage',
      action:'edit',
      user:user.name

    }

    const historyResponse = await db.createDocument(DATABASE_ID,HISTORY_COLLECTION_ID,ID.unique(),historyData)

    if (!historyResponse) {
      alert('Failed to record the history of updating height')
    }

    return { success: true, data: response };
  } catch (error) {
    console.log("catched error", error);

    return { success: false, error: `Catched An Error ${error}` };
  }
  }else{
    return {success:false,error:'Failed to define User'}
  }

}

export async function lessQuantityBy1(height, size) {

  const user = await getCurrentUser()

  if(user){
  try {
    const row = {
      quantity: parseInt(height.quantity - 1),
    };
    const response = await db.updateDocument(
      DATABASE_ID,
      HEIGHTS_COLLECTION_ID,
      height.$id,
      row
    );

    if (!response) {
      return {
        success: false,
        error: "Server Error - Failed To Update Quantity",
      };
    }

    const historyData = {
      description:`reduced the quantity  Height - ${height.height} , Quantity - ${height.quantity} to ${height.quantity-1} , At - ${response.$updatedAt.split("T")[0]} - ${formatTime(response.$updatedAt)} , Size - ${size.size}`,
      type:'stockPage',
      action:'edit',
      user:user.name
    }

    const historyResponse = await db.createDocument(DATABASE_ID,HISTORY_COLLECTION_ID,ID.unique(),historyData)

    if (!historyResponse) {
        alert('Failed to record the history of reducing stock by 1')
    }

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: `Catched An Error - ${error}` };
  }
  }else{
    return {success:false,error:'Failed to define User'}
  }
  

}

export async function addQuantityBy1(height,size) {

  const user = await getCurrentUser()

  if (user) {
 
  try {
    const row = {
      quantity: parseInt(height.quantity + 1),
    };
    const response = await db.updateDocument(
      DATABASE_ID,
      HEIGHTS_COLLECTION_ID,
      height.$id,
      row
    );

    if (!response) {
      return {
        success: false,
        error: "Server Error - Failed To Update Quantity",
      };
    }

       const historyData = {
      description:`Increased the quantity  Height - ${height.height} , Quantity - ${height.quantity} to ${height.quantity+1} , At - ${response.$updatedAt.split("T")[0]} - ${formatTime(response.$updatedAt)} , Size - ${size.size} `,
      type:'stockPage',
      action:'Edit',
      user:user.name
    }

    const historyResponse = await db.createDocument(DATABASE_ID,HISTORY_COLLECTION_ID,ID.unique(),historyData)

    if (!historyResponse) {
        alert('Failed to record the history of reducing stock by 1')
    }

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: `Catched An Error - ${error}` };
  }   
  }else{
    return {success:false,error:'Failed to define User'}
  }
}
