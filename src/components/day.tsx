import React from "react"
import dayjs from "dayjs"
const cx = require("classnames")
interface I_Props {
    date: dayjs.Dayjs
    initTable: string[]
    bookedIndex: number[]
    availableIndex: number[]
}

function DayCreater(props: I_Props) {
    const { date, initTable, bookedIndex, availableIndex } = props
    return (
        <div className="day_container">
            <div className="day_header">
                <div className="weekday">{date.format("ddd")}</div>
                <div className="date">{date.format("DD")}</div>
            </div>
            <div className="day_body">
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
                {/* {availableIndex.map((time_idx) => {
                    return <div key={initTable[time_idx]}>{initTable[time_idx]}</div>
                })} */}
            </div>
        </div>
    )
}

export default DayCreater
