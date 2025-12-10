import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen justify-center items-center pb-50">
      <SignIn />
    </div>
  );
}
