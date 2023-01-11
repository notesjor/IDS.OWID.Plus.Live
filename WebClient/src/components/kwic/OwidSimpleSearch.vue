<template>
  <div>
    <div v-if="isSignedIn">
      <!-- ANMELDUNG ERFOLGREICH - SUCHE - START -->
      <v-dialog v-model="dialog_search" width="90%">
        <template v-slot:activator="{ on, attrs }">
          <v-icon style="margin-left:10px" v-bind="attrs" v-on="on" color="primary"
            @click="kwicSearch">mdi-open-in-new</v-icon>
        </template>

        <v-card style="margin-top:25px">
          <v-card-title class="text-h5 grey lighten-2" style="margin-bottom:20px">
            KorAP-Belege für: <span style="font-weight:lighter; margin-left:10px; margin-right:5px">{{ query }}</span>
            <a :href="getKorapLink()" target="_blank" style="text-decoration:none"><v-icon>mdi-open-in-new</v-icon></a>
            <v-spacer />
            <v-icon style="margin-left:10px" @click="dialog_search = false">mdi-close</v-icon>
          </v-card-title>

          <v-card-text>
            <div v-if="kwic === null">
              <h2 style="text-align:center;">Bitte warten...</h2>
              <h4 style="text-align:center;">Die KorAP-Abfrage nimmt wenige Sekunden in Anspruch.</h4>
            </div>
            <div v-else>
              <v-alert color="#f9b211" dense outlined text type="warning">
                <strong>Hinweis:</strong> Diese Funktion befindet sich aktuell in der Entwicklung (Beta-Status).
                OWIDplusLIVE fragt zufällige Belege aus KorAP ab. Diese Belege sind <u>nicht</u> Teil der Datenmenge von
                OWIDplusLIVE.
              </v-alert>
              <div style="display: flex; justify-content: center; align-items: center; margin-top:20px">
                <table style="display:block">
                  <tr v-for="item in kwic" :key="item.matchID" style="font-size: 10px">
                    <td style="padding-top:3px; text-align: right; font-size: 14px;">{{ item.left }}</td>
                    <td style="padding-top:3px; font-weight: 600; font-size: 14px;">{{ item.match }}</td>
                    <td style="padding-top:3px; font-size: 14px;">{{ item.right }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </v-card-text>

          <v-card-actions>
            <!---->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- ANMELDUNG ERFOLGREICH - SUCHE - ENDE -->
    </div>
    <div v-else>
      <!-- ANMELDEFORMULAR START -->
      <v-dialog v-model="dialog_signin" width="500" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-icon style="margin-left:10px" v-bind="attrs" v-on="on">mdi-open-in-new</v-icon>
        </template>

        <v-card>
          <v-card-title class="text-h5 grey lighten-2" style="margin-bottom:20px">
            KorAP-Anmeldung<br />
            <span style="font-size:12px; font-weight:light">
              Für diese Funktion ist eine Anmeldung via KorAP notwendig.
            </span>
          </v-card-title>

          <v-card-text>
            <div>
              <v-row>
                <v-text-field outlined label="Benutzername" v-model="user"></v-text-field>
              </v-row>
              <v-row>
                <v-text-field outlined label="Kennwort" type="password" v-model="password"></v-text-field>
              </v-row>
              <v-alert color="red" dense outlined text type="error" v-if="dialog_signin_error">
                Bitte überprüfen Sie ihre Eingabe.<br />Benutzername und/oder Kennwort sind falsch.
              </v-alert>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-col cols="5">
              <a class="signinLink" href="https://perso.ids-mannheim.de/registration/" target="_blank">Kostenfreie
                Registrierung</a>
              <a class="signinLink" href="https://perso.ids-mannheim.de/registration/" target="_blank">Passwort
                vergessen?</a>
            </v-col>
            <v-col style="text-align:right; margin-right:10px" cols="3">
              <v-btn :color="btnSigninColor" @click="signIn">Anmelden</v-btn>
            </v-col>
            <v-col style="text-align:right" cols="3">
              <v-btn :color="btnAbortColor" @click="dialog_signin = false">Abbrechen</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- ANMELDEFORMULAR ENDE -->
    </div>
  </div>
</template>

<script>
import auth from "./code/auth.js"
import kwic from "./code/kwic.js"

var authentication = new auth();
var kwicHelper = new kwic();

export default {
  name: 'OwidSignin',

  props: {
    query: {
      type: String,
      default: ""
    },
    btnSigninColor: {
      type: String,
      default: "primary"
    },
    btnAbortColor: {
      type: String,
      default: "error"
    },
  },

  data() {
    return {
      dialog_signin: false,
      dialog_signin_error: false,
      dialog_search: false,

      user: "",
      password: "",
      isSignedIn: false,
      timer: null,
      authentication: null,
      kwic: null
    };
  },

  mounted() {
    this.$data.authentication = authentication;
    var self = this;

    this.$data.timer = setInterval(() => {
      var newVal = self.$data.authentication.isSignedIn;
      if (newVal !== self.$data.isSignedIn) {
        self.$data.isSignedIn = newVal;
      }
    }, 1000);
  },

  methods: {
    kwicSearch: function () {
      var self = this;
      fetch('https://www.owid.de/api/kwic/search?query=' + encodeURIComponent(self.query), {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'Authorization': self.authentication.bearerToken,
        }
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
          self.$data.kwic = kwicHelper.optimizeKwic(result)
        })
        .catch((error) => console.log('error', error))
    },
    getKorapLink() {
      return "https://korap.ids-mannheim.de/?q=" + encodeURIComponent(this.query) + "&ql=poliqarp&cutoff=1"
    },
    signIn() {
      var self = this;
      authentication.signIn(this.$data.user, this.$data.password).then(r => {
        if (r) {
          self.$data.dialog_signin = false;
          self.kwicSearch();
          self.$data.dialog_search = true;
        } else {
          self.$data.dialog_signin_error = true;
          self.$data.dialog_signin = true;
        }
      })
    },
    signOut() {
      authentication.signOut();
    }
  }
}
</script>

<style>
.signinFormRow {
  margin: 10px 10px -10px 10px
}

.signinLink {
  font-size: 12px;
  display: block
}
</style>
