import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

type Invitee = {
  email: string;
  name: string;
};

type SendInvitesRequest = {
  invitees: Invitee[];
  inviteUrl: string;
  inviterName: string;
  teamName: string;
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { invitees, inviteUrl, inviterName, teamName } = (await req.json()) as SendInvitesRequest;

    for (const invitee of invitees) {
      const msg = {
        to: invitee.email,
        from: process.env.SENDGRID_EMAIL_ADDRESS,
        template_id: process.env.SENDGRID_INVITE_TEMPLATE_ID, // Set your SendGrid template ID for invites
        personalizations: [
          {
            to: { email: invitee.email },
            dynamic_template_data: {
              inviteUrl,
              teamName,
              inviterName,
              inviteeName: invitee.name,
            },
          },
        ],
      };

      await sgMail.send(msg as any);
    }

    return NextResponse.json({ message: "Invites sent successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error sending invites" }, { status: 500 });
  }
}
