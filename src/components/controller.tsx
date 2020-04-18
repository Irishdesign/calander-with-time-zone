import React from "react"
import "element-theme-default"
const cx = require("classnames")

interface I_Props {
    leftBtnActive?: boolean
}

function ScheduleController(props: I_Props) {
    return (
        <div className="schedule_control">
            <div className="fixed_part">
                <div className="buttion_group">
                    <button className={cx({ disabled: props.leftBtnActive })}>
                        <i className="el-icon-arrow-left" />
                    </button>

                    <button className="active">
                        <i className="el-icon-arrow-right" />
                    </button>
                </div>
                <div className="label_box">2020/04/12 - 19</div>
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
