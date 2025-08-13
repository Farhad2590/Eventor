const EventPackage = require("../Models/EventPackage");

// const EventPackage = require("../Models/EventPackage");

const createEventPackage = async (req, res) => {
  try {
    const packageData = req.body;

    console.log("Creating new event package:", packageData);

    if (
      !packageData.package_name ||
      !packageData.category ||
      !packageData.price ||
      !packageData.cart_image
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPackage = new EventPackage({
      ...packageData,
      created_by: "admin", // or you can remove this field entirely
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    console.error("Error creating event package:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateEventPackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const updates = req.body;

    // Add updated_at timestamp
    updates.updated_at = new Date();

    const updatedPackage = await EventPackage.findByIdAndUpdate(
      packageId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ error: "Event package not found" });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error updating event package:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getEventPackageById = async (req, res) => {
  try {
    const packageId = req.params.id;
    const package = await EventPackage.findById(packageId);

    if (!package) {
      return res.status(404).json({ error: "Event package not found" });
    }

    res.status(200).json(package);
  } catch (error) {
    console.error("Error fetching event package:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const togglePackageStatus = async (req, res) => {
  try {
    const packageId = req.params.id;

    const existingPackage = await EventPackage.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ error: "Event package not found" });
    }

    const updatedPackage = await EventPackage.findByIdAndUpdate(
      packageId,
      { is_active: !existingPackage.is_active },
      { new: true }
    );

    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error toggling package status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPackageCategories = async (req, res) => {
  try {
    const categories = await EventPackage.distinct("category");
    // console.log(categories);
    
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching package categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPackagesByCreator = async (req, res) => {
  try {
    const userId = req.user._id;
    const packages = await EventPackage.find({ created_by: userId });
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages by creator:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEventPackages = async (req, res) => {
  try {
    const users = await EventPackage.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createEventPackage,
  updateEventPackage,
  getEventPackages,
  getEventPackageById,
  togglePackageStatus,
  getPackageCategories,
  getPackagesByCreator,
  // getUser,
};
