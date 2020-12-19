// https://jsfiddle.net/JackIsJack/x2rgd6ju

class decomposeurSyllabe{
		    
  generate(phrase){
		
    let option_e_muet_poetique = false;
    
    // trim
    phrase = phrase.trim();
    
    // ajout d'un espace au début pour avoir une règle homogène incluant le 1er mot (ainsi chaque mot est précédé d'un espace)
    phrase = ' ' + phrase;
    
    // suppression de la versification
    phrase = phrase.replaceAll('\n'," ").toLowerCase();
		
    // normalisation de la ponctuation
    phrase = phrase.replace(/\s*[!?]/g,".");
    phrase = phrase.replace(/t-([aeouiy])/g,'t$1'); // cherchent-ils ?
    phrase = phrase.replace(/-/g,' '); // tête-à-tête / me trompe-je ?
    phrase = phrase.replace(/ :/g,'.');
    phrase = phrase.replace(/ –/g,'.');
    phrase = phrase.replace(/ —/g,'.');
    phrase = phrase.replace(/ ;/g,'.');
    phrase = phrase.replaceAll(' (','. ');
    phrase = phrase.replaceAll(')','.');
    
    // ajout d'un point final s'il n'existe pas
    if (phrase.slice(-1)!=='.')
    {
    	phrase = phrase + '.';
    }
    
    // remplacement des "je,te,ce..."
    phrase = phrase.replace(/([ ][cdjmlnrst])e([ \.,])/g,'$1eu$2');
    
    // remplacement des 'mes/tes/ces..'
    phrase = phrase.replace(/([ ][cdlmst])es([ \.,])/g,'$1ès$2');
    
    // remplacement de 'qu'
    phrase = phrase.replaceAll('qu','k');
      
    // remplacement des 'gu..'
    phrase = phrase.replace(/gu([aàâeéèêiîoôöuûùy])/g,'g$1');
    
    // supprimer des 'e' muets
    phrase = phrase.replace(/([^aàâeéèêiîoôöuûùy])e([ ]h?[aàâeéèêiîoôöuûùy])/g,'$1$2');

    if(option_e_muet_poetique==false){
      phrase = phrase.replace(/e(s)?[\.,]/g,'.'); // la virgule coupe la liaison et le 'e' muet
      phrase = phrase.replace(/e(s)? \.,/g,'.');            
    } else {
      phrase = phrase.replace(/e(s)?\./g,'.');
      phrase = phrase.replace(/e(s)? \./g,'.');
    }
    
    // suppression de la ponctuation
    phrase = phrase.replace(/[\.,]/g,'');
    
    // suppression du premier espace artificiel
    phrase = phrase.trim();
        
 		let taille = 0;
    let t = phrase.split(' ').map((val, index, arr) => {
                
          // gestion du 'ent'
          // test :
          /*
          Ils aiment la folie. 5
          Ils trichent. 2
          Ardemment. 3
          Furieusement. 4
          Ils violent. 2
          Il est violent. 3 
          !*/
          if(/ent$/.test(val)) {
            
              // on met de côté le suffixe
              let suffixe = val.match(/^([lmst]')/)
              val = val.replace(/^([lmst]')/,'');

              // si ce n'est pas un homographe (sinon c'est foutu on traite pas)
              if(!homographeENT.includes(val)){
                // si ça se termine par une fin qui assure que ça c'est le son 'AN'
                if(/[aîiûuéeè]mm?ent$/.test(val)){
                  // mais que ce n'est pas une exception
                  if(!exception2_ENT.includes(val)){
                    val = val.replace(/([aîiûuéeè]mm?)ent$/g,'$1ant');
                  }
                } else {
                  if (exception1_ENT.includes(val)){
                    val = val.replace(/ent$/g,'ant');
                  }
                }
              }
            
              // cas standard (nombreux verbes) : le 'ent' est muet si une voyelle lui succède
              if(index+1<=arr.length){ // si ce n'est pas le dernier mot de la phrase
                let prochain_mot = arr[index+1];
                if (/^[aàâeéèêiîoôöuûùy]/.test(prochain_mot)){
                  val = val.replace(/ent$/,'');
                }
              }
            
              // on remet le suffixe
              if(suffixe!==null){
                val = suffixe[0] + val;
              }
          }
      
     			// gestion des hiatus 
          // pas de gestion cas type 'sexuel' car demi-voyelle
           // pas de gestion des 'io' (biologie) ou 'ieu' (vieux/insoucieux)
          val = val.replaceAll('ï','hi'); // droïde (tant pis pour 'aïe' et 'thaïlande')
    			val = val.replace(/a([oéeè])/g,'ah$1'); // aorte / aérer
          if (/(^pluria)|(^péria)|(^multia)|(^antia)|(^bia)/.test == true) {
            val = val.replaceAll('ia','iha'); // hiatus 
          } 
          val = val.replace(/^coo/g,' coho');  // remplacement des 'coo'
          val = val.replace(/([aàâeéèêiîoôöuûùy])y([aàâeéèêiîoôöuûùy])/g, '$1ihi$2'); // gestion du y
          val = val.replaceAll('uei','e'); // cerceuil 
          val = val.replaceAll('ueu','eheu'); // sinueux (mais pas queue car keu) 
    			val = val.replaceAll('ue[^$]','uhe'); // jouer (mais pas bleue)
          //val = val.replaceAll('ua','uha'); // joua (trop d'ambiguïté)
          val = val.replaceAll('oé','ohé');  // poésie
          val = val.replaceAll('oè','ohè');  // poète
          if(val!=='oui'){
          val = val.replace(/oui(?!ll)/g,'ouhi');  // jouir (oui) mais pas gazouille ou trouille
          }
          val = val.replaceAll('oeu','eu'); // coeur
          val = val.replaceAll('oa','oha'); // oasis (tant pis pour les mots anglais : boat, toast...)
          val = val.replace(/é([aâéoui])/g,'éh$1'); // réussir (cas non couvert volontairement : réemettre), créé, théâtre
          if(/ée?s?$/.test(val)==false){ // exclusion des pluriels
            if(/éer[aeoui]/.test(val)==false && ['féerie','féeries','féerique'].includes(val)==false){ // exclusion des conjugaisons au futur (ex:créeraient)
              if(/ée[^aeoui]/){
                val = val.replaceAll('ée','éhe'); // déesse
              }           
            }
          }
          
      
          let a = val.match(/[^ aàâeéèêiîoôöuûùy]*?[aàâeéèêiîoôöuûùy]+([^aàâeéèêiîoôöuûùy]*)?/g);
          taille += (a==null ? 0 : a.length)
          
  				return {mot:val, nombre:a==null ? 0 : a.length, decomposition: a==null ? '' : a.join('_')}
      
			});
          
    return t;
    
  }
  
}