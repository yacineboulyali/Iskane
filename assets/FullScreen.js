
/** @namespace */
var THREEx = THREEx || {};
THREEx.FullScreen = THREEx.FullScreen || {};

/**
 * test s'il est possible d'avoir le plein écran
 * 
 * @returns {Boolean} true si une API plein écran est disponible, false sinon
*/
THREEx.FullScreen.available = function ()
{
	renvoyer this._hasWebkitFullScreen || this._hasMozFullScreen;
}

/**
 * test si le plein écran est actuellement activé
 * 
 * @returns {Boolean} true si le mode plein écran est actuellement activé, false sinon
*/
THREEx.FullScreen.activated = function ()
{
	if (this._hasWebkitFullScreen) {
		return document.webkitIsFullScreen;
	} else if (this._hasMozFullScreen) {
		retourner document.mozFullScreen;
	}autre{
		console.assert (false);
	}
}

/**
 * Demande en plein écran sur un élément donné
 * @param {DomElement}, élément pour passer en plein écran. optionnel. défaut à document.body
*/
THREEx.FullScreen.request = fonction (élément)
{
	élément = élément || document.body;
	if (this._hasWebkitFullScreen) {
		element.webkitRequestFullScreen ();
	} else if (this._hasMozFullScreen) {
		element.mozRequestFullScreen ();
	}autre{
		console.assert (false);
	}
}

/**
 * Annuler le plein écran
*/
THREEx.FullScreen.cancel = function ()
{
	if (this._hasWebkitFullScreen) {
		document.webkitCancelFullScreen ();
	} else if (this._hasMozFullScreen) {
		document.mozCancelFullScreen ();
	}autre{
		console.assert (false);
	}
}

// fonctions internes pour savoir quelle implémentation d'API plein écran est disponible
THREEx.FullScreen._hasWebkitFullScreen = 'webkitCancelFullScreen' dans le document? vrai faux;	
THREEx.FullScreen._hasMozFullScreen = 'mozCancelFullScreen' dans le document? vrai faux;	
