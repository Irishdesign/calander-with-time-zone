import React from "react"
import "./App.scss"
import dayjs, { Dayjs } from "dayjs"
import rowData from "./data.json"
import rowData2 from "./data2.json"
import rowData3 from "./data3.json"
import Controller from "./components/controller"
import DayCreater from "./components/day"
import { getLocalDateOrTime, getEachIndexArr, initClassTimeCol, getLangText } from "./utility"
import { Dropdown } from "element-react"
import "element-theme-default"

interface IndexArr {
    [key: string]: number[]
}

interface IDate {
    start: string
    end: string
}

interface IW_arragement {
    available: IndexArr
    booked: IndexArr
}

interface ILangText {
    "zh-TW": ILangLabel
    default: ILangLabel
}

interface ILangLabel {
    TableTitle: string
    TimeMark: string
    Droplist: string
    DropOption: string[]
}

function App() {
    const { useState, useEffect } = React
    const [WeekTitle, setWeekTitle] = useState<Dayjs[]>([])
    const [initTimeTable] = useState(initClassTimeCol) // 初始時間表（全部時間）
    const [WeekArrangement, setWeekArrangement] = useState<IW_arragement>({ available: {}, booked: {} }) // 本週各日時間 by 日期
    const [Data, setData] = useState(rowData)
    const [Page, setPage] = useState(0)
    const [BtnActive, setBtnActive] = useState([false, true])
    const [UserLang, setUserLang] = useState(navigator.language)
    const LangTexts: ILangText = getLangText() // 語系標籤
    //init
    useEffect(() => {
        createWeekTitle()
        initArrangement()
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (Data) {
            initArrangement()
        }
        //eslint-disable-next-line
    }, [Data])

    useEffect(() => {
        switch (Page) {
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
                return
            default:
                return
        }
    }, [Page])

    const createWeekTitle = (isBack?: boolean) => {
        let startDate: Dayjs
        if (WeekTitle.length !== 0) {
            startDate = isBack ? WeekTitle[0].add(-1, "week") : WeekTitle[6].add(1, "day")
        } else {
            // 以JSON第一筆資料初始化
            let LocalDate = getLocalDateOrTime(Data.available[0].start, "d")
            let LocalTime = getLocalDateOrTime(Data.available[0].start, "t")
            let today = new Date(`${LocalDate} ${LocalTime}:00`)
            const today_weekday = today.getDay()
            startDate = dayjs(today).add(-today_weekday, "day")
        }
        const DaysInTheWeek = []
        for (let i = 0; i < 7; i++) {
            DaysInTheWeek.push(dayjs(startDate).add(i, "day"))
        }
        setWeekTitle(DaysInTheWeek)
    }

    const initArrangement = () => {
        const availableIndex = getIndexArrForEachDate(Data.available)
        const bookedIndex = getIndexArrForEachDate(Data.booked)
        setWeekArrangement({ available: availableIndex, booked: bookedIndex })
    }

    const getIndexArrForEachDate = (targetData: IDate[]) => {
        const IndexArray: IndexArr = {}
        targetData.forEach((date) => {
            const startD = getLocalDateOrTime(date.start, "d")
            const endD = getLocalDateOrTime(date.end, "d")
            const startT = getLocalDateOrTime(date.start, "t")
            const endT = getLocalDateOrTime(date.end, "t")
            const startT_index = initTimeTable.indexOf(startT)
            const endT_index = initTimeTable.indexOf(endT)

            IndexArray[startD] = IndexArray[startD] ? [...IndexArray[startD]] : []
            IndexArray[endD] = IndexArray[endD] ? [...IndexArray[endD]] : []

            let forStartD = getEachIndexArr(startT_index, endT_index)
            if (startD === endD) {
                IndexArray[startD].push(...forStartD)
            } else {
                //處理跨日情況
                forStartD = getEachIndexArr(startT_index, 48)
                const forEndD = getEachIndexArr(0, endT_index)
                IndexArray[startD].push(...forStartD)
                IndexArray[endD].push(...forEndD)
            }
        })
        return IndexArray
    }

    const onHandlePage = (type: string) => {
        if (Page === 0 && type === "l") return
        type === "r"
            ? (function () {
                  setPage((prev) => prev + 1)
                  createWeekTitle()
              })()
            : (function () {
                  setPage((prev) => prev - 1)
                  createWeekTitle(true) // isBack = true
              })()
    }

    return (
        <div className="App">
            <div className="langDropdown">
                {LangTexts ? (
                    <Dropdown
                        onCommand={(e: string) => {
                            setUserLang(e)
                        }}
                        menu={
                            <Dropdown.Menu>
                                <Dropdown.Item command="en-US">
                                    {UserLang === "zh-TW"
                                        ? LangTexts["zh-TW"].DropOption[1]
                                        : LangTexts["default"].DropOption[1]}
                                </Dropdown.Item>
                                <Dropdown.Item command="zh-TW">
                                    {UserLang === "zh-TW"
                                        ? LangTexts["zh-TW"].DropOption[0]
                                        : LangTexts["default"].DropOption[0]}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        }
                    >
                        <span className="el-dropdown-link">
                            {UserLang === "zh-TW" ? LangTexts["zh-TW"].Droplist : LangTexts["default"].Droplist}
                            <i className="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                    </Dropdown>
                ) : null}
            </div>
            <div className="section_title">
                {UserLang === "zh-TW" ? LangTexts["zh-TW"].TableTitle : LangTexts["default"].TableTitle}
            </div>
            <div className="calander_head">
                <Controller
                    BtnActive={BtnActive}
                    WeekTitle={WeekTitle}
                    handlePage={(str: string) => onHandlePage(str)}
                    TimeMark={UserLang === "zh-TW" ? LangTexts["zh-TW"].TimeMark : LangTexts["default"].TimeMark}
                />
            </div>
            <div className="calander_body">
                {WeekTitle
                    ? WeekTitle.map((date, i) => {
                          const YYYY_MM_DD = date.format("YYYY-MM-DD")
                          return (
                              <DayCreater
                                  UserLang={UserLang}
                                  _date={date}
                                  initTimeTable={initTimeTable}
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
