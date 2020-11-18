"use strict";

class objectosJogo{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

class Nave extends objectosJogo{
	constructor(x,y){
		super(x,y);
		this.tiro = false;
		this.maxRate = 1.8;
		this.width = 50;
		this.height = 80;
	}
}
class Inimigo extends objectosJogo{
	constructor(x,y,tipo){
		super(x,y);
		this.tipo = tipo;
		this.width = 70;
		this.height = 60;
		this.h = 0;
		this.g = 0;
	}
}

class Asteroide extends objectosJogo{
	constructor(x,y,tipo){
		super(x,y);
		this.tipo = tipo;
    	this.width = 50;
		this.height = 50;
		this.velocidade = 100;
		this.h = 0;
		this.g = 0;
		if(y > 275)
        	this.direcao = -1;
    	else
        	this.direcao = 1;
	}
}

class Tiro  extends objectosJogo{
	constructor(x,y,velocidade){
		super(x,y);
		this.width = 16;
		this.height = 30;
		this.velocidade = velocidade;
	}	
}
