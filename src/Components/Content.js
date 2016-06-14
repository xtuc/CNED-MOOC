const CONTENT_CLASS = "my-main-content"

import {
    removeToc
} from "../utils"

import Header from "./Header"

export default class Content {

  /**
   * Hot update
   * @param content mixed Content
   */
  static update(element, content) {
    element.find("." + CONTENT_CLASS).html(content)
  }

  /**
   * Constructor
   *
   * @param content Content (LessonContent)
   */
  constructor(content) {
    this._content = content
  }

  getHeaderData() {
    return $(`
<div id="toc" class="toc">
<div id="toctitle">
<h2>Contents</h2>
<span class="toctoggle">&nbsp;[<a href="#" id="togglelink">hide</a>]&nbsp;</span></div>
<ul>
<li class="toclevel-1 tocsection-1"><a href="#Comprendre_l.27accessibilit.C3.A9_.28.23Pr.C3.A9-requis.29"><span class="tocnumber">1</span> <span class="toctext">Comprendre l'accessibilité (#Pré-requis)</span></a></li>
<li class="toclevel-1 tocsection-2"><a href="#Faire_comprendre_la_dimension_transversale_de_l.27accessibilit.C3.A9_.28.23Objectif.29"><span class="tocnumber">2</span> <span class="toctext">Faire comprendre la dimension transversale de l'accessibilité (#Objectif)</span></a></li>
<li class="toclevel-1 tocsection-3"><a href="#Conna.C3.AEtre_les_.C3.A9tapes.2C_intervenants_et_champs_d.27action_mettant_en_jeu_l.27accessibilit.C3.A9_num.C3.A9rique_.28.23comp.C3.A9tences_vis.C3.A9es.29"><span class="tocnumber">3</span> <span class="toctext">Connaître les étapes, intervenants et champs d'action mettant en jeu l'accessibilité numérique (#compétences visées)</span></a></li>
<li class="toclevel-1 tocsection-4"><a href="#Environ_1_h_.28.23dur.C3.A9e.29"><span class="tocnumber">4</span> <span class="toctext">Environ 1 h (#durée)</span></a></li>
</ul>
</div>
<p></p>
<h1><span class="mw-headline" id="Comprendre_l.27accessibilit.C3.A9_.28.23Pr.C3.A9-requis.29">Comprendre l'accessibilité (#Pré-requis)</span><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Utilisateur:Xtuc-Sven/Initier_une_d%C3%A9marche_d%27accessibilit%C3%A9&amp;veaction=edit&amp;vesection=1" class="mw-editsection-visualeditor" title="Edit section: Comprendre l'accessibilité (#Pré-requis)">edit</a><span class="mw-editsection-divider"> | </span><a href="/w/index.php?title=Utilisateur:Xtuc-Sven/Initier_une_d%C3%A9marche_d%27accessibilit%C3%A9&amp;action=edit&amp;section=1" title="Edit section: Comprendre l'accessibilité (#Pré-requis)">edit source</a><span class="mw-editsection-bracket">]</span></span></h1>
<p>Comprendre</p>
<h1><span class="mw-headline" id="Faire_comprendre_la_dimension_transversale_de_l.27accessibilit.C3.A9_.28.23Objectif.29">Faire comprendre la dimension transversale de l'accessibilité (#Objectif)</span><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Utilisateur:Xtuc-Sven/Initier_une_d%C3%A9marche_d%27accessibilit%C3%A9&amp;veaction=edit&amp;vesection=2" class="mw-editsection-visualeditor" title="Edit section: Faire comprendre la dimension transversale de l'accessibilité (#Objectif)">edit</a><span class="mw-editsection-divider"> | </span><a href="/w/index.php?title=Utilisateur:Xtuc-Sven/Initier_une_d%C3%A9marche_d%27accessibilit%C3%A9&amp;action=edit&amp;section=2" title="Edit section: Faire comprendre la dimension transversale de l'accessibilité (#Objectif)">edit source</a><span class="mw-editsection-bracket">]</span></span></h1>
<p>Faire comprendre</p>
<h1><span class="mw-headline" id="Conna.C3.AEtre_les_.C3.A9tapes.2C_intervenants_et_champs_d.27action_mettant_en_jeu_l.27accessibilit.C3.A9_num.C3.A9rique_.28.23comp.C3.A9tences_vis.C3.A9es.29">Connaître les étapes, intervenants et champs d'action mettant en jeu l'accessibilité numérique (#compétences visées)</span><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Utilisateur:Xtuc-Sven/Initier_une_d%C3%A9marche_d%27accessibilit%C3%A9&amp;veaction=edit&amp;vesection=3" class="mw-editsection-visualeditor" title="Edit section: Connaître les étapes, intervenants et champs d'action mettant en jeu l'accessibilité numérique (#compétences visées)">edit</a><span class="mw-editsection-divider"> | </span><a href="/w/index.php?title=Utilisateur:Xtuc-Sven/Initier_une_d%C3%A9marche_d%27accessibilit%C3%A9&amp;action=edit&amp;section=3" title="Edit section: Connaître les étapes, intervenants et champs d'action mettant en jeu l'accessibilité numérique (#compétences visées)">edit source</a><span class="mw-editsection-bracket">]</span></span></h1>
<p>Connaitre</p>
<h1><span class="mw-headline" id="Environ_1_h_.28.23dur.C3.A9e.29">Environ 1 h (#durée)</span><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Utilisateur:Xtuc-Sven/Initier_une_d%C3%A9marche_d%27accessibilit%C3%A9&amp;veaction=edit&amp;vesection=4" class="mw-editsection-visualeditor" title="Edit section: Environ 1 h (#durée)">edit</a><span class="mw-editsection-divider"> | </span><a href="/w/index.php?title=Utilisateur:Xtuc-Sven/Initier_une_d%C3%A9marche_d%27accessibilit%C3%A9&amp;action=edit&amp;section=4" title="Edit section: Environ 1 h (#durée)">edit source</a><span class="mw-editsection-bracket">]</span></span></h1>
<p>1 heure</p>`)
  }

  /**
   * Generate jQuery elements
   */
  generate() {
    const data = this.getHeaderData()
    removeToc(data)

    const header = new Header(data).generate()

    return $("<div />")
                  .addClass("my-main")
                  .addClass(CONTENT_CLASS)
                  .append(header)
                  .append(this._content.generate())
  }
}
