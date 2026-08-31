export default class auth {
  /**
   * @param {function} func - callback function - true if the user is signed in
   */
  signIn(func) {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    var url = "https://www.owid.de/api/oauth2/new";
    fetch(url, requestOptions)
      .then((response) => {
        if (response.status != 200) throw new Error("unauthorized");
        return response;
      })
      .then((response) => response.text())
      .then((url) => {
        var state = new URLSearchParams(url).get("state");
        var window = open(url, "KorAP-Anmeldung", "width=800,height=600");

        var timer = setInterval(() => {
          if (window.closed) {
            clearInterval(timer);

            var requestOptions = {
              method: "GET",
              redirect: "follow",
            };

            var url = "https://www.owid.de/api/oauth2/fetch?state=" + state;
            return fetch(url, requestOptions)
              .then((response) => {
                if (response.status != 200) throw new Error("unauthorized");
                return response;
              })
              .then((response) => response.text())
              .then((result) => {
                var now = new Date();
                now.setTime(now.getTime() + 23 * 60 * 60 * 1000);

                localStorage.setItem("owid_auth_timestamp", now.toUTCString());
                localStorage.setItem("owid_auth_token", result);

                func(true);
              });
          }
        }, 200);
      })
      .catch((error) => {
        this.__reset();
        console.log("error", error);
        func(false);
      });
  }

  /**
   * @returns {boolean} true if the user is signed in
   */
  get isSignedIn() {
    var utc = localStorage.getItem("owid_auth_timestamp");
    if (utc == null || utc == "") return false;

    var date = Date.parse(utc);
    var now = new Date();
    if (now > date) {
      this.__reset();
      return false;
    }

    return localStorage.getItem("owid_auth_token") != "";
  }

  /**
   * Sign out the user
   */
  signOut() {
    this.__reset();
  }

  /**
   * @returns {string} bearer token
   */
  get bearerToken() {
    return localStorage.getItem("owid_auth_token");
  }

  /**
   * Reset the authentication
   * @private
   */
  __reset() {
    localStorage.setItem("owid_auth_timestamp", "");
    localStorage.setItem("owid_auth_token", "");
  }
}
