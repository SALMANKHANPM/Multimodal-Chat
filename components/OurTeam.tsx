import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Card from "@/components/kokonutui/card";
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface TeamProps {
  heading?: string;
  subheading?: string;
  description?: string;
  members?: TeamMember[];
}

const OurTeam = ({
  heading = "Meet the Team",
  subheading = "Ideate. Collaborate. Create.",
  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.",
  members = [
    {
      id: "person-1",
      name: "Name",
      role: "Role",
      avatar: "https://shadcnblocks.com/images/block/avatar-1.webp",
    },
    {
      id: "person-2",
      name: "Name",
      role: "Role",
      avatar: "https://shadcnblocks.com/images/block/avatar-2.webp",
    },
    {
      id: "person-3",
      name: "Name",
      role: "Role",
      avatar: "https://shadcnblocks.com/images/block/avatar-3.webp",
    },
    {
      id: "person-4",
      name: "Name",
      role: "Role",
      avatar: "https://shadcnblocks.com/images/block/avatar-4.webp",
    },
  ],
}: TeamProps) => {
  return (
    <div className="flex items-center justify-center py-16">
      <section className="w-full max-w-7xl mx-auto px-4">
        <div className="container flex flex-col items-center text-center mb-12">
          <p className="font-medium text-muted-foreground md:max-w-4xl lg:text-xl">
            {subheading}
          </p>
          <h1 className="text-4xl font-semibold lg:text-6xl mt-2">
            {heading}
          </h1>
        </div>
        
        <div className="container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 place-items-center">
            {members.map((person) => (
              <Card 
                key={person.id}
                name={person.name} 
                role={person.role} 
                avatar={person.avatar} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { OurTeam };
