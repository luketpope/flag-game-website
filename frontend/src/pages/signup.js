import "../styles/globals.css";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <SignupForm />
    </div>
  );
}
