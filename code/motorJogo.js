"use strict";

class ComecarJogo{
	constructor(configuracoes){
		this.configuracoes = configuracoes;
		this.ultimoTiro = null;
		this.heroi = null;
		this.inimigos = [];
		this.asteroides = [];
		this.tirosHeroi = [];
		this.tirosCruzadores = [];
		this.estrelaMorte = [];

	}
	enter(jogo){
		jogo.canvas.style.background = "url(../resources/MaterialJogo/fundoJogo.png)";
		this.heroi = new Nave(400,400);
		this.heroi.maxRate += 0.9;
		this.speedHeroi = this.configuracoes.speedHeroi;
		//variavel de controlo de dificuldade do jogo
		var nivelDificuldade = this.configuracoes.dificuldade;

		this.rateTiroInimigo = this.configuracoes.rateTiroInimigo + (1 * this.configuracoes.rateTiroInimigo);
		this.rateTiroEstrelaMorte = this.configuracoes.rateTiroEstrelaMorte + (1 * this.configuracoes.rateTiroEstrelaMorte);

		this.velocidadeTiroMinInimigo = this.configuracoes.velocidadeTiroMinInimigo + (1 * this.configuracoes.velocidadeTiroMinInimigo);
		this.velocidadeTiroMaxInimigo = this.configuracoes.velocidadeTiroMaxInimigo + (1 * this.configuracoes.velocidadeTiroMaxInimigo);


    	this.tempoDrawInimigo = this.configuracoes.tempoDrawInimigo ;
    	this.tempoDrawAsteroide = this.configuracoes.tempoDrawAsteroide ;

    	var inimigos = this.inimigos;
    	var asteroides = this.asteroides;
    	var estrelaMorte = this.estrelaMorte;

    	
    	var tempoDrawInimigo_ = setInterval(function() { drawInimigos(inimigos,jogo); }, this.tempoDrawInimigo);
    	var tempoDrawAsteroides = setInterval(function() { drawAsteroides(asteroides, jogo); }, this.tempoDrawAsteroide);

    	
		
    }

