// Progetto: Pagliaccio in fuga 
//Descrizione: personaggio movibile con le frecce sopra a rullo dentato che ruota
//Alessandro Pinto
//Scuola Righi
//
MYLIB.initialize('renderCanvas', populateScene);
//costanti
const R = 4;
const d = 20; //diametro cilindro
const l = 0; //altezza obj

let cubes = [];	//creo l'array dei cubi
let oggetto_rullo;
let colonne;
let disegno

let sferetta_avanti
let sferetta
let sferetta_dietro //serve a controllare collisioni
let b;
let m;
let g;

let ts = 33 //tempo della simulazione(durata)
	
	//creo 1 colonna
function createColumn(scene) {
	let column = new BABYLON.Mesh('colonna', scene);
	const h1 = 1.0;
	const h2 = 5;    
	const L1 = 0.8;
	const L2 = L1 - 0.2;
	const T = 0.15;
	let box;
	let ring;

	material = new BABYLON.StandardMaterial('base-mat', scene);//colore colonne
	material.diffuseColor.set(0.85,0.647,0.1254);
	material.specularColor.set(0.1,0.1,0.1);

	// blocco in basso
	box = BABYLON.MeshBuilder.CreateBox('a', {
			width:L1,depth:L1,height:h1
		}, scene);
		box.material = material;
		box.parent = column;
		box.position.y = h1/2;

	// toro in basso (appoggiato sul blocco)
	ring = BABYLON.MeshBuilder.CreateTorus('a', {
		diameter:L2,
		thickness:T,
		tessellation: 40
		}, scene);
		ring.material = material;
		ring.position.y = h1+T/2;
		ring.parent = column;

	// cilindro
	let obj = BABYLON.MeshBuilder.CreateCylinder('a', {
		diameter:L2,
		height:h2,
		}, scene);
		obj.material = new BABYLON.StandardMaterial('ballmat', scene);
		obj.material.diffuseColor.set(0.7529, 0.7529, 0.7529);;
		obj.parent = column;
		obj.position.y = h1+h2/2;


	// toro in alto (sopra la colonna)
	ring = BABYLON.MeshBuilder.CreateTorus('a', {
		diameter:L2,
		thickness:T,
		tessellation: 40
		}, scene);
		ring.material = material;
		ring.position.y = h1+h2-T/2;
		ring.parent = column;

	// blocco in alto
	box = BABYLON.MeshBuilder.CreateBox('a', {
		width:L1,depth:L1,height:0.2
		}, scene);
		box.material = material;
		box.parent = column;
		box.position.y = h1+h2+0.1;
	return column;
}

//creo le colonne sul rullo
function colonnato(scene) {
	let obj = new BABYLON.Mesh('obj', scene);
    const m = 50;
	colons = [];
	for(let i=0;i<m;i++) {
		let phi = Math.PI*2*i/m;
			
		for( j=-2;j<3;j++) {//Tutto questo solo perchè non sapevo come dirgli di prendere con valore di pivot position.y sia +tot sia -tot (poi lo hai sfruttato per le colonne alternate)
			let J=j
			if(Math.abs(j)==1||Math.abs(j)==2){
				let pivot = new BABYLON.Mesh('port'+i, scene); 
				pivot.position.set((d)/2*Math.cos(phi+J*Math.PI/2) ,J/Math.abs(J)*(14)-J,(-d)/2*Math.sin(phi+J*Math.PI/2));
				pivot.rotation.set(0,phi+J*Math.PI/2,0);
				pivot.parent = obj
				
				colon = createColumn(scene)	
				colon.rotation.z=-Math.PI/2 //fa sdraiare le colonne
				colon.parent = pivot;
				colons.push(colon);    
			} 	
		}
	}
	return obj	
}

