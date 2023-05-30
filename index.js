const express = require("express");
const app = express();
const port = 8080;
const videosRoutes = require("./routes/video");
const cors = require("cors");

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.use("/videos", videosRoutes);

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
