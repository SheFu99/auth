import { createUserProfile } from "./actions/UserProfile";
import { currentUser } from "./lib/auth";
import { db } from "./lib/db";

jest.mock('./lib/db', () => ({
  profile: {
    create: jest.fn(),
  },
}));

jest.mock('./lib/auth', () => ({
  currentUser: jest.fn(),
}));

describe('createUserProfile', () => {
  it('creates a user profile successfully', async () => {
    // Mock currentUser to return a valid user id
    (currentUser as jest.Mock).mockReturnValue({ id: 'validUserId' });

    // Mock db.profile.create to simulate successful profile creation
    (db.profile.create as jest.Mock).mockResolvedValue({
      id: 'newProfileId',
      // include other profile fields as necessary
    });

    const values = {
      firstName: 'John',
      lastName: 'Doe',
      coverImage: 'http://example.com/image.png',
      gender: 'Male',
      age: "30",
      phoneNumber: '1234567890',
      regionCode: 'US',
      adres: '123 Main St',
      userId:'clujf70sp00002tfzoxee2kxx'
      // Include other fields as needed for your test
    };

    const result = await createUserProfile(values);

    expect(result).toHaveProperty('id', 'newProfileId');
    // Add more assertions as needed
  });

  // Add more tests for error cases, such as when currentUser is not logged in
});
