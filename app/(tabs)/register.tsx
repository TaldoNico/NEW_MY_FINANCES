// Redirect placeholder: avoid duplicate Register inside (tabs) group
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function TabsRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register");
  }, [router]);

  return null;
}
