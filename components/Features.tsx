import { MessageSquare, Mic, BookOpen, Brain, Zap, Globe } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Interactive Conversations",
      description: "Practice real conversations with our AI tutor that adapts to your learning pace and provides instant feedback.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mic,
      title: "Voice Recognition",
      description: "Perfect your pronunciation with advanced speech recognition technology that helps you sound like a native speaker.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BookOpen,
      title: "Personalized Learning",
      description: "Get customized lessons based on your skill level, learning style, and progress to maximize your learning efficiency.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Receive intelligent feedback and suggestions to improve your language skills faster with data-driven insights.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Zap,
      title: "Instant Translation",
      description: "Seamlessly translate between Telugu and English with context-aware translations that preserve meaning.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      title: "Cultural Context",
      description: "Learn not just the language but also cultural nuances and expressions for authentic communication.",
      gradient: "from-teal-500 to-blue-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Powerful Features</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Master Languages
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with proven learning methodologies 
            to help you achieve fluency faster than traditional methods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <span>Explore All Features</span>
            <Brain className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Features };