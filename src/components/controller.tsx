import React from "react"
import "element-theme-default"
import dayjs from "dayjs"
const cx = require("classnames")

interface I_Props {
    BtnActive: boolean[]
    weekTitle: dayjs.Dayjs[]
    handlePage: (str: string) => void
}

function ScheduleController(props: I_Props) {
    const { BtnActive, weekTitle, handlePage } = props
    return (
        <div className="schedule_control">
            <div className="fixed_part">
                <div className="buttion_group">
                    <button
                        className={cx({ disabled: !BtnActive[0] }, { active: BtnActive[0] })}
                        onClick={() => handlePage("l")}
                    >
                        <i className="el-icon-arrow-left" />
                    </button>

                    <button
                        className={cx({ disabled: !BtnActive[1] }, { active: BtnActive[1] })}
                        onClick={() => handlePage("r")}
                    >
                        <i className="el-icon-arrow-right" />
                    </button>
                </div>
                {weekTitle ? (
                    <div className="label_box">
                        {weekTitle[0]?.format("YYYY/MM/DD")} - {weekTitle[6]?.format("DD")}
                    </div>
                ) : null}
            </div>
            <div className="rws_part">
                <div className="time_zone_description">
                    <span>* All the timings listed are in your timezone: Taipei (GMT+08:00)</span>
                </div>
            </div>
        </div>
    )
}

export default ScheduleController
