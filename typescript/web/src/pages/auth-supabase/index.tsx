import React, { useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

import { Button } from "@chakra-ui/react";
import { Layout } from "../../components/layout";

const supabase = createClient(
  "https://zokyprbhquvvrleedkkk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjk1NzgzOCwiZXhwIjoxOTQyNTMzODM4fQ.tfr1M8tg6-ynD-qKkODRXX-do1qWNwQQUt1zQp8sFIc"
);

const AuthSupabase = () => {
  const signIn = useCallback(() => {
    const doSignIn = async () => {
      // Create a single supabase client for interacting with your database

      const { user, session, error } = await supabase.auth.signIn({
        provider: "google",
      });

      console.log("new user", user);
      console.log("new session", session);
      console.log("new error", error);
    };
    doSignIn();
  }, []);

  const session = supabase.auth.session();
  const user = supabase.auth.user();
  console.log("user", user);
  console.log("session", session);

  return (
    <>
      <Layout>
        <Button onClick={signIn}>Login Google</Button>
      </Layout>
    </>
  );
};

export default AuthSupabase;