    update(jogo,delta){
		if(!jogo.mute){
			jogo.loop = true;
            jogo.somJogo.play();
        }
        if(jogo.mute == true){
        	jogo.somJogo.pause();
        }
		
		//movimentos de teclado
		if(jogo.pressedKeys[38]) {
        	this.heroi.y -= this.speedHeroi *delta;
	    }
	    if(jogo.pressedKeys[40]) {
	        this.heroi.y += this.speedHeroi *delta;
	    }
	    if(jogo.pressedKeys[37]) {
	        this.heroi.x -= this.speedHeroi *delta;
	    }
	    if(jogo.pressedKeys[39]) {
	        this.heroi.x += this.speedHeroi *delta;
	    }
	    if(jogo.pressedKeys[32]) {
	    	this.disparo();
    	}

	    	//  manter a nave do heroi na canvas
	    if(this.heroi.x < jogo.caixaJogo.left) {
	        this.heroi.x = jogo.caixaJogo.left;
	    }
	    if(this.heroi.x > jogo.caixaJogo.right) {
	        this.heroi.x = jogo.caixaJogo.right;
	    }
	    if(this.heroi.y < jogo.caixaJogo.top) {
	        this.heroi.y = jogo.caixaJogo.top;
	    }
	    if(this.heroi.y > jogo.caixaJogo.bottom) {
	        this.heroi.y = jogo.caixaJogo.bottom;
	    }

	    //controlo de disparos do heroi

	    for(var i=0; i<this.tirosHeroi.length; i++) {
	        var tiroHeroi = this.tirosHeroi[i];
	        tiroHeroi.y -= tiroHeroi.velocidade * delta ;
	        if(tiroHeroi.y < 0) {
	            this.tirosHeroi.splice(i--, 1);
	        }
    	}

    	//movimento de tiros dos inimigos

    	for(var i=0; i<this.tirosCruzadores.length; i++) {
        	var tiroCruzador = this.tirosCruzadores[i];
        	tiroCruzador.y += delta * tiroCruzador.velocidade;

        	if(tiroCruzador.x < 0) {
            	this.tirosCruzadores.splice(i--, 1);
        	}
    	}
    
    	//  mover asteroides
    	
	    for(var j=0; j<this.asteroides.length; j++) {
	        var asteroides = this.asteroides[j];
	        //asteroides.x = asteroides.velocidade * delta;
	        asteroides.y += asteroides.velocidade * delta;
	        if(asteroides.h==0 || asteroides.h%100 == 0){
	        	asteroides.g = Math.random();
	        }
	        if(asteroides.g> 0.5){
	        	asteroides.x = asteroides.x + (asteroides.direcao * delta * asteroides.velocidade) * 0.15 ;
	        	asteroides.h = asteroides.h + 1;
	    	}else{
	    		asteroides.x = asteroides.x - (asteroides.direcao * delta * asteroides.velocidade) * 0.15 ;
	    		asteroides.h = asteroides.h + 1;
	    	}		
	        if(asteroides.y > 600 || asteroides.x > 1000 ) {
            	this.asteroides.splice(i--, 1);
            }
        }


	    //  mover inimigos
	    
	    for(i=0; i<this.inimigos.length; i++) {
	        var inimigos = this.inimigos[i];
	        inimigos.y = inimigos.y + 1;
	        if(inimigos.h==0 || inimigos.h%100 == 0){
	        	inimigos.g = Math.random();
	        }
	        if(inimigos.g> 0.5){
	        	inimigos.x = inimigos.x + (delta * 100) * 0.15 ;
	        	inimigos.h = inimigos.h + 1;
	    	}else{
	    		inimigos.x = inimigos.x - (delta * 100) * 0.15 ;
	    		inimigos.h = inimigos.h + 1;
	    	}	
	    }

	     for(var i=0; i<this.inimigos.length; i++) {
	        var inimigo = this.inimigos[i];
	        if(!inimigo) continue;
	        var chance = this.rateTiroInimigo * delta;
	        if(chance > Math.random()) {
	            //  disparos do inimigo!
	            this.tirosCruzadores.push(new Tiro(inimigo.x /*- inimigo.width/2*/ + 3, inimigo.y + inimigo.height/2, this.velocidadeTiroMinInimigo,50));
	        }
    	}

	    //colisoes : tiro do heroi contra inimigos
	    colisoesTiros(this.tirosHeroi,this.inimigos,jogo,this.configuracoes.pontosPorInimigo);
	    //colisoes : tiro do heroi contra asteroides
	    colisoesTiros(this.tirosHeroi,this.asteroides,jogo,this.configuracoes.pontosPorAstroide);
	    //colisoes :tiro do inimigo contra o heroi
	    colisoesTirosInimigo(this.tirosCruzadores,this.heroi,jogo);
	    //colisoes : asteroide contra heroi
	    colisoesObjecto_Contra_Heroi(this.asteroides,this.heroi,jogo);
	    //colisoes : inimigo contra heroi
	    colisoesObjecto_Contra_Heroi(this.inimigos,this.heroi,jogo);

	    //verificar vidas do utilizador
	    if(jogo.vidas <= 0) {
	        if(!jogo.mute){
	            jogo.fimJogo.play();
	        }
	        //pedir nome de utilizador e guardar nick +  jogo.score em ficheiro -> falta fazer
	        var pontuacaoFinal = jogo.score;
			//falta tratar aqui forma para guardar cockies
        	jogo.mudancaEstado(new jogoPerdido());
    	}


	}

