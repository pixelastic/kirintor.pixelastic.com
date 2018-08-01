var weekend = [0,6];
var gNow = new Date();
var ggWinContent;
var ggPosX = -1;
var ggPosY = -1;

Calendar.Months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
"Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

// Non-Leap year Month days..
Calendar.DOMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// Leap year Month days..
Calendar.lDOMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//Constructeur de la classe Calendar
function Calendar(p_item, p_month, p_year, p_format) {
	if ((p_month == null) && (p_year == null))	return;

	//Si on ne précise pas de mois, alors calendrier de l'année
	if (p_month == null) {
		this.gMonthName = null;
		this.gMonth = null;
		this.gYearly = true;
	} else {
		this.gMonthName = Calendar.get_month(p_month);
		this.gMonth = new Number(p_month);
		this.gYearly = false;
	}

	this.gYear = p_year;
	this.gFormat = p_format;
	this.gBGColor = "white";
	this.gFGColor = "black";
	this.gTextColor = "black";
	this.gHeaderColor = "black";
	this.gReturnItem = p_item;
}

//définitions de fonctions barbare...
Calendar.get_month = Calendar_get_month;
Calendar.get_daysofmonth = Calendar_get_daysofmonth;
Calendar.calc_month_year = Calendar_calc_month_year;

//Retourne le nom du mois en fonction de son numero (0-11) i.e sa place dans le tableau
function Calendar_get_month(monthNo) {
	return Calendar.Months[monthNo];
}

//Retourne le nombre de jours dans un mois
function Calendar_get_daysofmonth(monthNo, p_year) {
	/* 
	Les années divisibles par 4 sont bissextiles...
	Sauf si elles sont aussi divisibles par 100...
	Mais sont quand même bissextiles si divisible par 400
	*/
	if ((p_year % 4) == 0) {
		if ((p_year % 100) == 0 && (p_year % 400) != 0)
			return Calendar.DOMonth[monthNo];
		return Calendar.lDOMonth[monthNo];
	} else
		return Calendar.DOMonth[monthNo];
}

//Retourne un tableau à deux valeurs, la premiere le mois, la seconde l'année
//calculée à partir du mois et de l'année donnée +/- incr
function Calendar_calc_month_year(p_Month, p_Year, incr) {
	var ret_arr = new Array();
	
	switch (incr) {
	case (-1) :
		// En arriere
		if (p_Month == 0) {
			//Année précédente, Décembre
			ret_arr[0] = 11;
			ret_arr[1] = parseInt(p_Year) - 1;
		}
		else {
			//Même année, un mois de moins
			ret_arr[0] = parseInt(p_Month) - 1;
			ret_arr[1] = parseInt(p_Year);
		}
	break;
	case (1) :
		// En avant
		if (p_Month == 11) {
			//Année suivante, Janvier
			ret_arr[0] = 0;
			ret_arr[1] = parseInt(p_Year) + 1;
		}
		else {
			//Même année, un mois de plus
			ret_arr[0] = parseInt(p_Month) + 1;
			ret_arr[1] = parseInt(p_Year);
		}
	break;
	}
	
	return ret_arr;
}

// (Compatibilité Netscape 3... on doit créer une instance avant de pouvoir définir le prototype)
new Calendar();

//retourne le code complet du calendrier du mois
Calendar.prototype.getMonthlyCalendarCode = function() {
	var vCode = "";
	var vHeader_Code = "";
	var vData_Code = "";
	
	vCode += ("<div align='center'><table class='overlib_calendar'>");
	
	vHeader_Code = this.cal_header();
	vData_Code = this.cal_data();
	vCode += (vHeader_Code + vData_Code);
	
	vCode += "</div></table>";
	
	return vCode;
}

//Retourne la ligne des jours du mois
Calendar.prototype.cal_header = function() {
	vCode = "<tr class='overlib_calendar_jours'>";
	vCode+= "<td>Dim</td>";
	vCode+= "<td>Lun</td>";
	vCode+= "<td>Mar</td>";
	vCode+= "<td>Mer</td>";
	vCode+= "<td>Jeu</td>";
	vCode+= "<td>Ven</td>";
	vCode+= "<td>Sam</td>";
	vCode+= "</tr>";	
	return vCode;
}

