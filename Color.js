/** 
 * array of dark colors, to be able to switch to white text
 */
var darks = [ 'Navy', 
			'blue', 
			'DarkGreen', 
			'MediumBlue', 
			'Black' ];

/** try to 'guess' if text show better in black or white on the given color */
function letter_color(color)
{
	for (c in darks) {
		//pa(color.toLowerCase());
		if (color.toLowerCase() == darks[c].toLowerCase()) return 'white';
	}
	// opera makes rgb from named colors so 
	return letter_rgb(color);
}

/** @ignore */
function letter_rgb(color)
{
	if (color[0] != '#') {
        return 'black';
	}
	r = color.substring(1,3);
	g = color.substring(3,5);
	b = color.substring(5,7);
    rather_crued= parseInt(r,16) + parseInt(g,16) + parseInt(b,16);
    if (rather_crued < 200) return 'white';  //natte vinger !
	return 'black'; // default color;
}

