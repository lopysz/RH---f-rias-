
/* =========================================================
   PRANCHETA RH — CONFIGURAÇÕES VISUAIS
   Tema claro/escuro e espaçamento compacto
========================================================= */

const CHAVE_PREFERENCIAS_VISUAIS = "pranchetaPreferenciasVisuais";


/* =========================================================
   PREFERÊNCIAS PADRÃO
========================================================= */

function obterPreferenciasPadrao() {
    return {
        tema: "claro",
        espacamento: "normal"
    };
}


/* =========================================================
   CARREGAR PREFERÊNCIAS
========================================================= */

function carregarPreferenciasVisuais() {
    try {
        const dados = localStorage.getItem(CHAVE_PREFERENCIAS_VISUAIS);

        if (!dados) {
            return obterPreferenciasPadrao();
        }

        const preferencias = JSON.parse(dados);

        return {
            tema: preferencias.tema === "escuro" ? "escuro" : "claro",
            espacamento: preferencias.espacamento === "compacto"
                ? "compacto"
                : "normal"
        };
    } catch (erro) {
        console.error("Erro ao carregar as preferências:", erro);
        return obterPreferenciasPadrao();
    }
}


/* =========================================================
   APLICAR PREFERÊNCIAS
========================================================= */

function aplicarPreferenciasVisuais(preferencias) {
    const tema = preferencias.tema === "escuro" ? "escuro" : "claro";

    const espacamento = preferencias.espacamento === "compacto"
        ? "compacto"
        : "normal";

    document.body.classList.toggle("tema-escuro", tema === "escuro");
    document.body.classList.toggle(
        "espacamento-compacto",
        espacamento === "compacto"
    );

    const seletorTema = document.getElementById("temaSistema");
    const seletorEspacamento = document.getElementById("espacamentoSistema");

    if (seletorTema) seletorTema.value = tema;
    if (seletorEspacamento) seletorEspacamento.value = espacamento;
}


/* =========================================================
   ABRIR CONFIGURAÇÕES
========================================================= */

function abrirConfiguracoes() {
    const modal = document.getElementById("modalConfiguracoes");

    if (!modal) {
        alert("Não foi possível encontrar a janela de configurações.");
        console.error('Elemento "#modalConfiguracoes" não encontrado.');
        return;
    }

    aplicarPreferenciasVisuais(carregarPreferenciasVisuais());

    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const seletorTema = document.getElementById("temaSistema");

    if (seletorTema) {
        seletorTema.focus();
    }
}


/* =========================================================
   FECHAR CONFIGURAÇÕES
========================================================= */

function fecharConfiguracoes() {
    const modal = document.getElementById("modalConfiguracoes");

    if (!modal) return;

    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}


/* =========================================================
   SALVAR CONFIGURAÇÕES
========================================================= */

function salvarConfiguracoes() {
    const seletorTema = document.getElementById("temaSistema");
    const seletorEspacamento = document.getElementById("espacamentoSistema");

    if (!seletorTema || !seletorEspacamento) {
        alert("Não foi possível encontrar os campos de configuração.");
        return;
    }

    const preferencias = {
        tema: seletorTema.value === "escuro" ? "escuro" : "claro",
        espacamento: seletorEspacamento.value === "compacto"
            ? "compacto"
            : "normal"
    };

    try {
        localStorage.setItem(
            CHAVE_PREFERENCIAS_VISUAIS,
            JSON.stringify(preferencias)
        );
    } catch (erro) {
        console.error("Erro ao salvar as preferências:", erro);
        alert("Não foi possível salvar as preferências no navegador.");
        return;
    }

    aplicarPreferenciasVisuais(preferencias);
    fecharConfiguracoes();
}


/* =========================================================
   EVENTOS DA JANELA
========================================================= */

function configurarEventosConfiguracoes() {
    const botao = document.getElementById("abrirConfiguracoes");
    const modal = document.getElementById("modalConfiguracoes");

    if (!botao || !modal) {
        console.error("Configurações: botão ou janela não encontrados.", {
            botao: !!botao,
            modal: !!modal
        });
        return;
    }

    // Evita depender apenas do onclick do HTML.
    botao.addEventListener("click", abrirConfiguracoes);

    // Fecha ao clicar fora do painel.
    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            fecharConfiguracoes();
        }
    });

    // Fecha com Escape.
    document.addEventListener("keydown", function (evento) {
        if (
            evento.key === "Escape" &&
            modal.classList.contains("aberto")
        ) {
            fecharConfiguracoes();
        }
    });
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function inicializarConfiguracoesVisuais() {
    aplicarPreferenciasVisuais(carregarPreferenciasVisuais());
    configurarEventosConfiguracoes();
}

// Torna as funções acessíveis aos onclick do index.html.
window.abrirConfiguracoes = abrirConfiguracoes;
window.fecharConfiguracoes = fecharConfiguracoes;
window.salvarConfiguracoes = salvarConfiguracoes;

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        inicializarConfiguracoesVisuais
    );
} else {
    inicializarConfiguracoesVisuais();
}
