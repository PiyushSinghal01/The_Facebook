import React, { useEffect, useState } from 'react';
import Pages from './Pages';
import axios from 'axios';

const Login = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState({}); 
  const [sdkLoaded, setSdkLoaded] = useState(false);

  
    const handleLogout = () => {
      window.FB.logout(function() {
        setIsLoggedIn(false);
        setAccessToken(null);
        setUserInfo({});
      })
    }


    const fetchUserInfo = (accessToken) => {
      if(accessToken)
        {
          axios.get('https://the-facebook-backend.onrender.com/facebook/login', {
            params: {
              accessToken: accessToken
            }
          })
          .then((response) => {

            // console.log(response.data);

            setUserInfo({
              id : response.data.id,
              name : response.data.name,
              picture: response.data.picture.data.url
            })
          })
        }
    }

    const statusChangeCallback = (response) => {

      console.log(response);

      if(response.status === 'connected')
      {
        setIsLoggedIn(true);
        setAccessToken(response.authResponse.accessToken);

        // fetch user info using access token
        fetchUserInfo(response.authResponse.accessToken);

      }
      else{
        setIsLoggedIn(false);
        setAccessToken(null);
        setUserInfo({});
      }
    };

    const checkLoginState = () => {
      if(window.FB){
        window.FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
        });
      } 
      else {
        console.log("Facebook SDK not loaded yet");
      }
    };

  useEffect(() => {

      // Load the Facebook SDK when the component mounts
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v20.0'
        });

        // Call checkLoginState here after the SDK has loaded
        checkLoginState();
        setSdkLoaded(true);
      };

      // Dynamically load the Facebook SDK script
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

  }, []);


  return (
    <>
      <div>
        <h1>Log-in page</h1>
        {
          sdkLoaded ? (
            isLoggedIn ? 
          <>
            <div>
              <h1>Welcome, {userInfo.name}</h1>
              <img src={ userInfo.picture } alt="profile pic" />
              <br />
              <br />
              <button onClick={ handleLogout }>Log-out</button>
            </div>
          </> 
            : 
          <>
            <div 
              className="fb-login-button"
              data-width=""
              data-size="large"
              data-button-type="login_with"
              data-layout="default"
              data-auto-logout-link="false"
              data-use-continue-as="false"
              data-scope="public_profile,email,pages_show_list,pages_read_engagement"
            ></div>
          </>
          ) : <p>Loading....</p>
        }
        <br />
        <br />
        <button onClick={ checkLoginState }>check status</button>
      </div>

      {/* Access token pass to page component */}
      {
        accessToken && (<Pages access_token={accessToken} id={userInfo.id}></Pages>)
      }
  </>
  );
};

export default Login;
