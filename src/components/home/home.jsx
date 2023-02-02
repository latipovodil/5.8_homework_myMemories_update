import {
  Avatar,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import React from "react";
import "../styleAll.scss";
import Slider from "@mui/material/Slider";
import { Link } from "react-router-dom";
import logo from "../imgs/logojon.svg";
import createLogo from "../imgs/creatememories.svg";
import editMemories from "../imgs/editmemories.svg";
import myPlaylist from "../imgs/myplaylist.svg";
import { Stack } from "@mui/system";
import KeyboardDoubleArrowLeft from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRight from "@mui/icons-material/KeyboardDoubleArrowRight";
import Pause from "@mui/icons-material/Pause";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import memoryImg from "../imgs/memory.jpg";
import like from "../imgs/like.svg";
import dontLike from "../imgs/don'tLike.svg";
import Close from "@mui/icons-material/Close";
import music from "../music/a.m4a";
import { AlertTitle } from "@mui/material";
import { Alert } from "@mui/material";

export const Home = () => {
  const userHomeKey = JSON.parse(localStorage.getItem("userHome"));
  if (userHomeKey?.user) {
  } else {
    window.location.href = window.location.origin + "/login";
  }

  React.useEffect(() => {
    const userToken = JSON.parse(localStorage.getItem("user"));

    fetch("https://api.mymemories.uz/api/v1/memories/all/", {
      method: "GET",
      headers: {
        Authorization: "Token " + userToken.token,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  const duration = 200;
  const [position, setPosition] = React.useState(2);
  const [pausa, setPausa] = React.useState(true);
  const musicPlay = React.useRef(null);

  const [createTheme, setCreateTheme] = React.useState(false);
  const [editTheme, setEditTheme] = React.useState(false);

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  const TinyText = styled(Typography)({
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: 0.2,
  });

  const textLength = (text, count = 15) => {
    if (text.length > count) {
      let str = "";
      for (let i = 0; i < text.length - 3; i++) {
        str += text[i];
      }
      return str + "...";
    } else {
      return text;
    }
  };

  function play() {
    setPausa(!pausa);
    if (musicPlay.current) {
      if (pausa) {
        musicPlay.current.play();
        setInterval(() => {
          if (position > musicPlay.current.currentTime + 1) {
            musicPlay.current.currentTime = position;
          }
          let seekPosition = Math.round(
            musicPlay.current.currentTime * (100 / musicPlay.current.duration)
          );
          setPosition(seekPosition);
        }, 1000);
      } else {
        musicPlay.current.pause();
      }
    }
  }

  const userToken = JSON.parse(localStorage.getItem("user"));
  const [img, setImg] = React.useState();

  const imgUpdate = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);

    fetch("https://api.mymemories.uz/api/v1/files/", {
      method: "POST",
      headers: {
        Authorization: "Token " + userToken.token,
        "Content-Type": file.type,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setImg([data.data.id, ...img]);
        }
      });
  };
  const [alert, setAlert] = React.useState(false);
  const [alertSuccess, setAlertSuccess] = React.useState(false);

  const createThemeFunc = (e) => {
    const desc = e.target[2].value;
    const title = e.target[0].value;
    e.preventDefault();
    fetch("https://api.mymemories.uz/api/v1/memories", {
      method: "POST",
      headers: {
        Authorization: "Token " + userToken.token,
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        title: title,
        desc: desc,
        media: JSON.stringify(img),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setAlert(true);
          setAlertSuccess(true);
        }
      });
  };

  return (
    <div className="home">
      <div className="alert">
        {alert ? (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            This is a success alert — <strong>check it out!</strong>
          </Alert>
        ) : (
          ""
        )}
      </div>

      <audio ref={musicPlay} src={music}></audio>
      {createTheme ? (
        <div className="createTheme">
          <div>
            <div
              style={{
                display: "flex",
                alignItmes: "center",
                justifyContent: "space-around",
              }}
            >
              <img src={createLogo} alt="sitelogoCreateMemory" />
              <Close onClick={() => setCreateTheme(false)} color="#12a7fb" />
            </div>
            <div>
              <form onSubmit={(e) => createThemeFunc(e)}>
                <div>
                  {" "}
                  <TextField
                    style={{ marginBottom: "50px", width: "450px" }}
                    required
                    type="text"
                    label="Enter title"
                    variant="standard"
                  />
                  <Edit color="#fff" style={{ marginLeft: "-20px" }} />
                </div>
                <div>
                  {" "}
                  <TextField
                    onChange={(e) => imgUpdate(e)}
                    style={{ marginBottom: "50px", width: "450px" }}
                    required
                    type="file"
                    label="Enter img"
                    variant="standard"
                  />
                  <Edit color="#fff" style={{ marginLeft: "-20px" }} />
                </div>
                <div>
                  {" "}
                  <TextField
                    style={{ marginBottom: "50px", width: "450px" }}
                    required
                    type="text"
                    label="Enter description"
                    variant="standard"
                  />
                  <Edit color="#fff" style={{ marginLeft: "-20px" }} />
                </div>
                <div>
                  {" "}
                  <Button
                    type="submit"
                    variant="outlined"
                    style={{
                      borderRadius: "25px",
                      marginTop: "37px",
                      padding: "13px 41px",
                      marginRight: "20px",
                    }}
                  >
                    CREATE
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCreateTheme(false)}
                    variant="outlined"
                    style={{
                      borderRadius: "25px",
                      borderColor: "#fff",
                      marginTop: "37px",
                      padding: "13px 41px",
                      color: "#fff",
                    }}
                  >
                    CANCEL
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {editTheme ? (
        <div className="createTheme">
          <div>
            <div
              style={{
                display: "flex",
                alignItmes: "center",
                justifyContent: "space-around",
              }}
            >
              <img
                style={{ marginRight: "20px" }}
                src={editMemories}
                alt="sitelogoEditMemory"
              />
              <img src={myPlaylist} alt="sitelogoPlaylist" />
              <Close onClick={() => setEditTheme(false)} color="#12a7fb" />
            </div>
            <div>
              <form onSubmit={(e) => createThemeFunc(e)}>
                <div>
                  {" "}
                  <TextField
                    style={{ marginBottom: "50px", width: "450px" }}
                    required
                    type="text"
                    label="Enter title"
                    variant="standard"
                  />
                  <Edit color="#fff" style={{ marginLeft: "-20px" }} />
                </div>
                <div>
                  {" "}
                  <TextField
                    style={{ marginBottom: "50px", width: "450px" }}
                    required
                    type="file"
                    label="Enter img"
                    variant="standard"
                  />
                  <Edit color="#fff" style={{ marginLeft: "-20px" }} />
                </div>
                <div>
                  {" "}
                  <TextField
                    style={{ marginBottom: "50px", width: "450px" }}
                    required
                    type="text"
                    label="Enter description"
                    variant="standard"
                  />
                  <Edit color="#fff" style={{ marginLeft: "-20px" }} />
                </div>
                <div>
                  {" "}
                  <Button
                    type="submit"
                    variant="outlined"
                    style={{
                      borderRadius: "25px",
                      marginTop: "37px",
                      padding: "13px 41px",
                      marginRight: "20px",
                    }}
                  >
                    CREATE
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEditTheme(false)}
                    variant="outlined"
                    style={{
                      borderRadius: "25px",
                      borderColor: "#fff",
                      marginTop: "37px",
                      padding: "13px 41px",
                      color: "#fff",
                    }}
                  >
                    CANCEL
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <Container
        style={{
          padding: "0",
          display: "flex",
          justifyContent: "space-between",
        }}
        maxWidth="1300px"
      >
        <div className="homeLeft">
          <div>
            <Link to="/">
              <img src={logo} alt="site logo" />
            </Link>
            <Button
              onClick={() => setCreateTheme(true)}
              style={{
                borderRadius: "25px",
                width: "230px",
                marginTop: "47px",
                marginBottom: "70px",
              }}
              variant="outlined"
            >
              CREATE THEME
            </Button>
            <Stack alignItems="flexStart" direction="column">
              <button className="likedMemories">Liked memorise</button>
              <button className="dontLikedMemories">Disliked memorise</button>
            </Stack>
          </div>

          <Stack
            style={{ backgroundColor: "#000", position: "relative" }}
            direction="row"
          >
            <Stack
              style={{
                position: "absolute",
                color: "#12A7FB",
                boxShadow:
                  " 0 0 4px #12A7FB, 0 0 4px #12A7FB, 0 0 4px rgba(0, 0, 0, 0.25)",
                backgroundColor: "#000",
                borderTopLeftRadius: "400px",
                padding: "10px",
                borderTopRightRadius: "400px",
                width: "120px",
                height: "45px",
                top: "-35%",
              }}
            >
              <KeyboardArrowDown
                fontSize="large"
                style={{ marginTop: "-10px", marginLeft: "43px" }}
              />
            </Stack>
            <ButtonGroup
              style={{
                alignItems: "center",
                marginTop: "-35px",
                marginBottom: "20px",
              }}
              size="large"
              aria-label="large button group"
            >
              <Button
                onClick={() => [
                  position > 4 ? setPosition(position - 5) : setPosition(0),
                ]}
                style={{
                  width: "80px",
                  borderTopLeftRadius: "20px",
                  borderBottomLeftRadius: "20px",
                  backgroundColor: "#000",
                  boxShadow:
                    " 0 0 4px #12A7FB, 0 0 4px #12A7FB, 0 0 4px rgba(0, 0, 0, 0.25)",
                  height: "41px",
                  marginRight: "-5px",
                }}
                key="one"
              >
                {" "}
                <KeyboardDoubleArrowLeft />
              </Button>

              <Button
                onClick={() => play()}
                style={{
                  backgroundColor: "#000",
                  boxShadow:
                    " 0 0 4px #12A7FB, 0 0 4px #12A7FB, 0 0 4px rgba(0, 0, 0, 0.25)",
                  borderRadius: "50%",
                  width: "91px",
                  height: "91px",
                  zIndex: "2",
                }}
                key="two"
              >
                {pausa ? (
                  <PlayArrow fontSize="large" />
                ) : (
                  <Pause fontSize="large" />
                )}{" "}
              </Button>

              <Button
                onClick={() => [
                  position < 191 ? setPosition(position + 5) : setPosition(0),
                ]}
                style={{
                  width: "80px",
                  borderTopRightRadius: "20px",
                  borderBottomRightRadius: "20px",
                  backgroundColor: "#000",
                  boxShadow:
                    " 0 0 4px #12A7FB, 0 0 4px #12A7FB, 0 0 4px rgba(0, 0, 0, 0.25)",
                  height: "41px",
                  marginLeft: "-5px",
                }}
                key="three"
              >
                {" "}
                <KeyboardDoubleArrowRight />
              </Button>
            </ButtonGroup>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: -2,
                width: "100%",
              }}
            >
              <TinyText style={{ color: "#fff" }}>
                {formatDuration(position)}
              </TinyText>
              <TinyText style={{ color: "#fff" }}>
                -{formatDuration(duration - position)}
              </TinyText>
            </Box>
            <Slider
              aria-label="time-indicator"
              size="small"
              value={position}
              min={0}
              step={1}
              max={duration}
              onChange={(_, value) => setPosition(value)}
            />
          </Stack>
        </div>
        <Stack direction="column" width="100%">
          <Stack
            padding="14px 50px"
            alignItems="center"
            direction="row"
            backgroundColor="rgba(48, 33, 33, 0.9)"
          >
            <TextField
              style={{ width: "415px" }}
              id="search"
              label="Write theme"
              variant="standard"
            />{" "}
            <Search style={{ marginLeft: "-30px" }} />
            <Button
              style={{
                borderRadius: "25px",
                width: "160px",
                marginLeft: "auto",
                height: "50px",
              }}
              variant="outlined"
            >
              LOGOUT
            </Button>
          </Stack>
          <Stack
            height="490px"
            overflow="hidden scroll"
            style={{ overflowY: "scroll" }}
            justifyContent="space-beetwen"
            flexWrap="wrap"
            direction="row"
            padding="20px"
            gap="20px"
          >
            <Stack
              direction="row"
              backgroundColor="rgba(54, 46, 46, 0.8)"
              borderRadius="30px"
              width="466px"
              overflow="hidden"
              padding="12px 0 9px 31px"
              position="relative"
            >
              <Stack>
                <IconButton>
                  <Avatar
                    style={{ height: "93px", width: "93px" }}
                    alt="memory"
                    src={memoryImg}
                  />
                </IconButton>
                <Stack direction="row">
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={like}
                    />
                  </IconButton>
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={dontLike}
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="column" padding="10px 30px 0 10px">
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "23px",
                    lineHeight: "28px",
                    color: "#FFFFFF",
                  }}
                  variant="h3"
                  gutterBottom
                >
                  {textLength("Yoshligimga qaytgim keladi")}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "6px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  {textLength(
                    "Urush boshlanadi. Charliz qurolli kuchlar majmuasiga xizmatga ketadi. Lekin jangda ishtirok...",
                    60
                  )}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "auto",
                    marginLeft: "auto",
                    marginRight: "30px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  "2023/01/30"
                </Typography>
              </Stack>
              <Stack>
                <div className="memoryEdit">
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Delete />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Edit />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Add />
                  </Avatar>
                </div>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              backgroundColor="rgba(54, 46, 46, 0.8)"
              borderRadius="30px"
              width="466px"
              overflow="hidden"
              padding="12px 0 9px 31px"
              position="relative"
            >
              <Stack>
                <IconButton>
                  <Avatar
                    style={{ height: "93px", width: "93px" }}
                    alt="memory"
                    src={memoryImg}
                  />
                </IconButton>
                <Stack direction="row">
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={like}
                    />
                  </IconButton>
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={dontLike}
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="row" flexWrap="wrap" padding="10px 10px 0 10px">
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "23px",
                    lineHeight: "28px",
                    color: "#FFFFFF",
                  }}
                  variant="h3"
                  gutterBottom
                >
                  {textLength("Yoshligimga qaytgim keladi")}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "6px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  {textLength(
                    "Urush boshlanadi. Charliz qurolli kuchlar majmuasiga xizmatga ketadi. Lekin jangda ishtirok...",
                    60
                  )}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "auto",
                    marginLeft: "auto",
                    marginRight: "30px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  "2023/01/30"
                </Typography>
              </Stack>
              <Stack>
                <div className="memoryEdit">
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Delete />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Edit />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Add />
                  </Avatar>
                </div>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              backgroundColor="rgba(54, 46, 46, 0.8)"
              borderRadius="30px"
              width="466px"
              overflow="hidden"
              padding="12px 0 9px 31px"
              position="relative"
            >
              <Stack>
                <IconButton>
                  <Avatar
                    style={{ height: "93px", width: "93px" }}
                    alt="memory"
                    src={memoryImg}
                  />
                </IconButton>
                <Stack direction="row">
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={like}
                    />
                  </IconButton>
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={dontLike}
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="column" padding="10px 30px 0 10px">
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "23px",
                    lineHeight: "28px",
                    color: "#FFFFFF",
                  }}
                  variant="h3"
                  gutterBottom
                >
                  {textLength("Yoshligimga qaytgim keladi")}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "6px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  {textLength(
                    "Urush boshlanadi. Charliz qurolli kuchlar majmuasiga xizmatga ketadi. Lekin jangda ishtirok...",
                    60
                  )}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "auto",
                    marginLeft: "auto",
                    marginRight: "30px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  "2023/01/30"
                </Typography>
              </Stack>
              <Stack>
                <div className="memoryEdit">
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Delete />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Edit />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Add />
                  </Avatar>
                </div>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              backgroundColor="rgba(54, 46, 46, 0.8)"
              borderRadius="30px"
              width="466px"
              overflow="hidden"
              padding="12px 0 9px 31px"
              position="relative"
            >
              <Stack>
                <IconButton>
                  <Avatar
                    style={{ height: "93px", width: "93px" }}
                    alt="memory"
                    src={memoryImg}
                  />
                </IconButton>
                <Stack direction="row">
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={like}
                    />
                  </IconButton>
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={dontLike}
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="column" padding="10px 30px 0 10px">
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "23px",
                    lineHeight: "28px",
                    color: "#FFFFFF",
                  }}
                  variant="h3"
                  gutterBottom
                >
                  {textLength("Yoshligimga qaytgim keladi")}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "6px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  {textLength(
                    "Urush boshlanadi. Charliz qurolli kuchlar majmuasiga xizmatga ketadi. Lekin jangda ishtirok...",
                    60
                  )}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "auto",
                    marginLeft: "auto",
                    marginRight: "30px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  "2023/01/30"
                </Typography>
              </Stack>
              <Stack>
                <div className="memoryEdit">
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Delete />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Edit />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Add />
                  </Avatar>
                </div>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              backgroundColor="rgba(54, 46, 46, 0.8)"
              borderRadius="30px"
              width="466px"
              overflow="hidden"
              padding="12px 0 9px 31px"
              position="relative"
            >
              <Stack>
                <IconButton>
                  <Avatar
                    style={{ height: "93px", width: "93px" }}
                    alt="memory"
                    src={memoryImg}
                  />
                </IconButton>
                <Stack direction="row">
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={like}
                    />
                  </IconButton>
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={dontLike}
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="column" padding="10px 30px 0 10px">
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "23px",
                    lineHeight: "28px",
                    color: "#FFFFFF",
                  }}
                  variant="h3"
                  gutterBottom
                >
                  {textLength("Yoshligimga qaytgim keladi")}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "6px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  {textLength(
                    "Urush boshlanadi. Charliz qurolli kuchlar majmuasiga xizmatga ketadi. Lekin jangda ishtirok...",
                    60
                  )}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "auto",
                    marginLeft: "auto",
                    marginRight: "30px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  "2023/01/30"
                </Typography>
              </Stack>
              <Stack>
                <div className="memoryEdit">
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Delete />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Edit />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Add />
                  </Avatar>
                </div>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              backgroundColor="rgba(54, 46, 46, 0.8)"
              borderRadius="30px"
              width="466px"
              overflow="hidden"
              padding="12px 0 9px 31px"
              position="relative"
            >
              <Stack>
                <IconButton>
                  <Avatar
                    style={{ height: "93px", width: "93px" }}
                    alt="memory"
                    src={memoryImg}
                  />
                </IconButton>
                <Stack direction="row">
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={like}
                    />
                  </IconButton>
                  <IconButton style={{ borderRadius: "0px" }}>
                    {" "}
                    <Avatar
                      style={{
                        objectFit: "none",
                        borderRadius: "0px",
                        width: "46px",
                      }}
                      alt="memory"
                      src={dontLike}
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="column" padding="10px 30px 0 10px">
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "23px",
                    lineHeight: "28px",
                    color: "#FFFFFF",
                  }}
                  variant="h3"
                  gutterBottom
                >
                  {textLength("Yoshligimga qaytgim keladi")}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "6px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  {textLength(
                    "Urush boshlanadi. Charliz qurolli kuchlar majmuasiga xizmatga ketadi. Lekin jangda ishtirok...",
                    60
                  )}
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "18px",
                    color: "#A7A7A7",
                    marginTop: "auto",
                    marginLeft: "auto",
                    marginRight: "30px",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  "2023/01/30"
                </Typography>
              </Stack>
              <Stack>
                <div className="memoryEdit">
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Delete />
                  </Avatar>
                  <Avatar
                    onClick={() => setEditTheme(true)}
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Edit />
                  </Avatar>
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #fff",
                      cursor: "pointer",
                    }}
                    variant="circular"
                  >
                    <Add />
                  </Avatar>
                </div>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
};
