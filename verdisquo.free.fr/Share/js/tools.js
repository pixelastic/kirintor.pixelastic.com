// Sniffer based on http://www.mozilla.org/docs/web-developer/sniffer/browser_type.html
var uagent    = navigator.userAgent.toLowerCase();
var is_ie     = (uagent.indexOf('msie') != -1);
var is_moz    = (navigator.product == 'Gecko');
var is_win    =  ( (uagent.indexOf("win") != -1) || (uagent.indexOf("16bit") !=- 1) );
var ua_vers   = parseInt(navigator.appVersion);

if ((ua_vers >= 4) && is_ie && is_win) var nav = "IE";
else var nav = "MOZZY";

info = new Array(); //message d'info
//messages d'infos :
info["b"] = "Mettre le texte en gras. [b]Texte[/b].";
info["i"] = "Mettre le texte en italique. [i]Texte[/i].";
info["u"] = "Mettre le texte en soulign�. [u]Texte[/u].";
info["img"] = "Ins�rer une image. [img]Adresse[/img].";
info["img_left"] = "Ins�rer une image et l'aligne sur la gauche du texte. [img_left]Adresse[/img_left].";
info["img_right"] = "Ins�rer une image et l'aligne sur la droite du texte. [img_right]Adresse[/img_right].";
info["media"] = "Ins�rer un media (son ou vid�o). [media]Adresse[/media].";
info["ancre"] = "Insere un point d'ancrage pour un lien dans la page. [ancre]nom[/ancre].";
info["url"] = 'Ins�rer un lien. [url]Adresse[/url] ou [url=*Adresse*]Nom[/url] ou [url=#ancre]Nom[/url].';
info["url_new"] = 'Lien dans une nouvelle fen�tre. [url]Adresse[/url] ou [url=*Adresse*]Nom[/url]';
info["quote"] = "Ins�rer une citation. [quote]Citation[/quote].";
info["color"] = 'Mettre le texte en couleur. [color=*Couleur*]Texte[/color].';
info["size"] = 'Changer la taille du texte. [size=*Taille*]Texte[/size].';
info["smiley"] = 'Ouvrir la pop-up des smileys.';
info["center"] = 'Centrer le texte. [center]*Texte*[/center].';
info["left"] = 'Aligner sur la gauche le texte. [left]*Texte*[/left].';
info["right"] = 'Aligner sur la droite le texte. [right]*Texte*[/right].';
info["justify"] = 'Justifier le texte. [justify]*Texte*[/justify].';
info["img_left_mini"] = "Ins�re l'image sur la gauche du texte.";
info["img_right_mini"] = "Ins�re l'image sur la droite du texte";
info["img_mini"] = "Ins�re l'image � l'endroit du curseur";








is_set = new Array(); //si la balise est ouverte
is_click = new Array(); //si la touche est enfonc�e



//affiche le message d'aide
function affiche_aide(name_info, info_type) {
	document.getElementById(name_info).value = info[info_type];	
}
//affiche le message d'aide du smiley
//function affiche_aide_smiley(name_info, smiley_nom) {	document.<? echo $nom_form ?>.<? echo $nom_textarea ?>_info.value = 'Smiley '+smiley_nom; }


