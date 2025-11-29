function displayMoney(money: number, showDecimal: boolean) {
    return showDecimal
        ? `$${Number(money).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`
        : `$${Number(money).toLocaleString()}`
}

export default ({
    displayMoney
})