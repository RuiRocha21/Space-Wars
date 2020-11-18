"use strict";

class Jogo{
	constructor(x,y){	
		this.configuracoes ={
			speedHeroi:200,
			speedTiro: 400,

			gameWidth:950,
	    	gameHeight: 500,
	    	fps: 50,
	    	dificuldade: 0.4,

	    	pontosPorInimigo: 100,
	    	pontosPorEstrelaMorte: 500,
	    	pontosPorAstroide: 25,

	    	tempoDrawInimigo: 2500,
	    	tempoDrawAsteroide: 2500,
	    	velocidadeTiro: 300,
	    	velocidadeAstroide: 200,
	    	velocidadeInimigo: 200,
	        velocidadeTiroMinInimigo: 100,
	        velocidadeTiroMaxInimigo: 150,
	    	velocidadeTiroEstrelaMorte: 800,

	    	rateTiroHeroi: 1.2,
	    	rateTiroInimigo: 1,
	    	rateTiroEstrelaMorte: 1.5,

	    	flagDebug: false
	    };
	    this.vidas = 5;
	    this.nivel = 1;
	    this.width = 0;
	    this.height = 0;
	    this.caixaJogo = {left: 0, top: 0, right: 0, bottom: 0};
	    this.intervalId = 0;
	    this.score = 0;

		    //  pilha para estados.
	    this.pilhaEstados = [];

	    //  entradas e saidas
	    this.pressedKeys = {};
	    this.canvas =  null;

	    //  sons do jogo.
	    this.somJogo = null;
	    this.explosao = null;
		this.personagemTiro = null;
		this.fimJogo = null;
		this.mute = false;
		}
	init(ctx){
		this.canvas = ctx;
		this.width = ctx.width;
		this.height = ctx.height;

		
		this.caixaJogo = {
	    	left: ctx.width / 2 - this.configuracoes.gameWidth / 2,
	    	right: ctx.width / 2 + this.configuracoes.gameWidth / 2,
	    	top: ctx.height / 2 - this.configuracoes.gameHeight / 2,
	    	bottom: ctx.height / 2 + this.configuracoes.gameHeight / 2,
		};
	}

	mudancaEstado(estado){
	//sair de um estado
		if(this.estadoCorrente() && this.estadoCorrente().leave) {
			this.estadoCorrente().leave(this);
			this.pilhaEstados.pop();
		}
   
   
		if(estado.enter) {
			estado.enter(this);
	   	}
	 
	   //  difinir estado actuaal.
	   	this.pilhaEstados.pop();
	   	this.pilhaEstados.push(estado);
	}

	start(){
		this.mudancaEstado(new estadoInicial());
		this.vidas = 5;
		this.configuracoes.flagDebug = /debug=true/.test(window.location.href);
		var jogo = this;
		this.intervalId = setInterval(function () { GameLoop(jogo);}, 1000 / this.configuracoes.fps);
	}

	estadoCorrente(){
		return this.pilhaEstados.length > 0 ? this.pilhaEstados[this.pilhaEstados.length - 1] : null;
	}

	inserirEstado(estado) {

	
		if(estado.enter) {
			estado.enter(jogo);
		}
		//  estado actual
		this.pilhaEstados.push(estado);
	}
	retirarEstado(estado){
		if(this.estadoCorrente()) {
			if(this.estadoCorrente().leave) {
				this.estadoCorrente().leave(jogo);
			}

			//  estadoactual.
			this.stateStack.pop();
		}
	}
	//carregar tecla
	keyDown(keyCode) {
	    this.pressedKeys[keyCode] = true;
	    // apagar estado corrente
	    if(this.estadoCorrente() && this.estadoCorrente().keyDown) {
	        this.estadoCorrente().keyDown(this, keyCode);
	    }
	}
	//soltar tecla
	keyUp(keyCode) {
	    delete this.pressedKeys[keyCode];
	    // apagar estado corrente
	    if(this.estadoCorrente() && this.estadoCorrente().keyUp) {
	        this.estadoCorrente().keyUp(this, keyCode);
	    }
	}
}

