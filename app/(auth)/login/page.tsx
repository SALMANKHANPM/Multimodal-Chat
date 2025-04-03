"use client";

import NavbarLogo from "@/components/logos/NavBarLogo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const heading = "Login";
  const subheading = "Welcome back";
  const loginText = "Login";
  const googleText = "Login with Google";
  const signupText = "Don't have an account?";
  const signupUrl = "/signup";

  return (
    <section className="h-screen bg-muted">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border border-muted bg-white px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
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
                  placeholder="Enter your email"
                  required
                  className="bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="bg-white"
                />
              </div>
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-muted-foreground" />
                  <label
                    htmlFor="remember"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <Button type="submit" className="mt-2 w-full">
                  {loginText}
                </Button>
                <Button variant="outline" className="w-full">
                  {googleText}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{signupText}</p>
            <a
              href={signupUrl}
              className="font-medium text-primary hover:underline"
            >
              Sign up
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
