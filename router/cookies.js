const express = require("express")
const router = express.Router()

router.use(express.urlencoded({ extended: true }));

//router.get("/", function(req,res){
//    
//    res.render("partials/cookieWindow")
//})



router.post("/", function (req,res){
    if (req.body.action == "annehmen") {
        res.cookie("hasSeenWindow", "true", {maxAge: 1000 * 60 * 60 * 24 * 365});
        res.cookie("darkmode", "true", {maxAge: 1000 * 60 * 60 * 24 * 365})
        console.log(req.body.action)
        res.redirect(req.get('Referrer'))
    } else {
        res.redirect(req.get('Referrer'))
    }
})


module.exports = router