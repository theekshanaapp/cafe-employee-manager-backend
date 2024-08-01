// const Cafe = require('../models/Cafe');
// const Employee = require('../models/Employee');
// const { v4: uuidv4 } = require('uuid');

// // Get cafes by location
// exports.getCafes = async (req, res) => {
//     const location = req.query.location;
//     try {
//         let cafes;
//         if (location) {
//             cafes = await Cafe.find({ location }).exec();
//         } else {
//             cafes = await Cafe.find().exec();
//         }
//         const cafeData = await Promise.all(cafes.map(async cafe => {
//             const employeeCount = await Employee.countDocuments({ cafe: cafe._id });
//             return { ...cafe.toObject(), employees: employeeCount };
//         }));
//         cafeData.sort((a, b) => b.employees - a.employees);
//         res.json(cafeData);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Create a new cafe
// exports.createCafe = async (req, res) => {
//     const cafe = new Cafe({ ...req.body, id: uuidv4() });
//     try {
//         const newCafe = await cafe.save();
//         res.status(201).json(newCafe);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// // Update a cafe
// exports.updateCafe = async (req, res) => {
//     try {
//         const cafe = await Cafe.findByIdAndUpdate(req.body._id, req.body, { new: true });
//         if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
//         res.json(cafe);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// // Delete a cafe
// exports.deleteCafe = async (req, res) => {
//     try {
//         const cafe = await Cafe.findById(req.params.id);
//         if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
//         await Cafe.findByIdAndDelete(req.params.id);
//         await Employee.deleteMany({ cafe: cafe._id });
//         res.json({ message: 'Cafe deleted' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Cafe = require('../models/Cafe');
const Employee = require('../models/Employee');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this path exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb('Error: Images only!');
  }
});

// Get cafes by location
exports.getCafes = async (req, res) => {
  const location = req.query.location;
  try {
    let cafes;
    if (location) {
      cafes = await Cafe.find({ location }).exec();
    } else {
      cafes = await Cafe.find().exec();
    }
    const cafeData = await Promise.all(cafes.map(async cafe => {
      const employeeCount = await Employee.countDocuments({ cafe: cafe._id });
      return { ...cafe.toObject(), employees: employeeCount };
    }));
    cafeData.sort((a, b) => b.employees - a.employees);
    res.json(cafeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCafeById = async (req, res) => {
  const { id } = req.params;
  try {
      const cafe = await Cafe.findById(id).exec();
      if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

      // Count the number of employees for this cafe
      const employeeCount = await Employee.countDocuments({ cafe: cafe._id });

      // Return the cafe data with employee count
      res.json({ ...cafe.toObject(), employees: employeeCount });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Create a new cafe
exports.createCafe = [
  upload.single('logo'), // Handle file upload for 'logo'
  async (req, res) => {
    const { name, description, location } = req.body;
    const logo = req.file ? req.file.path : ''; // Retrieve the file path if it exists

    const cafe = new Cafe({
      name,
      description,
      location,
      logo,
      id: uuidv4()
    });

    try {
      const newCafe = await cafe.save();
      res.status(201).json(newCafe);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

// Update a cafe
exports.updateCafe = [
  upload.single('logo'), // Handle file upload for 'logo'
  async (req, res) => {
    const { _id, name, description, location } = req.body;
    const logo = req.file ? req.file.path : undefined; // Retrieve the file path if it exists

    const updateData = {
      name,
      description,
      location
    };

    if (logo) updateData.logo = logo; // Only update logo if it's provided

    try {
      const cafe = await Cafe.findByIdAndUpdate(_id, updateData, { new: true });
      if (!cafe) return res.status(404).json({ message: 'Cafe not found' });
      res.json(cafe);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

// Delete a cafe
exports.deleteCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    // Delete the cafe
    await Cafe.findByIdAndDelete(req.params.id);

    // Delete the associated logo file if it exists
    if (cafe.logo) {
      const filePath = path.join(__dirname, '..', cafe.logo);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete logo file:', err);
      });
    }

    // Delete employees associated with the cafe
    await Employee.deleteMany({ cafe: cafe._id });
    res.json({ message: 'Cafe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

