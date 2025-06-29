import { Users, Award, Clock, Languages } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Learners",
      description: "Students actively learning with our AI"
    },
    {
      icon: Award,
      value: "95%",
      label: "Success Rate",
      description: "Students achieve their language goals"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "AI Availability",
      description: "Learn anytime, anywhere"
    },
    {
      icon: Languages,
      value: "2",
      label: "Languages",
      description: "Telugu and English supported"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl mb-4">
            Trusted by Thousands of Learners
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our growing community of successful language learners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Stats };