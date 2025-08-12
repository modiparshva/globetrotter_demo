// app/test-scraper/page.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  IndianRupee, 
  Loader2,
  Mountain,
  Hotel,
  Bus,
  RefreshCw,
  ExternalLink,
  Calendar,
  TestTube,
  Globe,
  Zap
} from 'lucide-react';
import LiveActivityFinder from '@/components/LiveActivityFinder';

// Popular Indian cities for testing
const TEST_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Goa', 'Agra', 'Varanasi', 
  'Udaipur', 'Jodhpur', 'Mysore', 'Amritsar', 'Saputara', 'Hampi'
];

interface Activity {
  id: string;
  name: string;
  category: 'adventure' | 'accommodation' | 'transport' | 'sightseeing';
  subcategory: string;
  price: number;
  duration: string;
  description: string;
  imageUrl: string;
  sourceUrl: string;
  provider: string;
  rating: number;
  availability: boolean;
  location: string;
}

export default function TestScraperPage() {
  const [selectedCity, setSelectedCity] = useState<string>('Saputara');
  const [customCity, setCustomCity] = useState<string>('');
  const [showScraper, setShowScraper] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{
    lastTest: string;
    results: any;
    success: boolean;
  } | null>(null);
  const [quickTesting, setQuickTesting] = useState<boolean>(false);

  const handleActivitySelect = (activity: Activity) => {
    console.log('🎯 Selected activity:', activity);
    
    // Show a nice alert with activity details
    alert(`
🎉 Activity Selected!

📍 ${activity.name}
💰 Price: ₹${activity.price.toLocaleString()}
⏱️ Duration: ${activity.duration}
⭐ Rating: ${activity.rating}/5
🏷️ Category: ${activity.category}
🌐 Source: ${activity.provider}

This activity would be added to your trip!
    `.trim());

    // You can add more logic here like:
    // - Add to local storage
    // - Send to an API
    // - Update state
    console.log('Activity data:', {
      id: activity.id,
      name: activity.name,
      price: activity.price,
      category: activity.category,
      provider: activity.provider
    });
  };

  const handleQuickTest = async () => {
    setQuickTesting(true);
    const testCity = customCity || selectedCity;

    try {
      console.log(`🧪 Running quick test for ${testCity}`);
      
      const response = await fetch(`/api/scrape-activities?city=${encodeURIComponent(testCity)}`);
      const data = await response.json();
      
      setTestResults({
        lastTest: new Date().toLocaleTimeString(),
        results: data,
        success: data.success || false
      });

      console.log('Quick test results:', data);
    } catch (error) {
      console.error('Quick test failed:', error);
      setTestResults({
        lastTest: new Date().toLocaleTimeString(),
        results: { error: error?.message || error },
        success: false
      });
    } finally {
      setQuickTesting(false);
    }
  };

  const currentCity = customCity || selectedCity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <TestTube className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧪 Live Scraper Test Lab
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Test real-time data scraping for Indian heritage cities
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              <span>Multi-source scraping</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              <span>Live data</span>
            </div>
            <div className="flex items-center">
              <Mountain className="w-4 h-4 mr-1" />
              <span>Activities & Hotels</span>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-6">
              <CardTitle className="text-xl mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Test Configuration
              </CardTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Test City
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEST_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          📍 {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom City Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Enter Custom City
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Manali, Rishikesh"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Test Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                <Button 
                  onClick={handleQuickTest}
                  disabled={quickTesting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {quickTesting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  Quick API Test
                </Button>

                <Button 
                  onClick={() => setShowScraper(!showScraper)}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {showScraper ? 'Hide' : 'Show'} Full Scraper
                </Button>
              </div>

              {/* Current Selection Display */}
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Testing City:</div>
                <div className="font-semibold text-lg text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  {currentCity}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Test Results */}
        {testResults && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className={`border-2 ${testResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-4 flex items-center">
                  {testResults.success ? (
                    <div className="flex items-center text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Quick Test Results - Success
                    </div>
                  ) : (
                    <div className="flex items-center text-red-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Quick Test Results - Failed
                    </div>
                  )}
                  <Badge className="ml-2" variant="outline">
                    {testResults.lastTest}
                  </Badge>
                </CardTitle>
                
                {testResults.success ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-blue-600">
                          {testResults.results.quickResults?.adventures?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Adventures</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-green-600">
                          {testResults.results.quickResults?.hotels?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Hotels</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-purple-600">
                          ₹{testResults.results.quickResults?.summary?.avgPrice || 0}
                        </div>
                        <div className="text-sm text-gray-600">Avg Price</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-orange-600">
                          {testResults.results.quickResults?.summary?.scrapingTime || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Scrape Time</div>
                      </div>
                    </div>
                    
                    {/* Sample Results Preview */}
                    {testResults.results.quickResults?.adventures?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Sample Adventure Activities:</h4>
                        <div className="space-y-2">
                          {testResults.results.quickResults.adventures.slice(0, 3).map((activity: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                              <div>
                                <span className="font-medium">{activity.name}</span>
                                <span className="text-sm text-gray-600 ml-2">({activity.category})</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-bold text-green-600">₹{activity.price}</span>
                                <Badge className="ml-2" variant="outline">{activity.provider}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-700 bg-white p-4 rounded-lg border border-red-200">
                    <div className="font-medium mb-2">Error Details:</div>
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(testResults.results, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Full Scraper Component */}
        {showScraper && (
          <div className="max-w-7xl mx-auto">
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 mb-4">
              <CardContent className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <Mountain className="w-5 h-5 mr-2 text-purple-600" />
                  Full Scraper Test - {currentCity}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  This will demonstrate the complete scraping functionality with live data
                </p>
              </CardContent>
            </Card>
            
            <LiveActivityFinder 
              cityName={currentCity}
              onActivitySelect={handleActivitySelect}
            />
          </div>
        )}

        {/* Instructions */}
        {!showScraper && (
          <div className="max-w-4xl mx-auto">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  How to Test
                </CardTitle>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-100 text-blue-800">1</Badge>
                    <div>
                      <div className="font-medium">Select or Enter a City</div>
                      <div className="text-sm text-gray-600">Choose from dropdown or enter custom city name</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-100 text-blue-800">2</Badge>
                    <div>
                      <div className="font-medium">Run Quick API Test</div>
                      <div className="text-sm text-gray-600">Test basic API functionality and see sample results</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-100 text-blue-800">3</Badge>
                    <div>
                      <div className="font-medium">Try Full Scraper</div>
                      <div className="text-sm text-gray-600">Experience complete UI with live scraping, filtering, and selection</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-100 text-blue-800">4</Badge>
                    <div>
                      <div className="font-medium">Monitor Console</div>
                      <div className="text-sm text-gray-600">Check browser console (F12) for detailed scraping logs</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="text-yellow-600 mr-2">💡</div>
                    <div>
                      <div className="font-medium text-yellow-800">Pro Tips:</div>
                      <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                        <li>• Some cities may take 10-30 seconds to scrape</li>
                        <li>• If scraping fails, fallback data will be shown</li>
                        <li>• Try different cities to test various scenarios</li>
                        <li>• Budget filter works in real-time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Debug Info */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="border border-gray-100">
            <CardContent className="p-4">
              <details>
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  🔍 Debug Information (Click to expand)
                </summary>
                <div className="mt-3 text-xs text-gray-600 space-y-1">
                  <div>Current URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</div>
                  <div>Selected City: {selectedCity}</div>
                  <div>Custom City: {customCity}</div>
                  <div>Active City: {currentCity}</div>
                  <div>Scraper Visible: {showScraper ? 'Yes' : 'No'}</div>
                  <div>Last Test: {testResults?.lastTest || 'None'}</div>
                </div>
              </details>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
