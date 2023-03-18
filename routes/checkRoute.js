const router = require("express").Router();

const {
  addCheck,
  getChecks,
  getSingleCheck,
  updateCheck,
  deleteCheck,
} = require("../controllers/checkController");

const auth = require("../middlewares/auth");

router.route("/").post(auth, addCheck).get(getChecks);

router.route("/:id").get(getSingleCheck).put(updateCheck).delete(deleteCheck);

module.exports = router;
