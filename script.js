// Selecionando os elementos que são usados no formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// selecionando os elementos da ul
const expenseList = document.querySelector("ul")
const expenseTotal = document.querySelector("aside header h2")
const expenseQuantity = document.querySelector("aside header p span")

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

// Adiciona um evento de submissão ao formulário
form.onsubmit = (event) => {
    // Previne o comportamento padrão de submissão do formulário
    event.preventDefault()

    // Cria um novo objeto de despesa com os valores do formulário
    const newExpense = {
        id: new Date().getTime(), // Gera um ID único baseado no timestamp atual
        expense: expense.value, // Obtém o valor do campo de descrição da despesa
        category_id: category.value, // Obtém o ID da categoria selecionada
        category_name: category.options[category.selectedIndex].text, // Obtém o nome da categoria selecionada
        amount: amount.value, // Obtém o valor formatado da despesa
        create_at: new Date() // Adiciona a data e hora atuais
    }

    // Adiciona a nova despesa a lista de despesas
    addExpense(newExpense)
}

/**
 * Adiciona uma nova despesa à lista de despesas no DOM.
 *
 * @param {Object} newExpense - Objeto que representa a nova despesa.
 * @param {number} newExpense.category_id - ID da categoria da despesa.
 * @param {string} newExpense.category_name - Nome da categoria da despesa.
 *
 * @throws {Error} Lança um erro se não for possível adicionar a despesa.
 *
 * A função cria um novo elemento de lista (li) e adiciona a classe 'expense' a ele.
 * Em seguida, cria um ícone de imagem para a categoria da despesa, definindo o 
 * atributo 'src' com base no ID da categoria e o atributo 'alt' com o nome da categoria.
 * Por fim, adiciona o ícone ao item da lista e o item da lista à lista de despesas.
 * Se ocorrer um erro durante o processo, uma mensagem de alerta é exibida e o erro é 
 * registrado no console.
 */
function addExpense (newExpense) {
    try {
        const expenseItem = document.createElement("li")
        expenseItem.classList.add('expense')

        // Cria o ícone da categoria da despesa
        const expenseIcon = document.createElement('img')
        expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute('alt', newExpense.category_name)

        // Cria o contêiner para as informações da despesa
        const expenseInfo = document.createElement('div')
        expenseInfo.classList.add('expense-info')

        // Cria o elemento para o nome da despesa
        const expenseName = document.createElement('strong')
        expenseName.textContent = newExpense.expense

        // Cria o elemento para a categoria da despesa
        const expenseCategory = document.createElement('span')
        expenseCategory.textContent = newExpense.category_name


        const expenseAmount = document.createElement('span')
        expenseAmount.classList.add('expense-amount')
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
        .toUpperCase()
        .replace('R$', '')}`

        // adicionando o ícone de remover despesa
        const removeIcon = document.createElement('img')
        removeIcon.setAttribute('src', 'img/remove.svg')
        removeIcon.setAttribute('alt', 'remover')
        removeIcon.classList.add('remove-icon')

        // Adiciona o nome e a categoria ao contêiner de informações da despesa
        expenseInfo.append(expenseName, expenseCategory)
        // Adiciona o ícone e o contêiner de informações ao item da lista de despesas
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
        // Adiciona o item da despesa ao final da lista de despesas
        expenseList.append(expenseItem)

        resetForm()

        updateTotal()

    } catch (error) {
        alert('Não foi possível adicionar a despesa. Tente novamente.')
        console.log(error)
    }
}

function updateTotal () {
    try {
        const items = expenseList.children
        expenseQuantity.textContent = `${items.length} ${items.length <= 1 ? 'despesa' : 'despesas'}`

        let total = 0

        for (let i = 0; i < items.length; i++) {
            const itemsAmount = Number(items[i].querySelector('.expense-amount')
            .textContent.replace('R$', '').replace(',', '.'))
            total += itemsAmount

        }

        const symbolBRL = document.createElement('small')
        symbolBRL.textContent = 'R$'
        
        total = formatCurrencyBRL(total).toUpperCase().replace('R$', '')

        expenseTotal.innerHTML = ''

        expenseTotal.append(symbolBRL, total)
    } catch (error) {
        alert('Não foi possível atualizar o total das despesas. Tente novamente.')
        console.log(error)
    }
}

expenseList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-icon')) {
        const expense = event.target.parentElement
        expense.remove()
        resetForm()
        updateTotal()
    }
})

function resetForm () {
    amount.value = ''
    expense.value = ''
    category.value = ''

    expense.focus()
}