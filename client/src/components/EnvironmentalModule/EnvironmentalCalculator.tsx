import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Droplets, Zap, Cloud, Car, Smartphone, ArrowRight } from 'lucide-react';

interface EnvironmentalCalculatorProps {
  onComplete: () => void;
}

// Research-based constants (per usage)
const USAGE_COSTS = {
  textQuery: {
    water: 5, // ml (drops)
    energy: 0.002, // kWh
    carbon: 0.001, // kg CO2
  },
  image: {
    water: 200, // ml (~1 cup)
    energy: 0.08, // kWh
    carbon: 0.04, // kg CO2
  },
  video: {
    water: 16000, // ml (45 bottles per minute, ~355ml per bottle)
    energy: 3.2, // kWh
    carbon: 1.6, // kg CO2
  }
};

// Conversion factors for relatable comparisons
const COMPARISONS = {
  waterBottle: 355, // ml per standard bottle
  drivingMiles: 0.4, // kg CO2 per mile
  phoneCharge: 0.012, // kWh per full phone charge
};

export default function EnvironmentalCalculator({ onComplete }: EnvironmentalCalculatorProps) {
  const [textQueries, setTextQueries] = useState<number>(0);
  const [images, setImages] = useState<number>(0);
  const [videos, setVideos] = useState<number>(0);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Calculate totals
  const totalWater =
    textQueries * USAGE_COSTS.textQuery.water +
    images * USAGE_COSTS.image.water +
    videos * USAGE_COSTS.video.water;

  const totalEnergy =
    textQueries * USAGE_COSTS.textQuery.energy +
    images * USAGE_COSTS.image.energy +
    videos * USAGE_COSTS.video.energy;

  const totalCarbon =
    textQueries * USAGE_COSTS.textQuery.carbon +
    images * USAGE_COSTS.image.carbon +
    videos * USAGE_COSTS.video.carbon;

  // Relatable comparisons
  const waterBottles = (totalWater / COMPARISONS.waterBottle).toFixed(1);
  const drivingMiles = (totalCarbon / COMPARISONS.drivingMiles).toFixed(1);
  const phoneCharges = (totalEnergy / COMPARISONS.phoneCharge).toFixed(1);

  const handleCalculate = () => {
    if (textQueries > 0 || images > 0 || videos > 0) {
      setHasCalculated(true);
    }
  };

  const handleReset = () => {
    setTextQueries(0);
    setImages(0);
    setVideos(0);
    setHasCalculated(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-blue-600" />
          Your Weekly AI Environmental Impact Calculator
        </CardTitle>
        <p className="text-gray-700 mt-2">
          Enter your typical weekly AI usage to see your environmental footprint
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Text Queries */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              ChatGPT / Text Queries
            </label>
            <p className="text-xs text-gray-600">
              How many questions per week?
            </p>
            <input
              type="number"
              min="0"
              max="500"
              value={textQueries || ''}
              onChange={(e) => setTextQueries(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
              placeholder="0"
            />
          </div>

          {/* AI Images */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              AI Images Generated
            </label>
            <p className="text-xs text-gray-600">
              How many images per week?
            </p>
            <input
              type="number"
              min="0"
              max="100"
              value={images || ''}
              onChange={(e) => setImages(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
              placeholder="0"
            />
          </div>

          {/* AI Videos */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              AI Videos (1 min each)
            </label>
            <p className="text-xs text-gray-600">
              How many 1-min videos per week?
            </p>
            <input
              type="number"
              min="0"
              max="20"
              value={videos || ''}
              onChange={(e) => setVideos(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
              placeholder="0"
            />
          </div>
        </div>

        {/* Calculate Button */}
        {!hasCalculated && (
          <Button
            onClick={handleCalculate}
            disabled={textQueries === 0 && images === 0 && videos === 0}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            Calculate My Impact
          </Button>
        )}

        {/* Results Section */}
        {hasCalculated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Your Weekly Environmental Footprint
            </h3>

            {/* Water Usage */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Droplets className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">Water Usage</h4>
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {waterBottles} bottles
                  </p>
                  <p className="text-sm text-gray-700">
                    That's {(totalWater / 1000).toFixed(2)} liters of fresh water used for cooling data centers
                  </p>
                </div>
              </div>
            </div>

            {/* Energy Usage */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Zap className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">Energy Usage</h4>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">
                    {phoneCharges} phone charges
                  </p>
                  <p className="text-sm text-gray-700">
                    Equivalent to {totalEnergy.toFixed(3)} kWh of electricity
                  </p>
                </div>
              </div>
            </div>

            {/* Carbon Emissions */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Cloud className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">Carbon Emissions</h4>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {totalCarbon.toFixed(2)} kg CO₂
                  </p>
                  <p className="text-sm text-gray-700">
                    Same as driving {drivingMiles} miles in a car
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison Card */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Car className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">Put It In Perspective</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Your weekly AI usage consumes <strong>{waterBottles}</strong> bottles of water</li>
                    <li>• That's enough energy to charge your phone <strong>{phoneCharges}</strong> times</li>
                    <li>• The carbon emissions equal driving <strong>{drivingMiles}</strong> miles</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Insight Box */}
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-900">
                <strong>💡 Remember:</strong> This is just <em>your</em> usage for <em>one week</em>.
                Multiply by millions of users globally, and you can see why AI's environmental impact matters!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Try Different Numbers
              </Button>
              <Button
                onClick={onComplete}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Continue Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Helper Text */}
        {!hasCalculated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Not sure?</strong> The average teen uses ChatGPT about 10-20 times per week,
              generates 2-5 AI images, and rarely creates videos. Try those numbers!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