//creo il rullo che ruota e i cubi al di sopra
function rullo(scene) {
	let obj = new BABYLON.Mesh('obj', scene);	
	
			//CUBI
	const m = 5;
	//qui provi a fare dei "livelli"
	
			
					
		for(let i=0;i<m;i++) {		//cubi su ogni circonferenza del cilindro	
			let riga=i;
			let phi = Math.PI*2*i/m;		
			for(let j=-7;j<8;j++){ //numero di circonferenze sul cilindro
				let k=j
				let w=Math.round(Math.random()*100) //numero casuale per la disposizione dei cubi											
				
					let pivot = new BABYLON.Mesh('port'+i, scene);
						pivot.position.set((d+1)/2*Math.cos(phi+w*Math.PI/3) ,k*1.5, (-d-1)/2*Math.sin(phi+w*Math.PI/3));
						pivot.rotation.set(0,phi+w*Math.PI/3,0);
						pivot.parent = obj
						
					cube = BABYLON.MeshBuilder.CreateBox("cube"+i, {size:1.2}, scene);	
					cube.material = mat;
					cube.parent = pivot;
					cubes.push(cube); 
					
					//SECONDO STRATO CUBI

					//const m = 5;		NON SERVE	
					//usa lo stesso W
					if(riga == 1 || riga == 3 || riga == 5 || riga == 4){
						if(k==-6 || k==-4 || k==-2 || k==-0 || k==2 || k==4 || k==6){
							let gio = new BABYLON.Mesh('port'+i, scene);
								gio.position.set((d+1+1.2*2)/2*Math.cos(phi+w*Math.PI/3),k*1.5, (-d-1-1.2*2)/2*Math.sin(phi+w*Math.PI/3))+1.2; //seconda cosa allarga
								gio.rotation.set(0,phi+w*Math.PI/3,0);
								gio.parent = obj
							
							cubeg = BABYLON.MeshBuilder.CreateBox("cube"+i, {size:1.2}, scene);	
							cubeg.material = mat;
							cubeg.parent = gio;
							cubes.push(cubeg); 
						}
					}
					
				var mat = new BABYLON.StandardMaterial("m"+i,scene); //quel +i non importa, è solo per il nome
					mat.diffuseColor.copyFromFloats(
						0.5+0.5*Math.cos(phi*1/5*w),//colori casuali
						0.4,
						0.3+0.5*Math.sin(phi*(1/5*w))            
					);	
					
			}

		}		
							
	let ball = BABYLON.MeshBuilder.CreateCylinder('a', {diameter:d, height:27}, scene);					
		ball.rotation.y=Math.PI/2
		ball.material = new BABYLON.StandardMaterial('ballmat', scene);
		ball.material.diffuseColor.set(0.133333, 0.54509, 0.133333);
		ball.material.specularColor.set(0.1,0.1,0.1)
		ball.parent = obj
								
	return obj	
}
					

				//creo il personaggio
function Olaf(scene) {
	let obj = new BABYLON.Mesh('obj', scene);
	let corpo = pupazzoneve(scene)//tutto è riferito a corpo
		corpo.position.y = 1.1-2.2;//metto il pupazzo al CENTRO 
		corpo.rotation.y=Math.PI
		corpo.parent = obj;
		  
	let braccia = sgomitare(scene);
		braccia.parent = obj;
		braccia.parent=corpo


	let wheel = createMyWheel(scene);					
		wheel.rotation.z = Math.PI/2;
		wheel.parent= corpo
	
		scene.registerBeforeRender(() => {
			let seconds = performance.now() * 0.001;
			let z = -4 + 8 * (seconds - Math.floor(seconds)); //fa ruotare ruota senza slittamenti
			wheel.rotation.x = z/1.1; //c'era diviso raggio ruota per slittamento
		});
	return obj							
}
							
//braccia
function sgomitare(scene) {

	let obj = new BABYLON.Mesh('obj', scene);
	
	let cyl = BABYLON.MeshBuilder.CreateCylinder('a', {diameter:0.15,height:1}, scene);
		cyl.position.y = 1.9
		cyl.position.x = 0.6
		cyl.rotation.z = Math.PI/2;
		cyl.parent=obj
	
				
		
	let cyl2 = BABYLON.MeshBuilder.CreateCylinder('a', {diameter:0.15,height:1}, scene);
		cyl2.position.y = 1.9
		cyl2.position.x = -0.6
		cyl2.rotation.z = Math.PI/2;
		cyl2.parent=obj
					

	scene.registerBeforeRender(() => {
			let t = performance.now() * 0.001;
			obj.rotation.y = Math.sin(t);
			obj.position.y = 0.1
	});						
	return obj
}
	


