import React from "react";
import "../styleAll.scss";
import logo from "../imgs/logo.png";
import { Stack, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export const Signup = () => {
  const [value, setValue] = React.useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const newValue = {
    username: value.username,
    password: value.password
  }

  const submit = (e) => {
    e.preventDefault();

    fetch("https://api.mymemories.uz/api/v1/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(value),
    })
      .then((respon) => respon.json())
      .then((data) => {
        if (data.succes) {

          fetch("https://api.mymemories.uz/api/v1/login", {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify(newValue),
          })
            .then((respon) => respon.json())
            .then((userData) => {
              
              if (userData.success) {
                window.location.href = window.location.origin;
                localStorage.setItem(
                  "userHome",
                  JSON.stringify({ user: true })
                );
              }
              localStorage.setItem(
                "user",
                JSON.stringify({ token: userData.token, id: userData.data.id })
              );
            });
        }
      });
  };

  return (
    <div className="containerSignup">
      <div>
        <div className="signLeft">
          <div className="signLogoBox">
            <img src={logo} alt="siteLogo" />
          </div>
          <h1 className="signTitle">mymemories</h1>
          <p className="signText">
            No matter how much suffering you went through, you never wanted to
            let go of those memories.
          </p>
        </div>

        <div className="signRight">
          <h1 style={{ textAlign: "start" }} className="signTitle signTitle2">
            my<span>memories</span>
          </h1>
          <Stack marginTop="69px" flexDirection="row">
            <Link className="signLinklogin" to="/login">
              LOGIN
            </Link>
            <Link className="signLinklogin signLinklogin2" to="/signup">
              SIGNUP
            </Link>
          </Stack>

          <Stack flexDirection="row">
            <form onSubmit={submit}>
              <TextField
                onChange={(e) =>
                  setValue(value, (value.username = e.target.value))
                }
                autoFocus
                required
                autoComplete="none"
                aria-autocomplete="none"
                sx={{
                  maxWidth: "400px",
                  width: "400px",
                  marginTop: "20px",
                }}
                id="standard-basic"
                type="text"
                label="Enter your username"
                variant="standard"
              />
              <TextField
                onChange={(e) => setValue(value, (value.name = e.target.value))}
                required
                autoComplete="none"
                aria-autocomplete="none"
                sx={{
                  maxWidth: "400px",
                  width: "400px",
                  marginTop: "20px",
                }}
                id="standard-basic2"
                type="text"
                label="Enter your name"
                variant="standard"
              />
              <TextField
                onChange={(e) =>
                  setValue(value, (value.email = e.target.value))
                }
                required
                autoComplete="none"
                aria-autocomplete="none"
                sx={{
                  maxWidth: "400px",
                  width: "400px",
                  marginTop: "20px",
                }}
                id="standard-basic3"
                type="email"
                label="Enter your email"
                variant="standard"
              />
              <TextField
                onChange={(e) =>
                  setValue(value, (value.password = e.target.value))
                }
                required
                autoComplete="none"
                aria-autocomplete="none"
                sx={{
                  maxWidth: "400px",
                  width: "400px",
                  marginTop: "20px",
                }}
                id="standard-basic4"
                type="password"
                label="Enter your password"
                variant="standard"
              />
              <Stack direction="row" marginTop="50px" alignItems="center">
                <Button
                  style={{
                    borderRadius: "20px",
                    width: "140px",
                  }}
                  type="submit"
                  variant="outlined"
                >
                  SIGNUP
                </Button>
                <Link className="signUpasaccount" to="/login">
                  Have as account
                </Link>
              </Stack>
            </form>
          </Stack>
        </div>
      </div>
    </div>
  );
};
