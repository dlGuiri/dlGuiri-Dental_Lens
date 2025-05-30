print("Seeding the 'users' and 'scanrecords' collections...");

// Drop existing collections to avoid duplicates (optional, but useful for dev)
db.users.drop();
db.scanrecords.drop();

// Insert users
const userId1 = ObjectId();
const userId2 = ObjectId();

db.users.insertMany([
  {
    _id: userId1,
    oauthProvider: "google",
    oauthId: "google-123456",
    name: "Alice Doe",
    email: "alice@example.com",
    avatarUrl: "https://example.com/avatar1.jpg",
    teeth_status: "Good",
    scanRecords: [], // This will be populated below
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: userId2,
    oauthProvider: "github",
    oauthId: "github-789012",
    name: "Bob Smith",
    email: "bob@example.com",
    avatarUrl: "https://example.com/avatar2.jpg",
    teeth_status: "Needs Attention",
    scanRecords: [], // This will be populated below
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// Insert scan records and associate them with users
const scan1 = {
  user: userId1,
  date: new Date("2024-05-01"),
  notes: "Routine checkup. All good.",
  imageUrls: ["https://example.com/scan1.png"],
  result: "Healthy",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const scan2 = {
  user: userId2,
  date: new Date("2024-06-15"),
  notes: "Cavity found on molar.",
  imageUrls: ["https://example.com/scan2.png"],
  result: "Cavity Detected",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const scanInsertResult = db.scanrecords.insertMany([scan1, scan2]);

// Update the users to include their scan record IDs
db.users.updateOne(
  { _id: userId1 },
  { $set: { scanRecords: [scanInsertResult.insertedIds[0]] } }
);
db.users.updateOne(
  { _id: userId2 },
  { $set: { scanRecords: [scanInsertResult.insertedIds[1]] } }
);
