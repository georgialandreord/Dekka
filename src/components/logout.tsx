import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/better-auth";

const Logout = () => {
  const handlelogout = async () => {
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/auth/login");
  };
  return (
    <form>
      <Button
        variant="default"
        className="mt-3 flex w-full cursor-pointer"
        onClick={handlelogout}
      >
        Logout
      </Button>
    </form>
  );
};

export default Logout;
