import * as functions from 'firebase-functions';
import { db , messaging} from "./admin/admin";
const jwt = require("jsonwebtoken")

export const getAllUserForParticularEmail = functions.https.onRequest(async (request, response) => {
  const result:any = {}   
  try {
    const email: any = request.query.email
    if (email=== undefined){
      throw new Error("Email cannot be null")      
    }
    const studentArray : any = []
    const blockedArray : any = []

    const snapshot = await db.collection('userCollection').get()
    const peopleIBlocked = await db.collection('userCollection').doc(email).collection("IBlocked").get()
    for (const blockId of peopleIBlocked.docs){
      blockedArray.push(blockId.id)
    }
    for (const studentDocs of snapshot.docs){
      let flag = true
      for (const blockId of blockedArray) {
        if (blockId === studentDocs.id){
          flag = false
          break
        }
      }
      if(studentDocs.id === email) {
        flag = false
      }
      if(flag){
        studentArray.push(studentDocs.data())
      }
    }
    result['success'] = studentArray

  } catch (error) {
    result['error'] = error.message
  }
  response.send(result);
});

export const login = functions.https.onRequest(async (request, response) => {
  const result:any = {}   
  try {
    const email: any = request.query.email
    if (email=== undefined){
      throw new Error("Email cannot be null")      
    }
    const snapshot = await db.collection('userCollection').doc(email).get()
    if(!snapshot.exists){
      throw new Error("Email not exist")
    }
    if(snapshot.data()!.password === request.query.password) {
      await jwt.verify(snapshot.data()!.token,  "secretkey", async (err: any, data: any) => {
        if (err){
          result['error'] = "auth failed"
        } else {
          result['success'] = "login successfull"
        }
      } )
    } else {
      result['error'] = "login and password did not match"
    }
  } catch (error) {
    result['error'] = error.message
  }
  response.send(result);
});


export const signup = functions.https.onRequest(async (request, response) => {
  const result:any = {}   
  try {
    const email: any = request.query.email
    const password: any = request.query.password
    if (email === undefined || password === undefined) {
      throw new Error("email or password cannot be null")      
    }
    const snapshot = await db.collection('userCollection').doc(email).get()
    if(snapshot.exists){
      throw new Error("Email already exist")
    }
    await jwt.sign({user: email}, "secretkey", async (err: any, token: any) => {
      await db.collection('userCollection').doc(email).set({email: email, password: password, image: request.query.image || "", name: request.query.name || "", token: token, gcmId: request.query.gcmId || ""}, {merge: true})
    })
    result['success'] = "signup successfull"

  } catch (error) {
    result['error'] = error.message
  }
  response.send(result);
});


export const sendNotificationToLiked = functions.https.onRequest(async (request, response) => {
  const result:any = {}   
  try {
    const email: any = request.query.email
    const userEmail: any = request.query.userEmail
    let userName: any = request.query.userName
    if (email === undefined  || userEmail === undefined) {
      throw new Error("email cannot be null")      
    }
    let name: any = email
    const snapshot = await db.collection('userCollection').doc(email).get()
    if (snapshot.data()!.name !== undefined){
      name = userEmail
    }
    await db.collection('userCollection').doc(email).collection("Iliked").doc(userEmail).set({email: userEmail, name: userName}, {merge: true})
    await db.collection('userCollection').doc(userEmail).collection("likedMe").doc(email).set({email: email, name: name}, {merge: true})    
    const gcmId = snapshot.data()!.gcmId
    if(gcmId !== undefined && gcmId.trim() != "") {
      const payload = {
        notification: {
          title: name +' has liked your photo',
          body: 'Tap here to check it out!'
        }
      };
      const notificationResult = await messaging.sendToDevice(gcmId, payload)
      result['notificationResult'] = notificationResult
    }
    result['success'] = "dataSavedSuccessfully"

  } catch (error) {
    result['error'] = error.message
  }
  response.send(result);
});

export const blockUser = functions.https.onRequest(async (request, response) => {
  const result:any = {}   
  try {
    const email: any = request.query.email // myemail
    const userEmail: any = request.query.userEmail //person i am blocking
    if (email === undefined || userEmail === undefined) {
      throw new Error("email or password cannot be null")      
    }
    await db.collection('userCollection').doc(email).collection("IBlocked").doc(userEmail).set({email: userEmail}, {merge: true})
    await db.collection('userCollection').doc(userEmail).collection("blockedMe").doc(email).set({email: email}, {merge: true})
    result['success'] = "successfully blocked"

  } catch (error) {
    result['error'] = error.message
  }
  response.send(result);
});



