"use client"
import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PathFinder } from "@/components/PathFinderLoader";
import { useRouter } from "next/navigation";

interface LoginData {
    email: string;
    password: string;
}

export default function Login() {
    const [data, setData] = useState<LoginData>({ email: "", password: "" });
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Start loading
    
        try {
            const url = "http://localhost:8080/api/auth";
            const { data: res } = await axios.post(url, data);
    
            // Only set localStorage if window is defined (client-side)
            if (typeof window !== 'undefined') {
                localStorage.setItem("token", res.data);
                localStorage.setItem("email", data.email);
    
                const address = `http://localhost:8080/api/walletKey/blessinghove69@gmail.com`;
                const { data: walletKey } = await axios.get(address);
                console.log(walletKey.publicKey);
                localStorage.setItem("address", walletKey.publicKey);
            }
    
            setTimeout(() => {
                setLoading(false);
                router.push("/");
            }, 3000);
    
        } catch (error: any) {
            setLoading(false); // Stop loading immediately if there's an error
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };
    
    return (
        <div className="w-full lg:grid lg:max-h-screen lg:grid-cols-2 xl:max-h-screen">
            <div className="flex items-center justify-center py-12">
                {loading ? (
                    <div>
                        <PathFinder />
                    </div>
                ) : (
                    <form className="mx-auto grid w-[350px] gap-6" onSubmit={handleSubmit}>
                        <div className="grid gap-2 text-center">
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
                            <h1 className="text-3xl font-bold">Login</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your email below to login to your account
                            </p>
                        </div>
                        <div className="grid gap-4">
                            {/* Add loader here */}

                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        name="email"
                                        onChange={handleChange}
                                        value={data.email}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="ml-auto inline-block text-sm underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        onChange={handleChange}
                                        value={data.password}
                                        required />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full">
                                    {loading ? "Loading" : "Login"}
                                </Button>
                            </>

                        </div>
                        {error && <div>{error}</div>}
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/sign-up" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </form>
                )}
            </div>
            {/* Background image container */}
            <div
                style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1529245019870-59b249281fd3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
                className="hidden h-screen bg-muted lg:block dark:brightness-[0.2] dark:grayscale">
            </div>
        </div>
    );
}
