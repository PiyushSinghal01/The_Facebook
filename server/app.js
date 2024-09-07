import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';


dotenv.config()

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("This is the Server Side of The Facebook");
})


app.get("/facebook/insights", async (req, res) => {
    const { pageId, pageAccessToken, since, until, period } = req.query;

    if(!pageId || !pageAccessToken)
    {
        return res.status(400).json({error: "missing pageid or token"})
    }

    try{
        const response = await fetch(`https://graph.facebook.com/v20.0/${pageId}/insights?access_token=${pageAccessToken}&metric=page_fan_adds_unique,page_post_engagements,page_impressions,page_actions_post_reactions_like_total&since=${since}&until=${until}&period=${period}`)
        const data = await response.json();

        if(response.ok)
        {
            res.json(data);
        }
        else{
            res.status(response.status).json(data);
        }
    }
    catch (error) {
        res.status(500).json({error:"error in fetching insights"});
    }
})

app.get("/facebook/pages", async (req, res) => {
    const { accessToken } = req.query;

    if(!accessToken)
    {
        return res.status(400).json({error: "missing access token"})
    }

    try {
        const response = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${accessToken}`)
        const data = await response.json();

        if(response.ok)
        {
            res.json(data);
        }
        else{
            res.status(response.status).json(data);
        }
        
    } 
    catch (error) {
        res.status(500).json({error: "error in fetching pages"});
    }

})

app.get("/facebook/login", async (req, res) => {
    const { accessToken } = req.query;

    if(!accessToken)
    {
        return res.status(400).json({error: "missing access token"})
    }

    try {
        const response = await fetch(`https://graph.facebook.com/v20.0/me?fields=id,name,picture&access_token=${accessToken}`)
        const data = await response.json();

        if(response.ok)
        {
            res.json(data);
        }
        else{
            res.status(response.status).json(data);
        }

    } 
    catch (error) {
        res.status(500).json({error: "error in fetching pages"});
    }

})


app.listen(PORT, () => {
    console.log("Server running on port", PORT);
})