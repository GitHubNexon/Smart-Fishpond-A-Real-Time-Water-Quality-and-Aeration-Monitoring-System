'use client';
import React from 'react';
import {
  Fish,
  Cpu,
  Radio,
  Database,
  Shield,
  Zap,
  ArrowLeft,
} from 'lucide-react';

export default function AboutPageContent() {
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
            <Fish className="h-4 w-4" />
            About the System
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Smart Fishpond
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-400 to-primary mt-2">
              Monitoring System
            </span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
            An advanced IoT-based solution designed to revolutionize aquaculture
            management through real-time water quality monitoring and automated
            aeration control.
          </p>
        </div>

        {/* Mission Section */}
        <div className="relative mb-12 mt-2">
          <div className="absolute -inset-4 bg-linear-to-r from-primary/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-30"></div>
          <div className="relative bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-700/50">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              Our Mission
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              To empower aquaculture operations with real-time insights and
              automated controls that increase productivity, reduce losses, and
              promote sustainable fish farming practices. We believe in
              leveraging cutting-edge technology to make fish farming more
              efficient, profitable, and environmentally responsible.
            </p>
          </div>
        </div>

        {/* Technology Features Grid */}
        <div className="mb-12 mt-2">
          <h2 className="text-3xl font-bold mb-8">Technology Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                title: 'Microcontroller',
                desc: 'Arduino-based processing unit for real-time data collection and control',
                color:
                  'from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40',
              },
              {
                icon: Radio,
                title: 'Wireless Communication',
                desc: 'IoT connectivity for remote monitoring and cloud data transmission',
                color:
                  'from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40',
              },
              {
                icon: Database,
                title: 'Cloud Storage',
                desc: 'Secure data logging with historical trend analysis and reporting',
                color:
                  'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40',
              },
              {
                icon: Shield,
                title: 'High-Precision Sensors',
                desc: 'Calibrated sensors for pH, dissolved oxygen, temperature, and turbidity',
                color:
                  'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40',
              },
              {
                icon: Zap,
                title: 'Automated Control',
                desc: 'Smart aeration system that activates based on oxygen levels',
                color:
                  'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40',
              },
              {
                icon: Fish,
                title: 'Dashboard Interface',
                desc: 'User-friendly web and mobile interface for system management',
                color:
                  'from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`group bg-linear-to-br ${feature.color} backdrop-blur-sm border rounded-2xl p-6 transition-all hover:scale-105`}
              >
                <div className="bg-slate-800/50 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Benefits */}
        <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-700/50 mt-6">
          <h2 className="text-3xl font-bold mb-8">
            Why Choose Smart Fishpond?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Prevent Fish Mortality
                  </h3>
                  <p className="text-slate-400">
                    Early detection of dangerous water conditions prevents mass
                    fish die-offs and protects your investment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Increase Productivity
                  </h3>
                  <p className="text-slate-400">
                    Optimal water conditions lead to faster fish growth and
                    higher yields per harvest cycle.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Save Time & Labor
                  </h3>
                  <p className="text-slate-400">
                    Automated monitoring and control reduce the need for manual
                    water testing and aerator management.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Remote Monitoring
                  </h3>
                  <p className="text-slate-400">
                    Access your fishpond data from anywhere, anytime through web
                    or mobile applications.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Data-Driven Decisions
                  </h3>
                  <p className="text-slate-400">
                    Historical data and trend analysis help you make informed
                    management decisions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Energy Efficient
                  </h3>
                  <p className="text-slate-400">
                    Smart automation only runs aerators when needed, reducing
                    electricity costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
