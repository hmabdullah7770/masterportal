// seedUser.ts
import { connectDB } from './lib/dbconnect.ts';
import User from './models/MasterPortal.ts';

async function main() {
  await connectDB(); // connect to database

  // Check if user already exists
  const existingUser = await User.findOne({ email: 'john@example.com' });
  if (existingUser) {
    console.log('User already exists:', existingUser);
    return;
  }

  // Insert the user
  const newUser = await User.create({ name: 'John Doe', email: 'john@example.com' });
  console.log('Inserted user:', newUser);
}

main()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
