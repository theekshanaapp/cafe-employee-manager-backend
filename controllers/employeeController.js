const Employee = require('../models/Employee');
const Cafe = require('../models/Cafe');
const { v4: uuidv4 } = require('uuid');

// Get employees by cafe
exports.getEmployees = async (req, res) => {
  const cafeId = req.query.cafe; // Expecting the cafe ID in query

  try {
    const employees = cafeId 
      ? await Employee.find({ cafe: cafeId }).populate('cafe').exec()
      : await Employee.find().populate('cafe').exec();

    const employeeData = employees.map(emp => ({
      ...emp.toObject(),
      days_worked: Math.floor((new Date() - new Date(emp.start_date)) / (1000 * 60 * 60 * 24)),
      cafe: emp.cafe ? emp.cafe.name : '' // Add cafe name if populated
    }));

    employeeData.sort((a, b) => b.days_worked - a.days_worked);
    res.json(employeeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      res.json(employee);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
    const employee = new Employee({ ...req.body, id: uuidv4() });
    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.body._id, req.body, { new: true });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