function GameLoop(jogo) {
    var estadoCorrente = jogo.estadoCorrente();
    if(jogo.estadoCorrente()) {
    	
        //  intervalo de tempo para draw
        var delta = 1 / jogo.configuracoes.fps;

        var ctx = jogo.canvas.getContext("2d");

        if(estadoCorrente.update) {
            estadoCorrente.update(jogo, delta);
        }
        if(estadoCorrente.draw) {
            estadoCorrente.draw(jogo, delta, ctx);
        }
    }
}






class estadoInicial{
	constructor(){

	}
	enter(jogo) {

    // load dos sons do jogo
    jogo.somJogo = new Audio('../resources/sounds/resistence.mp3');
    jogo.somJogo.volume = 0.5;
	jogo.explosao = new Audio('../resources/sounds/explosion.mp3');
	jogo.explosao.volume = 0.5;
	jogo.personagemTiro = new Audio('../resources/sounds/shoot.mp3');
	jogo.personagemTiro.volume = 0.5;
	jogo.fimJogo = new Audio('../resources/sounds/gameOver.mp3');
	jogo.fimJogo.volume = 0.5;


    }

	update(jogo, delta) {

	}
	draw(jogo, dt, ctx) {

		//  limpar canvas
		ctx.clearRect(0, 0, jogo.width, jogo.height);
	    jogo.score = 0;
	    jogo.lives = 3;
	    jogo.mudancaEstado(new inicio(jogo.nivel) );
	}
}

class jogoPerdido{

	constructor(){

	}

	update(jogo, delta) {

	}
	draw(jogo, delta, ctx){
		//  limpar canvas
		ctx.clearRect(0, 0, jogo.width, jogo.height);
		var textoYpos = 300;
	    var textoXpos = 500;
	    var fontSize = 30;
	    ctx.font= fontSize + "px Arial";
	    ctx.fillStyle = 'black';
	    var info = "Perdeu!" + "/n" + "Fez um total de " + jogo.score +" pontos" +"/n"+ "Pressionar 'ESC' para voltar ao menu" + "/n" + "Pressionar 'ENTER' para voltar a jogar";
	    var arrayTexto = info.split("/n");
	    ctx.textAlign = "center";
	    for(var x=0 ; x<arrayTexto.length; x++){
	    	ctx.fillText(arrayTexto[x], textoXpos, textoYpos);
	    	textoYpos += fontSize;
	    }
	    //acrescentar aqui pedir nick e guardar em ficheiro  nick + jogo.score

	}
	keyDown(jogo, keyCode) {
		if(keyCode == 13) /*tecla enter*/ {
        //  restaurar configuracoes do jogo.
	        jogo.vidas = 5;
	        jogo.score = 0;
	       	jogo.mudancaEstado(new inicio(jogo.nivel));
		}else if(keyCode == 27) { // ESC
        	parent.postMessage("voltar","*");
    	}
    }
}

class inicio{
	constructor(nivel){
	    this.nivel = nivel;
	    this.countdownMessage = "3";
	}

	update(jogo, delta) {

	    //  Update the countdown.
	    if(this.countdown === undefined) {
	        this.countdown = 3; 
	    }
	    this.countdown -= delta;

	    if(this.countdown < 2) { 
	        this.countdownMessage = "2"; 
	    }
	    if(this.countdown < 1) { 
	        this.countdownMessage = "1"; 
	    } 
	    if(this.countdown <= 0) {
	        //comecar um jogo novo
	        jogo.mudancaEstado(new ComecarJogo(jogo.configuracoes, this.nivel));
	    }
	}

	draw(jogo, delta, ctx) {

	    //  limpar canvas.
	    ctx.clearRect(0, 0, jogo.width, jogo.height);

	    ctx.font="36px Arial";
	    ctx.fillStyle = 'black';
	    ctx.textBaseline="middle"; 
	    ctx.textAlign="center"; 
	    ctx.font="24px Arial";
	    ctx.fillText("Pronto em " + this.countdownMessage, jogo.width / 2, jogo.height/2 + 36);      
	    return;
	}
}


