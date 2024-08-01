const mongoose = require('mongoose');
const Cafe = require('../models/Cafe');
const Employee = require('../models/Employee');

const seedCafes = [
  { name: 'Cafe One', description: 'A cozy place', location: 'Location One', id: 'cafe1' },
  { name: 'Cafe Two', description: 'A trendy spot', location: 'Location Two', id: 'cafe2' }
];

const seedEmployees = [
  { name: 'John Doe', email_address: 'john.doe@example.com', phone_number: '91234567', gender: 'Male', cafe: '', start_date: new Date() },
  { name: 'Jane Smith', email_address: 'jane.smith@example.com', phone_number: '82345678', gender: 'Female', cafe: '', start_date: new Date() }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/cafe_employee_manager', { useNewUrlParser: true, useUnifiedTopology: true });

    await Cafe.deleteMany({});
    await Employee.deleteMany({});

    // Insert cafes
    const cafes = await Cafe.insertMany(seedCafes);

    // Update seedEmployees with actual ObjectIds
    seedEmployees[0].cafe = cafes[0]._id;
    seedEmployees[1].cafe = cafes[1]._id;

    await Employee.insertMany(seedEmployees);

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
