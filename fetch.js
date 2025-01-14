var fs = require("fs");
const https = require("https");
var process = require("process");
require("dotenv").config();

const REACT_APP_GITHUB_TOKEN=process.env.TOKEN
const GITHUB_USERNAME = process.env.USERNAME_GITHUB;

if (GITHUB_USERNAME === undefined) {
  throw "Github Username was found to be undefined. Please set an Environment variable.";
}

console.log(`fetching profile for fedecontegrand`);
var data = JSON.stringify({
  query: `
 {
   user(login:"fedecontegrand") { 
     name
     bio
     isHireable
     avatarUrl
     location
     pinnedItems(first: 6, types: [REPOSITORY]) {
       totalCount
       edges {
           node {
             ... on Repository {
               name
               description
               forkCount
               stargazers {
                 totalCount
               }
               url
               id
               diskUsage
               primaryLanguage {
                 name
                 color
               }
             }
           }
         }
       }
     }
 }
 `,
});
const default_options = {
  hostname: "api.github.com",
  path: "/graphql",
  port: 443,
  method: "POST",
  headers: {
    Authorization: `token ${REACT_APP_GITHUB_TOKEN}`,
    "User-Agent": "Node",
  },
};

const req = https.request(default_options, (res) => {
  let data = "";
  console.log(`statusCode: ${res.statusCode}`);
  if (res.statusCode != 200) {
    throw `Request went wrong`;
  }

  res.on("data", (d) => {
    data += d;
  });
  res.on("end", () => {
    fs.writeFile("./public/profile.json", data, function (err) {
      if (err) return console.log(err);
      console.log("saved file to public/profile.json");
    });
  });
});

req.on("error", (error) => {
  throw error;
});

req.write(data);
req.end();
