import { NextResponse } from "next/server";
import Parser from "rss-parser";

// The URL of the external RSS feed
const RSS_URL =
  "https://lyc-pascal-orsay.ac-versailles.fr/spip.php?page=backend";

export async function GET() {
  // Instantiate the RSS parser
  const parser = new Parser();

  try {
    // Fetch the RSS feed from the school's website
    // This happens on the server, so no CORS issues!
    const feed = await parser.parseURL(RSS_URL);

    // Send the parsed feed back to our client-side page as JSON
    return NextResponse.json(feed);
  } catch (error) {
    console.error("Failed to fetch RSS feed:", error);
    // If something goes wrong, send a server error response
    return new NextResponse("Error fetching RSS feed", { status: 500 });
  }
}
