import { ChevronRight, Play, Sparkles, Globe, MessageCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 animate-float">
          <Globe className="w-8 h-8 text-blue-400/60" />
        </div>
        <div className="absolute top-40 right-32 animate-float-delayed">
          <MessageCircle className="w-6 h-6 text-purple-400/60" />
        </div>
        <div className="absolute bottom-40 left-16 animate-float">
          <Brain className="w-10 h-10 text-indigo-400/60" />
        </div>
        <div className="absolute bottom-20 right-20 animate-float-delayed">
          <Sparkles className="w-7 h-7 text-pink-400/60" />
        </div>
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">AI-Powered Language Learning</span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 lg:text-7xl">
            Master{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Telugu & English
            </span>{" "}
            with AI
          </h1>

          {/* Subheading */}
          <p className="max-w-3xl mx-auto mb-10 text-xl text-gray-600 lg:text-2xl leading-relaxed">
            Experience the future of language learning with our intelligent conversational AI. 
            Practice speaking, improve comprehension, and achieve fluency faster than ever before.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link href="/dashboard/chat">
                Start Learning Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-blue-50 transition-all duration-300">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 mt-16 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 lg:text-4xl">10K+</div>
              <div className="text-sm text-gray-600 lg:text-base">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 lg:text-4xl">95%</div>
              <div className="text-sm text-gray-600 lg:text-base">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 lg:text-4xl">24/7</div>
              <div className="text-sm text-gray-600 lg:text-base">AI Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 lg:text-4xl">2</div>
              <div className="text-sm text-gray-600 lg:text-base">Languages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export { Hero };