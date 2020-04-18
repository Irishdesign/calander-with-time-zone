import React from "react"
import "./App.scss"
import dayjs, { Dayjs } from "dayjs"
import rowData from "./data.json"
import rowData2 from "./data2.json"
import rowData3 from "./data3.json"
import Controller from "./components/controller"
import DayCreater from "./components/day"
import { getDateOrTime, getEachIndexArr, initClassTimeCol, getLangText } from "./utility"
import { Dropdown } from "element-react"
import "element-theme-default"

export interface IndexArr {
    [key: string]: number[]
}

interface Idate {
    start: string
    end: string
}

interface W_arragement {
    available: IndexArr
    booked: IndexArr
}

interface ILangText {
    "zh-TW": LangLabel
    default: LangLabel
}

interface LangLabel {
    TableTitle: string
    timeMark: string
}

function App() {
    const { useState, useEffect } = React
    const [weekTitle, setWeekTitle] = useState<Dayjs[]>([])
    const [initTable] = useState(initClassTimeCol)
    const [WeekArrangement, setWeekArrangement] = useState<W_arragement>({ available: {}, booked: {} })
    const [Data, setData] = useState(rowData)
    const [page, setPage] = useState(0)
    const [BtnActive, setBtnActive] = useState([false, true])
    const [UserLang, setUserLang] = useState(navigator.language)

    const LangTexts: ILangText = getLangText()
    //init
    useEffect(() => {
        createWeekTitle()
        initArrangement()
    }, [Data])

    useEffect(() => {
        switch (page) {
            case 0:
                setData(rowData)
                setBtnActive([false, true])
                return
            case 1:
                setData(rowData2)
                setBtnActive([true, true])
                return
            case 2:
                setData(rowData3)
                setBtnActive([true, false])
                return
        }
    }, [page])

    const createWeekTitle = () => {
        const LocalDate = getDateOrTime(Data.available[0].start, "d")
        const LocalTime = getDateOrTime(Data.available[0].start, "t")

        const today = new Date(`${LocalDate} ${LocalTime}:00`)
        const today_weekday = today.getDay()
        const startDate = dayjs(today).add(-today_weekday, "day")

        const DaysInTheWeek = []
        for (let i = 0; i < 7; i++) {
            DaysInTheWeek.push(dayjs(startDate).add(i, "day"))
        }
        setWeekTitle(DaysInTheWeek)
    }

    const initArrangement = () => {
        const availableIndex = getIndexArrForEachDate(Data.available)
        const bookedIndex = getIndexArrForEachDate(Data.booked)
        // console.log("availableIndex", availableIndex)
        // console.log("bookedIndex", bookedIndex)
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
    const onHandlePage = (type: string) => {
        if (page === 0 && type === "l") return
        if (page === 2 && type === "r") return
        type === "r" ? setPage((prev) => prev + 1) : setPage((prev) => prev - 1)
    }

    return (
        <div className="App">
            <div className="langDropdown">
                <Dropdown
                    onCommand={(e: string) => {
                        setUserLang(e)
                    }}
                    menu={
                        <Dropdown.Menu>
                            <Dropdown.Item command="zh-TW">繁體中文</Dropdown.Item>
                            <Dropdown.Item command="en-US">英語</Dropdown.Item>
                        </Dropdown.Menu>
                    }
                >
                    <span className="el-dropdown-link">
                        切換語言<i className="el-icon-caret-bottom el-icon--right"></i>
                    </span>
                </Dropdown>
            </div>
            <div className="section_title">
                {UserLang === "zh-TW" ? LangTexts["zh-TW"].TableTitle : LangTexts["default"].TableTitle}
            </div>
            <div className="calander_head">
                <Controller
                    BtnActive={BtnActive}
                    weekTitle={weekTitle}
                    handlePage={(str: string) => onHandlePage(str)}
                    TimeMark={UserLang === "zh-TW" ? LangTexts["zh-TW"].timeMark : LangTexts["default"].timeMark}
                />
            </div>
            <div className="calander_body">
                {weekTitle
                    ? weekTitle.map((date, i) => {
                          const YYYY_MM_DD = date.format("YYYY-MM-DD")
                          return (
                              <DayCreater
                                  UserLang={UserLang}
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
