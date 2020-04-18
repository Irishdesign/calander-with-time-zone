import React from "react"
import dayjs from "dayjs"
const cx = require("classnames")
interface I_Props {
    date: dayjs.Dayjs
    initTable: string[]
    bookedIndex: number[]
    availableIndex: number[]
    UserLang: string
}

function DayCreater(props: I_Props) {
    const { date, initTable, bookedIndex, availableIndex, UserLang } = props
    const today = dayjs()
    const cn_Week = ["日", "一", "二", "三", "四", "五", "六"]
    return (
        <div className="day_container">
            <div className={cx("day_header", { expired: date.isBefore(today) })}>
                <div className="weekday">{UserLang === "zh-TW" ? cn_Week[date.day()] : date.format("ddd")}</div>
                <div className="date">{date.format("DD")}</div>
            </div>
            <div className={cx("day_body", { expired: date.isBefore(today) })}>
                {initTable.map((time, i) => {
                    return (
                        <div
                            className={cx({
                                green: bookedIndex?.indexOf(i) > -1,
                                show: availableIndex?.indexOf(i) > -1,
                            })}
                            key={time}
                        >
                            {time}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default DayCreater
