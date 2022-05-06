import React, { useContext } from "react";
import { AccountContext } from "./Account";
import Signup from "./Signup";
import Login from "./Login";

const Status = () => {
  const {
    logout,
    loggedIn,
    username,
    signup,
    setSignup,
    setConfirm,
    setMessage,
  } = useContext(AccountContext);

  return (
    <div>
      {loggedIn ? (
        <div>
          <p>Welcome {username}!</p>
          <div>
            <button onClick={logout}>Logout</button>
          </div>
          <p>Here’s how it works: </p>
          <div style={{ width: "75%", margin: "auto", fontSize: ".8em"}}>
          <p>
            You upload an image and the objects in the image get recognized. The
            picture and the labels are saved for about a week. There is a limit
            of 10 images per account so if it’s full just make your own account
            and try it out yourself!
          </p>
          <p>
            Watch this video for an explanation of the tech behind this site:
          </p>
          </div>
          <a
            href="https://www.youtube.com/watch?v=r74_s-Da8RM"
            style={{ color: "yellow" }}
          >
            https://www.youtube.com/watch?v=r74_s-Da8RM
          </a>
        </div>
      ) : (
        <div style={{ width: "75%", margin: "auto" }}>
          <h1>Looking to hire a hard working dev?</h1>

          <p>
            Look no further, because you’ve found the DevOps project of Steve
            Ballard.
          </p>
          <div style={{ fontSize: ".8em" }}>
            <p>
              This site is totally serverless and you can launch a full copy
              with just a few commands. Source code and launch instructions on
              my github page:
            </p>
          </div>

          <a
            href="https://github.com/iamsteveballard/DevOps-Project-V2"
            style={{ color: "yellow" }}
          >
            https://github.com/iamsteveballard/DevOps-Project-V2{" "}
          </a>
          <div style={{ fontSize: ".8em" }}>
            <p>
              Sign up for your own account or use this login (case sensitive):
              <br></br>
              Username: test <br></br>Password: testing
            </p>
          </div>
          {signup ? (
            <div>
              <Signup />
              <button
                onClick={() => {
                  setSignup(false);
                  setConfirm(false);
                  setMessage("");
                }}
              >
                Login
              </button>
            </div>
          ) : (
            <div>
              <Login />
              <button
                onClick={() => {
                  setSignup(true);
                  setMessage("");
                }}
              >
                Signup
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Status;
