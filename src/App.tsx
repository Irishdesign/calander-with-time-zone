import React from "react"
import "./App.scss"
import rowData from "./data2.json"
import dayjs, { Dayjs } from "dayjs"
import Controller from "./components/controller"

import DayCreater from "./components/day"

import "dayjs/locale/es" // 按需加載
import { stringify } from "querystring"

dayjs.locale("zh-tw") // 全局使用西班牙語

// dayjs("2018-05-05")
//   .locale("zh-tw")
//   .format(); // 局部使用繁體中文
export interface IndexArr {
    [key: string]: number[]
}

interface Idata {
    available: Idate[]
    booked: Idate[]
}
interface Idate {
    start: string
    end: string
}

interface W_arragement {
    available: IndexArr
    booked: IndexArr
}

// export const createCalendar = () => {
//     const table = []
//     const today = new Date("2020-04-20")
//     const today_weekday = today.getDay()
//     const startDate = dayjs().add(-today_weekday, "day")
//     console.log(today_weekday, startDate)
//     const renderDate = []
//     for (let i = 0; i < 7; i++) {
//         table.push(
//             <div className="day-container">
//                 <div className="weekday">{dayjs(startDate).add(i, "day").format("ddd")}</div>
//                 <div className="date">{dayjs(startDate).add(i, "day").format("DD")}</div>
//             </div>
//         )
//     }

//     return table
// }
export const initClassTimeCol = () => {
    const resArr: string[] = []
    for (let i = 0; i < 24; i++) {
        i < 10 ? resArr.push("0" + i + ":00") : resArr.push(i + ":00")
        i < 10 ? resArr.push("0" + i + ":30") : resArr.push(i + ":30")
    }
    return resArr
}

