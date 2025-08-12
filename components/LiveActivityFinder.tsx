// components/LiveActivityFinder.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Calendar
} from 'lucide-react';

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

interface LiveActivityFinderProps {
  cityName: string;
  onActivitySelect?: (activity: Activity) => void;
}

export default function LiveActivityFinder({ cityName, onActivitySelect }: LiveActivityFinderProps) {
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<{
    adventures: Activity[];
    hotels: Activity[];
    transport: Activity[];
  }>({
    adventures: [],
    hotels: [],
    transport: []
  });
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [budget, setBudget] = useState<number>(5000);
  const [activeTab, setActiveTab] = useState('adventures');

  const scrapeActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scrape-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cityName,
          includeHotels: true,
          includeTransport: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setActivities({
          adventures: data.results.adventures.data || [],
          hotels: data.results.hotels?.data || [],
          transport: data.results.transport?.data || []
        });
        setLastUpdated(new Date().toLocaleTimeString());
        
        // Log success
        console.log('✅ Scraping successful:', {
          adventures: data.results.adventures.data.length,
          hotels: data.results.hotels?.data.length || 0,
          scrapingTime: data.results.summary.scrapingTime
        });
      } else {
        setError(data.error || 'No data received from scraping service');
      }

    } catch (err) {
      console.error('Scraping error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'adventure': return <Mountain className="w-4 h-4" />;
      case 'accommodation': return <Hotel className="w-4 h-4" />;
      case 'transport': return <Bus className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'adventure': return 'bg-green-100 text-green-800 border-green-300';
      case 'accommodation': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'transport': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filterByBudget = (activityList: Activity[]) => {
    return activityList.filter(activity => activity.price <= budget);
  };

  const ActivityCard = ({ activity }: { activity: Activity }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(activity.category)}>
              {getCategoryIcon(activity.category)}
              <span className="ml-1 capitalize">{activity.category}</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-sm">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              {activity.rating.toFixed(1)}
            </div>
            {activity.availability && (
              <Badge className="bg-green-500 text-white">Available</Badge>
            )}
          </div>
        </div>

        <CardTitle className="text-lg mb-2 line-clamp-2">{activity.name}</CardTitle>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {activity.duration}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {activity.location}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center font-bold text-lg text-green-600">
            <IndianRupee className="w-5 h-5 mr-1" />
            {activity.price.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            via {activity.provider}
          </div>
        </div>

        <div className="flex gap-2">
          {activity.sourceUrl !== '#' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(activity.sourceUrl, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View Source
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => onActivitySelect?.(activity)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Select This
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Live Activities in {cityName}
          </h2>
          <p className="text-gray-600">
            Real-time scraped data from multiple travel sources
          </p>
          {lastUpdated && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
        <Button 
          onClick={scrapeActivities}
          disabled={loading}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Scraping Live Data...' : 'Get Live Data'}
        </Button>
      </div>

      {/* Budget Filter */}
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💰 Maximum Budget per Activity
        </label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-48"
            min="0"
            step="100"
            placeholder="Enter budget"
          />
          <span className="text-sm text-gray-600">
            Showing activities under ₹{budget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Scraping Live Data...
          </h3>
          <p className="text-gray-600 mb-4">
            Fetching latest activities, hotels, and transport options for {cityName}
          </p>
          <div className="text-sm text-gray-500">
            This may take 10-30 seconds depending on data sources
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Scraping Failed
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={scrapeActivities} variant="outline" className="border-red-300 text-red-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (activities.adventures.length > 0 || activities.hotels.length > 0) && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="adventures" className="flex items-center gap-2">
              <Mountain className="w-4 h-4" />
              Adventures ({filterByBudget(activities.adventures).length})
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="w-4 h-4" />
              Hotels ({filterByBudget(activities.hotels).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adventures" className="mt-6">
            {filterByBudget(activities.adventures).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterByBudget(activities.adventures).map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No adventures found within ₹{budget.toLocaleString()} budget
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hotels" className="mt-6">
            {filterByBudget(activities.hotels).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterByBudget(activities.hotels).map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No hotels found within ₹{budget.toLocaleString()} budget
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {!loading && !error && activities.adventures.length === 0 && activities.hotels.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Ready to Find Activities
          </h3>
          <p className="text-gray-600 mb-6">
            Click "Get Live Data" to scrape real-time activities for {cityName}
          </p>
          <Button onClick={scrapeActivities} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Search className="w-5 h-5 mr-2" />
            Start Scraping
          </Button>
        </div>
      )}
    </div>
  );
}