	draw(jogo,delta,ctx){
		ctx.clearRect(0, 0, jogo.width, jogo.height);
		//draw heroi
		drawNave(this.heroi,ctx);

    	

        //draw Inimigo

        var inimigo1 = new Image;
	    inimigo1.src = "../resources/MaterialJogo/caca.png";
	    var inimigo2 = new Image;
	    inimigo2.src = "../resources/MaterialJogo/cruzador.png";
	    var inimigo3 = new Image;
	    inimigo3.src = "../resources/MaterialJogo/cruzador2.png";
	    var inimigo4 = new Image;
	    inimigo4.src = "../resources/MaterialJogo/estrelaDaMorte.png";

	    for(var i=0; i<this.inimigos.length; i++) {
	        var inimigo = this.inimigos[i];
	        if(inimigo.tipo == 1)
	            ctx.drawImage(inimigo1, inimigo.x - inimigo.width/2, inimigo.y - inimigo.height/2, inimigo.width, inimigo.height);
	        else if(inimigo.tipo == 2)
	            ctx.drawImage(inimigo2, inimigo.x - inimigo.width/2, inimigo.y - inimigo.height/2, inimigo.width, inimigo.height);
	        else if(inimigo.tipo == 3)
	            ctx.drawImage(inimigo3, inimigo.x - inimigo.width/2, inimigo.y - inimigo.height/2, inimigo.width, inimigo.height);
	        else if(inimigo.tipo == 4)
	            ctx.drawImage(inimigo4, inimigo.x - inimigo.width/2, inimigo.y - inimigo.height/2, inimigo.width, inimigo.height);
    	}

    	//draw tiros inimigo
    	var img = new Image;
    	img.src = "../resources/MaterialJogo/tiroInimigo.png";
    	for(var i=0; i<this.tirosCruzadores.length; i++) {
	        var tiroCruzador = this.tirosCruzadores[i];
	       	ctx.drawImage(img, tiroCruzador.x - tiroCruzador.width/2, tiroCruzador.y - tiroCruzador.height/2, tiroCruzador.width, tiroCruzador.height);  
	    }




    	//draw de tiros do heroi
    	var img = new Image;
    	img.src = "../resources/MaterialJogo/tiroMilleniumFalcon.png";
    	for(var i = 0; i<this.tirosHeroi.length; i++){
    		var tiros = this.tirosHeroi[i];
    		ctx.drawImage(img, tiros.x - tiros.width/2, tiros.y - tiros.height/2, tiros.width, tiros.height);
    	}


    	// Draw asteroides.
	    var asteroide1 = new Image;
	    asteroide1.src = "../resources/MaterialJogo/asteroide1.png";
	    var asteroide2 = new Image;
	    asteroide2.src = "../resources/MaterialJogo/asteroide2.png";
	    var asteroide3 = new Image;
	    asteroide3.src = "../resources/MaterialJogo/asteroide3.png";
	    var asteroide4 = new Image;
	    asteroide4.src = "../resources/MaterialJogo/asteroide4.png";
	    for(var i=0; i < this.asteroides.length; i++) {
	        var asteroide = this.asteroides[i];
	        if(asteroide.tipo == 1)
	            ctx.drawImage(asteroide1, asteroide.x - asteroide.width/2, asteroide.y - asteroide.height/2, asteroide.width, asteroide.height);
	        else if(asteroide.tipo == 2)
	            ctx.drawImage(asteroide2, asteroide.x - asteroide.width/2, asteroide.y - asteroide.height/2, asteroide.width, asteroide.height);
	        else if(asteroide.tipo == 3)
	            ctx.drawImage(asteroide3, asteroide.x - asteroide.width/2, asteroide.y - asteroide.height/2, asteroide.width, asteroide.height);
	        else if(asteroide.tipo == 4)
	            ctx.drawImage(asteroide4, asteroide.x - asteroide.width/2, asteroide.y - asteroide.height/2, asteroide.width, asteroide.height);
	    }

	    //draw informacoes de vidas e pontos
	    var textoYpos = 20;
	    var textoXpos = 1000;
	    var fontSize = 40;
	    ctx.font= fontSize + "px Arial";
	    ctx.fillStyle = 'black';
	    var info = "Vidas: " + jogo.vidas + "/n" + "Pontos: " + jogo.score;
	    var arrayTexto = info.split("/n");
	    ctx.textAlign = "right";
	    for(var x=0 ; x<arrayTexto.length; x++){
	    	ctx.fillText(arrayTexto[x], textoXpos, textoYpos);
	    	textoYpos += fontSize;
	    }
	    if(jogo.mute){
	        var aviso1 = "Clique tecla 'm' para ligar sons de jogo!";
	        var fontT1 = 20;
	        ctx.font= fontT1 + "px Arial";
	        ctx.fillStyle = 'black';
	        ctx.textAlign = "left";
	        var textPosX = 5;
	        var textPosY = 20;
	        ctx.fillText(aviso1, textPosX, textPosY);
	        	
	    }else if(!jogo.mute){
	    	var aviso2 = "Clique tecla 'm' para desligar sons de jogo!";
	    	var fontT2 = 20;
	        ctx.font= fontT2 + "px Arial";
	        ctx.fillStyle = 'black';
	        ctx.textAlign = "left";
	        var textPosXX = 5;
	        var textPosYY = 20;
        	ctx.fillText(aviso2, textPosXX, textPosYY);
	    }

	}

