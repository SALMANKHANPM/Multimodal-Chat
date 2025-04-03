"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavbarLogo from "@/components/logos/NavBarLogo";

export default function SignupPage() {
  const heading = "Signup";
  const subheading = "Create a new account";
  const googleText = "Sign up with Google";
  const signupText = "Create an account";
  const loginText = "Already have an account?";
  const loginUrl = "/login";
  return (
    <section className="h-screen bg-muted">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border border-muted bg-white px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <NavbarLogo />
            </div>
            <h2 className="text-2xl font-semibold font-sans">
              Conversational AI
            </h2>

            <h1 className="text-3xl font-semibold">{heading}</h1>
            {subheading && (
              <p className="text-sm text-muted-foreground">{subheading}</p>
            )}
          </div>
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  className="bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  className="bg-white"
                />
              </div>
              <div className="flex flex-col gap-4">
                <Button type="submit" className="mt-2 w-full">
                  {signupText}
                </Button>
                <Button variant="outline" className="w-full">
                  {googleText}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{loginText}</p>
            <a
              href={loginUrl}
              className="font-medium text-primary hover:underline"
            >
              Login
            </a>
          </div>
          <Button
            onClick={() => (window.location.href = "/")}
            className="font-medium  hover:underline text-white bg-primary hover:bg-primary/90"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </section>
  );
}
