//Ouvre ou ferme une décade/lune/ere
function open_div(name) {
	obj = document.getElementById(name);
	if (obj.style.display=='block') obj.style.display = 'none';
	else if (obj.style.display=='none' || obj.style.display=="") obj.style.display = 'block';
}

//Ouvre ou ferme (en fonction de none ou block passé en param) les divs de type 'to_expand'
function open_close_all(what) {
	obj = document.getElementsByName('to_expand');
	for( i=0; obj.length; i++) 	obj.item(i).style.display = what;
}

//On cache ou on montre les events/récits et donc les décades/lunes/eres qui les contiennent et unqiuement celles là
//Les récits/events sont dans des blockquote, donc on les display:block ainsi que leurs parents (dont on retrouve le nom à partir du nom des blockquote)
function view_hide_all(what) {
	var obj = document.getElementsByTagName('blockquote');

	for( i=0; i!=obj.length; i++) 	{
		ca = obj.item(i);
		name = ca.id;
		explode = name.split('_');
		name_ere = 'div_'+explode[1];
		name_lune = name_ere+'_'+explode[2];
		name_decade = name_lune+'_'+explode[3];
		document.getElementById(name_decade).style.display = what;
		document.getElementById(name_lune).style.display = what;
		document.getElementById(name_ere).style.display = what;
		ca.style.display = what;
	}
}

//La même chose sauf que cette fois ci on n'ouvre pas les récits/events
function view_hide_all_except_events(what) {
	var obj = document.getElementsByTagName('blockquote');

	for( i=0; i!=obj.length; i++) 	{
		ca = obj.item(i);
		name = ca.id;
		explode = name.split('_');
		name_ere = 'div_'+explode[1];
		name_lune = name_ere+'_'+explode[2];
		name_decade = name_lune+'_'+explode[3];
		document.getElementById(name_decade).style.display = 'block';
		document.getElementById(name_lune).style.display = 'block';
		document.getElementById(name_ere).style.display = 'block';
		ca.style.display = 'none';
	}
}

//Cette fonction va cacher ou afficher les persos qui n'ont pas de récits (sont dans des blockquote)
function view_hide_no_recit(what) {
	var obj = document.getElementsByTagName('blockquote');
	for( i=0; i!=obj.length; i++) 	{
		ca = obj.item(i);
		ca.style.display = what;
	}
	
	//on mets à jour le texte du bouton et la valeur
	update_what_to_do();
}


//Demande confirmation avant d'ouvrir une certaine pop-up
function show_hidden_info(show, hide) {
	var texte = "Attention !!\nLes informations que vous allez voir peuvent gâcher une partie du RP.\nSoyez bien conscient que la curiosité est un vilain défaut et qu'il ne faudra vous en prendre qu'à vous même en cas de déception.\n\nCliquez sur [ OUI ] si vous continuez à vouloir voir cette information, cliquez sur [ NON ] pour annuler";
	if (confirm(texte)) {
		open_div(show);
		document.getElementById(hide).style.display = 'none';
		this.style.display = 'none';
	}
}


//Ouvre la fenetre de dl d'un fichier
function open_pop( adresse ) {
	window.open(adresse, 'open_dl', 'height=1,width=1,channelmode=no,directories=no,left='+o3_x+',location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no,top='+o3_y+'');
}

//ouverture de pop-up (musique, smileys)
function ouvre_pop_up(page,width,height)
		{
			window.open(page,'newwindow','location=0,toolbar=0,directories=0,menubar=0,scrollbars=0,resizable=1,status=0,width='+ width +',height='+ height +',top=20,left=10');
	}