function App() {
    const { useState, useEffect } = React
    const [data, setData] = useState<Idata>(rowData)
    const [activeYYYYMM, setActiveYYYYMM] = useState("202004")
    const [weekTitle, setWeekTitle] = useState<Dayjs[]>([])
    const [initTable, setInitTable] = useState(initClassTimeCol)
    const [WeekArrangement, setWeekArrangement] = useState<W_arragement>({ available: {}, booked: {} })

    useEffect(() => {
        createWeekTitle()
    }, [])

    useEffect(() => {
        if (rowData) {
            initDataObj()
        }
    }, [rowData])
    const createWeekTitle = () => {
        const table = []
        const today = new Date("2020-04-26")
        const today_weekday = today.getDay()

        const startDate = dayjs(today).add(-today_weekday, "day")

        const renderDate = []
        for (let i = 0; i < 7; i++) {
            renderDate.push(dayjs(startDate).add(i, "day"))
            // table.push(
            //     <div className="day-container">
            //         <div className="weekday">{dayjs(startDate).add(i, "day").format("ddd")}</div>
            //         <div className="date">{dayjs(startDate).add(i, "day").format("DD")}</div>
            //     </div>
            // )
        }
        console.log(renderDate)

        setWeekTitle(renderDate)
    }
    // const filterTimeByDate = () => {
    //     const d = weekTitle[2]
    //     const targetDay = d.format("YYYY-MM-DD")
    //     console.log("targetDay", targetDay)
    //     const a: any = []
    //     rowData.available.forEach((item, idx) => {
    //         const next_StartD = rowData.available[idx - 1]?.start.split("T")[0]
    //         const StartD = dayjs(rowData.available[idx]?.start)
    //         console.log(next_StartD, StartD)
    //         if (StartD.isBefore(d)) {
    //             console.log("into while")
    //             console.log(item, idx, rowData.available[idx + 1], rowData.available[idx])
    //             if (item.start.split("T")[0] !== item.end.split("T")[0]) {
    //                 // 跨日
    //                 console.log("跨日")
    //             } else {
    //                 item.start.split("T")[0] === targetDay ? a.push(item) : console.log("no")
    //             }
    //         }
    //     })
    //     console.log(a)
    // }
    // const createCalander = () => {
    //     const table = []
    //     let lastD = new Date(Number(activeYYYYMM.slice(0, 4)), Number(activeYYYYMM.slice(4, 7)), 0)
    //     let firstD = new Date(Number(activeYYYYMM.slice(0, 4)), Number(activeYYYYMM.slice(4, 7)) - 1, 1)
    //     let totalD = lastD.getDate()
    //     let firstD_W = firstD.getDay()
    //     console.log(lastD, firstD)
    //     //第一行補灰格
    //     for (let i = 0; i < firstD_W; i++) {
    //         table.push(<li key={"blankP" + i} className={`oneDate  gray-blank`} id={"blank" + i} />)
    //     }
    // }
    // createCalander()
    const test = () => {
        const arr: any = []
        rowData.available.map((bookedDay) => {
            const start = new Date(bookedDay.start)
            const end = new Date(bookedDay.end)

            const hours = Math.abs(end.getTime() - start.getTime()) / 36e5
            arr.push(hours)
        })
    }

    const getEachIndexArr = (from: number, to: number) => {
        const arr = []
        for (let i = from; i <= to; i++) {
            arr.push(i)
        }
        return arr
    }

    const initDataObj = () => {
        // const d = weekTitle[2]

        // const targetDay = d.format("YYYY-MM-DD")
        // console.log("targetDay", targetDay)
        // const a: any = []
        const availableIndex = getIndexArrForEachDate(rowData.available)
        const bookedIndex = getIndexArrForEachDate(rowData.booked)
        console.log("availableIndex", availableIndex)
        console.log("bookedIndex", bookedIndex)
        setWeekArrangement({ available: availableIndex, booked: bookedIndex })
    }

    const getIndexArrForEachDate = (targetData: Idate[]) => {
        const IndexArray: IndexArr = {}
        targetData.forEach((date) => {
            const startD = getDateOrTime(date.start, "d")
            const endD = getDateOrTime(date.end, "d")
            const startT = getDateOrTime(date.start, "t")
            const endT = getDateOrTime(date.end, "t")
            const startT_index = initTable.indexOf(startT)
            const endT_index = initTable.indexOf(endT)

            IndexArray[startD] = IndexArray[startD] ? [...IndexArray[startD]] : []
            IndexArray[endD] = IndexArray[endD] ? [...IndexArray[endD]] : []

            let forStartD = getEachIndexArr(startT_index, endT_index)

            if (startD === endD) {
                IndexArray[startD].push(...forStartD)
            } else {
                forStartD = getEachIndexArr(startT_index, 48)
                const forEndD = getEachIndexArr(0, endT_index)
                IndexArray[startD].push(...forStartD)
                IndexArray[endD].push(...forEndD)
            }
            // if (startD !== endD) {
            //     const forStartD = getEachIndexArr(startT_index, 48)
            //     const forEndD = getEachIndexArr(0, endT_index)
            //     availableIndex[startD].push(...forStartD)
            //     availableIndex[endD].push(...forEndD)
            // } else {
            //     const forStartD = getEachIndexArr(startT_index, endT_index)

            // }
        })
        return IndexArray
    }

    const getDateOrTime = (str: string, type: string) => {
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

    return (
        <div className="App">
            <div className="section_title">Available times</div>
            <div className="calander_head">
                <Controller />
            </div>
            <div className="calander_body">
                {weekTitle
                    ? weekTitle.map((date, i) => {
                          const YYYY_MM_DD = date.format("YYYY-MM-DD")
                          return (
                              <DayCreater
                                  date={date}
                                  initTable={initTable}
                                  key={YYYY_MM_DD}
                                  bookedIndex={WeekArrangement["booked"][YYYY_MM_DD]}
                                  availableIndex={WeekArrangement["available"][YYYY_MM_DD]}
                              />
                          )
                      })
                    : null}
            </div>
        </div>
    )
}

export default App
