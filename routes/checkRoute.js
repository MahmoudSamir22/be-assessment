const router = require("express").Router();

const {
  addCheck,
  getChecks,
  getSingleCheck,
  updateCheck,
  deleteCheck,
} = require("../controllers/checkController");

const {
  addCheckValidator,
  getSingleCheckValidator,
  deleteCheckValidator,
} = require("../utils/validators/checkValidator");

const auth = require("../middlewares/auth");

router.route("/").post(auth, addCheckValidator, addCheck).get(auth, getChecks);

router
  .route("/:id")
  .get(auth, getSingleCheckValidator, getSingleCheck)
  .put(auth, updateCheck)
  .delete(auth, deleteCheckValidator, deleteCheck);

module.exports = router;