//retourne la classe pour aujourd'hui
Calendar.prototype.class_today = function(vday) {
	var vNowDay = gNow.getDate();
	var vNowMonth = gNow.getMonth();
	var vNowYear = gNow.getFullYear();

	if (vday == vNowDay && this.gMonth == vNowMonth && this.gYear == vNowYear)
		return ("class='calendar_today' ");
	else
		return "";
}

//Rajoute la classe weekend si jamais on est dans le we
Calendar.prototype.write_weekend_string = function(vday) {
	var i;
	for (i=0; i<weekend.length; i++) {
		if (vday == weekend[i])
			return (" class='weekend' ");
	}
	return "";
}

Calendar.prototype.cal_data = function() {
	//premier du mois de l'année selectionné
	var vDate = new Date();
	vDate.setDate(1);
	vDate.setMonth(this.gMonth);
	vDate.setFullYear(this.gYear);

	var vFirstDay=vDate.getDay(); //"numero" du jour (0-6)
	var vDay=1;
	var vLastDay=Calendar.get_daysofmonth(this.gMonth, this.gYear); //nombre jours ds le mois
	var vOnLastDay=0;
	var vCode = "";

	/*
		On mets des cases blanches du début au premier jour 
	*/
	vCode = vCode + "<tr>";
	for (i=0; i<vFirstDay; i++) {
		vCode = vCode + "<td " + this.write_weekend_string(i) + "></td>";
	}

	// On écrit la fin de la première semaine
	for (j=vFirstDay; j<7; j++) {
		vCode+= '<td ' + this.write_weekend_string(j) + '>' + 
			'<a href="javascript:void(0);" '  + 
			'onClick="put_in_form(\'' + this.gReturnItem +'\','+vDay+','+this.gMonth+','+this.gYear+');nd();nd();"' + this.class_today(vDay) + '>' + vDay + '</a></td>';
		vDay=vDay + 1;
	}

	vCode = vCode + "</tr>"; //On ferme la première ligne
	

	// On écrit les autres lignes
	for (k=2; k<7; k++) {
		vCode+= "<tr>";

		for (j=0; j<7; j++) {
			vCode+= '<td ' + this.write_weekend_string(j) + '>' + 
			'<a href="javascript:void(0);" '  + 
				'onClick="put_in_form(\'' + this.gReturnItem +'\','+vDay+','+this.gMonth+','+this.gYear+');nd();nd();"' + this.class_today(vDay) + '>' + 
				vDay + 
			'</a></td>';
			vDay=vDay + 1;

			//Si je vais dépasser le dernier jour je m'arrete
			if (vDay > vLastDay) {
				vOnLastDay = 1;
				break;
			}
		}

		//Si je suis arrivé à la fin de la ligne, je passe à la suivante
		if (j == 6)	vCode = vCode + "</tr>";
		if (vOnLastDay == 1) break; //Si je me suis arrété en cours de route (i.e dernier jour du mois) je ne continue pas
	}
	
	// Et on termine la fin comme on a commencé, avec des carrés blancs vides
	for (m=1; m<(7-j); m++) {
		vCode+= "<td " + this.write_weekend_string(j+m) +" class='en_trop'>" + m + "</td>";
	}
	
	return vCode;
}

Calendar.prototype.show = function() {
	var vCode = "";

	// Mois/année du calendrier
	ggWinContent += '<div class="overlib_calendar_mois">';
	ggWinContent += "<span>"+ (this.gMonthName + " " + this.gYear) + "</span>";
	
	// On trouve les mois/année suivantes/précédentes
	var prevMMYYYY = Calendar.calc_month_year(this.gMonth, this.gYear, -1);
	var prevMM = prevMMYYYY[0];
	var prevYYYY = prevMMYYYY[1];

	var nextMMYYYY = Calendar.calc_month_year(this.gMonth, this.gYear, 1);
	var nextMM = nextMMYYYY[0];
	var nextYYYY = nextMMYYYY[1];
	
	ggWinContent += '<div style="float:left">';
	
	ggWinContent += '[ <a href="javascript:void(0);" onClick="Build(\'' + this.gReturnItem + '\', \'' + this.gMonth + '\', \'' + (parseInt(this.gYear)-1) + '\', \'' + this.gFormat + '\');"> << Année</a> ]';
	ggWinContent += '[ <a href="javascript:void(0);" onClick="Build(\'' + this.gReturnItem + '\', \'' + prevMM + '\', \'' + prevYYYY + '\', \'' + this.gFormat + '\');"> << Mois</a> ]';
	
	ggWinContent += '</div>';
	
	
	ggWinContent += '<div style="float:right">';
	
	ggWinContent += '[ <a href="javascript:void(0);" onClick="Build(\'' + this.gReturnItem + '\', \'' + nextMM + '\', \'' + nextYYYY + '\', \'' + this.gFormat + '\');"> Mois >></a> ]';
	ggWinContent += '[ <a href="javascript:void(0);" onClick="Build(\'' + this.gReturnItem + '\', \'' + this.gMonth + '\', \'' + (parseInt(this.gYear)+1) + '\', \'' + this.gFormat + '\');"> Année >></a> ]';
	
	ggWinContent += '</div>';
	ggWinContent += '<div style="clear:both"></div></div>';
	
	// On rajoute ensuite le code du calendrier du mois
	vCode = this.getMonthlyCalendarCode();
	ggWinContent += vCode;
}


