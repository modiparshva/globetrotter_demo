// app/api/scrape-activities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TravelDataScraper } from '@/lib/scrapper';

export async function POST(request: NextRequest) {
  try {
    const { 
      cityName, 
      includeHotels = true, 
      includeTransport = false,
      transportFrom,
      transportTo,
      checkin,
      checkout 
    } = await request.json();

    if (!cityName) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }

    console.log(`🎯 API: Scraping data for ${cityName}`);

    const scraper = new TravelDataScraper();
    const results = await scraper.scrapeAllData(cityName, {
      includeHotels,
      includeTransport,
      transportFrom,
      transportTo,
      checkin,
      checkout
    });

    return NextResponse.json({
      success: true,
      cityName,
      results,
      scrapedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to scrape travel data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET route for quick city data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityName = searchParams.get('city');
  
  if (!cityName) {
    return NextResponse.json(
      { error: 'City parameter is required' },
      { status: 400 }
    );
  }

  try {
    const scraper = new TravelDataScraper();
    const results = await scraper.scrapeAllData(cityName, {
      includeHotels: true,
      includeTransport: false
    });

    return NextResponse.json({
      success: true,
      cityName,
      quickResults: {
        adventures: results.adventures.data.slice(0, 5),
        hotels: results.hotels?.data.slice(0, 4) || [],
        summary: results.summary
      },
      scrapedAt: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch quick data' },
      { status: 500 }
    );
  }
}
