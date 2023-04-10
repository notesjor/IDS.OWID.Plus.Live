export default class kwic {
  constructor() {
    this.__languageDict = {
      Poliqarp: "poliqarp",
      "Cosmas II": "cosmas2",
      "Annis QL": "annisql",
      "CQL v1.2": "cql",
      FCSQL: "fcsql",
    };

    this.__languageKeys = Object.keys(this.__languageDict);
  }

  /**
   * @returns {string[]} available languages
   */
  get availableLanguages() {
    return this.__languageKeys;
  }

  /**
   * Execute a KWIC-Search - please fill out all parameters (also the optional/default ones)
   * @param {string} bearerToken - authentication token (use korapJsClient/auth.js to get one)
   * @param {string} corpusQuery - corpus query (default: null > ALL)
   * @param {string} query - query string
   * @param {string} queryLanguage - query language (use property 'availableLanguages' to get a list of available languages)
   * @param {number} page - page number (default: 1). Only page=1 get the maxPage number.
   * @param {function} func - callback function - returns the result of the search as json
   */
  search(
    bearerToken,
    corpusQuery = null,
    query,
    queryLanguage,
    page = 1,
    func
  ) {
    var ql = this.__languageDict[queryLanguage];

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + bearerToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    var cq = "";
    if (corpusQuery != null) cq = "&cq=" + encodeURIComponent(corpusQuery);

    var url = `https://korap.ids-mannheim.de/api/v1.0/search?context=sentence&${cq}cutoff=${
      page != 1
    }&ql=${ql}&q=${encodeURIComponent(query)}&page=${page}`;
    fetch(url, requestOptions)
      .then((response) => {
        if (response.status != 200) throw new Error("KWIC-Search failed");
        return response;
      })
      .then((response) => response.json())
      .then((json) => {
        func(json);
      })
      .catch((error) => {
        console.log("error", error);
        func(null);
      });
  }

  /**
   * @param {*} searchResult - use search(authToken, query, queryLanguage, page = 1, func) to get a valid searchResult
   * @returns get the total number of results
   */
  searchResult_GetTotal(searchResult) {
    return searchResult.meta.totalResults;
  }

  /**
   * @param {*} searchResult - use search(authToken, query, queryLanguage, page = 1, func) to get a valid searchResult
   * @returns get the total number of result pages
   */
  searchResult_GetMaxPage(searchResult) {
    return Math.floor(searchResult.meta.totalResults / 25);
  }

  /**
   * @param {*} searchResult - use search(authToken, query, queryLanguage, page = 1, func) to get a valid searchResult
   * @returns benchmark information about the search
   */
  searchResult_GetBenchmark(searchResult) {
    return searchResult.meta.benchmark;
  }

  /**
   * @param {*} searchResult - use search(authToken, query, queryLanguage, page = 1, func) to get a valid searchResult
   * @returns information about the Koral-Query used in the search
   */
  searchResult_GetKoralQuery(searchResult) {
    return searchResult.query;
  }

  /**
   * @param {*} searchResult - use search(authToken, query, queryLanguage, page = 1, func) to get a valid searchResult
   * @returns information about the collection used in the search
   */
  searchResult_GetCollection(searchResult) {
    return searchResult.collection;
  }

  /**
   * @param {*} searchResult - use search(authToken, query, queryLanguage, page = 1, func) to get a valid searchResult
   * @returns get a list of matches
   */
  searchResult_GetMatches(searchResult) {
    return searchResult.matches;
  }

  /**
   * @param {*} searchResult - use search(authToken, query, queryLanguage, page = 1, func) to get a valid searchResult
   * @returns get a list of all matches (like searchResult_GetMatches) but cleaned by (match_GetSnippetCleanExtended)
   */
  searchResult_GetMatchesQuick(searchResult) {
    var matches = searchResult.matches;
    var matchesClean = [];
    for (var i = 0; i < matches.length; i++) {
      matchesClean.push(this.match_GetSnippetCleanExtended(matches[i]));
    }
    return matchesClean;
  }

  /**
   * @param {*} match - use match_GetMatches(json) to get a list of matches (you need here a single one)
   * @returns the snippet Id as string (documentId & matchId)
   */
  match_GetMatchID(match) {
    return match.matchID;
  }

  /**
   * @param {*} match - use match_GetMatches(json) to get a list of matches (you need here a single one)
   * @returns the document sigle as string
   */
  match_GetSigle(match) {
    return match.textSigle;
  }

  /**
   * @param {*} match - use match_GetMatches(json) to get a list of matches (you need here a single one)
   * @returns the author as string
   */
  match_GetAuthor(match) {
    return match.author;
  }

  /**
   * @param {*} match - use match_GetMatches(json) to get a list of matches (you need here a single one)
   * @returns the document title as string
   */
  match_GetTitle(match) {
    return match.title;
  }

  /**
   * @param {*} match - use match_GetMatches(json) to get a list of matches (you need here a single one)
   * @returns the date as string
   */
  match_GetPubDate(match) {
    return match.pubDate;
  }

  /**
   * @param {*} match - use match_GetMatches(json) to get a list of matches (you need here a single one)
   * @returns the snippet as html - use match_GetSnippetClean to get a clean version or match_GetSnippetCleanExtended to get a clean version with additional information
   */
  match_GetSnippet(match) {
    return match.snippet;
  }

  /**
   * @param {*} match - use match_GetMatches(json) to get a list of matches (you need here a single one)
   * @returns an object with the following properties: left, match, right. Use match_GetSnippetCleanExtended to get a clean version with additional information
   */
  match_GetSnippetClean(match) {
    var txt = match.snippet;

    txt = this.__removeAll(txt, "</span>", "");
    txt = this.__removeAll(txt, '<span class="more">', "");
    txt = this.__removeAll(txt, '<span class="more">', "");
    txt = this.__removeAll(txt, '<span class="context-left">', "");
    txt = this.__removeAll(txt, '<span class="match">', "");
    txt = this.__removeAll(txt, '<span class="context-right">', "");

    var split = txt.split("<mark>");
    var left = split[0];
    split = split[1].split("</mark>");
    var mymatch = split[0];
    var right = split[1];

    return {
      left: left,
      match: mymatch,
      right: right,
    };
  }

  /**
   * @param {*} match - use match_GetMatches(json) to get a list of matches (you need here a single one)
   * @returns an object with the following properties: left, match, right, id, sigle, author, title, date
   */
  match_GetSnippetCleanExtended(match) {
    var res = this.match_GetSnippetClean(match);
    res.id = this.match_GetMatchID(match);
    res.sigle = this.match_GetSigle(match);
    res.author = this.match_GetAuthor(match);
    res.title = this.match_GetTitle(match);
    res.date = this.match_GetPubDate(match);

    return res;
  }

  /**
   * @param {*} bearerToken - authentication token (use korapJsClient/auth.js to get one)
   * @param {*} matchId - use match_GetMatches(json) to get a list of matches (you need here a single one) - match.id example: match-WUD17/A91/44293-p3691-3692
   * @param {*} func - callback function (token + annotation as data)
   */
  match_GetLayerData(bearerToken, matchId, func) {
    // Nehme die match.id und baue daraus eine URL
    // Bsp. match-WUD17/A91/44293-p3691-3692
    var matchQuery = matchId.replace("match-", "");
    var parts = matchQuery.split("/");
    var corpus = parts[0];
    var document = parts[1];
    var text = parts.slice(2).join("/");
    parts = text.split("-");
    text = parts[0];
    var range = parts.slice(1).join("-");

    var url = `https://korap.ids-mannheim.de/api/v1.0/corpus/${corpus}/${document}/${text}/${range}?foundry=*`;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + bearerToken);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // Frage die URL nach den Layer-Daten ab
    fetch(url, requestOptions)
      .then((response) => {
        if (response.status != 200) throw new Error("Match-Request failed");
        return response;
      })
      .then((response) => response.json())
      .then((json) => {
        // Nehme das json.snippet und parse die XML-Daten
        var parser = new DOMParser();console.log(json.snippet);
        var xmlDoc = parser.parseFromString(
          "<xml>" + json.snippet.replace("<mark>", "").replace("</mark>", "") + "</xml>", // ist notwendig, da ein root-Element fehlt
          "text/xml"
        );

        // /xml/span = left/right-context oder match
        // /xml/span/span = token
        var spans = xmlDoc.evaluate(
          "/xml/span/span",
          xmlDoc,
          null,
          XPathResult.ANY_TYPE,
          null
        );
        var tokens = [];

        var span = spans.iterateNext();
        while (span) {
          var token = {};
          token.layers = [];

          // Löst das Problem ohne Rekursion
          var current = span;
          while (current && current.nodeName == "span") {
            var title = current.getAttribute("title");
            if (!title) continue;

            // Bsp.: title = marmot/m:gender:masc
            var parts = title.split("/");
            var foundry = parts[0];
            title = parts.slice(1).join("/");
            parts = title.split(":");
            var layer = parts[0];
            var value = parts.slice(1).join(":");

            token.layers.push({
              foundry: foundry,
              layer: layer,
              value: value,
            });
            token.text = current.textContent;

            // Rekurisv
            current = current.firstChild;
          }

          tokens.push(token);
          span = spans.iterateNext();
        }

        func(tokens);
      })
      .catch((error) => {
        console.log("error", error);
        func(null);
      });
  }

  /**
   * @param {*} layerData - use match_GetLayerData to get the layer data
   * @returns a list of unique foundry/layer combinations
   */
  layerData_GetInfo(layerData) {
    var foundries = [];
    foundries.push("TEXT");

    layerData.forEach((token) => {
      token.layers.forEach((layer) => {
        if (!foundries.includes(layer.foundry + "/" + layer.layer))
          foundries.push(layer.foundry + "/" + layer.layer);
      });
    });

    return foundries;
  }

  /**
   * @param {*} str the string to remove the find string from
   * @param {*} find the string to remove
   * @returns the string without the find string
   */
  __removeAll(str, find) {
    return str.replace(new RegExp(find, "g"), "");
  }
}
