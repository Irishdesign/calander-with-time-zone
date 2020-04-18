export const getEachIndexArr = (from: number, to: number) => {
    const arr = []
    for (let i = from; i <= to; i++) {
        arr.push(i)
    }
    return arr
}
export const getDateOrTime = (str: string, type: string) => {
    let res = ""
    switch (type) {
        case "t":
            res = str.split("T")[1].slice(0, 5)
            break
        case "d":
            res = str.split("T")[0]
            break
    }
    return res
}
export const initClassTimeCol = () => {
    const resArr: string[] = []
    for (let i = 0; i < 24; i++) {
        i < 10 ? resArr.push("0" + i + ":00") : resArr.push(i + ":00")
        i < 10 ? resArr.push("0" + i + ":30") : resArr.push(i + ":30")
    }
    return resArr
}
