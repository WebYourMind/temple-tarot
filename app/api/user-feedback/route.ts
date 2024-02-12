import sendgrid from "@sendgrid/mail";
import { capitalizeFirstLetter } from "lib/utils";
import { NextRequest, NextResponse } from "next/server";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      feedback,
      sentiment,
      feedbackData: { type, subject },
    } = (await request.json()) as any;

    const message = {
      to: "ibis-feedback@webyourmind.com",
      from: process.env.SENDGRID_EMAIL_ADDRESS as string, // Verified SendGrid sender email
      subject: `${capitalizeFirstLetter(sentiment)} Feedback from ${email}`,
      text: `Sentiment: ${sentiment}\nFeedback: ${feedback}\n\n${type ? type : ""}\n${subject ? subject : ""}`,
      html: `<strong>Sentiment:</strong> ${sentiment}<br><strong>Feedback:</strong> ${feedback}<br><br>${
        type ? type : ""
      }<br>${subject ? subject : ""}`,
    };

    await sendgrid.send(message);
    return NextResponse.json({ message: "Feedback sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending feedback:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}
