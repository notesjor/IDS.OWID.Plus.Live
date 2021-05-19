<template>
  <v-dialog v-model="dialog" width="600" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on" style="float:right; display:block; margin-top:-70px;" @click="dialog = true">
        <sup>
          <v-icon left small>
            mdi-information-outline
          </v-icon>
        </sup>
      </div>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Deutsches Wortart-Tagset STTS
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <span>
          <table>
            <thead>
              <tr class="header">
                <th>Wortart</th>
                <th>Beschreibung</th>
                <th>Beispiele</th>
              </tr>
            </thead>
            <tbody>
              <tr class="odd">
                <td style="min-width: 80px">ADJA</td>
                <td>attributives Adjektiv</td>
                <td>[das] große [Haus]</td>
              </tr>
              <tr class="even">
                <td>ADJD</td>
                <td>adverbiales oder prädikatives Adjektiv</td>
                <td>[er fährt] schnell, [er ist] schnell</td>
              </tr>
              <tr class="odd">
                <td>ADV</td>
                <td>Adverb</td>
                <td>schon, bald, doch</td>
              </tr>
              <tr class="even">
                <td>APPR</td>
                <td>Präposition; Zirkumposition links</td>
                <td>in [der Stadt], ohne [mich]</td>
              </tr>
              <tr class="odd">
                <td></td>
                <td>Präposition mit Artikel</td>
                <td>im [Haus], zur [Sache]</td>
              </tr>
              <tr class="even">
                <td>APPO</td>
                <td>Postposition</td>
                <td>[ihm] zufolge, [der Sache] wegen</td>
              </tr>
              <tr class="odd">
                <td>APZR</td>
                <td>Zirkumposition rechts</td>
                <td>[von jetzt] an</td>
              </tr>
              <tr class="even">
                <td>ART</td>
                <td>bestimmter oder unbestimmter Artikel</td>
                <td>der, die, das, ein, eine</td>
              </tr>
              <tr class="odd">
                <td>CARD</td>
                <td>Kardinalzahl</td>
                <td>zwei [Männer], [im Jahre] 1994</td>
              </tr>
              <tr class="even">
                <td>FM</td>
                <td>Fremdsprachliches Material</td>
                <td>[Er hat das mit “] A big fish [” übersetzt]</td>
              </tr>
              <tr class="odd">
                <td>ITJ</td>
                <td>Interjektion</td>
                <td>mhm, ach, tja</td>
              </tr>
              <tr class="even">
                <td>KOUI</td>
                <td>unterordnende Konjunktion mit “zu” und Infinitiv</td>
                <td>um [zu leben], anstatt [zu fragen]</td>
              </tr>
              <tr class="odd">
                <td>KOUS</td>
                <td>unterordnende Konjunktion mit Satz</td>
                <td>weil, dass, damit, wenn, ob</td>
              </tr>
              <tr class="even">
                <td>KON</td>
                <td>nebenordnende Konjunktion</td>
                <td>und, oder, aber</td>
              </tr>
              <tr class="odd">
                <td>KOKOM</td>
                <td>Vergleichskonjunktion</td>
                <td>als, wie</td>
              </tr>
              <tr class="even">
                <td>NN</td>
                <td>normales Nomen</td>
                <td>Tisch, Herr, [das] Reisen</td>
              </tr>
              <tr class="odd">
                <td>NE</td>
                <td>Eigennamen</td>
                <td>Hans, Hamburg, HSV</td>
              </tr>
              <tr class="even">
                <td>PDS</td>
                <td>substituierendes Demonstrativpronomen</td>
                <td>dieser, jener</td>
              </tr>
              <tr class="odd">
                <td>PDAT</td>
                <td>attribuierendes Demonstrativpronomen</td>
                <td>jener [Mensch]</td>
              </tr>
              <tr class="even">
                <td>PIS</td>
                <td>substituierendes Indefinitpronomen</td>
                <td>keiner, viele, man, niemand</td>
              </tr>
              <tr class="odd">
                <td>PIAT</td>
                <td>attribuierendes Indefinitpronomen ohne Determiner</td>
                <td>kein [Mensch], irgendein [Glas]</td>
              </tr>
              <tr class="even">
                <td>PIDAT</td>
                <td>attribuierendes Indefinitpronomen mit Determiner</td>
                <td>[ein] wenig [Wasser], [die] beiden [Brüder]</td>
              </tr>
              <tr class="odd">
                <td>PPER</td>
                <td>irreflexives Personalpronomen</td>
                <td>ich, er, ihm, mich, dir</td>
              </tr>
              <tr class="even">
                <td>PPOSS</td>
                <td>substituierendes Possessivpronomen</td>
                <td>meins, deiner</td>
              </tr>
              <tr class="odd">
                <td>PPOSAT</td>
                <td>attribuierendes Possessivpronomen</td>
                <td>mein [Buch], deine [Mutter]</td>
              </tr>
              <tr class="even">
                <td>PRELS</td>
                <td>substituierendes Relativpronomen</td>
                <td>[der Hund ,] der</td>
              </tr>
              <tr class="odd">
                <td>PRELAT</td>
                <td>attribuierendes Relativpronomen</td>
                <td>[der Mann ,] dessen [Hund]</td>
              </tr>
              <tr class="even">
                <td>PRF</td>
                <td>reflexives Personalpronomen</td>
                <td>sich, einander, dich, mir</td>
              </tr>
              <tr class="odd">
                <td>PWS</td>
                <td>substituierendes Interrogativpronomen</td>
                <td>wer, was</td>
              </tr>
              <tr class="even">
                <td>PWAT</td>
                <td>attribuierendes Interrogativpronomen</td>
                <td>welche[Farbe], wessen [Hut]</td>
              </tr>
              <tr class="odd">
                <td>PWAV</td>
                <td>adverbiales Interrogativ- oder Relativpronomen</td>
                <td>warum, wo, wann, worüber, wobei</td>
              </tr>
              <tr class="even">
                <td>PAV</td>
                <td>Pronominaladverb</td>
                <td>dafür, dabei, deswegen, trotzdem</td>
              </tr>
              <tr class="odd">
                <td>PTKZU</td>
                <td>“zu” vor Infinitiv</td>
                <td>zu [gehen]</td>
              </tr>
              <tr class="even">
                <td>PTKNEG</td>
                <td>Negationspartikel</td>
                <td>nicht</td>
              </tr>
              <tr class="odd">
                <td>PTKVZ</td>
                <td>abgetrennter Verbzusatz</td>
                <td>[er kommt] an, [er fährt] rad</td>
              </tr>
              <tr class="even">
                <td>PTKANT</td>
                <td>Antwortpartikel</td>
                <td>ja, nein, danke, bitte</td>
              </tr>
              <tr class="odd">
                <td>PTKA</td>
                <td>Partikel bei Adjektiv oder Adverb</td>
                <td>am [schönsten], zu [schnell]</td>
              </tr>
              <tr class="even">
                <td>TRUNC</td>
                <td>Kompositions-Erstglied</td>
                <td>An- [und Abreise]</td>
              </tr>
              <tr class="odd">
                <td>VVFIN</td>
                <td>finites Verb, voll</td>
                <td>[du] gehst, [wir] kommen [an]</td>
              </tr>
              <tr class="even">
                <td>VVIMP</td>
                <td>Imperativ, voll</td>
                <td>komm [!]</td>
              </tr>
              <tr class="odd">
                <td>VVINF</td>
                <td>Infinitiv, voll</td>
                <td>gehen, ankommen</td>
              </tr>
              <tr class="even">
                <td>VVIZU</td>
                <td>Infinitiv mit “zu”, voll</td>
                <td>anzukommen, loszulassen</td>
              </tr>
              <tr class="odd">
                <td>VVPP</td>
                <td>Partizip Perfekt, voll</td>
                <td>gegangen, angekommen</td>
              </tr>
              <tr class="even">
                <td>VAFIN</td>
                <td>finites Verb, aux</td>
                <td>[du] bist, [wir] werden</td>
              </tr>
              <tr class="odd">
                <td>VAIMP</td>
                <td>Imperativ, aux</td>
                <td>sei [ruhig !]</td>
              </tr>
              <tr class="even">
                <td>VAINF</td>
                <td>Infinitiv, aux</td>
                <td>werden, sein</td>
              </tr>
              <tr class="odd">
                <td>VAPP</td>
                <td>Partizip Perfekt, aux</td>
                <td>gewesen</td>
              </tr>
              <tr class="even">
                <td>VMFIN</td>
                <td>finites Verb, modal</td>
                <td>dürfen</td>
              </tr>
              <tr class="odd">
                <td>VMINF</td>
                <td>Infinitiv, modal</td>
                <td>wollen</td>
              </tr>
              <tr class="even">
                <td>VMPP</td>
                <td>Partizip Perfekt, modal</td>
                <td>gekonnt, [er hat gehen] können</td>
              </tr>
              <tr class="odd">
                <td>XY</td>
                <td>Nichtwort, Sonderzeichen enthaltend</td>
                <td>3:7, H2O, D2XW3</td>
              </tr>
              <tr class="even">
                <td>$,</td>
                <td>Komma</td>
                <td>,</td>
              </tr>
              <tr class="odd">
                <td>$.</td>
                <td>Satzbeendende Interpunktion</td>
                <td>. ? ! ; :</td>
              </tr>
              <tr class="even">
                <td>$(</td>
                <td>sonstige Satzzeichen; satzintern</td>
                <td>- [,]()</td>
              </tr>
            </tbody>
          </table>
        </span>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">
          Fenster schließen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TagsetInfo",
  theme: { dark: false },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
