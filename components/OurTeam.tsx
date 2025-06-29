import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Card from "@/components/kokonutui/card";
import { Github, Linkedin, Twitter } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

interface TeamProps {
  heading?: string;
  subheading?: string;
  description?: string;
  members?: TeamMember[];
}

const OurTeam = ({
  heading = "Meet Our Team",
  subheading = "The minds behind the innovation",
  description = "Our diverse team of AI researchers, language experts, and developers are passionate about making language learning accessible to everyone.",
  members = [
    {
      id: "person-1",
      name: "Dr. Sarah Chen",
      role: "AI Research Lead",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      bio: "PhD in Natural Language Processing with 10+ years in AI research",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: "person-2",
      name: "Rajesh Patel",
      role: "Language Expert",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Linguist specializing in Telugu and English language acquisition",
      social: {
        github: "#",
        linkedin: "#"
      }
    },
    {
      id: "person-3",
      name: "Emily Rodriguez",
      role: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "UX designer focused on creating intuitive learning experiences",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: "person-4",
      name: "Michael Kim",
      role: "Full Stack Developer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Senior developer with expertise in AI integration and scalable systems",
      social: {
        github: "#",
        linkedin: "#"
      }
    },
  ],
}: TeamProps) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-sm font-medium text-gray-700">{subheading}</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl mb-6">
            {heading}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 place-items-center">
          {members.map((person) => (
            <div key={person.id} className="group relative">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{person.name}</h3>
                  <p className="text-blue-200 font-medium mb-2">{person.role}</p>
                  {person.bio && (
                    <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {person.bio}
                    </p>
                  )}
                  
                  {/* Social Links */}
                  {person.social && (
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {person.social.github && (
                        <a href={person.social.github} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {person.social.linkedin && (
                        <a href={person.social.linkedin} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {person.social.twitter && (
                        <a href={person.social.twitter} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
            <h3 className="text-2xl font-bold text-gray-900">Join Our Team</h3>
            <p className="text-gray-600 max-w-md">
              We're always looking for talented individuals who share our passion for education and technology.
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              View Open Positions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { OurTeam };