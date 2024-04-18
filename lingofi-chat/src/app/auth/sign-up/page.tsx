"use client"
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from 'axios';
import { PathFinder } from "@/components/PathFinderLoader";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [verify, setVerify] = useState<boolean>(false);
  const router = useRouter();
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = 'http://localhost:8080/api/users';
      const { data: res } = await axios.post(url, data);
      console.log('User created:', res);
      setLoading(true); // Start loading
      setTimeout(() => {
        setLoading(false); // Stop loading after 5 seconds
        router.push("/auth/verify"); // Redirect to dashboard after login
        // alert("Login successful");
      }, 5000);
    } catch (error: any) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setLoading(false);
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="w-full h-screen items-center justify-center flex py-12">
      {loading ? (
        <div>
          <PathFinder />
        </div>
      ) : (
        <form className="" onSubmit={handleSubmit}>
          <Card className="border-none shadow-none">
            <CardHeader className="text-center">
              <div>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 50 50"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlSpace="preserve"
                  style={{
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    strokeLinejoin: "round",
                    strokeMiterlimit: 2,
                  }}
                  className="w-20 h-20 mx-auto mb-6"
                >
                  <g transform="matrix(0.239703,0,0,0.239703,-26.037,-126.482)">
                    <g transform="matrix(288,0,0,288,328.533,730.956)" />
                    <text
                      x="95.917px"
                      y="730.956px"
                      style={{
                        fontFamily: "'Yarndings12-Regular', 'Yarndings 12'",
                        fontSize: 288,
                      }}
                    >
                      {"a"}
                    </text>
                  </g>
                </svg>
              </div>
              <CardTitle className="text-3xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Max"
                      required
                      value={data.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Robinson"
                      required
                      value={data.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={data.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={data.password}
                    onChange={handleChange}
                  />
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Loading" : "Create an account"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/sign-in">
                  <span className="underline">Sign in</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