//sfere e cappello
function pupazzoneve(scene) {
	let obj = new BABYLON.Mesh('obj', scene);
					
	let sphere1 = BABYLON.MeshBuilder.CreateSphere('s',{diameter:1.5},scene);
		sphere1.parent = obj;
		sphere1.position.y = 0.75;
		sphere1.material = new BABYLON.StandardMaterial('ma', scene);
		sphere1.material.diffuseColor.set(0,0,1);
				
	let sphere2 = BABYLON.MeshBuilder.CreateSphere('s',{diameter:0.9},scene);
		sphere2.parent = obj;
		sphere2.position.y = 1.7
		sphere2.material = new BABYLON.StandardMaterial('ma', scene);
		sphere2.material.diffuseColor.set(1,0.14117,0);
				
	let sphere3 = BABYLON.MeshBuilder.CreateSphere('s',{diameter:0.45},scene);
		sphere3.parent = obj;
		sphere3.position.y = 2.3
		sphere3.material = new BABYLON.StandardMaterial('ma', scene);
		sphere3.material.diffuseColor.set(1,1,1);
			

	let cyl = BABYLON.MeshBuilder.CreateCylinder('a', {diameter:0.4,height:0.4}, scene);
		cyl.position.y = 2.7
		cyl.parent = obj;
		cyl.material = new BABYLON.StandardMaterial('ma', scene);
		cyl.material.diffuseColor.set(0.1882,0.835,0.784);
			
	let cyl2 = BABYLON.MeshBuilder.CreateCylinder('b', {diameter:0.6,height:0.1	}, scene);
		cyl2.position.y=2.5
		cyl2.parent = obj;
		cyl2.material = new BABYLON.StandardMaterial('ma', scene);
		cyl2.material.diffuseColor.set(0.1882,0.835,0.784);
				
	let sphere4 = BABYLON.MeshBuilder.CreateSphere('s',{diameter:0.2},scene);
		sphere4.parent = obj;
		sphere4.position.y = 2.3
		sphere4.position.z = 0.2
		sphere4.material = new BABYLON.StandardMaterial('ma', scene);
		sphere4.material.diffuseColor.set(1,0,0);
				
	return obj					   
}



//ruota
function createMyWheel(scene) {
	let obj = new BABYLON.Mesh('obj', scene);

	let sphere = BABYLON.MeshBuilder.CreateSphere('a', {diameter:0.5}, scene);
		sphere.material = new BABYLON.StandardMaterial('ma', scene);
		sphere.material.diffuseColor.set(0.2,0.2,0.2);
		sphere.parent = obj;

	let ring = BABYLON.MeshBuilder.CreateTorus('a', {diameter:2,thickness:0.2,tessellation:70}, scene);
								ring.material = new BABYLON.StandardMaterial('ma', scene);
								ring.material.diffuseColor.set(0.2,0.2,0.2);
								ring.parent = obj;

	for(let i=0; i<5; i++) {
		let cyl = BABYLON.MeshBuilder.CreateCylinder('a', {
			diameter:0.05,
			height:2
			}, scene);
			cyl.rotation.z = Math.PI/2;
			cyl.rotation.y = Math.PI*2*i/3;
			cyl.material = new BABYLON.StandardMaterial('ma', scene);
			cyl.material.diffuseColor.set(0.4,0.4,0.4);
			cyl.parent = obj;							
	}											
	return obj;
}
								
			
			
