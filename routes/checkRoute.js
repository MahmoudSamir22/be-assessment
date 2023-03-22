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

router
  .route("/")
  .post(auth, addCheckValidator, addCheck)
  .get(auth, setOwnerFilter, getChecks);

router.get("/getByTags", auth, setOwnerFilter, setTagsFilter, getChecks);

router
  .route("/:id")
  .get(
    auth,
    getSingleCheckValidator,
    setOwnerFilter,
    setIdFilter,
    getSingleCheck
  )
  .put(auth, updateCheck)
  .delete(auth, deleteCheckValidator, deleteCheck);

module.exports = router;
