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

router.post("/", (req, res) => {
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);

  const video = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    timestamp: Date.now(),
  };
  videos.push(video);

  const videosStringified = JSON.stringify(videos);
  fs.writeFileSync("./data/videos.json", videosStringified);

  res.status(201).send("New video successfully posted");
});

module.exports = router;
