"use client"
export default function LoginForm() {
    return (
        <div className="w-full flex flex-col h-screen items-center text-center justify-center py-12">
            <div className="w-[500px]">
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

                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Welcome to Lingofi!
                </h1>
                <p className="leading-7 text-sm font-semibold [&:not(:first-child)]:mt-6">
                    Thank you for joining us on this exciting journey to bring blockchain technology closer to home. To complete your registration and unlock all the features of Lingofi, please check your email to verify your account.
                    <br /><br />
                    If you don&apos;t see the email, be sure to check your spam or junk folder, or resend the verification email from your account settings. Once verified, you&apos;ll be all set to start exploring all that Lingofi has to offer!
                    <br /><br />
                    Welcome aboard, and thank you for choosing Lingofi!
                </p>
            </div>
        </div>
    );
}
