import { useRouter } from "next/dist/client/router";
import { FC, useEffect } from "react";
import { auth } from "../components/firebase-app";

const SignOutPage: FC = () => {
  const { push } = useRouter();

  useEffect(() => {
    auth.signOut().then(() => {
      push("/");
    });
  }, []);

  return <></>;
}

export default SignOutPage;
