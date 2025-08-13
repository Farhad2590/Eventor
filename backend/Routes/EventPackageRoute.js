const express = require("express");
const router = express.Router();
const {
  createEventPackage,
  updateEventPackage,
  getEventPackages,
  getEventPackageById,
  togglePackageStatus,
  getPackageCategories,
  getPackagesByCreator,
  // getUser
} = require("../Controller/EventPackageController");

// const verifyFirebaseToken = require("../Middleware/firebaseAuth");

// Public routes
// router.get("/", getEventPackages);
router.get("/events", getEventPackages);
router.get("/categories", getPackageCategories);
router.get("/:id", getEventPackageById);

// Protected routes
// router.use(verifyFirebaseToken);

router.post("/", createEventPackage);
router.put("/:id", updateEventPackage);
router.patch("/:id/status", togglePackageStatus);
router.get("/creator/packages", getPackagesByCreator);

module.exports = router;