const router = require("express").Router();

router.get('/1', (req, res) => {
    res.status(200).send({data: "Check 1"})
})

router.get('/2', (req, res) => {
    res.status(200).send({data: "Check 2"})
})

router.get('/3', (req, res) => {
    res.status(200).send({data: "Check 3"})
})

module.exports = router;
