import { ChevronRight, Sparkles, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-float">
        <Sparkles className="w-8 h-8 text-white/30" />
      </div>
      <div className="absolute top-40 right-32 animate-float-delayed">
        <MessageCircle className="w-6 h-6 text-white/20" />
      </div>
      <div className="absolute bottom-20 left-16 animate-float">
        <Zap className="w-10 h-10 text-white/25" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Start Your Journey Today</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-white lg:text-6xl mb-6">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Language Skills?
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners who have already mastered Telugu and English with our AI-powered platform. 
            Start your free trial today and experience the future of language learning.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 mb-12">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link href="/dashboard/chat">
                Start Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300">
              Learn More
            </Button>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Free Trial</div>
                <div className="text-sm text-blue-100">No credit card required</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Instant Access</div>
                <div className="text-sm text-blue-100">Start learning immediately</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">AI-Powered</div>
                <div className="text-sm text-blue-100">Personalized learning experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CTA };