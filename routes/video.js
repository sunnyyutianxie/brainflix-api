const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

router.get("/", (req, res) => {
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);

  res.send(videos);
});

router.get("/:videoId", (req, res) => {
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);

  const videoId = req.params.videoId;

  const selectedVideo = videos.find((video) => video.id === videoId);

  if (selectedVideo) {
    res.send(selectedVideo);
  } else {
    res.status(404).send();
  }
});

const multer = require("multer");
// const upload = multer({ dest: "./public/images/" });

const storage = multer.diskStorage({
  destination: "./public/images/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + fileExtension);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), (req, res) => {
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);

  const video = {
    id: uuidv4(),
    title: req.body.title,
    channel: "Unknown Identity",
    // image: "http://localhost:8080/images/image0.jpeg",
    // image: req.body.image,
    // image: `http://localhost:8080/images/${req.file.filename}.jpeg`,
    image: req.file
      ? `http://localhost:8080/images/${req.file.filename}`
      : `http://localhost:8080/images/image0.jpeg`,

    description: req.body.description,
    views: 100,
    likes: 100,
    duration: "1:00",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [],
  };
  videos.push(video);

  // console.log(req.file.filename);
  // console.log(video);

  const videosStringified = JSON.stringify(videos);
  fs.writeFileSync("./data/videos.json", videosStringified);

  res.status(201).send("new video successfully posted");
});

router.post("/:videoId/comments", (req, res) => {
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);

  const videoId = req.params.videoId;

  const selectedVideo = videos.find((video) => video.id === videoId);

  const comment = {
    id: uuidv4(),
    name: "Unknown User",
    comment: req.body.comment,
    likes: 0,
    timestamp: Date.now(),
  };

  selectedVideo.comments.push(comment);

  const commentsStringified = JSON.stringify(videos);
  fs.writeFileSync("./data/videos.json", commentsStringified);

  res.status(201).send("new comment successfully posted");
});

router.delete("/:videoId/comments", (req, res) => {
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);

  const videoId = req.params.videoId;

  const selectedVideo = videos.find((video) => video.id === videoId);

  const selectedCommentIndex = selectedVideo.comments.findIndex(
    (comment) => comment.id == req.body.commentId
  );

  selectedVideo.comments.splice(selectedCommentIndex, 1);

  const commentsStringified = JSON.stringify(videos);
  fs.writeFileSync("./data/videos.json", commentsStringified);

  res.status(201).send("comment deleted");
});

router.put("/:videoId/likes", (req, res) => {
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);

  const videoId = req.params.videoId;

  const selectedVideo = videos.find((video) => video.id === videoId);

  if (typeof selectedVideo.likes == "string") {
    const numberWithoutCommas = parseInt(
      selectedVideo.likes.replace(/,/g, ""),
      10
    );
    const incrementedNumber = numberWithoutCommas + 1;
    const formattedNumber = incrementedNumber.toLocaleString();
    selectedVideo.likes = formattedNumber;
  } else {
    const numberWithoutCommas = selectedVideo.likes;
    const incrementedNumber = numberWithoutCommas + 1;
    const formattedNumber = incrementedNumber.toLocaleString();
    selectedVideo.likes = formattedNumber;
  }

  const commentsStringified = JSON.stringify(videos);
  fs.writeFileSync("./data/videos.json", commentsStringified);

  res.status(201).send("like added");
});

module.exports = router;
