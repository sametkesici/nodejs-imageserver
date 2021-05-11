const express = require("express");
const multer = require("multer");
const path = require("path");
const helpers = require("./helpers");
const axios = require("axios");
const { randomInt } = require("crypto");

const app = express();
const port = 5000;

var dir = path.join(__dirname, "uploads");

app.use(express.static(dir));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get("/", (req, res) => {
  res.json({ user: "samett" });
});

app.post("/upload", (req, res) => {
  let upload = multer({
    storage: storage,
    fileFilter: helpers.imageFilter,
  }).single("photo");

  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }

    let ip = "http://178.128.196.62:5000";
    let path = req.file.path.split("/")[1];

    let link = ip + "/" + path;
    console.log(link);

    let data = {
      url: link,
    };

    const postColab = async (data) => {
      try {
        const response = await axios.post(
          "http://5dec119d3f86.ngrok.io/",
          data
        );
        let datas = {
          predict: response.data.split("-")[0],
          base: response.data.split("-")[1],
        };
        console.log(datas);
        res.json({ response: datas });
      } catch {
        console.log("error11111");
      }
      //
    };

    //fonksiyonun calismasi için responsedan gelen stringin aşagıya gönderilmesi lazım
    //base64 u image e donustur ve kaydet
    //var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
    // require("fs").writeFile("parsedImage"+ randomInt(1, 200)+".png", base64Data, 'base64', function(err) {
    //   console.log(err);
    // });

    postColab(data);
  });
});
