const router = require("express").Router();
const { StringToken } = require("../models/string");
require('dotenv').config();

router.get("/:StringToken", async (req, res) => {
    const token = req.params.StringToken;
    try {

        let stringToken = await StringToken.findOne({ token: token });
        if (!stringToken) {
            return res.status(404).send({ message: "Token doesn't exist" });
        }
        console.log(stringToken);
        const name = stringToken.fromName;
        const sentAssets = stringToken.sentAssets;
        const fromAddress = stringToken.fromAddress;

        res.send({ stringInfo: { name, sentAssets, fromAddress }});
    } catch (error) {
        console.error("Failed to retrieve token", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
