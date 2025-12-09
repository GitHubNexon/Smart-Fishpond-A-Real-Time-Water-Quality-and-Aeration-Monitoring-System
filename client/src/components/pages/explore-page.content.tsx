'use client';

import React from 'react';
import {
  ArrowLeft,
  Droplets,
  Gauge,
  Waves,
  Thermometer,
  Activity,
  Zap,
  Bell,
  BarChart3,
} from 'lucide-react';

export default function ExplorePageContent() {
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
            <Activity className="h-4 w-4" />
            What We Do
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            What Does This
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-primary mt-2">
              System Do?
            </span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
            Smart Fishpond is an automated monitoring system that watches your
            water quality 24/7 and controls aeration to keep your fish healthy.
          </p>
        </div>

        {/* Main Features - Simple Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Monitors Water Quality */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-linear-to-r from-primary/20 to-emerald-500/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-primary/50 transition-all">
              <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Droplets className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Monitors Water Quality
              </h2>
              <p className="text-lg text-slate-300 mb-6">
                The system constantly checks 4 important water parameters to
                ensure optimal conditions for your fish.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>pH Level (acidity/alkalinity)</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Dissolved Oxygen (O₂ in water)</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Temperature (water heat)</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Turbidity (water clarity)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Aeration */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all">
              <div className="bg-cyan-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Controls Aeration</h2>
              <p className="text-lg text-slate-300 mb-6">
                When oxygen levels drop too low, the system automatically turns
                on the aerator to add oxygen to the water.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Automatic aerator activation</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Prevents fish from suffocating</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Saves electricity (only runs when needed)</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Manual control also available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sends Alerts */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-linear-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all">
              <div className="bg-orange-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Bell className="h-8 w-8 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Sends Alerts</h2>
              <p className="text-lg text-slate-300 mb-6">
                Get instant notifications when water conditions go outside safe
                ranges so you can take action quickly.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Real-time danger warnings</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>SMS or email notifications</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Custom alert thresholds</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Monitor from anywhere</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shows Data & History */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all">
              <div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Shows Data & History</h2>
              <p className="text-lg text-slate-300 mb-6">
                View current readings and see how your water quality has changed
                over time with charts and graphs.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Live dashboard with current values</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Historical trend charts</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Export data for reports</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Access from phone or computer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Simple Flow */}
        <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-700/50 mt-6">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Sensors Collect Data
              </h3>
              <p className="text-slate-400">
                Sensors in the water measure pH, oxygen, temperature, and
                turbidity every few seconds.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">System Analyzes</h3>
              <p className="text-slate-400">
                The microcontroller checks if readings are within safe ranges
                for your fish.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Takes Action</h3>
              <p className="text-slate-400">
                If needed, the system turns on aerators and sends you alerts via
                SMS or email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
