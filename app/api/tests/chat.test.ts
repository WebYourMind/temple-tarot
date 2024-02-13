import { GET } from "../chat/route";
import { NextRequest, NextResponse } from "next/server";
import { getChatMessagesByUserId } from "lib/database/chatMessages.database";

// Mock the getChatMessagesByUserId function
jest.mock("lib/database/chatMessages.database", () => ({
  getChatMessagesByUserId: jest.fn(),
}));

describe("GET function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if userId is not provided", async () => {
    // Mock the Next.js request object without a userId
    const request = { url: "http://localhost:3000/api/chat?userId=" };

    // Call the GET function
    const response = await GET(request as NextRequest);
    const apiResponseJson = await response.json();
    // Assert that the response contains the expected error message and status
    expect(apiResponseJson).toEqual({
      error: "The user ID must be provided.",
    });
    expect(response.status).toEqual(400);
  });

  it("should return an error if no chat messages found for given userId", async () => {
    // Mock the Next.js request object with a userId
    const request = { url: "http://localhost:3000?userId=1" };

    // Mock the getChatMessagesByUserId function to return null
    (getChatMessagesByUserId as jest.Mock).mockResolvedValue(null);

    // Call the GET function
    const response = await GET(request as NextRequest);

    const apiResponseJson = await response.json();
    // Assert that the response contains the expected error message and status
    expect(apiResponseJson).toEqual({
      error: "No chat found for the given user ID.",
    });
    expect(response.status).toEqual(404);
  });

  it("should return chat messages if found for given userId", async () => {
    // Mock the Next.js request object with a userId
    const request = { url: "http://localhost:3000?userId=1" };

    // Mock the chat messages
    const mockMessages = [
      {
        id: 1,
        user_id: 1,
        content: "Message 1",
        role: "user",
        created_at: "2024-02-02T15:00:00.000Z",
      },
      {
        id: 2,
        user_id: 1,
        content: "Message 2",
        role: "assistant",
        created_at: "2024-02-02T15:01:00.000Z",
      },
    ];

    // Mock the getChatMessagesByUserId function to return the mock messages
    (getChatMessagesByUserId as jest.Mock).mockResolvedValue(mockMessages);

    // Call the GET function
    const response = await GET(request as NextRequest);
    const apiResponseJson = await response.json();
    // Assert that the response contains the expected error message and status
    expect(apiResponseJson).toEqual({ message: "Chat retrieved successfully.", existingMessages: mockMessages });
    expect(response.status).toEqual(200);
  });

  it("should return an error if an error occurs during processing", async () => {
    // Mock the Next.js request object with a userId
    const request = { url: "http://localhost:3000?userId=1" };

    // Mock the getChatMessagesByUserId function to throw an error
    (getChatMessagesByUserId as jest.Mock).mockRejectedValue(new Error("Some error"));

    // Call the GET function
    const response = await GET(request as NextRequest);
    const apiResponseJson = await response.json();
    // Assert that the response contains the expected error message and status
    expect(apiResponseJson).toEqual({ error: "An error occurred while processing your request." });
    expect(response.status).toEqual(500);
  });
});