	keyDown(jogo, keyCode) {
		if(keyCode == 32) {
			this.disparo();
	    }
        if(keyCode == 77){ //desligar sons com a tecla 'm'
		    if(jogo.mute){
		        jogo.mute = false;
		    }
		    else{
		        jogo.mute = true;
		    }
    	}
	}

	keyUp(jogo, keyCode) {

	}
	disparo(){
	    if(this.ultimoTiro === null || ((new Date()).valueOf() - this.ultimoTiro) > (1000 / this.heroi.maxRate)){   
	        this.tirosHeroi.push(new Tiro(this.heroi.x + this.heroi.width / 2, this.heroi.y, this.configuracoes.velocidadeTiro));
	        this.ultimoTiro = (new Date()).valueOf();
	    }
	}

}
function colisoesObjecto_Contra_Heroi(objecto,heroi,jogo){
	for(var i=0; i<objecto.length; i++) {
        var objectoX = objecto[i];
        var alvo = false;
        if((objectoX.x + objectoX.width/2) >= (heroi.x/* - heroi.width/2*/) && 
            (objectoX.x - objectoX.width/2) <= (heroi.x + heroi.width) &&
            (objectoX.y + objectoX.height/2) >= (heroi.y) &&
            (objectoX.y - objectoX.height/2) <= (heroi.y + heroi.height)) {
        	alvo = true;
        	if (alvo){
	            if(!jogo.mute){
	                jogo.explosao.play();
	            }
	            objecto.splice(i--, 1);
	           	jogo.vidas--;
           	}
        }
    }
}



function colisoesTirosInimigo(tiroInimigo,heroi,jogo){
	for(var k = 0;k<tiroInimigo.length; k++){
		var tiro = tiroInimigo[k];
		var alvo = false;
		if(tiro.x >= (heroi.x) && tiro.x <= (heroi.x + heroi.width) && 
			tiro.y >= (heroi.y) && tiro.y <= (heroi.y + heroi.height)){
			alvo = true;
			tiroInimigo.splice(k--,1);
			if(alvo){
	            if(!jogo.mute){
	                jogo.explosao.play();
	            }
	            jogo.vidas--;
	        }
		}
	}
}


function colisoesTiros(objDispara,objAtingido,jogo,configuracoes){
	for(var i=0; i<objAtingido.length; i++) {
        var obj = objAtingido[i];
        var alvo = false;

        for(var j=0; j<objDispara.length; j++){
            var tiro = objDispara[j];

            if((tiro.x + tiro.width/2) > (obj.x - obj.width/2) && 
            (tiro.x - tiro.width/2) < (obj.x + obj.width/2) &&
            (tiro.y + tiro.height/2) > (obj.y - obj.height/2) &&
            (tiro.y - tiro.height/2) < (obj.y + obj.height/2)) {
               	objDispara.splice(j--, 1);
                alvo = true;
                jogo.score += configuracoes;
                if(alvo){
                	objAtingido.splice(i--, 1);
		            if(!jogo.mute){
		                jogo.explosao.play();
		            }
		        }
                //break;
            }
        }
        /*if(alvo) {
            objAtingido.splice(i--, 1);
            if(!jogo.mute){
                jogo.explosao.play();
            }
        }*/
	}
}
   
function drawInimigos(inimigos, jogo){
	inimigos.push(new Inimigo(Math.floor(Math.random() * (jogo.caixaJogo.bottom + 380)) + 25,0, Math.floor(Math.random() * 4) + 1 ));
	for(var i= 0; i<(jogo.score/3000 - 1);i++){
		inimigos.push(new Inimigo(Math.floor(Math.random() * (jogo.caixaJogo.bottom + 380)) + 25,0, Math.floor(Math.random() * 4) + 1 ));
	}
}

	
function drawAsteroides(asteroides,jogo){
	asteroides.push(new Asteroide(Math.floor(Math.random() * (jogo.caixaJogo.bottom+380)) + 25, 0, Math.floor(Math.random() * 4) + 1 ));
	for(var j= 0; j<(jogo.score/2000 - 1);j++){
		asteroides.push(new Asteroide(Math.floor(Math.random() * (jogo.caixaJogo.bottom+380)) + 25, 0, Math.floor(Math.random() * 4) + 1 ));
	}

}
function drawNave(heroi,ctx){
	var img = new Image;
    img.src="../resources/MaterialJogo/milleniumFalcon.png";
    ctx.drawImage(img,heroi.x, heroi.y, heroi.width, heroi.height);
}





