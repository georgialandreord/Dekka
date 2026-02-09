import { redirect } from "next/navigation";
import Login from "~/components/login";
import { getSession } from "~/server/better-auth/server";

export default async function Page() {
  const session = await getSession();

  // If user is already logged in, redirect to dashboard
  if (session) {
    return redirect("/dashboard/folders");
  }

  return (
    <>
      <Login />
    </>
  );
}