function add_balise(name_textarea,balise_type,valeur) {
	//on sauvegarde la target
	var obj_ta = document.getElementById(name_textarea);
	//je sauvegarde facilement les tags d'ouverture et de fermeture. Il faut faire gaffe dans la suite de ne pas changer la valeur du bouton des menus-d�roulant (impossible)
	var open_tag;
	//Pour les balises de couleur et de taille on passe une valeur
	if (valeur==null) open_tag = "["+balise_type+"]";
	else open_tag = "["+balise_type+"="+valeur+"]";
	close_tag = "[/"+balise_type+"]";
	
	//Je sais si le bouton est enfonc� ou non en fonction de sa couleur
	var obj_button = document.getElementById(name_textarea+"_"+balise_type)
	var couleur_fond_actuelle = obj_button.style.backgroundColor;
	var button_set;
	//IE et Mozzila sont vraiment cons... IE ne gere les noms de couleurs que en miniscule, et uniquement pas s'ils sont nest�s...
	//Il faut le respecifier pour l'�l�ment en question.
	//Et si un �l�ment parent (ex : a) a �t� d�fini avec une certaine couleur, les �l�ments de type div > a ont la mm couleur MAIS
	//Non accesible par javascript, il faut lui redefinir en style="background-color:red" pour qu'il le prenne
	//Et pour couronner le tout, Ie gere en hexa, Mozzy en rgb...
	if (nav=="IE") button_set = (couleur_fond_actuelle=="#808080");
	if (nav=="MOZZY") button_set = (couleur_fond_actuelle=="rgb(128, 128, 128)");
		
			
	//comme IE et Mozzila ne r�agissent pas de la m�me mani�re, je fais deux cas
	if ( nav=="IE") {
		obj_ta.focus();
		//on r�cup�re la s�lection s'il y en a une
		var sel = document.selection;
		var rng = sel.createRange();
		rng.colapse;
		//si s�l�ction :
		if (sel.type == "Text")	rng.text = open_tag + rng.text + close_tag;
		//si pas de s�lection, on ajoute au curseur
		if (sel.type == "None") {
			//Le bouton n'�tait pas d�ja appuy�, on ajoute le tag d'ouverture
			if (!button_set) {
				rng.text += open_tag;
				obj_button.style.backgroundColor = "#808080";
			}
			//Le bouton �tait appuy�, on ajoute le tag de fermeture
			else {
				obj_button.style.backgroundColor = "#c0c0c0";
				rng.text += close_tag;
			}
			
			}
		}
		
	
	if (nav=="MOZZY") {
		//mode de s�lection trouv� sur Z�bulon.fr
		var ss = obj_ta.selectionStart;
		var st = obj_ta.scrollTop;
		var es = obj_ta.selectionEnd;
		
		if (es <= 2) es = obj_ta.textLength;
		
		var start  = (obj_ta.value).substring(0, ss);
		var middle = (obj_ta.value).substring(ss, es);
		var end    = (obj_ta.value).substring(es, obj_ta.textLength);
		
		//Si jamais la taille du texte s�lectionn�e est sup�rieure � 0, alors on a une selection
		if (middle.length > 0) middle = open_tag + middle + close_tag;
		else {
			//Le bouton n'�tait pas d�ja appuy�, on ajoute le tag d'ouverture
			if (!button_set) {
				middle += open_tag;
				obj_button.style.backgroundColor = "#808080";
			}
			//Le bouton �tait appuy�, on ajoute le tag de fermeture
			else {
				obj_button.style.backgroundColor = "#c0c0c0";
				middle += close_tag;
			}			
		}
		obj_ta.value = start + middle + end;
		obj_ta.scrollTop      = st;
	}
	
	/*
	//Si j'ai influ� sur une balise de couleur je ferme la petite fenetre !
	if (balise_type=="color") document.getElementById(name_textarea+"_color_fenetre").style.display = "none";
	if (balise_type=="size") document.getElementById(name_textarea+"_size_fenetre").style.display = "none";
	*/
		
}


//Ajoute un smiley au texte
function add_smiley(name_textarea, smiley) {
	smiley = " " + smiley;
	//on sauvegarde la target
	var obj_ta = document.getElementById(name_textarea);
				
	//comme IE et Mozzila ne r�agissent pas de la m�me mani�re, je fais deux cas
	if ( nav=="IE") {
		obj_ta.focus();
		//on r�cup�re la s�lection s'il y en a une
		var sel = document.selection;
		var rng = sel.createRange();
		rng.colapse;
		
		rng.text += smiley;
	}
		
	
	if (nav=="MOZZY") {
		//mode de s�lection trouv� sur Z�bulon.fr
		var ss = obj_ta.selectionStart;
		var st = obj_ta.scrollTop;
		var es = obj_ta.selectionEnd;
		
		if (es <= 2) es = obj_ta.textLength;
		
		var start  = (obj_ta.value).substring(0, ss);
		var middle = (obj_ta.value).substring(ss, es);
		var end    = (obj_ta.value).substring(es, obj_ta.textLength);
		
		middle += smiley;
		
		obj_ta.value = start + middle + end;
		obj_ta.scrollTop      = st;
	}
}





