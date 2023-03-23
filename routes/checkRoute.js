const router = require("express").Router();

const {
  addCheck,
  getChecks,
  getSingleCheck,
  updateCheck,
  deleteCheck,
} = require("../controllers/checkController");

const {
  setOwnerFilter,
  setIdFilter,
  setTagsFilter,
} = require("../controllers/utilsController");

const {
  addCheckValidator,
  getSingleCheckValidator,
  deleteCheckValidator,
} = require("../utils/validators/checkValidator");

const auth = require("../middlewares/auth");

router.use(auth);

router
  .route("/")
  .post(addCheckValidator, addCheck)
  .get(setOwnerFilter, getChecks);

router.get("/getByTags", setOwnerFilter, setTagsFilter, getChecks);

router
  .route("/:id")
  .get(getSingleCheckValidator, setOwnerFilter, setIdFilter, getSingleCheck)
  .put(updateCheck)
  .delete(deleteCheckValidator, deleteCheck);

module.exports = router;
