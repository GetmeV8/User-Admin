var db = require('../config/connection')
var collection = require('../config/collections')
const { get, response } = require('../app')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports = {
    addMovies: (movies) => {
        db.get().collection(collection.MOVIES_COLLECTION).insertOne(movies)
    },
    getAllMovies: () => {

        return new Promise(async (resolve, reject) => {
            let movies = await db.get().collection(collection.MOVIES_COLLECTION).find().toArray()
            resolve(movies)

        })

    },
    addUsers: (userData) => {
        console.log(userData)
        return new Promise(async(resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            console.log(user)
            let oldUser = {}
            if (user) {
                oldUser.status = true;
                resolve(oldUser)
            } else {
                userData.password =await bcrypt.hash(userData.password, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData)
                resolve({status:false})


            }

        })

    },
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },

    adminLogin: (userData) => {
        return new Promise(async (resolve, reject) => {

            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response)

                    }
                    else {
                        resolve({ status: false })

                    }
                })
            }
            else {
                resolve({ status: false })
            }
        })
    
    },
    deleteUser:(userId)=>{
        
        return new Promise(async(resolve,reject)=>{
          await  db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    },
    getUserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)}).then((userData)=>{
                resolve(userData);
            })
        })
    },

    updateUser:(userDetails)=>{
            
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION)
            .updateOne({_id:objectId(userDetails.id)},{
                $set:{
                    name:userDetails.name,
                    email:userDetails.email,
                    mobile:userDetails.mobile
                }
            }).then((response)=>{
                
                resolve()
             })
        })
    }



}



