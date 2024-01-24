const express = require("express");
const app = express();
const express_file_upload = require("express-fileupload");
const http = require("http");
const cors = require("cors");

app.use(cors());

app.use(express.static("upload"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	express_file_upload({
		limits: { fileSize: 2 * 1024 * 1024 },
	}),
);

app.use("/medias", require("./router"));

http.createServer(app).listen(5000, () => {
	console.log("server run on port 5000");
});
