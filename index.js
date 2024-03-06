require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
const WEBHOOK_LOG_ENABLE = true;
const PARCEL_API_URL = "https://v2.parcelroblox.com";

async function log_webhook(status, data, productid, userid, userid_type) {
  let Embeds = [
    {
      title: "Payhip Whitelister",
      color: null,
      fields: [
        {
          name: "Status Code & Message",
          value: `${status} - ${data.message}`,
        },
        {
          name: "User Id Type",
          value: `${userid_type}`,
        },
        {
          name: "Product Id",
          value: `${productid}`,
        },
        {
          name: "User Id",
          value: `${userid}`,
        },
      ],
    },
  ];

  let WebhookUser = {
    username: "Payhip Purchase",
    content: null,
    embeds: Embeds,
    attachments: [],
  };

  axios({
    url: process.env.PARCEL_API_KEY,
    method: "POST",
    data: WebhookUser,
  })
    .then(() => {
      // ignore
    })
    .catch(() => {
      // ignore
    });
}

app.use(express.json());

app.post("/api/payhip/:productid/:userid/:userid_type", async (req, res) => {
  if (
    !req.params["productid"] &&
    !req.params["userid"] &&
    !req.params["userid_type"]
  ) {
  }

  const { productid, userid, userid_type } = req.params;

  axios({
    method: "POST",
    url: `${PARCEL_API_URL}/whitelist/assign`,
    data: {
      productid,
      userid,
      userid_type,
    },
  })
    .then(function (response) {
      if (response.status == 200) {
        if (WEBHOOK_LOG_ENABLE == true) {
          log_webhook(200, response.data, productid, userid, userid_type);
        }
        return res.status(200).json({ status: 200, message: "OK" });
      } else if (response.status == 400) {
        if (WEBHOOK_LOG_ENABLE == true) {
          log_webhook(400, response.data, productid, userid, userid_type);
        }
        return res.status(400).json({ status: 400, message: "Bad Request" });
      } else if (response.status == 401) {
        if (WEBHOOK_LOG_ENABLE == true) {
          log_webhook(401, response.data, productid, userid, userid_type);
        }
        return res.status(401).json({ status: 401, message: "Unauthorized" });
      } else if (response.status == 404) {
        if (WEBHOOK_LOG_ENABLE == true) {
          log_webhook(404, response.data, productid, userid, userid_type);
        }
        return res.status(404).json({ status: 404, message: "Not Found" });
      }
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "You can create a GitHub Issue and report screenshot of the error you gotten here."
      );
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    });
});
