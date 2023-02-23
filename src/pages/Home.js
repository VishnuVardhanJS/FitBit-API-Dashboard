import React, { useState, useEffect } from 'react'
import '../App.css'
import { Avatar } from '@mui/material'
import 'chart.js/auto';
import { Line } from 'react-chartjs-2'
import "rsuite/dist/rsuite.css"
import axios from 'axios';



function Home() {
    const [Profile, setProfile] = useState({ "user": { "firstName": "Error Getting Name" } });
    const [Info, setInfo] = useState({})
    const [Sleep, setSleep] = useState({
        "sleep": [["2003-07-30", "2003-07-28", "2003-07-27", "2003-07-26", "2003-07-25", "2003-07-24", "2003-07-22", "2003-07-21", "2003-07-20"],
        [21, 45, 17, 1, 29, 22, 2, 19, 17]]
    });
    const [graphShown, setgraphShown] = useState(false);
    const [isError, setisError] = useState(false);
    const [Date, setDate] = useState({});


    useEffect(() => {
        fetch(`http://localhost:5000/profile`).then(
            response => response.json()
        ).then(data => setProfile(data))

        fetch(`http://localhost:5000/info`).then(
            response => response.json()
        ).then(data => setInfo(data))

        fetch('http://localhost:5000/sleep').then(
            response => response.json()
        ).then(
            data => setSleep(data)
            
        )
        if (Sleep["sleep"][0].length > 0) {
            setgraphShown(true)
            setisError(false)
        } else {
            setgraphShown(false)
            setisError(true)
        }

    }, []);

    function sendDate() {

        axios.post('/sleep', Date)
            .then((res) => {
                console.log(res.data)
                setSleep(res.data)


            }).catch((err) => { console.log(err) })

    }

    return (
        <div className="Home">

            <div className='profile'>
                <h3>Hello {Profile.user.firstName}! </h3>
                <Avatar alt="Remy Sharp" className='Avatar' src={Profile.user.avatar} sx={{ width: 48, height: 48 }} />
            </div>

            <div className='device_info'>
                <h3>FitBit {Info.deviceVersion} </h3>
                <h3>Battery : {Info.batteryLevel}% </h3>
            </div>

            {graphShown && (
                <div className='chart'>
                    <Line
                        height={"100px"}
                        data={{
                            labels: Sleep["sleep"][0],
                            datasets: [
                                {
                                    label: 'Sleep Data in Hours',
                                    data: Sleep["sleep"][1],
                                    borderColor: 'rgb(255, 99, 132)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                }
                            ],
                        }}
                    />
                </div>
            )}

            {isError && (
                <div className='errorText'>
                    <h3>No Data Available! </h3>
                </div>
            )}


            <div className='details'>
                <h1>Height : {Math.round(Profile.user.height)}</h1>
                <h1>Weight : {Profile.user.weight}</h1>
                <h1>LifeTime Steps : {Info.steps}</h1>
                <h1>Distance : {Info.distance} km</h1>
            </div>
        </div>
    )
}

export default Home