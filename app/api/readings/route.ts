import { NextRequest, NextResponse } from "next/server";
import { addReadingWithCards, deleteReading } from "lib/database/readings.database";
import { CardInReading, getCardsByReadingId } from "lib/database/cardsInReadings.database";
import { getSession } from "lib/auth";
import { Reading } from "lib/database/readings.database";
import { sql } from "@vercel/postgres";
import {
  countTarotSessionsByUserId,
  deleteTarotSession,
  getTarotSessionById,
  getTarotSessionsByUserId,
} from "lib/database/tarotSessions.database";

// POST method to add a new reading and associated cards
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reading, cards } = (await request.json()) as { reading: Reading; cards: CardInReading[] };

    // Add reading and cards
    const newReading = await addReadingWithCards(reading, cards);
    return NextResponse.json({ message: "Reading added successfully", reading: newReading }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to add reading and cards" }, { status: 500 });
  }
}

// GET method to retrieve a reading by ID or all readings by user ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const readingId = searchParams.get("readingId");
  const userId = searchParams.get("userId");
  const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not specified
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page if not specified
  const userSessionId = (await getSession())?.user.id;

  try {
    if (readingId) {
      const tarotSession = await getTarotSessionById(readingId);
      if (!tarotSession) {
        return NextResponse.json({ error: "Reading not found" }, { status: 404 });
      }
      // @ts-ignore
      if (tarotSession.userId == userSessionId) {
        // const cards = await getCardsByReadingId(tarotSession.);
        return NextResponse.json(tarotSession, { status: 200 });
      } else {
        return NextResponse.json({ error: "You are not authorized to view this reading." }, { status: 401 });
      }
    } else if (userId) {
      if (userId == userSessionId) {
        // Fetch paginated readings and count total readings
        const [readings, total] = await Promise.all([
          getTarotSessionsByUserId(parseInt(userId), page, limit),
          countTarotSessionsByUserId(userId),
        ]);

        const totalPages = Math.ceil(total / limit); // Calculate the total number of pages

        if (!readings || readings.length === 0) {
          return NextResponse.json({ error: "No readings found for this user" }, { status: 404 });
        }
        return NextResponse.json({ readings, totalPages }, { status: 200 });
      } else {
        return NextResponse.json({ error: "You are not authorized to view these readings." }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Reading ID or User ID must be provided" }, { status: 400 });
    }
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "An error occurred while retrieving the reading(s)" }, { status: 500 });
  }
}

// DELETE method to remove a reading and its associated cards
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tarotSessionId } = (await request.json()) as { tarotSessionId: string };
    if (!tarotSessionId) {
      return NextResponse.json({ error: "Reading ID must be provided" }, { status: 400 });
    }

    // Start a transaction
    await sql`BEGIN`;

    // Delete cards associated with the reading
    // await deleteCardsByReadingId(readingId);

    // Delete the reading
    const deletionResult = await deleteTarotSession(tarotSessionId);
    if (!deletionResult) {
      await sql`ROLLBACK`;
      return NextResponse.json({ error: "Failed to delete reading" }, { status: 404 });
    }

    // Commit the transaction
    await sql`COMMIT`;

    return NextResponse.json({ message: "Reading and associated cards deleted successfully" }, { status: 200 });
  } catch (error) {
    await sql`ROLLBACK`;
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "An error occurred during the deletion process" }, { status: 500 });
  }
}
