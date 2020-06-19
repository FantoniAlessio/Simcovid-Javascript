
// registriamo l'id dell'animazione fornito da requestAnimationFrame
// in partenza questo valore sarà null
idSimulazione = null;
// vogliamo dare la possibilità di interrompere l'animazione
// di predefinito non vi è alcuna chiamata stop ovviamente
stop = false;
 
// questa funzione viene chiamata quando si clicca sul pulsante INIZIA
function simulazione() {
	
	/* GESTIONE DEL PULSANTE - INIZIO */
	// leggiamo il valore del pulsante
	var pulsante = document.getElementById("inizia").value;
	
	// se il testo è FERMA, dobbiamo fermare l'animazione
	if( pulsante == "FERMA" ) {
	// cancelliamo la chiamata al browser per effettuare l'animazione
	window.cancelAnimationFrame( idSimulazione );
	// impostiamo stop su true, in modo da fermare i cicli di seguito
	stop = true;
	// cambiamo il valore del pulsante su inizia
	document.getElementById("inizia").value = "INIZIA";
	// altrimenti la iniziamo
	} else {
	stop = false;
	// cambiamo il valore del pulsante su ferma
	document.getElementById("inizia").value = "FERMA";
	}
	/* GESTIONE DEL PULSANTE - FINE */
	
	// preleviamo il riferimento al canvas delle particelle
	var canvas = document.getElementById("particelle");
	var ctx = canvas.getContext("2d");
	
	

	

	
	// queste sono le pareti del nostro spazio
	var pareti = [
	[5,5],
	[795,5],
	[795,595],
	[5,595]
	];
	
	// preimpostiamo tutti i valori
	var pallini = [];
	// popolazione
	var npallini = document.getElementById("npallini").value ? document.getElementById("npallini").value : 800;
	// n malati
	var nmalati = document.getElementById("nmalati").value ? document.getElementById("nmalati").value : 1;
	// n di quelli fermi
	var nfermi = document.getElementById("nfermi").value ? document.getElementById("nfermi").value : 600;
	// tempo di guarigione
	var tempoguarigione = document.getElementById("tempoguarigione").value ? document.getElementById("tempoguarigione").value : 2000;
	
	// altre variabili per il funzionamento del sistema
	var maxmalati = 0;	
	var frame = 0;
	var start = new Date().getTime() / 1000;
	
	// predisponiamo tutte le palline in modo casuale
	// ogni pallino rappresenta un membro della popolazione
	var pallinicalc = [];
	for( i = 0; i < npallini; i++ ) {
	var x = Math.floor(Math.random() * (canvas.width-20)) + 10;
	var y = Math.floor(Math.random() * (canvas.height-20)) + 10;
	var pos = [x, y];
	// verifichiamo che la posizione non sia già esistente, in tal caso non
	// aggiungiamo il pallino al numero totale
	var trovato = false;
	for( j = 0; j < pallinicalc.length; j++ ) {
	if(JSON.stringify(pos)==JSON.stringify(pallinicalc[j])) {
	trovato = true;
	}
	}
	if( !trovato ) {
	pallinicalc.push(pos);
	} else {
	i--; // se la posizione esiste di già, torniamo di uno indietro e riproviamo
	}
	}
	
	// con questa classe gestiamo ogni membro della popolazione
	class Pallino {
	
	constructor(x, y, stato, direzione, velocita) {
	this.x = x;
	this.y = y;
	// 0 = sano, 1 = malato, 2 = guarito
	this.stato = stato;
	// valore in pi-greco
	this.direzione = direzione;
	this.velocita = velocita;
	this.raggio = 5;
	// il tempo ci servirà per valure la guarigione
	this.tempo = stato ? new Date().getTime() : 0;
	}
	
	// calcoliamo l'urto sulle pareti
	// nel mio caso ho considerato solamente pareti verticali ed orizzontali
	urtoParete() {
	var nPareti = pareti.length;
	for( vi = 0; vi < nPareti; vi++ ) {
	var vf = vi < nPareti - 1 ? vi + 1 : 0;
	// calcoliamo il coefficiente angolare della parete
	var a = (pareti[vf][1]-pareti[vi][1])/(pareti[vf][0]-pareti[vi][0]);
	// parete orizzontale
	if( isFinite( a ) ) {
	var b = -1;
	var c = -a * pareti[vi][0] + pareti[vi][1];
	
	var d = Math.abs(a * this.x + b * this.y + c) / Math.sqrt(a*a+b*b);
	// invertiamo velocità e direzione
	if( d <= this.raggio ) {
	this.direzione = -this.direzione;
	this.velocita = this.velocita;
	}
	// parete verticale
	} else {
	// invertiamo velocità e direzione
	if( Math.abs( this.x - pareti[vf][0] ) <= this.raggio ) {
	this.direzione = -this.direzione;
	this.velocita = -this.velocita;
	}
	}
	}
	}
	
	// controlliamo se i pallini si toccano tra di loro
	urtoPallino(pallino) {
	// se il pallino non è se stesso
	if( this.x != pallino.x && this.y != pallino.y ) {
	// la massima distanza tra due pallini
	var d = Math.sqrt(Math.pow(this.x-pallino.x,2)+Math.pow(this.y-pallino.y,2));
	// la confrontiamo con la somma dei raggi di ciascun pallino
	if( d <= this.raggio + pallino.raggio ) {
	// questa è una semplificazione dell'urto elastico bidimensionale
	// visto che entrambi i pallini hanno la medesima massa
	// calcoliamo l'angolo di impatto e sommiamolo alla direzione
	var phi = Math.atan((this.y-pallino.y)/(this.x-pallino.x));
	this.direzione += phi / 2;
	if( this.stato < 1 && pallino.stato == 1 ) {
	this.stato = 1;
	this.tempo = new Date().getTime();
	}
	}
	}
	}
	
	// restituiamo il colore in base allo stato: sano, malato, guarito
	getColore() {
	var colori = ["#0095DD","#ed1c24","#3cb878"];
	return colori[this.stato];
	}
	
	// controlliamo le interazioni da eseguire su tutti
	controlla() {
	for(var j = 0; j < pallini.length; j++ ) { 
	this.urtoPallino(pallini[j]);
	}
	this.urtoParete();
	if( new Date().getTime() - this.tempo > tempoguarigione && this.tempo > 0) {
	this.stato = 2;
	}
	}
	
	// poi effettuiamo il movimento, derivato dai controlli precedenti
	muovi() {
	this.x += this.velocita * Math.cos(this.direzione);
	this.y += this.velocita * Math.sin(this.direzione);
	}
	
	}
	
	// creiamo tutti i pallini preimpostati in cima, distribuendo malati e sani
	for( i = 0; i < pallinicalc.length; i++ ) {
	var stato = nmalati-- > 0 ? 1 : 0;
	var velocita = nfermi-- > 0 ? 0 : 2;
	pallini.push(new Pallino(pallinicalc[i][0],pallinicalc[i][1],stato,2*Math.PI*Math.random(),velocita));
	}
	
	// avviamo il processo di disegno
	function disegna() {
	// ripuliamo il canvas come prima per il grafico
	ctx.beginPath(); // questo ci serve per evitare lo slowdown
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	var sani = 0;
	var malati = 0;
	var curati = 0;
	
	// disegniamo le pareti
	function disegnaPareti() {
	var nPareti = pareti.length;
	for( vi = 0; vi < nPareti; vi++ ) {
	var vf = vi < nPareti - 1 ? vi + 1 : 0;
	ctx.moveTo(pareti[vi][0], pareti[vi][1]);
	ctx.lineTo(pareti[vf][0], pareti[vf][1]);
	ctx.stroke();
	}
	}
	
	// disegniamo un pallino
	// NB sto usando Path2D per evitare che venga disegnato
	// il bordo di controno per ciascun pallino
	function disegnaPallino(x, y, colore, raggio) {
	var pallino = new Path2D();
	pallino.arc(x, y, raggio, 0, Math.PI*2, false);
	ctx.fillStyle = colore;
	ctx.fill(pallino);
	}
	
	// disegniamo tutti i pallini chiamando la funzione precedente
	function disegnaPallini() {
	for(i = 0; i < pallini.length; i++ ) {
	disegnaPallino(pallini[i].x,pallini[i].y,pallini[i].getColore(),pallini[i].raggio);
	// già che ci siamo contiamo lo stato attuale di sani e malati
	switch( pallini[i].stato ) {
	case 0: sani++; break;
	case 1: malati++; break;
	case 2: curati++; break;
	}
	}
	}
	
	// chiamiamo i controlli per il movimento dei pallini
	function muoviPallini() {
	for(i = 0; i < pallini.length; i++ ) {
	pallini[i].controlla();
	}
	for(i = 0; i < pallini.length; i++ ) {
	pallini[i].muovi();
	}
	}
	

	
	disegnaPareti();
	disegnaPallini();
	muoviPallini();
	
	// controlliamo se l'animazione prosegue o meno
	if( !stop ) idSimulazione = window.requestAnimationFrame(disegna);
	console.log("id: " + idSimulazione );
	
	var now = new Date().getTime() / 1000;
	
	// avanziamo di frame
	frame++;
	}
	
	function init() {
	idSimulazione = window.requestAnimationFrame(disegna);
	}
	
	init();
 }