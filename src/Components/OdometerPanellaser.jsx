import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Odometer from "react-odometerjs";
import * as ROSLIB from "roslib";
const OdometerPanelLaser = ({ros,connected,setConnected}) => {
  const odometerSub = useRef(null);
  const [odometerValue, setOdometerValue] = useState(0.0);
  const [airSpeedValue, setAirSpeedValue] = useState(0.0);
  const [areaValue, setAreaValue] = useState(0.0);
  const [flowRateValue, setFlowRateValue] = useState(0.0);
  const airSpeedSub = useRef(null);
  const areaSub = useRef(null);
  const flowRateSub = useRef(null);
  const odomSub = useRef(null);
  
  useEffect(() => {
    if (!connected) {
      return;
    }

    setConnected(true);
    // subscribe odometer
    odometerSub.current = new ROSLIB.Topic({
      ros: ros.current,
      name: "/odometer",
      messageType: "std_msgs/Float64",
    });

    airSpeedSub.current = new ROSLIB.Topic({
      ros: ros.current,
      name: "/airspeed",
      messageType: "std_msgs/Float32",
    });

    odometerSub.current.subscribe((msg) => {
      setOdometerValue(msg.data);
    });
    airSpeedSub.current.subscribe((msg) => {
      setAirSpeedValue(msg.data);
    });

    odomSub.current = new ROSLIB.Topic({
      ros: ros.current,
      name: "/odom",
      messageType: "nav_msgs/Odometry",
    });
    odomSub.current.subscribe((msg) => {
      // // console.log(msg);
      setAirSpeedValue(msg.pose.pose.position.x);
    });
  }, [connected]);
  return (
    <div className="card bg-base-100">
      <div className="card-body">
        <div className="grid grid-row-2 gap-5">
          <div className="col-span-1">
            <div className="flex flex-col items-center">
              <div>
                <h2 style={{ fontWeight: "bold" }}>ODOMETER</h2>
              </div>
              <div>
                <Odometer
                  value={odometerValue}
                  format="(,ddd).dd"
                  duration="50"
                  style={{ cursor: "pointer", fontSize: "1.5em" }}
                  className="odometer"
                />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex flex-col items-center">
              <div>
                <h2 style={{ fontWeight: "bold" }}>FORWARD DISTANCE</h2>
              </div>
              <div>
                <Odometer
                  value={airSpeedValue}
                  format="(,ddd).dd"
                  duration="50"
                  style={{ cursor: "pointer", fontSize: "1.5em" }}
                  className="odometer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdometerPanelLaser;