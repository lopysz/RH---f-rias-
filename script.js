/* =========================================================
   PRANCHETA RH — CONFIGURAÇÕES VISUAIS
   Tema claro/escuro e espaçamento compacto
========================================================= */

const CHAVE_PREFERENCIAS_VISUAIS =
    "pranchetaPreferenciasVisuais";


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
        const dados = localStorage.getItem(
            CHAVE_PREFERENCIAS_VISUAIS
        );

        if (!dados) {
            return obterPreferenciasPadrao();
        }

        const preferencias = JSON.parse(dados);

        return {
            tema:
                preferencias.tema === "escuro"
                    ? "escuro"
                    : "claro",

            espacamento:
                preferencias.espacamento === "compacto"
                    ? "compacto"
                    : "normal"
        };

    } catch (erro) {
        console.error(
            "Erro ao carregar as preferências visuais:",
            erro
        );

        return obterPreferenciasPadrao();
    }
}


/* =========================================================
   APLICAR PREFERÊNCIAS
========================================================= */

function aplicarPreferenciasVisuais(preferencias) {
    const tema =
        preferencias.tema === "escuro"
            ? "escuro"
            : "claro";

    const espacamento =
        preferencias.espacamento === "compacto"
            ? "compacto"
            : "normal";

    document.body.classList.toggle(
        "tema-escuro",
        tema === "escuro"
    );

    document.body.classList.toggle(
        "espacamento-compacto",
        espacamento === "compacto"
    );

    const seletorTema =
        document.getElementById("temaSistema");

    const seletorEspacamento =
        document.getElementById("espacamentoSistema");

    if (seletorTema) {
        seletorTema.value = tema;
    }

    if (seletorEspacamento) {
        seletorEspacamento.value = espacamento;
    }
}


/* =========================================================
   SALVAR PREFERÊNCIAS
========================================================= */

function salvarPreferenciasVisuais(preferencias) {
    try {
        localStorage.setItem(
            CHAVE_PREFERENCIAS_VISUAIS,
            JSON.stringify(preferencias)
        );

        return true;

    } catch (erro) {
        console.error(
            "Erro ao salvar as preferências visuais:",
            erro
        );

        return false;
    }
}


/* =========================================================
   ABRIR CONFIGURAÇÕES
========================================================= */

function abrirConfiguracoes() {
    const modal =
        document.getElementById("modalConfiguracoes");

    if (!modal) {
        console.error(
            "A janela de configurações não foi encontrada."
        );

        return;
    }

    const preferencias =
        carregarPreferenciasVisuais();

    aplicarPreferenciasVisuais(preferencias);

    modal.classList.add("aberto");

    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    const seletorTema =
        document.getElementById("temaSistema");

    if (seletorTema) {
        seletorTema.focus();
    }
}


/* =========================================================
   FECHAR CONFIGURAÇÕES
========================================================= */

function fecharConfiguracoes() {
    const modal =
        document.getElementById("modalConfiguracoes");

    if (!modal) {
        return;
    }

    modal.classList.remove("aberto");

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}


/* =========================================================
   SALVAR CONFIGURAÇÕES DA JANELA
========================================================= */

function salvarConfiguracoes() {
    const seletorTema =
        document.getElementById("temaSistema");

    const seletorEspacamento =
        document.getElementById("espacamentoSistema");

    if (!seletorTema || !seletorEspacamento) {
        console.error(
            "Não foi possível encontrar os campos de configuração."
        );

        return;
    }

    const preferencias = {
        tema:
            seletorTema.value === "escuro"
                ? "escuro"
                : "claro",

        espacamento:
            seletorEspacamento.value === "compacto"
                ? "compacto"
                : "normal"
    };

    aplicarPreferenciasVisuais(preferencias);

    const salvou =
        salvarPreferenciasVisuais(preferencias);

    if (!salvou) {
        alert(
            "Não foi possível salvar as preferências. " +
            "Verifique as permissões de armazenamento do navegador."
        );

        return;
    }

    fecharConfiguracoes();
}


/* =========================================================
   FECHAR AO CLICAR FORA DA JANELA
========================================================= */

function configurarFechamentoModal() {
    const modal =
        document.getElementById("modalConfiguracoes");

    if (!modal) {
        return;
    }

    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            fecharConfiguracoes();
        }
    });
}


/* =========================================================
   FECHAR COM A TECLA ESC
========================================================= */

function configurarTeclaEscape() {
    document.addEventListener("keydown", function (evento) {
        if (evento.key !== "Escape") {
            return;
        }

        const modal =
            document.getElementById("modalConfiguracoes");

        if (modal && modal.classList.contains("aberto")) {
            fecharConfiguracoes();
        }
    });
}


/* =========================================================
   INICIALIZAÇÃO DAS PREFERÊNCIAS
========================================================= */

function inicializarConfiguracoesVisuais() {
    const preferencias =
        carregarPreferenciasVisuais();

    aplicarPreferenciasVisuais(preferencias);

    configurarFechamentoModal();

    configurarTeclaEscape();
}


/* =========================================================
   INICIAR QUANDO A PÁGINA ESTIVER PRONTA
========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        inicializarConfiguracoesVisuais
    );
} else {
    inicializarConfiguracoesVisuais();
}
