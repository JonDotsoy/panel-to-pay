import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useRouter } from "next/dist/client/router";
import { FC, useEffect } from "react";
import { useAuth } from "../components/auth.hook";
import { auth } from "../components/firebase-app";

const SignInPage: FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();

  useEffect(() => {
    if (!user) {
      const googleAuthProvider = new GoogleAuthProvider();
      getRedirectResult(auth)
        .then(async (result) => {
          if (result) {
            push("/")
          } else {
            signInWithRedirect(auth, googleAuthProvider)
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      <h1>Sign In</h1>
    </div>
  );
}

export default SignInPage;
