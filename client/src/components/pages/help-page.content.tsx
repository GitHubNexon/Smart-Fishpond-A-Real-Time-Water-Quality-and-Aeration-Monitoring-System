'use client';
import React from 'react';
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Activity,
  Waves,
  Circle,
  AlertCircle,
} from 'lucide-react';

export default function HelpPageContent() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </a>

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30">
            <AlertCircle className="h-4 w-4" />
            How to Use
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Monitoring
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-primary mt-2">
              Modules Guide
            </span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
            Learn how to use and interpret data from each monitoring module to
            maintain optimal water conditions for your fishpond.
          </p>
        </div>

        {/* Monitoring Modules */}
        <div className="space-y-8">
          {/* Temperature Monitoring */}
          <div className="relative">
            <div className="absolute -inset-2 bg-linear-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-700/50">
              <div className="flex items-start gap-6">
                <div className="bg-linear-to-br from-orange-500/20 to-red-500/20 p-4 rounded-2xl shrink-0">
                  <Thermometer className="h-10 w-10 text-orange-400" />
                </div>
                <div className="grow">
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    Temperature Monitoring
                  </h2>
                  <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                    Monitors water temperature in real-time to ensure optimal
                    conditions for fish health and growth.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-primary text-primary" />
                        Optimal Range
                      </h3>
                      <p className="text-slate-400">
                        25°C - 30°C for most freshwater fish species
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-primary text-primary" />
                        Alert Threshold
                      </h3>
                      <p className="text-slate-400">
                        System alerts when temperature exceeds 32°C or drops
                        below 23°C
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-orange-500/10 border border-orange-500/30 rounded-xl p-5">
                    <h3 className="font-semibold text-lg mb-2 text-orange-300">
                      Usage Tips:
                    </h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>
                          Check temperature readings during morning and
                          afternoon for daily variations
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>
                          High temperatures reduce oxygen levels - monitor both
                          parameters together
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>
                          Sudden temperature changes can stress fish - ensure
                          gradual adjustments
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Turbidity Monitoring */}
          <div className="relative">
            <div className="absolute -inset-2 bg-linear-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-700/50">
              <div className="flex items-start gap-6">
                <div className="bg-linear-to-br from-amber-500/20 to-yellow-500/20 p-4 rounded-2xl shrink-0">
                  <Circle className="h-10 w-10 text-amber-400" />
                </div>
                <div className="grow">
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    Turbidity Monitoring
                  </h2>
                  <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                    Measures water clarity by detecting suspended particles that
                    affect light penetration and fish visibility.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-primary text-primary" />
                        Optimal Range
                      </h3>
                      <p className="text-slate-400">
                        20 - 50 NTU (Nephelometric Turbidity Units)
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-primary text-primary" />
                        Alert Threshold
                      </h3>
                      <p className="text-slate-400">
                        System alerts when turbidity exceeds 80 NTU or drops
                        below 10 NTU
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                    <h3 className="font-semibold text-lg mb-2 text-amber-300">
                      Usage Tips:
                    </h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>
                          High turbidity may indicate overfeeding or excessive
                          algae growth
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>
                          Very low turbidity means insufficient phytoplankton
                          for natural food chain
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>
                          Monitor after rain as runoff can increase turbidity
                          levels
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* pH Water Monitoring */}
          <div className="relative">
            <div className="absolute -inset-2 bg-linear-to-r from-primary/20 to-emerald-500/20 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-700/50">
              <div className="flex items-start gap-6">
                <div className="bg-linear-to-br from-primary/20 to-emerald-500/20 p-4 rounded-2xl shrink-0">
                  <Droplets className="h-10 w-10 text-primary" />
                </div>
                <div className="grow">
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    pH Water Monitoring
                  </h2>
                  <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                    Tracks the acidity or alkalinity of water, which is critical
                    for fish health, nutrient availability, and biological
                    processes.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-primary text-primary" />
                        Optimal Range
                      </h3>
                      <p className="text-slate-400">
                        6.5 - 8.5 pH for most aquaculture species
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-primary text-primary" />
                        Alert Threshold
                      </h3>
                      <p className="text-slate-400">
                        System alerts when pH drops below 6.0 or exceeds 9.0
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-primary/10 border border-primary/30 rounded-xl p-5">
                    <h3 className="font-semibold text-lg mb-2 text-primary">
                      Usage Tips:
                    </h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          pH levels naturally fluctuate throughout the day due
                          to photosynthesis
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Low pH can be corrected with agricultural lime, high
                          pH with organic matter
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Regular monitoring prevents stress and disease in fish
                          populations
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Water Level Monitoring */}
          <div className="relative">
            <div className="absolute -inset-2 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-700/50">
              <div className="flex items-start gap-6">
                <div className="bg-linear-to-br from-cyan-500/20 to-blue-500/20 p-4 rounded-2xl shrink-0">
                  <Waves className="h-10 w-10 text-cyan-400" />
                </div>
                <div className="grow">
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    Water Level Monitoring
                  </h2>
                  <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                    Continuously tracks water depth to prevent overflow or low
                    water conditions that affect fish stocking density and
                    aeration efficiency.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-primary text-primary" />
                        Optimal Range
                      </h3>
                      <p className="text-slate-400">
                        Maintain consistent depth based on pond design
                        (typically 1-2 meters)
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-primary text-primary" />
                        Alert Threshold
                      </h3>
                      <p className="text-slate-400">
                        System alerts when level drops 20% below normal or
                        reaches overflow point
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
                    <h3 className="font-semibold text-lg mb-2 text-cyan-300">
                      Usage Tips:
                    </h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>
                          Low water levels concentrate waste and reduce oxygen
                          availability
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>
                          Monitor during dry season to ensure adequate water
                          supply
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>
                          Sudden level changes may indicate leaks or drainage
                          issues
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Card */}
        <div className="mt-6 bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold mb-6">Quick Reference Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-3 pr-4 text-slate-300 font-semibold">
                    Parameter
                  </th>
                  <th className="pb-3 pr-4 text-slate-300 font-semibold">
                    Optimal Range
                  </th>
                  <th className="pb-3 text-slate-300 font-semibold">
                    Critical Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                <tr className="border-b border-slate-800">
                  <td className="py-4 pr-4">Temperature</td>
                  <td className="py-4 pr-4">25-30°C</td>
                  <td className="py-4">Increase aeration if {'>'} 32°C</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 pr-4">Turbidity</td>
                  <td className="py-4 pr-4">20-50 NTU</td>
                  <td className="py-4">Reduce feeding if {'>'} 80 NTU</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 pr-4">pH Level</td>
                  <td className="py-4 pr-4">6.5-8.5</td>
                  <td className="py-4">Add lime if {'<'} 6.0</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4">Water Level</td>
                  <td className="py-4 pr-4">Consistent depth</td>
                  <td className="py-4">Add water if drops {'>'} 20%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
