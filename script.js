var textContent = document.getElementById('textContent')
textContent.focus();

var syllabCounterDiv = document.getElementById('syllabCounter')

let previousText = [];

textContent.addEventListener('input', function(e) {
    textContentChange(e.target.innerText);  
});

// gestion de la pause poétique
function insertTextAtCaret(text) {
    var sel, rangeC, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0); 
            range.setStart(range.startContainer, range.startOffset-1);
            range.deleteContents();
            let newNode = document.createTextNode(text);
            range.insertNode(newNode);
            range.setStartAfter(newNode);
        }
    }
}

textContent.addEventListener('keyup', function(e) {
  if(e.key == '_'){
    insertTextAtCaret('‧');
  }
});

function textContentChange(nextText){
  
    nextText = nextText.replaceAll('\n\n','\n'); // astuce pour merde pour gérer le comportement merdique de innerText
    nextText  = nextText.split('\n');
    
    var arrayOfChange = [];
  
    // détection des lignes qui ont changé
    for(let i = 0; i < Math.max(nextText.length, previousText.length);i++){
      if(previousText[i] !== nextText[i]){
        arrayOfChange.push(i);
      }
    }
      
    previousText = nextText;
    resfreshSyllabCounter(arrayOfChange);
  
}

let previousData = [];

function resfreshSyllabCounter(arrayOfChange){

  for(let i = 0; i < arrayOfChange.length; i++){
    let phrase = syllabCounter(previousText[arrayOfChange[i]]);
    if (arrayOfChange[i] > previousData.length){  
      previousData.push(phrase);
    } else {
      previousData[arrayOfChange[i]] = phrase;
    }
  }
    
  syllabCounterDiv.innerHTML = previousData
                              .slice(0, previousText.length)
                              .map(x=> {
                                    let d = x.reduce((a, b) => a + ' ' + b.decomposition, '');
                                    let t = x.reduce((a, b) => a + b.nombre, 0);
                                    t = t == 0 ? '' : t;
                                    return '<span class="badge badge-light"  data-toggle="tooltip" data-placement="left" title="'+ d + '">' 
                                    + t
                                    + '</span>';
                              })
                              .join('<br>');
  
  previousData = previousData.slice(0,previousText.length);
    
   //$('[data-toggle="tooltip"]').tooltip();
  
}


let d = new decomposeurSyllabe();
textContentChange(textContent.innerText);


// TEST GLOBAL

	let log = [];

	//for(let i = 0; i <  dataTest. length; i++){  
	for(let i = 0; i <  0; i++){  
	
		let v = d.generate(dataTest[i]);
		
		let q = v.reduce((a, b) => a + ' ' + b.decomposition, '');
		let t = v.reduce((a, b) => a + b.nombre, 0);
				
		log.push([dataTest[i], t, q].join(';'));
	}

	console.log(log.join('\n'));

// FIN TEST GLOBAL

function syllabCounter(text){
  let taille = 0;
  if(text!==undefined && text!==null){
    taille=d.generate(text);
  }
  return taille==0 ? '' : taille;
}

textContent.addEventListener("paste", function(e) {
      
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

    // insert text manually
    document.execCommand("insertText", false, text.replaceAll('\r',''));

});

