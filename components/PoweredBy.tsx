"use client";
import React from "react";

interface Logo {
  name: string;
  logo: string;
  className: string;
}

interface LogosProps {
  title?: string;
  subtitle?: string;
  logos?: Logo[];
}

const PoweredBy = ({
  title = "Built with Free and OpenSource Software..",
  subtitle = "Free and OpenSource Software for all",
  logos = [
    {
      name: "NextJS",
      logo: "https://cdn.freelogovectors.net/wp-content/uploads/2023/09/next-js-logo-freelogovectors.net_.png",
      className: "h-22 w-auto",
    },
    {
      name: "TailwindCSS",
      logo: "https://shadcnblocks.com/images/block/logos/tailwind-wordmark.svg",
      className: "h-9 w-auto",
    },
    {
      name: "FastAPI",
      logo: "data:image/png;base64,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",
      className: "h-22 w-auto",

    },
    {
      name: "Shadcn UI",
      logo: "data:image/png;base64,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",
      className: "h-11 w-auto",
    },
    {
      name: "SeamlessM4t",
      logo: "https://miro.medium.com/v2/resize:fit:1400/1*9T8MUW2WW7wTMmPObVMoNQ.jpeg",
      className: "h-9 w-auto",
    },
    {
      name: "Supabase",
      logo: "https://shadcnblocks.com/images/block/logos/supabase-wordmark.svg",
      className: "h-9 w-auto",
    },
    {
      name: "Huggingface.co",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Hf-logo-with-title.svg",
      className: "h-11 w-auto",
    },
    {

      name: "Meta OpenSource",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMleIFMnoSJ07JG9SIlmAXrVl6S4lsuyUs-w&s",
      className: "h-22 w-auto",
    },
    {
      name: "Google Gemma3 ",
      logo: "https://ollama.com/assets/library/gemma3/b54bf767-f9c5-4284-b551-a49aebe3a3c2",
      className: "h-11 w-auto",
    },
    {
      name: "UnSlothAI",
      logo: "https://miro.medium.com/v2/resize:fit:898/0*WsJVuFrX9Wf_u6SE.png",
      className: "h-11 w-auto",
    },
    {
      name: "Pytorch",
      logo: "https://pypi-camo.freetls.fastly.net/ed3839e1c11e779b508097969affa63d0968692b/68747470733a2f2f6769746875622e636f6d2f7079746f7263682f7079746f7263682f7261772f6d61696e2f646f63732f736f757263652f5f7374617469632f696d672f7079746f7263682d6c6f676f2d6461726b2e706e67",
      className: "h-11 w-auto",
    }
  ],
}: LogosProps) => {
  return (
    <section className="flex items-center justify-center py-20">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <p className="font-medium text-muted-foreground md:max-w-4xl lg:text-xl">
            {subtitle}
          </p>
          <h1 className="flex items-center justify-center text-4xl font-semibold lg:max-w-3xl lg:text-6xl lg:text-nowrap">
            {title}
          </h1>
          <div className="mt-8 py-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 lg:gap-12">
            {logos.map((logo, index) => (
              <img
                key={index}
                src={logo.logo}
                alt={`${logo.name} logo`}
                width={109 * 2}
                height={48 * 2}
                className={logo.className}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { PoweredBy };
