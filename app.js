const express = require("express")
const session = require("express-session")
const crypto = require("crypto")
const cookieParser = require("cookie-parser")
const fs = require("fs");
const path = require("path");
const app = express()
const artikel = require("./database/schemas/Artikel.js");
const hersteller = require("./database/schemas/Hersteller.js")
const kategorie = require("./database/schemas/Kategorie.js")
const kategorie_sub = require("./database/schemas/Kategorie_sub.js")
const {getManufacture, getAds} = require("./public/js/getAds.js")
//const getAds = require("./public/js/getAds.js")


app.use(cookieParser())
app.set("view engine", "ejs")
app.use(express.static("./public"))
app.use(session({secret: crypto.randomBytes(32).toString("base64"),
                saveUninitialized: false,
                resave: false,
                cookie: {maxAge: 1000 *60 *60}
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const cookieRouter = require("./router/cookies")
app.use("/cookies", cookieRouter)
const sucheRouter = require("./router/suche")
app.use("/suche", sucheRouter)
const topwrapper = require("./router/topwrapper")
app.use("/", topwrapper)
const adminpanelRouter = require("./router/adminpanel")
app.use("/adminpanel", adminpanelRouter)


const MongoDBClient = require("./database/Database.js");
const database = new MongoDBClient("mongodb://localhost:27017", "webshop")
database.connect()
const mongoose = require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/webshop')

app.get("/", async function (req, res){
        
    var hasCookie = req.cookies.hasSeenWindow
    var commercial_right = await getManufacture()
    var ad_files = await getAds()
    if(req.cookies.hasSeenWindow) {
        res.render("index", {hasCookie, commercial_right, ad_files, queryObjekt: "undefined"})
    } else {
        res.render("index", {hasCookie, commercial_right, ad_files, queryObjekt: "undefined"})
    }
    
})

/*
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
  */
/*
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
*/
app.listen(3000)