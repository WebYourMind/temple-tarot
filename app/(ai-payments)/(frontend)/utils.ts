export async function manageSubscription() {
  try {
    const response = await fetch("/api/stripe-credits/create-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create billing portal session");
    }

    const data = await response.json();
    if (response.ok) {
      // @ts-ignore
      window.location.href = data.url; // Redirect user to the Stripe portal
    } else {
      // @ts-ignore
      throw new Error(data.message || "Failed to initiate billing portal session");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
