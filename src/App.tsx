import React from "react"
import "./App.scss"
import rowData from "./data.json"
import rowData2 from "./data2.json"
import rowData3 from "./data3.json"
import dayjs, { Dayjs } from "dayjs"
import Controller from "./components/controller"
import { getDateOrTime, getEachIndexArr, initClassTimeCol } from "./utility"

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

function App() {
    const { useState, useEffect } = React
    const [weekTitle, setWeekTitle] = useState<Dayjs[]>([])
    const [initTable, setInitTable] = useState(initClassTimeCol)
    const [WeekArrangement, setWeekArrangement] = useState<W_arragement>({ available: {}, booked: {} })

    //init
    useEffect(() => {
        createWeekTitle()
        initArrangement()
    }, [])

    const createWeekTitle = () => {
        const today = new Date("2020-04-19")
        const today_weekday = today.getDay()

        const startDate = dayjs(today).add(-today_weekday, "day")

        const DaysInTheWeek = []
        for (let i = 0; i < 7; i++) {
            DaysInTheWeek.push(dayjs(startDate).add(i, "day"))
        }
        console.log(DaysInTheWeek)
        setWeekTitle(DaysInTheWeek)
    }

    const initArrangement = () => {
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
        })
        return IndexArray
    }

    return (
        <div className="App">
            <div className="section_title">Available times</div>
            <div className="calander_head">
                <Controller leftBtnActive={false} />
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