function populateScene(scene) {
	MYLIB.createGrid(scene);
	
	scene.registerBeforeRender(() => {
		let seconds = performance.now() * 0.001;
		let score;
		let collisioni = collisionCount;
		if(seconds<=ts){
			
			let time =Math.floor(seconds)
			score = Math.max(0, time -2*collisioni)//toglie 5 punti ogni volta che colpisci un cubo EEE non va in negativo
			div_score.innerHTML = "Score:" +(score*100)
			
			div_collisioni.innerHTML = "Collisioni:" +(collisioni)
			
			div_temporimasto.innerHTML = "T. Rimasto:" +(Math.floor(ts-seconds))
			
			div_finish2.innerHTML = ""	
			div_finish2.style.visibility="hidden"
			
			div_finish.innerHTML = ""
			div_finish.style.visibility="hidden"
		}
		else{ 
		div_score.innerHTML = ""
		div_collisioni.innerHTML = ""
		div_temporimasto.innerHTML = ""
			score= Math.max(0, ts -2*collisionCount)
			div_finish2.innerHTML = "Thanks for playing! Here's your final score:"+ (score*100)
			div_finish2.style.visibility="visible"
			div_finish.innerHTML = "Finish!"
			div_finish.style.visibility="visible"
			
		}
		
	});

	div_score = document.createElement('div');
	div_score.style.position="absolute";
	div_score.style.left="20px";
	div_score.style.top="10px";
	div_score.style.width="500px";
	div_score.style.height="30px";
	div_score.style.fontSize = "30px";
	div_score.style.color = "chocolate";
	div_score.style.fontWeight = "bold";
	document.body.appendChild(div_score);
	
	div_temporimasto= document.createElement('div');
	div_temporimasto.style.position="absolute";
	div_temporimasto.style.left="20px";
	div_temporimasto.style.top="40px";
	div_temporimasto.style.width="500px";
	div_temporimasto.style.height="30px";
	div_temporimasto.style.fontSize = "30px";
	div_temporimasto.style.color = "darkseagreen";
	div_temporimasto.style.fontWeight = "bold";
	document.body.appendChild(div_temporimasto); 
	
	div_collisioni= document.createElement('div');
	div_collisioni.style.position="absolute";
	div_collisioni.style.left="20px";
	div_collisioni.style.top="70px";
	div_collisioni.style.width="500px";
	div_collisioni.style.height="30px";
	div_collisioni.style.fontSize = "30px";
	div_collisioni.style.color = "darkorange";
	div_collisioni.style.fontWeight = "bold";
	document.body.appendChild(div_collisioni); 
	
	div_finish= document.createElement('div');
	div_finish.style.position="absolute";
	div_finish.style.left="10%";
	div_finish.style.top="2%";
	div_finish.style.width="80%";
	div_finish.style.height="300px";
	div_finish.style.fontSize = "175px";
	div_finish.style.color = "gold";
	div_finish.style.fontWeight = "bold";
	div_finish.classList.add("classe") //va a prendere la classe CSS creata nell'html
	document.body.appendChild(div_finish); 
	
	div_finish2= document.createElement('div');
	div_finish2.style.position="absolute";
	div_finish2.style.left="10%";
	div_finish2.style.top="40%";
	div_finish2.style.width="80%";
	div_finish2.style.height="50px";
	div_finish2.style.fontSize = "40px";
	div_finish2.style.color = "red";
	div_finish2.style.fontWeight = "bold";
	div_finish2.classList.add("classe2")
	document.body.appendChild(div_finish2); 
	
	
	
	
	
	/*
	
	= document.createElement('div');
	.style.position="absolute";
	.style.left="20px";
	.style.top="20px";
	.style.width="500px";
	.style.height="50px";
	.style.fontSize = "50px";
	.style.color = "magenta";
	.style.fontWeight = "bold";
	document.body.appendChild(); 
	*/	
		
	

	//CAMERA
	let camera = scene.activeCamera;
		camera.setTarget(new BABYLON.Vector3(0,15,1));//Ho abbassato un po la camera
		
		camera.beta = 1;
		camera.alpha = 1.7
			
			
	//MOVIMENTO OMINO
	camera.inputs.attached.keyboard.detachControl()//evita che le frecce muovino la camera ma lascia libero il mouse
	//scene.activeCamera.inputs.clear();//evita che le frecce muovino la camera e impedisce anche il mouse	
	
	
    let tempo_comando;
	function comandosalto (scene){
		
		scene.registerBeforeRender(() => {
			
			let seconds = performance.now() * 0.001;
			t = seconds - tempo_comando;
			
				if (t<1){
					disegno.position.y = (d/2+2.2 + 4 * (t*(1-t)*4))
				}
		});
	}
	
	let tempus=1;//mi serve per evitare che tenendo premuto arrowright o arrow left il pupazzo corra. Arrow left muove solo se si aspetta 0.1 secondi prima di ripremerlo. NB parto con un valore 1 per far funzionare arrow left e arrow right all'inizio, poi viene sovrascritto dopo	
	scene.onKeyboardObservable.add((kbInfo) => {
		
		let tiempo = performance.now() * 0.001;
		if(tiempo<=ts){
			
			if(kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN) {	
			
				if(kbInfo.event.key=="ArrowLeft" && disegno.position.x < 10 && (tiempo-tempus)>0.1){
					tempus=tiempo
					disegno.position.x += 1;
				}	
				else if(kbInfo.event.key=="ArrowRight" && disegno.position.x >= -10&& (tiempo-tempus)>0.1){
					disegno.position.x -= 1;
					tempus=tiempo
				}	
				else if(kbInfo.event.key=="ArrowUp" && disegno.position.y == d/2+2.2 ) {
					let salto = comandosalto(scene)
					tempo_comando = tiempo;
					tempus=tiempo
				}										
			}
		}
	});
	
							
//richiamo pupazzo e ruota e colonne
			
		colonne= colonnato(scene)
			colonne.rotation.z = Math.PI/2
			colonne.position.set (0, l, 0)
		
		oggetto_rullo = rullo(scene);
			oggetto_rullo.rotation.z = Math.PI/2;
			oggetto_rullo.position.set (0, l, 0);
					
		disegno = Olaf(scene); //ora lavori con i quaternioni
		disegno.rotationQuaternion =  BABYLON.Quaternion.Identity();
		
		
		sferetta_avanti = BABYLON.MeshBuilder.CreateSphere('s',{diameter:0.2},scene); //la sferetta si trova nella parte bassa dello pneumatico
			sferetta_avanti.parent = disegno;
			sferetta_avanti.position.y = 0.101-2.2+1;
			sferetta_avanti.position.z= -1
			sferetta_avanti.material = new BABYLON.StandardMaterial('ma', scene);
			sferetta_avanti.material.diffuseColor.set(0,0,1);
			
		sferetta = BABYLON.MeshBuilder.CreateSphere('s',{diameter:0.2},scene); //la sferetta si trova nella parte bassa dello pneumatico
			sferetta.parent = disegno;
			sferetta.position.y = 0.101-2.2;
			sferetta.material = new BABYLON.StandardMaterial('ma', scene);
			sferetta.material.diffuseColor.set(0,0,1);
			
		sferetta_dietro = BABYLON.MeshBuilder.CreateSphere('s',{diameter:0.2},scene); //la sferetta si trova nella parte bassa dello pneumatico
			sferetta_dietro.parent = disegno;
			sferetta_dietro.position.y = 0.101-2.2+0.2928932;
			sferetta_dietro.position.z= +0.707106781
			sferetta_dietro.material = new BABYLON.StandardMaterial('ma', scene);
			sferetta_dietro.material.diffuseColor.set(0,0,1);
		
		scene.registerBeforeRender(animazione);
}
									//		t = t - Math.floor(t);
											//disegno.rotation.x = -(6.3)*t								
										//disegno.position.y = 1 + t * 20 - t*t *20	+ (d/2)-l		
												
