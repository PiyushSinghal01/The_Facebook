import React, { useEffect, useState } from 'react'
import Insights from './Insights';
import axios from 'axios';

const Pages = ({ access_token, id }) => {

  const accessToken = access_token;

  // console.log(accessToken);
  // console.log(id); 

  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null); 


  useEffect(() => {

    // console.log(accessToken)

    if(accessToken)
    {
      axios.get('https://the-facebook-backend.onrender.com/facebook/pages', {
        params: {
          accessToken: accessToken
        }
      })
      .then((response) => {
        // console.log(response.data);

        if(response && response.data)
        {
          setPages(response.data.data);
        }
        else if(response.error)
        {
          console.log("error in response", response.error);
        }
        else{
          console.log("unexpected Error in response");
        }
        
      })
    }
  }, [accessToken])

  // console.log(pages);
  // console.log(selectedPage);

  const handlePageChange = (event) => {
    setSelectedPage(event.target.value);
  }


  return (
    <>
      <div>
        <h1>Pages</h1>
        <div>

          <select onChange={ handlePageChange }>
            <option value="">Select page</option>
            {
              pages.map((page, i) => {
                return <option key={i} value={page.id} name={page.access_token}>{page.name}</option>
              })
            }
          </select>

        </div>

        <Insights access_token={accessToken} pageId={selectedPage} />

      </div>
    </>
  )
}

export default Pages
