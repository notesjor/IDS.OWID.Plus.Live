export default class auth {
  async signIn(user, password) {
    if (user == "")
        return;

    var raw = JSON.stringify({
      "user": user,
      "psw": password
    });

    var requestOptions = {
      method: 'POST',
      body: raw,
      redirect: 'follow'
    };

    var url = "https://www.owid.de/api/auth/signin";
    return fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => {
        var now = new Date();
        now.setTime(now.getTime() + (23 * 60 * 60 * 1000));

        localStorage.setItem('owid_auth_timestamp', now.toUTCString());
        localStorage.setItem('owid_auth_jwt', result);
        return true;
      })
      .catch(error => {          
        localStorage.setItem('owid_auth_jwt', "");
        console.log('error', error);
        return false;
      });
  }

  signOut() {    
    localStorage.setItem('owid_auth_timestamp', "");
    localStorage.setItem('owid_auth_jwt', "");    
  }

  get isSignedIn() {
    var utc = localStorage.getItem('owid_auth_timestamp');
    if(utc == null || utc == "")
        return false;

    var date = Date.parse(utc);
    var now = new Date();
    if(now > date)
    {
      localStorage.setItem('owid_auth_timestamp', "");
      localStorage.setItem('owid_auth_jwt', "");
      return false;
    }
    return localStorage.getItem('owid_auth_jwt') != "";
  }
  
  get bearerToken() {
    return localStorage.getItem('owid_auth_jwt');
  }
}