const sprites = new Image();
const somHit = new Audio();
const somFly = new Audio();
sprites.src = './img/sprites.png';
somFly.src = './sons/flying.wav';
somHit.src = './sons/hit.wav';
const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
let frames = 0;
function criarCanos() { // Função para criar os canos
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenhar() {
            canos.pares.forEach(function(par){
                const yRandom = par.y;
                const espacoEntreCanos = 110;
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                // --------- cano do céu --------
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura
                );
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura
                );
                par.canoCeuY = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            });
        },
        TemColisaoFlappyBird(par) {
            const cabecaFlappy = globais.flappyBird.y;
            const peFlappy = globais.flappyBird.y + globais.flappyBird.altura;
            if(globais.flappyBird.x >= par.x) {
                if(cabecaFlappy <= par.canoCeuY.y) {
                    return true;
                }
                if(peFlappy >= par.canoChao.y) {
                    return true;
                }
            }
        },
        pares: [],
        atualizar() {
            const passou100Frames = frames % 100 == 0;
            if(passou100Frames) {
                console.log('passou 100 frames');
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1)
                }
                );
            };
            canos.pares.forEach(function(par) {
                par.x -= 2;
                if(canos.TemColisaoFlappyBird(par)) {
                    somHit.play();
                    mudarParaTela(telas.inicio);
                }
                if(par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            });
        }
    }
    return canos;
}
const planoDeFundo = { // Desenhar plano de fundo
    spriteX: 398,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height -204,
    desenhar() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
          );
    }
}
function criarChao() { // Função para criar o chão
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualizar() {
            const movimentoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoChao;
            chao.x = movimentacao % repeteEm;
        },
        desenhar() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
    
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            )
        }
    }
    return chao;
}
function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;
    if(flappyBirdY >= chaoY) {
        return true;
    } else {
        return false;
    }
}
function criarFlappyBird() { // Função para criar o Flappy Bird
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pular() {
            flappyBird.velocidade = - flappyBird.pulo;
            somFly.play();
        },
        gravidade: 0.25,
        velocidade: 0,
        atualizar() {
            if(fazColisao(globais.flappyBird, globais.chao)) {
                // console.log('fez colisao');
                somHit.play();
                setTimeout(() => {
                    mudarParaTela(telas.inicio);
                }, 200);
                return;
            }
            flappyBird.velocidade += flappyBird.gravidade,
            flappyBird.y += flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio
        ],
        frameAtual: 0,
        atualizarFrameAtual() {
            const intervaloFrames = 8;
            const passouIntervalo = frames % intervaloFrames == 0;
            if(passouIntervalo) {
                const baseIncremento = 1;
                const incremento = baseIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
                // console.log(frames);
            }
        },
        desenhar() {
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            flappyBird.atualizarFrameAtual();
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                this.largura, this.altura,
                this.x, this.y,
                this.largura, this.altura
            );
        }
    }
    return flappyBird;
}
const mensagemGetReady = {
		sX: 134,
		sY: 0,
		w: 134,
		h: 152,
		x: (canvas.width / 2) - 174 /2,
		y: 50,
    	desenhar() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
         )
      }
   }
 /* ------ Telas do jogo --------- */
const globais = {};
let telaAtiva = {};
function mudarParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializar) {
        telas.inicio.inicializar(); 
    }
}
const telas = {
    inicio: {
        inicializar() {
            globais.flappyBird = criarFlappyBird();
            globais.chao = criarChao();
            globais.canos = criarCanos();
        },
        desenhar() {
            planoDeFundo.desenhar();
            globais.chao.desenhar();
            globais.flappyBird.desenhar();
            globais.canos.desenhar();
            mensagemGetReady.desenhar();
        },
        click() {
            mudarParaTela(telas.jogo);
        },
        atualizar() {
            globais.chao.atualizar();
        }
    }
};
telas.jogo = {
    desenhar() {
        planoDeFundo.desenhar();
        globais.canos.desenhar();
        globais.chao.desenhar();
        globais.flappyBird.desenhar();
    },
    atualizar() {
        globais.canos.atualizar();
        globais.chao.atualizar();
        globais.flappyBird.atualizar();
    },
    click() {
        globais.flappyBird.pular();
    }
};
function loop() { // Função para exibir os frames a cadas segundo na tela
    telaAtiva.desenhar();
    telaAtiva.atualizar();
    frames += 1;
    requestAnimationFrame(loop);
}
window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
})
mudarParaTela(telas.inicio);
loop();