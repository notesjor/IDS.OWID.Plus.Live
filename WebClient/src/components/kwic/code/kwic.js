export default class kwic{
  removeAll(str, find) {
    return str.replace(new RegExp(find, 'g'), '');
  }

  optimizeKwic(kwic) {
      var res = [];
    
      for (var i = 0; i < kwic.Results.length; i++) {
        var txt = kwic.Results[i].snippet;
    
        // TODO: Abklären, ob keine Lösung über API möglich
    
        txt = this.removeAll(txt, '</span>', '');
        txt = this.removeAll(txt, '<span class="more">', '');
        txt = this.removeAll(txt, '<span class="more">', '');
        txt = this.removeAll(txt, '<span class="context-left">', '');
        txt = this.removeAll(txt, '<span class="match">', '');
        txt = this.removeAll(txt, '<span class="context-right">', '');
    
        var split = txt.split('<mark>');
        var left = split[0];
        split = split[1].split('</mark>');
        var match = split[0];
        var right = split[1];
    
        res.push({
          left: left,
          match: match,
          right: right,
          author: kwic.Results[i].author,
          date: kwic.Results[i].pubDate,
          matchID: kwic.Results[i].matchID,
          textSigle: kwic.Results[i].textSigle,
          selected: false,
          contexts: []
        });
      }
    
      return res;
    }
}