/*
On remplit les champs du formulaire automatiquement
{cal_form_field}_day {cal_form_field}_month {cal_form_field}_year
*/
function put_in_form(cal_form_field, cal_form_day, cal_form_month, cal_form_year) {
	eval("document.getElementById('" + cal_form_field + "_day').value = " +cal_form_day);
	document.getElementById(cal_form_field + '_month_' + (cal_form_month+1) ).selected = true;
	eval("document.getElementById('" + cal_form_field + "_year').value = " +cal_form_year);	
}


Calendar.prototype.format_data = function(p_day) {
	var vData;
	var vMonth = 1 + this.gMonth; //les mois sont du 0-11 dans l'array
	vMonth = (vMonth.toString().length < 2) ? "0" + vMonth : vMonth; //On préfixe d'un 0 si <10
	var vMon = Calendar.get_month(this.gMonth).substr(0,3).toUpperCase(); //
	var vFMon = Calendar.get_month(this.gMonth).toUpperCase();
	var vY4 = new String(this.gYear);
	var vY2 = new String(this.gYear.substr(2,2));
	var vDD = (p_day.toString().length < 2) ? "0" + p_day : p_day;

	switch (this.gFormat) {
		case "MM\/DD\/YYYY" :
			vData = vMonth + "\/" + vDD + "\/" + vY4;
			break;
		case "MM\/DD\/YY" :
			vData = vMonth + "\/" + vDD + "\/" + vY2;
			break;
		case "MM-DD-YYYY" :
			vData = vMonth + "-" + vDD + "-" + vY4;
			break;
		case "YYYY-MM-DD" :
			vData = vY4 + "-" + vMonth + "-" + vDD;
			break;
		case "MM-DD-YY" :
			vData = vMonth + "-" + vDD + "-" + vY2;
			break;
		case "DD\/MON\/YYYY" :
			vData = vDD + "\/" + vMon + "\/" + vY4;
			break;
		case "DD\/MON\/YY" :
			vData = vDD + "\/" + vMon + "\/" + vY2;
			break;
		case "DD-MON-YYYY" :
			vData = vDD + "-" + vMon + "-" + vY4;
			break;
		case "DD-MON-YY" :
			vData = vDD + "-" + vMon + "-" + vY2;
			break;
		case "DD\/MONTH\/YYYY" :
			vData = vDD + "\/" + vFMon + "\/" + vY4;
			break;
		case "DD\/MONTH\/YY" :
			vData = vDD + "\/" + vFMon + "\/" + vY2;
			break;
		case "DD-MONTH-YYYY" :
			vData = vDD + "-" + vFMon + "-" + vY4;
			break;
		case "DD-MONTH-YY" :
			vData = vDD + "-" + vFMon + "-" + vY2;
			break;
		case "DD\/MM\/YYYY" :
			vData = vDD + "\/" + vMonth + "\/" + vY4;
			break;
		case "DD\/MM\/YY" :
			vData = vDD + "\/" + vMonth + "\/" + vY2;
			break;
		case "DD-MM-YYYY" :
			vData = vDD + "-" + vMonth + "-" + vY4;
			break;
		case "DD-MM-YY" :
			vData = vDD + "-" + vMonth + "-" + vY2;
			break;
		default :
			vData = vMonth + "\/" + vDD + "\/" + vY4;
	}

	return vData;
}

