import React from "react"
import "element-theme-default"
function ScheduleController() {
    return (
        <div className="schedule_control">
            <div className="fixed_part">
                <div className="buttion_group">
                    <button>
                        <i className="el-icon-arrow-left" />
                    </button>
                    <button>
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
