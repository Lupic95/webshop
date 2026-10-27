const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/webshop')
const artikel = require("../database/schemas/Artikel.js");
const hersteller = require("../database/schemas/Hersteller.js")
const kategorie = require("../database/schemas/Kategorie.js")
const kategorie_sub = require("../database/schemas/Kategorie_sub.js");
const { randomInt } = require("crypto");


router.use(express.urlencoded({ extended: true }));

router.get("/artikel_anlegen", async function (req, res){
    var hersteller_list = await hersteller.find()
    var kategorie_list = await kategorie.find()
    var kategorien = []   

    var artikel_list = await artikel.find()

    kategorie_list.forEach((element)=>{
        var object = {name: element.name, sub_kategorie: []}
        for (var i = 0; i < element.sub_kategorie.attributes.length; i++){
            var new_object = {id: element.sub_kategorie.attributes[i]}
            object.sub_kategorie.push(new_object)
        }
        kategorien.push(object)
    })
    for (var i = 0; i < kategorien.length; i++) {
        for (var x = 0; x < kategorien[i].sub_kategorie.length; x++){
            var name = await kategorie_sub.findById(kategorien[i].sub_kategorie[x].id).select("name")
            console.log(name)
            if (name) {
                kategorien[i].sub_kategorie[x].name = name.name;
            }
            
        }
    }
    
    
    res.render("adminpanel/artikel_anlegen", {hersteller: hersteller_list, kategorien: kategorien, artikel: artikel_list})

})

router.post("/artikel_anlegen", async function(req, res){
       
    var new_artikel = {artikel_nummer: req.body.artikelnummer,
        kategorie: req.body.kategorie,
        hersteller: req.body.hersteller,
        bezeichnung: req.body.bezeichnung,
        beschreibung: req.body.beschreibung,
        bild: req.body.bild,
        netto_preis: req.body.netto_preis,
        technische_daten: {
            attributes: []
        }
    }//denkfehler !!!
    for (var i = 0; i < 20; i++) {
        if (!req.body["key" + i]){
            break
        }
        console.log(req.body["key" + i])
        var attributes = {key: req.body["key" + i], value_1: req.body["value_1" + i], value_2: req.body["value_2" + i]}
        new_artikel.technische_daten.attributes.push(attributes)
    }
    create_artikelnummer().then(result =>{
        new_artikel.artikel_nummer = result  
        artikel.insertOne(new_artikel)
        console.log(new_artikel)
    })

    res.redirect(req.get('Referrer'))
})

router.post("/artikel_loeschen", async function(req,res){
    console.log(req.query.key)
    await artikel.findByIdAndDelete(req.query.key)
    res.redirect(req.get('Referrer'))
})

router.get("/hersteller", async function(req,res){
    var hersteller_list = await hersteller.find()
    //console.log(hersteller_list)
    res.render("adminpanel/hersteller", {hersteller: hersteller_list})
})

router.post("/hersteller_anlegen", async function(req,res){
    console.log(req.body.input_hersteller)
    const entry = new hersteller({name: req.body.input_hersteller, img: "img/herstellerBilder/"  + req.body.input_hersteller_img})
    entry.save()
    res.redirect(req.get('Referrer'))
})

router.post("/hersteller_loeschen", async function(req,res){
    console.log(req.query.key)
    await hersteller.findByIdAndDelete(req.query.key)
    res.redirect(req.get('Referrer'))
})

router.get("/kategorie", async function(req, res){
    var kategorien_list = await kategorie.find()
    var sub_kategorie_list = await kategorie_sub.find()
    res.render("adminpanel/kategorien", {kategorien: kategorien_list, sub_kategorie: sub_kategorie_list})
   
})

router.post("/kategorie_anlegen", async function (req, res){
    const entry = new kategorie({name: req.body.hauptkategorie_input})
    console.log(entry)
    entry.save()
    res.redirect(req.get('Referrer'))
})

router.post("/kategorie_loeschen", async function (req, res){
    console.log(req.query.key)
    await kategorie.findByIdAndDelete(req.query.key)
    res.redirect(req.get('Referrer'))
})

router.post("/subkategorie_anlegen", async function(req, res){
    const entry = new kategorie_sub({name: req.body.sub_kategorie})
    entry.save()
    const refer_entry = await kategorie.findById(req.body.kategorie_refer)
    refer_entry.updateOne(refer_entry.sub_kategorie.attributes.push(entry.id))
    refer_entry.save()   
    res.redirect(req.get('Referrer'))
})

router.post("/kategorie_sub_loeschen", async function(req,res){
    console.log(req.query.key)  
    await kategorie_sub.findOneAndDelete(req.query.key)
    await kategorie.updateMany({},
        {$pull: 
            {
            "sub_kategorie.attributes": req.query.key
        }}
    )
    res.redirect(req.get('Referrer'))
})

async function create_artikelnummer() {
    var randomInt = Math.floor(Math.random() * 99999999999999)
    let result = await artikel.find({artikelnummer: randomInt})
    if (result.length > 0) {
       const next = await create_artikelnummer()
       return next;
    } else {
        return randomInt;
    }
}   



module.exports = router