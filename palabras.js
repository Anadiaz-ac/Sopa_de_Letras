"use strict";

/** Este objeto configura el juego de bÃºsqueda de palabras, asÃ­ como las funciones de los botones (para resolver
 * y para actualizar o configurar un nuevo juego).
 * 
 * @author Noor Aftab
 *	
 * @param {String} gameId ID del div del juego de bÃºsqueda de palabras (donde va la cuadrÃ­cula real de letras)
 * @param {String} listId ID del div donde va la lista de palabras a buscar
 * @param {String} solveId ID para el botÃ³n para resolver la sopa de letras
 * @param {String} newGameId ID del botÃ³n para iniciar un nuevo juego
 * @param {String} instructionsId ID para el encabezado h2 (para actualizar el texto con mayor facilidad)
 * @param {String} themeId ID de la parte del encabezado h3 (para mostrar el tema de la bÃºsqueda de palabras)
 */

function WordSearchController(gameId, listId, solveId, newGameId, instructionsId, themeId) {

	//Objeto que contiene varias palabras sobre el tema del juego(en este caso sobre programaciÃ³n web)
	var searchTypes = {

		"Programacion Web": [["etiquetas", "web", "cascada", "diseño"],
			["pagina", "creatividad", "patron", "entorno"],
			["editor", "gráfico", "repositorio", "estilo"],
			["html", "codigo", "puerto", "desarrollo"],
			["git",  "figma",  "cliente", "servidor"]],
	
	};
	//variables para almacenar la lÃ³gica y la vista del juego
	var game;
	var view;

	//instrucciones para mostrar en el encabezado h2
	var mainInstructions = "Para marcar una palabra, debes presionar la letra y arrastrar";

	//FunciÃ³n para iniciar la busqueda de palabras del juego
	setUpWordSearch();

	/**Elige aleatoriamente un tema de palabras y configura la matriz del juego y el juego
     * muestra el tema con las palabras
	 */
	function setUpWordSearch() {

		//Genera un tema aleatorio
		var searchTypesArray = Object.keys(searchTypes); //convierte el objeto del tema en una matriz
		var randIndex = Math.floor(Math.random()*searchTypesArray.length); //genera un nÃºmero/index aleatorio
		var listOfWords = searchTypes[searchTypesArray[randIndex]]; //recupera la matriz de palabras del index aleatorio

		//convierte las letras a mayusculas
		convertToUpperCase(listOfWords); 

		//Establece los encabezados para reflejar las instrucciones y los temas
		updateHeadings(mainInstructions, searchTypesArray[randIndex]);

		//Ejecuta la lÃ³gica del juego usando un cierre de la lista de palabras (para evitar que se altere el objeto real)
		game = new WordSearchLogic(gameId, listOfWords.slice());
		game.setUpGame();

		//Genera la vista del juego y configura los eventos del mouse para hacer clic y arrastrar
		view = new WordSearchView(game.getMatrix(), game.getListOfWords(), gameId, listId, instructionsId);
		view.setUpView();
		view.triggerMouseDrag();

	}

	/**Convierte una matriz 2D dada en palabras a mayÃºsculas
	 *
	 * @param {String[][]} wordList Una matriz de palabras para convertir a mayÃºsculas
	 */
	function convertToUpperCase(wordList)  {

		for (var i = 0; i < wordList.length; i++) {

			for(var j = 0; j < wordList[i].length; j++) {

				wordList[i][j] = wordList[i][j].toUpperCase();

			}

		}

	}

	/** Actualiza los encabezados de instrucciones (h2) y tema (h3) de acuerdo con el
	* parÃ¡metro del texto
	 *
	 * @param {String} instructions Texto para establecer el encabezado h2 
	 * @param {String} theme Texto para establecer el elemento del tema h3 
	 */
	function updateHeadings(instructions, theme) {

		$(instructionsId).text(instructions);
		$(themeId).text(theme);

	}

	/** Resuelve la sopa de letras cuando se hace clic en el botÃ³n de resolver
	 *
	 * @event WordSearchController#click
	 * @param {function} function para ejecutar con un clic del mouse
	 */
	$(solveId).click(function() {

		view.solve(game.getWordLocations(), game.getMatrix());

	});

	/** vacÃ­a el juego y la lista de divs y los reemplaza con una nueva configuraciÃ³n, modelado
	 * un efecto de 'actualizar' cuando se hace clic en el botÃ³n
	 *
	 * @param {function} function ejecutar con un clic del mouse para un nuevo modelo de sopa de letras
	 */
	$(newGameId).click(function() {

		//vacÃ­a los elementos del juego y de la lista, asÃ­ como el elemento span del tema h3
		$(gameId).empty();
		$(listId).empty();
		$(themeId).empty();

		//llama a la configuraciÃ³n para crear un nuevo juego de bÃºsqueda de palabras
		setUpWordSearch();

	})

}