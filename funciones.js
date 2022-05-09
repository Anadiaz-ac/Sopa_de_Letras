"use strict";

/**Este objeto contiene las funciones necesarias para crear la 'vista' de la sopa de letras,
 * que esencialmente se refiere a mostrar la sopa de letras y manejar los eventos del mouse. *
 * @author Noor Aftab
 * 
 * @param {Array[]} matrix - Array 2D que contiene la cuadrÃ­cula de bÃºsqueda de palabras llena
 * @param {Array[]} list -Array 2D que contiene la lista de palabras en la cuadrÃ­cula
 * @param {String} gameId - ID de div para el contenedor de bÃºsqueda de palabras
 * @param {String} listId - ID de div para el contenedor que muestra la lista de palabras para encontrar
 * @param {String} instructionsId - ID para el encabezado h2, para actualizar segÃºn sea necesario
 */

function WordSearchView(matrix, list, gameId, listId, instructionsId) {

	"use strict";

	//variable para almacenar si el rompecabezas fue resuelto por el jugador o por el botÃ³n de resolver
	var selfSolved = true;

	//Objeto para contener nombres de clase/id/atributo de uso frecuente
	var names = { 

		cell: "cell",
		pivot: "pivot",
		selectable: "selectable",
		selected: "selected",
		path: "path"

	};
 	
 	//objeto para contener selectores de clase/id de uso frecuente
	var select = {  

		cells: "." + names.cell,
		pivot: "#" + names.pivot,
		selectable: "." + names.selectable,
		selected: "." + names.selected

	};

	var searchGrid = {

		row: "row",
		column: "column"

	};

	/* crea la cuadrÃ­cula de la sopa de letras de la bÃºsqueda de palabras y la tabla que contiene la lista
	* de palabras para encontrar
	 */
	 this.setUpView = function() {

		createSearchGrid(matrix, names.cell, searchGrid.row, searchGrid.column, gameId);
		createListOfWords(list, listId);

	}

	/**  esta funcion hace una 'tabla' de divs para almacenar cada letra en la matriz
	* creado en wordsearchlogic.js
	 *
	 * @param {Array[]} matrix
	 * @param {String} cellName
	 * @param {String} rowAttr
	 * @param {String} colAttr
	 * @param {String} boardId
	 */
	function createSearchGrid(matrix, cellName, rowAttr, colAttr, boardId) {

		//recorre filas
		for (var i = 0; i < matrix.length; i++) {

			//crea un div para la fila de la tabla y le da una clase de fila
			var row = $("<div/>");
			row.attr({class: "boardRow"});  //solo se usÃ³ una vez, por lo que no estÃ¡ en una variable

			//recorre las columnas
			for (var j = 0; j < matrix[i].length; j++) {

				//cada letra en la fila es un elemento de botÃ³n
				var letter = $("<button/>");  //Se prefieren los botones para las acciones en las que se puede hacer clic.
				//a la letra se le asigna una clase de celda y se le asignan atributos de fila y columna
				letter.attr({
					class: cellName, 
					[rowAttr]: i, 
					[colAttr]: j}).text(matrix[i][j]); //establece el texto del botÃ³n en la matriz respectiva al index

				//agrega letra al elemento de fila mÃ¡s grande
				letter.appendTo(row);

			}

			//agrega la fila de letras al elemento de tablero de juego mÃ¡s grande
			row.appendTo($(boardId));
		}

	}

	/** Esta funciÃ³n crea un objeto de tipo tabla para insertar todas las palabras
	* contenido en el rompecabezas de bÃºsqueda de palabras! los jugadores se refieren a esta tabla
	* al buscar palabras para encontrar
	 *
	 * @param {Array[]} wordList una matriz de palabras para insertar en el contenedor de lista
	 * @param {String} wordListId la identificaciÃ³n del contenedor 
	 */
	function createListOfWords(wordList, wordListId) {

		//recorre filas
		for (var i = 0; i < wordList.length; i++) {

			//crea un div para la fila
			var row = $("<div/>");
			row.attr({class: "listRow"}); //gives the rows a list row class

			//recorre las columnas
			for (var j = 0; j < wordList[i].length; j++) {

				//cada palabra individual es un elemento de lista
				var word = $("<li/>");

				//se les da una clase de palabra de lista y un atributo que contiene su texto recortado (como en el rompecabezas)
				word.attr({class: "listWord", text: wordList[i][j].replace(/\W/g, "")});

				//texto dado de su index de lista respetado
				word.text(wordList[i][j]);

				//agregado al elemento de fila de la lista mÃ¡s grande
				word.appendTo(row);

			}

			//fila de palabras agregadas a la lista de palabras mÃ¡s grande div
			row.appendTo($(wordListId));

		}

	}

	/** Esta funciÃ³n resuelve el rompecabezas para el jugador
	 *
	 * @param {Object} loc un objeto que contiene las ubicaciones de todas las palabras para encontrar en la sopa de letras
	 * @param {Array[]} matrix la cuadrÃ­cula en la que se colocan las palabras
	 */
	this.solve = function(wordLoc, matrix) {

		/** convierte el objeto en un array y recorre cada Ã­ndice para encontrar
		* la palabra con las propiedades de coordenadas/orientaciÃ³n, configurando las palabras para encontrar
		 *
		 * @param {String} word - la palabra (recortada) colocada en el rompecabezas
		 */
		Object.keys(wordLoc).forEach(function(word) {  	

			//camino de la palabra
			var p = wordLoc[word].p;

			//el valor Y y x desde que comienza la palabra
			var startX = wordLoc[word].x;
			var startY = wordLoc[word].y;

			/** variables inicializadas: k - para longitud de palabra
			* x - para iniciar x/fila
			* y - para comenzar y/columna
			*
			* condiciones: k - menos que la longitud total de la palabra
			*
			* incrementos: k - incrementado en 1,
			* x & y - incrementado por funciones x & y para la ruta p dentro
			* objeto 'incr'
			 */
			for (var k = 0, x = startX, y = startY; k < word.length; k++, x = incr[p](x, y).x, y = incr[p](x, y).y) {

				//encuentra la celda del rompecabezas con el valor x e y respectivo y la establece como encontrada
				$(select.cells + "[row = " + x + "][column = " + y + "]").addClass("found");	

			}

			//establecido en falso ya que el programa lo resolviÃ³ para el jugador
			selfSolved = false;

			//comprueba si la palabra hecha es vÃ¡lida 
			validWordMade(list, word, instructionsId);	
	
		});

	}

	/** esta funciÃ³n encapsula todos los eventos del mouse para hacer un movimiento desglosÃ¡ndolo
	* en tres partes principales: presionando el mouse hacia abajo (mousedown), arrastrÃ¡ndolo (mouseenter),
	* y por ultimo soltando el mouse (mouseup)
	 */
	 this.triggerMouseDrag = function() {	

	 	//array vacÃ­o para almacenar las celdas seleccionadas en un movimiento
		var selectedLetters = [];

		// //cadena vacÃ­a para almacenar la palabra hecha por un
		var wordMade = ''; 

	 	//variable para almacenar si el mouse estÃ¡ presionado
		var mouseIsDown = false;	

	 	/** se ejecuta cuando se presiona el ratÃ³n sobre una letra en el
		* cuadrÃ­cula de bÃºsqueda
	 	 */
		$(select.cells).mousedown(function() {
			
			//establece que el mouse estÃ¡ abajo
			mouseIsDown = true;

			//selecciona la celda presionada
			$(this).addClass(names.selected);

			//establece la celda presionada para que sea el "pivote" del movimiento
			$(this).attr({id: names.pivot});

			//Resalta todas las rutas posibles que el usuario puede seguir para seleccionar mÃ¡s letras
			highlightValidDirections($(this), matrix, names.selectable);

		});

		/** este cÃ³digo se ejecuta cuando el mouse estÃ¡ presionado y el usuario comienza a mover su
		* ratÃ³n dentro del contenedor de rompecabezas
		 */
		$(select.cells).mouseenter(function() {  
			
			//asegura que el mouse estÃ© presionado y que la celda en la que se encuentra el mouse estÃ© en una ruta vÃ¡lida
			if (mouseIsDown && $(this).hasClass(names.selectable)) {  

				//mantiene la direcciÃ³n de la ruta en la que se encuentra actualmente el mouse
				var currentDirection = $(this).attr(names.path);  

				//anula la selecciÃ³n de las celdas seleccionadas
				for (var i = 0; i < selectedLetters.length; i++) {

					selectedLetters[i].removeClass(names.selected);

				}

				//vacÃ­a el array de letras seleccionadas
				selectedLetters = [];

				//vacÃ­a la cadena de la palabra que se estÃ¡ construyendo
				wordMade = '';

				//restablece el rango de celdas para seleccionar
				var cells = selectCellRange(select.cells, $(this), names.path, currentDirection, selectedLetters, wordMade);

				wordMade = cells.word;
				selectedLetters = cells.array;

			}

		});

		/** este cÃ³digo llama a la funciÃ³n endMove cuando se suelta el mouse; en su mayorÃ­a verifica
		* la palabra hecha y si es una palabra que se encuentra, asÃ­ como el restablecimiento de variables
		* para permitir otro movimiento
		 */
		$(select.cells).mouseup(function() {

			endMove();

		});

		/** si el usuario estÃ¡ jugando y mueve el mouse fuera de la cuadrÃ­cula de palabras, esta funciÃ³n
		* hace que el movimiento finalice automÃ¡ticamente - esto hace que presionar el mouse hacia abajo 
		 */
		$(gameId).mouseleave (function() {

			if (mouseIsDown) { //comprueba que el usuario estÃ¡ presionando el mouse hacia abajo (por lo tanto, jugando)

				endMove();

			}	

		});

		/** esta funciÃ³n maneja todo lo que debe consistir en el final de un movimiento: restablecer variables
		* para un nuevo movimiento y verificar si se ha hecho una palabra adecuada para encontrar
		 */
		function endMove() {

			//establece el mouse hacia abajo como falso ya que el mouse ahora estÃ¡ arriba
			mouseIsDown = false;

			//comprueba si se seleccionÃ³ una palabra de la lista
			if (validWordMade(list, wordMade, instructionsId)) {

				$(select.selected).addClass("found");

			}

			//anula la selecciÃ³n de las letras seleccionadas
			$(select.selected).removeClass(names.selected);

			//elimina los atributos de direcciÃ³n de cualquier celda (evita un comportamiento extraÃ±o)
			$(select.cells).removeAttr(names.path);

			//elimina la ID del pivote para que se pueda seleccionar un nuevo pivote
			$(select.pivot).removeAttr("id");

			//eliminar la seleccionabilidad de las celdas seleccionables
			$(select.selectable).removeClass(names.selectable);

			//vacÃ­a la cadena de palabras y el array de celdas seleccionadas
			wordMade = '';
			selectedLetters = [];

			}

	}

	/* resalta todas las direcciones vÃ¡lidas en la matriz desde donde se hace clic por primera vez con el mouse, como
	* arriba -> abajo, izquierda -> derecha, Â¡y ambas diagonales!
	*
	* @param {jQuery} selectedCell - Elemento DOM sobre el que presionÃ³ el mouse (Â¡una celda en el rompecabezas de bÃºsqueda de palabras!)
	* @param {Array[]} matriz - la matriz 2D del rompecabezas
	* @param {String} makeSelectable - selector para hacer que un elemento sea seleccionable
	 */
	function highlightValidDirections(selectedCell, matrix, makeSelectable) {

		//obtiene la fila y la columna donde estÃ¡ la celda en la que se presionÃ³ el mouse
		var cellRow = parseInt(selectedCell.attr(searchGrid.row));
		var cellCol = parseInt(selectedCell.attr(searchGrid.column));

		//convierte el objeto de rutas globales en una matriz
		Object.keys(paths).forEach(function(path) { ////path - each property's name (e.g. 'vert', 'priDiagBack')

			//hace que cada celda en cada una de las rutas sea seleccionable
			makeRangeSelectable(cellRow, cellCol, matrix.length, paths[path], makeSelectable);

		});

	}

	/** Estas funciones hacen que una ruta dada sea seleccionable pero le da a cada celda en la ruta una clase 'seleccionable'
	* esto hace que el jugador solo pueda seleccionar celdas en rutas especÃ­ficas (lo que hace que la selecciÃ³n sea vertical,	
* Â¡horizontalmente y en diagonal es mucho menos complicado
	 *
	 * @param {Number} x - coordenada x inicial/fila de la ruta
	 * @param {Number} y - coordenada y inicial/columna de la ruta
	 * @param {Number} l - longitud/tamaÃ±o de la matriz
	 * @param {String} p - nombre de la ruta (por ejemplo, vertical, primarioDiagonalAtrÃ¡s)
	 * @param {String} selectable - selector para hacer seleccionable un elemento DOM
	 */
	function makeRangeSelectable(x, y, l, p, selectable) {  

		/** variables inicializadas: x - fila inicial, incrementada para excluir el pivote
		* y - columna inicial, incrementada para excluir el pivote
		*
		* condiciÃ³n: x & y para mantenerse dentro de los lÃ­mites recomendados para la ruta p
		* (determinado por los lÃ­mites del objeto)
		*
		* incrementos: x & y - incrementados por la funciÃ³n determinada para la ruta p (por
		* objeto 'incr')
		 */
		for (var i = incr[p](x, y).x, j = incr[p](x, y).y;  //variables inicializadas
			bounds[p](i, j, l);  							//condiciÃ³n 
			i = incr[p](i, j).x, j=incr[p](i, j).y) {		//incrementos

			//seleccione los elementos DOM especÃ­ficos con los valores de atributo de fila/columna especÃ­ficos
			$("[" + searchGrid.row + "= " + i + "][" + searchGrid.column + "= " + j + "]")
				.addClass(selectable) //lo hace seleccionable
				.attr({[names.path]: p}); //le da un atributo de ruta con el valor de p

		}

	}

	/** esta funciÃ³n encuentra y selecciona el rango de celdas desde el pivote (primera celda seleccionada) hasta
	* la celda sobre la que el mouse estÃ¡ actualmente, yendo de un extremo a otro en el rompecabezas
	* matriz
	 *
	 * @param {String} cellsSelector - nombre del selector para celdas en la cuadrÃ­cula de bÃºsqueda
	 * @param {Array} selectedCells
	 * @param {jQuery} hoveredCell - celda sobre la que se mueve el ratÃ³n
	 * @param {String} pathAttr - atributo de ruta/direcciÃ³n
	 * @param {String} path - valor del atributo de ruta
	 * @param {String} wordConstructed - palabra que el usuario hace arrastrando en la sopa de letras
	 * @return devuelve un objeto que contiene: la palabra construida y la matriz de celdas DOM seleccionadas.
	 */
	function selectCellRange(cellsSelector, hoveredCell, pathAttr, path, selectedCells, wordConstructed) {

		//variable para mantener el Ã­ndice de la celda sobre la que se moviÃ³ el cursor
		var hoverIndex;

		//variable para mantener el Ã­ndice de pivote
		var pivotIndex;  

		//selector de celdas en la ruta particular en la que se encuentra el mouse
		var cellRange = cellsSelector + "[" + pathAttr + " =" + path + "]";

		//establecer Ã­ndices dependiendo de cÃ³mo fluyen los caminos
		switch(path) {

			case paths.vert:
			case paths.horizon:
			case paths.priDiag: 
			case paths.secDiag:				

				//hoverIndex > pivotIndex 
				hoverIndex = hoveredCell.index(cellRange)+1;
				pivotIndex = 0;

				//configura wordConstructed con la letra del pivote (para comenzar)
				wordConstructed = $(select.pivot).text();

				//usando el texto dinÃ¡mico, selecciona celdas y agrega su texto a wordConstructed
				wordConstructed = selectLetters(selectedCells, wordConstructed, cellRange, pivotIndex, hoverIndex);
				

				break;
			
			case paths.vertBack:   
			case paths.horizonBack:
			case paths.priDiagBack:
			case paths.secDiagBack:

				//hoverIndex < pivotIndex
				hoverIndex = hoveredCell.index(cellRange);
				pivotIndex = $(cellRange).length;

				//selecciona el rango de celdas entre el pivote y la celda en la que se encuentra el mouse
			 	wordConstructed += selectLetters(selectedCells, wordConstructed, cellRange, hoverIndex, pivotIndex);

			 	//agrega texto pivote al final
				wordConstructed += $(select.pivot).text();

				break;

		}

		return {word: wordConstructed, array: selectedCells};
		
	}

	/** esta funciÃ³n selecciona el rango de celdas entre la celda pivote y la
	* la celda sobre la que se pasa el mouse y agrega su texto a la cadena de la palabra construida
	 *
	 * @param {Array} selectedCells - matriz para contener
	 * @param {String} wordConstructed - Palabra siendo creada por el usuario
	 * @param {String} range - la ruta en la que seleccionar las celdas
	 * @param {Number} lowerIndex - index de la celda inferior
	 * @param {Number} upperIndex - index de la celda superior
	 * @return devuelve la palabra creada durante el proceso de selecciÃ³n
	 */
	function selectLetters(selectedCells, wordConstructed, range, lowerIndex, upperIndex) {

		//solo pasa por el rango entre el pivote y donde sea que estÃ© el mouse en el camino
		$(range).slice(lowerIndex, upperIndex).each(function() {

			//selecciona la celda
			$(this).addClass(names.selected);

			//lo agrega a la matriz de celdas
			selectedCells.push($(this));

			//actualiza la palabra que se estÃ¡ creando para incluir la letra de la celda mÃ¡s nueva
			wordConstructed += $(this).text();

		});

		return wordConstructed;

	}
	
	/** comprueba si la palabra que un usuario hizo despuÃ©s de un movimiento es una palabra real para encontrar, y
	* si es asÃ­, Â¡Â¿establece la palabra como encontrada, de lo contrario, no pasa nada (por lo que el movimiento es
	* esencialmente ignorado)
	 *
	 * @param {Array[]} wordList - matriz de palabras en la cuadrÃ­cula
	 * @param {String} wordToCheck - palabra para comprobar la validez
	 * @param {String} instructionsId - selector para el rumbo h2
	 * @return verdadero si la palabra hecha es una palabra en la lista
	 */
	function validWordMade (list, wordToCheck, instructionsId) {

		//recorre filas
		for (var i = 0; i < list.length; i++) {

			//recorre las columnas
			for (var j = 0; j < list[i].length; j++) {

				//recorta la palabra en el index (para facilitar la comparaciÃ³n)
				var trimmedWord = list[i][j].replace(/\W/g, "")

				//si la palabra creada por el usuario es la misma que la palabra recortada, o al revÃ©s
				if (wordToCheck == trimmedWord ||
					wordToCheck == reversedWord(trimmedWord)) {
					
					//establece la palabra dentro del div de la lista como se encuentra (cambia de color, tacha el texto)
					$(".listWord[text = " + trimmedWord + "]").addClass("found");

					//comprueba si se encontrÃ³ la Ãºltima palabra a buscar
					checkPuzzleSolved(".listWord", ".listWord.found", instructionsId);
					
					return true;
									
				}

			}

		}

	}	

	/** comprueba si se han encontrado todas las palabras del acertijo, quÃ© mÃ©todo se utilizÃ³ para
		resuelver el rompecabezas y actualizar el tÃ­tulo de instrucciones h2 en consecuencia
	 *
	 * @param {String} fullList - selector de palabras en la lista de palabras div
	 * @param {String} foundWordsList - selector encontrÃ³ palabras en la lista de palabras div
	 * @param {String} instructionsId - selector para encabezado de instrucciones h2
	 * @return verdadero si se ha resuelto toda la sopa de letras
	 */
	function checkPuzzleSolved (fullList, foundWordsList, instructionsId) {

		//si se han encontrado todas las palabras de la lista a buscar (nÂ° de palabras a buscar == nÂ° de palabras encontradas)
		if ($(fullList).length == $(foundWordsList).length) {

			//si el usuario resolviÃ³ el rompecabezas por sÃ­ mismo
			if (selfSolved) {

				//actualiza el texto h2
				$(instructionsId).text("Felicidades");

			}

			//Si el usuario usÃ³ el botÃ³n resolver
			else {

				//actualiza el texto h2
				$(instructionsId).text("Lo haremos por ti");

			}	

			return true;

 		}

 		return false;

	}

	/** 
	 *
	 * @param {String} word -palabra para invertir
	 * @return la palabra al revÃ©s
	 */
	function reversedWord(word) {

		//crea una cadena vacÃ­a para almacenar la palabra invertida
		var reversedWord = "";

		//recorre desde el final de la palabra hasta el principio (en lugar del tradicional principio a fin)
		for (var i = word.length - 1; i >= 0; i--) {

			//agrega el carÃ¡cter a la palabra invertida
			reversedWord += word.charAt(i);

		}

		return reversedWord;

	}

}