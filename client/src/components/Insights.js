import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Insights = ({access_token, pageId}) => {

  const accessToken = access_token;
  // console.log(accessToken);
  // console.log(pageId);

  const since = '2024-09-01';  // Start date
  const until = '2024-09-30';  // End date
  const period = 'total_over_range';  // Total over range

  const [pageInfo, setPageInfo] = useState({});


  useEffect(() => {
    if(pageId){
      const fetchPageInfo = () => {

        // fetch page access token for getting insight
        window.FB.api(
          '/me/accounts',
          { access_token: accessToken },
          function(response) {
            if (response && !response.error) {
              const pages = response.data;
              var pageAccessToken = pages.find(page => page.id === pageId).access_token;
              
              fetchInsights(pageAccessToken);

            } else {
              console.error('Error in fetching page access tokens:', response.error);
            }
          }
        );

        const fetchInsights = (pageAccessToken) => {

          // console.log(pageAccessToken);
          // console.log(pageId);


          axios.get('https://the-facebook-backend.onrender.com/facebook/insights',{ 
            params: {
              pageId: pageId, 
              pageAccessToken: pageAccessToken,
              since: since,
              until: until,
              period: period
            } 
          })
          .then((response) => {

            // console.log(response.data.data);

            if (response && !response.error) {
                const data = response.data.data.reduce((acc, item) => {
                  acc[item.name] = item.values[0].value;
                    return acc;
                }, {});
      
              setPageInfo(data);
            }
          })
        }
      };

      fetchPageInfo();
    }
  }, [pageId]);


  // console.log(pageInfo);

  return (
    <>
      <div>
        <h1>Insights</h1>
        {pageId && (
          <div>
            <p>Total Followers: {pageInfo.page_fan_adds_unique}</p>
            <p>Total Engagement: {pageInfo.page_post_engagements}</p>
            <p>Total Impressions: {pageInfo.page_impressions}</p>
            <p>Total Reactions: {pageInfo.page_actions_post_reactions_like_total}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Insights;
