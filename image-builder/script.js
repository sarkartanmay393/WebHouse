const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const { exec } = require("child_process");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const PROJECT_NAME = process.env.PROJECT_NAME;
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

function runScript() {
  console.log("Script is running");

  const outputDir = path.join(__dirname, "output");
  const buildCommand = `cd ${outputDir} && npm install && npm run build`;
  const process = exec(buildCommand);

  process.stdout.on("data", (data) => {
    console.log(data);
  });

  process.stdout.on("error", (err) => {
    console.error(err);
  });

  process.on("close", async (code) => {
    console.log("Build successful");

    const distDir = path.join(__dirname, "output/dist");
    const distDirContents = fs.readdirSync(distDir, { recursive: true });

    for (const file of distDirContents) {
      const filePath = path.join(distDir, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;

      console.log(`Uploading ${filePath}`);
      const command = new PutObjectCommand({
        Bucket: "webhouse-bucket",
        Key: `__build/${PROJECT_NAME}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });

      await s3Client.send(command);
    }

    console.log("Done uploading files to S3");
  });
}

runScript();
