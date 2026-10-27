const express = require("express")
const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }));
const fs = require("fs");

const artikel = require("../database/schemas/Artikel.js");
const hersteller = require("../database/schemas/Hersteller.js")
const kategorie = require("../database/schemas/Kategorie.js")
const kategorie_sub = require("../database/schemas/Kategorie_sub.js")
const {getManufacture, getAds} = require("../public/js/getAds.js")

router.get("/", async function (req, res){
    var ergebnis = []
    if (req.query.key < 3) {
        return
    }




    if (req.query.key.length >= 3) {
        const queryObjekt = await artikel.find({
        $or: [
            {bezeichnung: { $regex: req.query.key, $options: "i" }},
            //{"hersteller.name": { $regex: req.query.key, $options: "i"}}
        ],
        

    }).populate(["hersteller", "kategorie"])
       //console.log(queryObjekt)
        res.send(queryObjekt)   
      //console.log(queryObjekt)
    } else if (req.query.key.length < 3) {
        res.send([])
    } else {

    }
        
})

router.get("/artikel", async function (req, res){
    var hasCookie = req.cookies.hasSeenWindow
    var commercial_right = await getManufacture()
    var ad_files = await getAds()
    console.log(req.originalUrl)
    //res.redirect("/suche/forward")
    res.render("artikel", {hasCookie, commercial_right, ad_files, queryObjekt: "undefined"})
})



module.exports = router