/*
//Ouvre ou ferme la fenetre de choix des couleurs
function open_close_color_size(name, type) {
	var obj_ta = document.getElementById(name); //le textarea
	var obj_button = document.getElementById(name+"_"+type); //le bouton Couleur
	var couleur_fond_actuelle = obj_button.style.backgroundColor; //La couleur de fond du bouton couleur
	var button_set;
	if (nav=="IE") button_set = (couleur_fond_actuelle=="#808080");
	if (nav=="MOZZY") button_set = (couleur_fond_actuelle=="rgb(128, 128, 128)");
	
	//Si le bouton n'est pas appuy�, j'affiche la fenetre
	if (!button_set) {
		obj = document.getElementById(name+"_"+type+"_fenetre");
		if (obj.style.display=="none") obj.style.display = "block";
		else obj.style.display="none";
	}
	else {
		obj_button.style.backgroundColor = "#c0c0c0";
		//Et selon IE ou MOZZY on va fermer diff�rement la balise
		if ( nav=="IE") {
			obj_ta.focus();
			//on r�cup�re la s�lection s'il y en a une
			var sel = document.selection;
			var rng = sel.createRange();
			rng.text += "[/" + type + "]";
		}
		if (nav=="MOZZY") {
			//mode de s�lection trouv� sur Z�bulon.fr
			var ss = obj_ta.selectionStart;
			var st = obj_ta.scrollTop;
			var es = obj_ta.selectionEnd;
			if (es <= 2) es = obj_ta.textLength;
			var start  = (obj_ta.value).substring(0, ss);
			var middle = (obj_ta.value).substring(ss, es);
			var end    = (obj_ta.value).substring(es, obj_ta.textLength);
			middle += "[/" + type + "]";
			obj_ta.value = start + middle + end;
			obj_ta.scrollTop      = st;
		}
		
	}
	
}
*/


//Ajoute une image choisie depuis la liste d�roulante
function add_image(name, adresse, align) {
	if (adresse==undefined) return;
	var obj_ta = document.getElementById(name); //le textarea
	//Et selon IE ou MOZZY on va fermer diff�rement la balise
	if ( nav=="IE") {
			obj_ta.focus();
			//on r�cup�re la s�lection s'il y en a une
			var sel = document.selection;
			var rng = sel.createRange();
			rng.text += " [img" + align + "]" + adresse + "[/img" + align + "]";
		}
		if (nav=="MOZZY") {
			//mode de s�lection trouv� sur Z�bulon.fr
			var ss = obj_ta.selectionStart;
			var st = obj_ta.scrollTop;
			var es = obj_ta.selectionEnd;
			if (es <= 2) es = obj_ta.textLength;
			var start  = (obj_ta.value).substring(0, ss);
			var middle = (obj_ta.value).substring(ss, es);
			var end    = (obj_ta.value).substring(es, obj_ta.textLength);
			middle += " [img" + align + "]" + adresse + "[/img" + align + "]";
			obj_ta.value = start + middle + end;
			obj_ta.scrollTop      = st;
		}
}

//Affiche/masque la miniature quand je passe ou non le curseur sur le menu d�roulant
function show_hide(img, what) {
	var obj = document.getElementById(img);
	obj.style.display = what;
}
//Modifie la valeur src d'une image
function update_mini(id_img, adresse)
{
	if (adresse!=undefined) document.getElementById(id_img).src = 'images/gallery/'+adresse;
}

//Demande confirmation avant de lancer la pop-up de suppression de fichier et masque l'image
function delete_file(fichier,nom_champ) {
	if (confirm('Etes vous sur de vouloir effacer le fichier '+fichier+' ?\n\n\n(Un logiciel d\'anti-popup peut parfois empecher le bon d�roulement de la suppression du fichier)')) {
		window.open('Share/delete_file.php?file='+fichier, 'open_delete', 'height=1,width=1,channelmode=no,directories=no,left='+o3_x+',location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no,top='+o3_y+'');
		//On arrete d'afficher le div avec le fichier
		document.getElementById("form_file_display_"+nom_champ).style.display = "none";
		//on passe en valeur hidden rien du tout
		document.getElementById(nom_champ+"_hidden").value = "";
	}
}