let tempo_ultima_collisione = -Infinity;
let collisionCount = 0

let durata_salto = 1; // (in secondi)


// questa è l'animazione
function animazione () {
	let seconds = performance.now() * 0.001;
	let t0= 3 //ritardo per tenere rullo fermo a partenza
		
		
	
	if (seconds - t0 >0) {	
		oggetto_rullo.rotation.x = (seconds - t0) *0.75 //riesco a far aspettare prima di far partire
		colonne.rotation.x = (seconds-t0)*0.75
	} //sottreggo t0 altrimenti ho uno scatto appena il rullo parte
			
			
		
	// t è il parametro che controlla il salto.
	// vale 0 all'inizio del salto e 1 alla fine del salto
	// se t>1 vuol dire che il salto è terminato
	let t = (seconds - tempo_ultima_collisione) / durata_salto;
	if(seconds<=ts){
		
		
		if(t>0.2) {
			//mi serve per fare sì che il  pupazzo controlli se va a sbattere ANCHE metre è in aria (precisamente 0.2 secondi da quando è in aria
			// vado a vedere se mi sto scontrando con un altro cubo
			 b = cubes.filter(cube => cube.intersectsMesh(sferetta_avanti, false)).length;
			 m = cubes.filter(cube => cube.intersectsMesh(sferetta, false)).length; //false indica collisione non precisissima, ci basta che sfiori un cubo
			 g = cubes.filter(cube => cube.intersectsMesh(sferetta_dietro, false)).length;
			 
			if(b>0 || m>0 || g>0) {
				
				// effettivamente mi sto scontrando!
				tempo_ultima_collisione = seconds;	
				 collisionCount = collisionCount + 1		//conta il numero di cubi colpiti	
			}
		}
	}
	if(t>1) {
		
		disegno.rotationQuaternion.set(0,0,0,1) //seconda fa andare il pupazzo di spalle. quarta dritto(normale), terza sottosopra, prima sottosopra di spalle
		// il salto è terminato. Con il quaternone controllo sia dritto dopo salto
		// mi assicuro che il pupazzo di neve sia ben appoggiato al rullo
		// n.b. qui ci dovrebbe andare il pupazzo di neve, non la sferetta	
		disegno.position.y = d/2+2.2; //interferisce con il comando salto
	} 
		
	else {
		
		// sto facendo il salto. Uso il parametro t per regolare la posizione
		// (e anche la rotazione del pupazzo)
		disegno.rotationQuaternion.set(0,0,0,1) //Con il quaternone controllo sia dritto dopo salto
		disegno.position.y = d/2+2.2 + 4 * (t*(1-t)*4);
		disegno.rotate(BABYLON.Axis.Y, t*Math.PI*2, BABYLON.Space.WORLD);//Avvitamento su asse y
		//N.B.usando Math PI fai una rotazione di 180 gradi * t (t sai che è 1, perchè sai che t <1) quindi se fai t*math.pi*2 fai 1 rotazione.
		disegno.rotate(BABYLON.Axis.X, -t*Math.PI*2, BABYLON.Space.WORLD);//mentre avvita su asse y, gli faccio fare salto carpiato
		//il - serve per non farlo girare al contrario
			
	}
	
						
}	