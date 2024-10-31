const express = require("express");
const router = express.Router();
const localStorage = require("localStorage");
const ApifyClient = require("apify-client");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hackr.db");

const api_key = "apify_api_eu4XsgE4F1wtcPv9FXeIoFiLFpofWc37V4nm";

router.post("/crawler", async (req, res) => {
  if (
    localStorage.getItem("userRole") === "admin" ||
    localStorage.getItem("userRole") === "hacker"
  ) {
    try {
      async function fetchApifyData() {
        const client = new ApifyClient.ApifyClient({ token: api_key });
        if (req.query.site === "instagram") {
          const actor = await client.actor("apify/instagram-scraper").call({
            addParentData: false,
            directUrls: [`https://www.instagram.com/${req.query.account}/`],
            enhanceUserSearchWithFacebookPage: false,
            isUserReelFeedURL: false,
            isUserTaggedFeedURL: false,
            resultsLimit: 10,
            resultsType: "posts",
            searchLimit: 1,
            searchType: "hashtag",
          });
          const data = client.dataset(actor.defaultDatasetId).listItems();
          return data;
        } else if (req.query.site === "tiktok") {
          const actor = await client
            .actor("clockworks/free-tiktok-scraper")
            .call({
              excludePinnedPosts: false,
              profiles: [req.query.account],
              resultsPerPage: 10,
              shouldDownloadCovers: false,
              shouldDownloadSlideshowImages: false,
              shouldDownloadSubtitles: false,
              shouldDownloadVideos: false,
              searchSection: "",
              maxProfilesPerQuery: 10,
            });
          const data = client.dataset(actor.defaultDatasetId).listItems();
          return data;
        } else if (req.query.site === "youtube") {
          const actor = await client.actor("streamers/youtube-scraper").call({
            downloadSubtitles: false,
            hasCC: false,
            hasLocation: false,
            hasSubtitles: false,
            is360: false,
            is3D: false,
            is4K: false,
            isBought: false,
            isHD: false,
            isHDR: false,
            isLive: false,
            isVR180: false,
            maxResultStreams: 0,
            maxResults: 5,
            maxResultsShorts: 5,
            preferAutoGeneratedSubtitles: false,
            saveSubsToKVS: false,
            searchKeywords: req.query.account,
          });
          const data = client.dataset(actor.defaultDatasetId).listItems();
          return data;
        } else {
          return "Site non crawlable";
        }
      }
      fetchApifyData()
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Erreur lors de la requête Apify: " + error });
        });

      const now = new Date();
      db.run(`
        INSERT INTO logs (user, action, date) VALUES
          ('${localStorage.getItem("username")}',
          'crawler : ${req.query.site}-${req.query.account}',
          '${now.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}')
      `);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors du crawler" });
    }
  } else {
    res.send("Vous n'êtes pas autorisé à utiliser cette fonctionnalité !");
  }
});

module.exports = router;
