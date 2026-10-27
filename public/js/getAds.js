const fs = require("fs");
const hersteller = require("../../database/schemas/Hersteller.js")

function getAds() {
    const directory = "./public/img/ads"
    var files_path = []
    return new Promise((resolve, reject)=>{
        fs.readdir(directory, (err, files)=>{
            if (err) reject(err)
            files.forEach((file)=>{
                var string = "./img/ads/" + file
                files_path.push(string)
            })
            resolve(files_path)
        })
        
    })
}

function getManufacture() {
  return new Promise((resolve, reject) => {
    var manufacture = hersteller.find()
    if (manufacture) {
        resolve(manufacture)
    } else {
        reject("Keine Hersteller gefunden")
    }
    
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
}

module.exports = {getManufacture, getAds}