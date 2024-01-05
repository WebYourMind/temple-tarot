import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { verifyTeamToken } from "../../../lib/database/team.database";
import { updateUserTeam } from "../../../lib/database/user.database";

type Invitee = {
  email: string;
  name: string;
};

type SendInvitesRequest = {
  invitees: Invitee[];
  inviteUrl: string;
  inviterName: string;
  inviteMessage: string;
  teamName: string;
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { invitees, inviteUrl, inviterName, teamName, inviteMessage } = (await req.json()) as SendInvitesRequest;

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
              inviteMessage,
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // Check if token is not null or undefined
  if (!token) {
    return NextResponse.json({ error: "The Token must be provided." }, { status: 400 });
  }

  const verifiedTeam = await verifyTeamToken(token);

  if (verifiedTeam !== null) {
    return NextResponse.json(
      {
        message: "Team retrieved successfully.",
        data: verifiedTeam,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const { token, teamId, userId } = (await request.json()) as any;

  // Check if token is not null or undefined
  if (!token) {
    return NextResponse.json({ error: "The Token must be provided." }, { status: 400 });
  }

  const verifiedTeam = await verifyTeamToken(token);

  if (verifiedTeam !== null) {
    const rows = await updateUserTeam(userId, teamId);

    if (rows !== null) {
      return NextResponse.json(
        {
          message: "Joined team successfully.",
          data: rows,
        },
        {
          status: 200,
        }
      );
    }
  }
  return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });
}
