import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <center>
      <section className="py-32 w-full h-full bg-whitesmoke">
        <div className="overflow-hidden pb-1 border-muted">
          <div className="container">
            <div className="mx-auto flex max-w-5xl  items-center justify-center">
              <div className="z-10 items-center text-center">
                <h1 className="mb-8 text-4xl font-semibold text-pretty lg:text-7xl">
                  Learn Telugu & English Faster!!
                </h1>
                <p className="mx-auto max-w-screen-md text-muted-foreground lg:text-xl">
                  Experience the best way to learn Telugu and English with our
                  AI-powered language learning platform.
                </p>
                <div className="mt-12 p-5 flex w-full flex-col justify-center gap-2 sm:flex-row">
                  <Button>
                    Get started now
                    <ChevronRight className="ml-2 h-4" />
                  </Button>
                  <Button variant="ghost">
                    Learn more
                    <ChevronRight className="ml-2 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <img
              src="https://shadcnblocks.com/images/block/placeholder-1.svg"
              alt="placeholder"
              className="mx-auto m-24 max-h-[700px] w-full max-w-7xl rounded-lg object-cover"
            />
          </div>
        </div>
      </section>
    </center>
  );
};

export { Hero };
