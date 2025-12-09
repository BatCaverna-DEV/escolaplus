export function gerarMatricula(sigla, ordem) {
    const ano = new Date().getFullYear(); // ex: 2025

    // Garante sempre 2 dígitos no número da ordem
    const ordemFormatada = String(ordem).padStart(2, '0');

    return `${ano}${sigla}${ordemFormatada}`;
}