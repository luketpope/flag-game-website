import "../styles/globals.css";
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Flag Game!</h1>
        <p className="text-lg">Try to guess today’s flag!</p>
        <Link href="/login">
            Login
        </Link>
        <Link href="/signup">
            Sign Up
        </Link>
        <Link href="/game">
            Flag Game
        </Link>
    </div>
  );
}