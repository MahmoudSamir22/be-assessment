const router = require("express").Router();

const {
  getReports,
  getSingleReport,
  deleteReport,
} = require("../controllers/reportController");
const {
  setIdFilter,
  setOwnerFilter,
} = require("../controllers/utilsController");

const auth = require("../middlewares/auth");

//Apply Auth middleware to all routes
router.use(auth);

router.get("/", setOwnerFilter, getReports);

router.route("/:id").get(setOwnerFilter, setIdFilter, getSingleReport);

router.route("/:id").delete(setOwnerFilter, setIdFilter, deleteReport);

module.exports = router;
