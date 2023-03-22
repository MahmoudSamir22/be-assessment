const router = require("express").Router();

router.get('/1', (req, res) => {
    setTimeout(() => {
        res.status(200).send({data: "Check 1"})
    }, 3000);
})

router.get('/2', (req, res) => {
    res.status(200).send({data: "Check 2"})
})

// router.get('/3', (req, res) => {
//     res.status(200).send({data: "Check 3"})
// })

router.get('/4', (req, res) => {
    res.status(200).send({data: "Check 4"})
})

module.exports = router;