function Build(p_item, p_month, p_year, p_format) {
	gCal = new Calendar(p_item, p_month, p_year, p_format);

	ggWinContent = "";

	//On affiche
	gCal.show();
	eval("var pos_x = getX(document.getElementById('img_calendar_" + p_item + "')) + 25");
	eval("var pos_y = getY(document.getElementById('img_calendar_" + p_item + "')) - 115");
	if (pos_y<0) pos_y=0;

	
	//var pos_x = getX(document.getElementById('img_calendar_sejour_fin')) + 20;
	//var pos_y = getY(document.getElementById('img_calendar_sejour_fin'));
	
	overlib(ggWinContent, STICKY, CLOSECLICK, CSSSTYLE,
			TEXTSIZEUNIT, "pt", TEXTSIZE, 8, CAPTIONSIZEUNIT, "pt", CAPTIONSIZE, 8, CLOSESIZEUNIT, "pt", CLOSESIZE, 8,
			CAPTION, "Choisissez une date", FIXX, pos_x, FIXY, pos_y);
			
	/*
	Version qui marche sous IE
	//On va trouver la position du calendrier, et on affiche le calendrier à coté
	eval("var pos_x = document.getElementById('img_calendar_" + p_item + "').x + 20");
	eval("var pos_y = document.getElementById('img_calendar_" + p_item + "').y");
	alert(pos_y);
	
	*/

	/*
	// Premiere apparition (i.e pas de Next / Prev) alors on affiche à coté
	if (ggPosX == -1 && ggPosY == -1) {
		
		
		overlib(ggWinContent, STICKY, CLOSECLICK, CSSSTYLE,
			TEXTSIZEUNIT, "pt", TEXTSIZE, 8, CAPTIONSIZEUNIT, "pt", CAPTIONSIZE, 8, CLOSESIZEUNIT, "pt", CLOSESIZE, 8,
			CAPTION, "Choisissez une date", FIXX, pos_x, FIXY, pos_y);
		//On sauvegarde la position pour rester au mm endroit si >> ou <<
		if ( (ns4) || (ie4) ) {
		        ggPosX = parseInt(over.left);
		        ggPosY = parseInt(over.top);
			} else if (ns6) {
			ggPosX = parseInt(over.style.left);
			ggPosY = parseInt(over.style.top);
			}
		}
	else {
		// Position sauvegardée, on l'y affiche
		overlib(ggWinContent, AUTOSTATUSCAP, STICKY, CLOSECLICK, CSSSTYLE,
			TEXTSIZEUNIT, "pt", TEXTSIZE, 8, CAPTIONSIZEUNIT, "pt", CAPTIONSIZE, 8, CLOSESIZEUNIT, "pt", CLOSESIZE, 8,
			CAPTION, "Choisissez une date", FIXX, pos_x, FIXY, pox_y);
		}
	*/
}



function show_calendar() {
	/*
		argument[0] = Le champ de formulaire à remplir
		argument[1] = spécification du mois (actuel par défaut)
		argument[2] = spécification de l'année (actuel par défaut)
		argument[3] = type de résultat (mm/dd/yyyy, dd/mm/yyyy)		
	*/
	p_item = arguments[0];
	if (arguments[1] == null || arguments[1]==-1)
		p_month = new String(gNow.getMonth());
	else
		p_month = arguments[1];
	if (arguments[2] == "" || arguments[2] == null)
		p_year = new String(gNow.getFullYear().toString());
	else
		p_year = arguments[2];
	if (arguments[3] == null)
		p_format = "YYYY-MM-DD";
	else
		p_format = arguments[3];
	Build(p_item, p_month, p_year, p_format);
}

/* Trouve la position d'un élément dans la page
Mozzila trouve la position exacte à partir des .x et .y mais IE ne connait pas
Il utilise .offsetLeft et .offsetTop (Mozzy aussi) mais ils les placent différemment, chacun en fonction du <div, <span conteneur
mais ils ne considérent pas tous les mêmes balises comme des conteneurs ou non... td, li, etc
Donc on fait une boucle à partir de l'élement parent .offsetParent jusqu'à ce qu'il n'y ai plus de parent, on additionne les positions à chaque fois et on aura la vraie position à la fin !
*/
function getX(obj)
{
	var ret = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			ret += obj.offsetLeft;
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)	ret += obj.x;
	return ret;
}

function getY(obj) {
	var ret = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			ret += obj.offsetTop;
			obj = obj.offsetParent;
		}
	}
	else if (obj.y) ret += obj.y;
	return ret;
}
