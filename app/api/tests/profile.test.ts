import { GET, DELETE, PATCH } from "../profile/route";
import { NextRequest, NextResponse } from "next/server";
import { getUserWithAdressById } from "lib/database/user.database";

jest.mock("lib/database/user.database", () => ({
  getUserWithAdressById: jest.fn(),
}));

jest.mock("lib/auth", () => ({
  getSession: jest.fn(() => ({ user: { id: 123 } })),
}));

jest.mock("lib/database/profile.database", () => ({
  deleteProfileById: jest.fn(() => true),
}));

describe("api/profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user info with address when valid userId is provided", async () => {
    const userId = "24";
    const user = {
      id: 24,
      name: "hamza123",
      email: "hamza123333@webyourmind.com",
      phone: "null",
      team_id: 26,
      street: "123",
      city: "null",
      state: "null",
      postal_code: "null",
      country: "null",
    };
    // Create a mock Next.js request object with a userId
    const request = { url: `http://localhost:3000/api/profile?userId=${userId}` };
    const expectedResponse = NextResponse.json({
      message: "User info retrieved successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        teamId: user.team_id,
        address: {
          street: user.street,
          city: user.city,
          state: user.state,
          postalCode: user.postal_code,
          country: user.country,
        },
      },
    });

    (getUserWithAdressById as jest.Mock).mockResolvedValue(user);
    // Call the API route handler function
    const response = await GET(request as NextRequest);
    const apiResponseJson = await response.json();
    const expectedResponseJson = await expectedResponse.json();

    expect(response.status).toEqual(200);
    expect(apiResponseJson).toEqual(expectedResponseJson);
  });

  it("should return error response when no userId is provided", async () => {
    // Create a mock Next.js request object without a userId
    const request = { url: "http://localhost:3000/api/profile?userId=" };

    // Call the API route handler function
    const response = await GET(request as NextRequest);
    const apiJsonResponse = await response.json();
    console.log(apiJsonResponse);

    // Assert that the response contains the expected error message and status
    expect(apiJsonResponse).toEqual({
      error: "The user ID must be provided.",
    });
    expect(response.status).toEqual(400);
  });
});

describe("DELETE function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete profile and return success message", async () => {
    const request = { url: "http://localhost:3000/api/profile" }; // No userId included in the URL
    const expectedResponse = NextResponse.json({ message: "User and associated data deleted successfully." });

    // Mock getSession to return a user ID
    jest.spyOn(require("lib/auth"), "getSession").mockResolvedValueOnce({ user: { id: "24" } });

    // Mock deleteProfileById to return true (indicating successful deletion)
    jest.spyOn(require("lib/database/profile.database"), "deleteProfileById").mockResolvedValueOnce(true);

    // Call the DELETE function
    const response = await DELETE(request as NextRequest);
    const apiResponseJson = await response.json();
    const expectedResponseJson = await expectedResponse.json();

    // Assert that the response contains the expected message and status
    expect(response.status).toEqual(200);
    expect(apiResponseJson).toEqual(expectedResponseJson);
  });

  it("should return error response when no userId is provided", async () => {
    // Create a mock Next.js request object without a userId
    const request = { url: "http://localhost:3000/api/profile" };
    jest.spyOn(require("lib/auth"), "getSession").mockResolvedValueOnce({ user: { id: "" } });

    // Call the DELETE function
    const response = await DELETE(request as NextRequest);
    const apiJsonResponse = await response.json();

    // Assert that the response contains the expected error message and status
    expect(apiJsonResponse).toEqual({ error: "The user ID must be provided." });
    expect(response.status).toEqual(400);
  });
});
