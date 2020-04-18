export const getLangText = () => {
    const now = new Date()
    const GMT = now.toTimeString().split(" ")[1]
    const City = now.toTimeString().split(" ")[2].split("(")[1]
    const pramas = {
        "zh-TW": {
            TableTitle: "授課時間",
            timeMark: `* 時間以 台北 ${GMT} 顯示`,
        },
        default: {
            TableTitle: "Availbale Time",
            timeMark: `* All the timings listed are in your timezone:${City} (${GMT})`,
        },
    }
    return pramas
}

export const getEachIndexArr = (from: number, to: number) => {
    const arr = []
    for (let i = from; i <= to; i++) {
        arr.push(i)
    }
    return arr
}

export const getDateOrTime = (str: string, type: string) => {
    let res = ""
    let UTCTimeObj = new Date(str)
    const localStr = UTCTimeObj.toLocaleString()
    const dateArr = localStr.split(",")[0].split("/")
    switch (type) {
        case "t":
            res = localStr.split(",")[1].trim().slice(0, 5)
            break
        case "d":
            res = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0]
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
