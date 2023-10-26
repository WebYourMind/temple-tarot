import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./login-form";

// Mocking fetch to avoid actual network requests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true, // response ok status
    json: () => Promise.resolve({ ok: true, token: "sample_token" }),
    headers: new Headers(),
    status: 200,
    statusText: "OK",
    redirected: false,
    type: "default",
    url: "",
    clone: jest.fn(),
    text: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    arrayBuffer: jest.fn(),
    bodyUsed: false,
  } as unknown as Response)
);

describe("LoginForm", () => {
  it("submits the login data", async () => {
    const { getByText, getByLabelText } = render(<LoginForm />);

    // Filling out the login form
    fireEvent.change(getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(getByLabelText("Password"), { target: { value: "password" } });

    // Submitting the form
    fireEvent.click(getByText("Submit"));

    // Waiting for the fetch call and assertion
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auth/signin", expect.any(Object));
    });
  });
});
