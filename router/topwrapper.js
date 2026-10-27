const express = require("express")
const router = express.Router()

router.use(express.urlencoded({ extended: true }));

router.get("/paypal", function(req, res){
    var hasCookie = req.cookies.hasSeenWindow
    res.render("topwrapper/paypal", {hasCookie})
})

router.get("/retoure", function (req,res){
    var hasCookie = req.cookies.hasSeenWindow
    res.render("topwrapper/retoure", {hasCookie})
})

router.get("/newsletter", function (req,res){
    var hasCookie = req.cookies.hasSeenWindow
    res.render("topwrapper/newsletter", {hasCookie})
})

router.get("/hilfe", function (req,res){
    var hasCookie = req.cookies.hasSeenWindow
    res.render("topwrapper/hilfe", {hasCookie})
})

module.exports = router