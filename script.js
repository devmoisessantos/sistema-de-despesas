// Selecionando os elementos que são usados no formulário
const amount = document.getElementById("amount")

// captura o valor digitado na caixa de texto
amount.oninput = () => {
    const removeRegex = /\D+/g
    // obter o valor digitado e substitui os caracteres não numéricos
    let value = amount.value.replace(removeRegex, "")

    value = Number(value) / 100
    amount.value = formatCurrencyBRL(value)
}

/**
 * Formata um valor numérico para o formato de moeda brasileira (BRL).
 *
 * @param {number} value - O valor numérico a ser formatado.
 * @returns {string} O valor formatado como moeda brasileira.
 */
function formatCurrencyBRL (value) {

    value = value.toLocaleString('pt-BR', {
        style: 'currency', 
        currency: 'BRL'
    })

    return value
}