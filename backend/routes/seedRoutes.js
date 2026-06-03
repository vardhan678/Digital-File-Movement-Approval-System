const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const File = require('../models/File');

router.post('/run', asyncHandler(async (req, res) => {
  // Clear existing data
  await User.deleteMany({});
  await File.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin Officer',
    email: 'admin@digitalfile.com',
    password: 'Admin@123',
    role: 'admin',
    department: 'Administration',
  });

  // Create employee users
  const emp1 = await User.create({
    name: 'Ravi Kumar',
    email: 'ravi@digitalfile.com',
    password: 'Employee@123',
    role: 'employee',
    department: 'HR',
  });

  const emp2 = await User.create({
    name: 'Priya Sharma',
    email: 'priya@digitalfile.com',
    password: 'Employee@123',
    role: 'employee',
    department: 'Finance',
  });

  // Create sample files
  const files = [
    {
      title: 'Annual Leave Policy Update 2024',
      description: 'Request to update the annual leave policy to include 5 additional days for senior employees with more than 5 years of service.',
      department: 'HR',
      category: 'Policy',
      priority: 'High',
      status: 'Submitted',
      createdBy: emp1._id,
      approvalHistory: [{ action: 'submitted', actionBy: emp1._id, actionByName: emp1.name, remarks: 'Submitted for approval' }],
    },
    {
      title: 'IT Infrastructure Budget Proposal Q1',
      description: 'Proposal for upgrading the server infrastructure and purchasing new laptops for the engineering team to improve productivity.',
      department: 'IT',
      category: 'Proposal',
      priority: 'Urgent',
      status: 'Under Review',
      createdBy: emp1._id,
      approvalHistory: [
        { action: 'submitted', actionBy: emp1._id, actionByName: emp1.name, remarks: 'Submitted' },
        { action: 'under_review', actionBy: admin._id, actionByName: admin.name, remarks: 'Under review by admin' },
      ],
    },
    {
      title: 'Vendor Contract Renewal - Tech Supplies',
      description: 'Renewal of vendor contract with TechSupply Co. for office equipment and consumables for the next fiscal year.',
      department: 'Procurement',
      category: 'Contract',
      priority: 'Medium',
      status: 'Approved',
      createdBy: emp2._id,
      approvalHistory: [
        { action: 'submitted', actionBy: emp2._id, actionByName: emp2.name, remarks: 'Submitted' },
        { action: 'under_review', actionBy: admin._id, actionByName: admin.name, remarks: 'Reviewing' },
        { action: 'approved', actionBy: admin._id, actionByName: admin.name, remarks: 'Approved. Contract looks good.' },
      ],
    },
    {
      title: 'Q3 Financial Audit Report',
      description: 'Submission of the Q3 financial audit report for review and approval by the finance committee before board presentation.',
      department: 'Finance',
      category: 'Report',
      priority: 'High',
      status: 'Rejected',
      remarks: 'Missing supporting documents. Please attach balance sheet.',
      createdBy: emp2._id,
      approvalHistory: [
        { action: 'submitted', actionBy: emp2._id, actionByName: emp2.name, remarks: 'Submitted' },
        { action: 'rejected', actionBy: admin._id, actionByName: admin.name, remarks: 'Missing supporting documents. Please attach balance sheet.' },
      ],
    },
    {
      title: 'Employee Training Request - React.js Workshop',
      description: 'Request for sponsoring 10 employees to attend the advanced React.js workshop scheduled for next month at the tech center.',
      department: 'HR',
      category: 'Request',
      priority: 'Low',
      status: 'Returned',
      remarks: 'Please provide justification and list of employee names.',
      createdBy: emp1._id,
      approvalHistory: [
        { action: 'submitted', actionBy: emp1._id, actionByName: emp1.name, remarks: 'Submitted' },
        { action: 'returned', actionBy: admin._id, actionByName: admin.name, remarks: 'Please provide justification and list of employee names.' },
      ],
    },
  ];

  await File.insertMany(files);

  res.json({
    success: true,
    message: 'Database seeded successfully',
    data: {
      users: { admin: admin.email, employees: [emp1.email, emp2.email] },
      filesCreated: files.length,
      loginCredentials: {
        admin: { email: 'admin@digitalfile.com', password: 'Admin@123' },
        employee: { email: 'ravi@digitalfile.com', password: 'Employee@123' },
      },
    },
  });
}));

module.exports = router;
