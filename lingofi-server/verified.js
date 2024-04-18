const mongoose = require('mongoose');
const { User } = require('./models/user');

async function getVerifiedUsers() {
  try {
    // Fetching all users where verified is true
    const verifiedUsers = await User.findOne({ email: "blessinghove69@gmail.com" });

    console.log(verifiedUsers); // Output the verified users
    return verifiedUsers;
  } catch (error) {
    console.error('Error fetching verified users:', error.message);
  } finally {
    // Optional: disconnect from MongoDB if no further operations are needed
    mongoose.disconnect();
  }
}

getVerifiedUsers();
