import React, { Component } from 'react';
import styled from "styled-components";
import { Label, Row } from "reactstrap";
import Dialog from './components/dialog';
import aliveplant from './icons/aliveplant.PNG'; // with import
import deadplant from './icons/deadplant.PNG'; // with import


const theme = {
    blue: {
        default: "#3f51b5",
        hover: "#283593"
    },
    pink: {
        default: "#e91e63",
        hover: "#ad1457"
    }
};

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

const styles = {
    waterButton: {
        fontSize: "15px",
        width: "10vw",
        fontWeight: "bold",
        color: "white",
        fontFamily: "Lato",
        background: "linear-gradient(180deg, #5AAED0 0%, #2B88BF 100%)",
        paddingTop: "5px",
        paddingBottom: "5px",
        borderRadius: "49px",
        cursor: "pointer",
        alignItems: "center",
        boxShadow: "rgb(56 85 132 / 29%) 0px 2px 4px 0px",
        textAlign: "center",
    },
    cancelWaterButton: {
            fontSize: "15px",
            width: "10vw",
            fontWeight: "bold",
            color: "#0091C6",
            fontFamily: "Lato",
            background: "white",
            borderRadius: "49px",
            cursor: "pointer",
            alignItems: "center",
            paddingTop: "5px",
            paddingBottom: "5px",
            border: "1px solid #0091C6",
            boxShadow: "rgb(56 85 132 / 29%) 0px 2px 4px 0px",
            textAlign: "center",

        
    },
    titlelabel: {
        color: "rgb(47, 56, 61)",
        fontFamily: "Lato",
        fontSize: "46px",
        fontWeight: "bold",
        letterSpacing: "0px",
        lineHeight: "24px",
        marginBottom: "1vh",
        textAlign: "center",
        width: "62vw"
    },
    secondTitlelabel: {
        color: "rgb(47, 56, 61)",
        fontFamily: "Lato",
        fontSize: "42px",
        fontWeight: "bold",
        letterSpacing: "0px",
        lineHeight: "24px",
        marginBottom: "1vh",
        textAlign: "center",
        width: "62vw"
    },
    label: {
        color: "rgb(47, 56, 61)",
        fontFamily: "Lato",
        fontSize: "35px",
        fontWeight: "normal",
        letterSpacing: "0px",
        lineHeight: "24px",
        marginBottom: "1vh",
        textAlign: "center",
        width: "10.5vw",
    },
    inputRow: {
        display: "flex",
        marginTop: "10px",
        align:"center"
    },
    calendarIconContainer: {
        height: "auto",
        width: "auto",
        textAlign: "center"
    },
}

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            forecasts: [],
            loading: true,
            number: 0,
            watering: false,
            plantOne: false,
            plantOneTimer: 0,
            plant1Alerted: false,
            plant1NeedsWatering: false,
            plantTwo: false,
            plantTwoTimer: 0,
            plant2Alerted: false,
            plant2NeedsWatering: false,
            plantThree: false,
            plantThreeTimer: 0,
            plant3Alerted: false,
            plant3NeedsWatering: false,
            plantFour: false,
            plantFourTimer: 0,
            plant4Alerted: false,
            plant4NeedsWatering: false,
            plantFive: false,
            plantFiveTimer: 0,
            plant5Alerted: false,
            plant5NeedsWatering: false,
            updatedData: false,
            openDialogue: false
        };
        this.getData = this.getData.bind(this);

    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
        this.getData();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    // returns the current time as yyyy-mm-dd hh:mm:ss
    getFormattedTimeStr = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mmm = String(today.getMonth() + 1).padStart(2, '0');//January is 0!
        var yyyy = String(today.getFullYear());
        var hh = (today.getHours())

        let suffix = null
        if (hh == 0) {
            hh = String(12)
            suffix = "AM"
        } else if (hh > 12) {
            hh = String(hh - 12)
            if (hh.length == 1) {
                hh = "0" + hh
            }
            suffix = "PM"
        } else {
            hh = String(hh)
            suffix = "AM"
        }

        var mm = String(today.getMinutes())
        if (mm.length == 1) {
            mm = "0" + mm
        }
        var ss = String(today.getSeconds())
        if (ss.length == 1) {
            ss = "0" + ss
        }

        today = yyyy + '-' + mmm + '-' + dd + " " + hh + ":" + mm + ":" + ss + " " + suffix;
        return today
    }

    currentPlantAlerted = (plantIndex) => {
        plantIndex += 1
        let alerted = null

        if (plantIndex == 1) {
            alerted = this.state.plant1Alerted
        } else if (plantIndex == 2) {
            alerted = this.state.plant2Alerted
        } else if (plantIndex == 3) {
            alerted = this.state.plant3Alerted
        } else if (plantIndex == 4) {
            alerted = this.state.plant4Alerted
        } else if (plantIndex == 5) {
            alerted = this.state.plant5Alerted
        }

        return alerted

    }

    getWateredTimes = () => {
        let arr = this.state.forecasts;
        let myDictionary = {};

        for (let i = 0; i < arr.length; i++) {
            let lastWatered = arr[i].date.trim();
            console.log(lastWatered)
            console.log(lastWatered.length)
            if (lastWatered.length == 21) {
                
                lastWatered = lastWatered.slice(0, 11) + "0" + lastWatered.slice(11, 21)
            }
            console.log(lastWatered)

            let year = lastWatered.slice(0, 4) ;
            let date = lastWatered.slice(8, 10);
            let month = lastWatered.slice(5, 7);

            let time = lastWatered.slice(11, 22)
            let AMPM = time.slice(9, 11)
            let formatString = null

            if (AMPM == "PM") {
                formatString = lastWatered.slice(0, 19)
                let hour = parseInt(formatString.slice(11, 13)) + 12

                formatString = formatString.slice(0,11) + hour + formatString.slice(13, 19)
            } else {
                formatString = lastWatered.slice(0, 19)

                if (formatString.slice(11, 13) == "12") {
                    formatString = formatString.slice(0,11) + "00" + formatString.slice(13, 19)
                }
            }

            let realDate = new Date(formatString);
            let y = new Date();
            ////used for testing functionality for 6 hours of no watering
            //if (i == 1) {
            //    y.setHours(y.getHours() + 5);
            //   y.setMinutes(y.getMinutes() + 59);
            //    y.setSeconds(y.getSeconds() + 50);
            //}
            let milis = (y - realDate)
            let numOfSeconds = parseInt(milis / 1000)
            let numOfHours = parseInt(numOfSeconds / 3600)
            
            if (numOfHours >= 6) {
                let alerted = (this.currentPlantAlerted(i))
               
                if (!alerted) {
                    console.log("It's been over 6 hours since you watered plant " + (i + 1))

                    if (i == 0) {
                        this.setState({ plant1Alerted: true, plant1Dialog:true, plant1NeedsWatering: true })
                    } else if (i == 1) {
                        this.setState({ plant2Alerted: true, plant2Dialog: true, plant2NeedsWatering: true })
                    } else if (i == 2) {
                        this.setState({ plant3Alerted: true, plant3Dialog: true, plant3NeedsWatering: true })
                    } else if (i == 3) {
                        this.setState({ plant4Alerted: true, plant4Dialog: true, plant4NeedsWatering: true })
                    } else if (i == 4) {
                        this.setState({ plant5Alerted: true, plant5Dialog:true, plant5NeedsWatering: true })
                    }
                }
            }

            let numOfMinutes = parseInt((numOfSeconds - (numOfHours * 3600)) / 60)
            let actualNumOfSeconds = parseInt((numOfSeconds - (numOfHours * 3600) - (numOfMinutes * 60)))
            let final = (numOfHours + " hours, " + numOfMinutes + " minutes, " + actualNumOfSeconds + " seconds")

            myDictionary[arr[i].name] = final;

        }
        return myDictionary;
    }


    waterPlant = (plantIndex) => {
        let dt = new Date();
        dt.setSeconds(dt.getSeconds() + 10);

        if (plantIndex == "Plant 1") {
            if ( ( ((new Date()) - (new Date(this.state.forecasts[0].date)) ) / 1000)  <= 30) {
                alert("wait for plant to cool down")
            } else {
                this.setState({ watering: true, plantOne: true, plantOneEndTime: dt})

            }

        } else if (plantIndex == "Plant 2") {
            if ((((new Date()) - (new Date(this.state.forecasts[1].date))) / 1000) <= 30) {
                alert("wait for plant to cool down")
            } else {
                this.setState({ watering: true, plantTwo: true, plantTwoEndTime: dt})
            }
        } else if (plantIndex == "Plant 3") {
            if ((((new Date()) - (new Date(this.state.forecasts[2].date))) / 1000) <= 30) {
                alert("wait for plant to cool down")
            } else {
                this.setState({ watering: true, plantThree: true, plantThreeEndTime: dt})
            }

        } else if (plantIndex == "Plant 4") {
            if ((((new Date()) - (new Date(this.state.forecasts[3].date))) / 1000) <= 30) {
                alert("wait for plant to cool down")
            } else {
                this.setState({ watering: true, plantFour: true, plantFourEndTime: dt })
            }

        } else if (plantIndex == "Plant 5") {
            if ((((new Date()) - (new Date(this.state.forecasts[4].date))) / 1000) <= 30) {
                alert("wait for plant to cool down")
            } else {
                this.setState({ watering: true, plantFive: true, plantFiveEndTime: dt })
            }
        }

    }

    currentPlantWatering = (plantIndex) => {
        if (plantIndex == "Plant 1" && this.state.plantOne == true) {
            return true
        } else if (plantIndex == "Plant 2" && this.state.plantTwo == true) {
            return true
        } else if (plantIndex == "Plant 3" && this.state.plantThree == true) {
            return true
        } else if (plantIndex == "Plant 4" && this.state.plantFour == true) {
            return true
        } else if (plantIndex == "Plant 5" && this.state.plantFive == true) {
            return true
        }
        return false
    }

    getPlantCounter = (plantIndex) => {

        let currentTime = new Date()
        let timeLeft = null
        let currforecasts = this.state.forecasts

        if (plantIndex == "Plant 1") {
            timeLeft = Math.ceil((this.state.plantOneEndTime.getTime() - currentTime.getTime()) / 1000)

            if (timeLeft == 0) {
                currforecasts[0].date = this.getFormattedTimeStr()
                this.setState({ plantOne: false, plantOneEndTime: null, forecasts: currforecasts, plant1Alerted: false, plant1NeedsWatering: false })
                this.putData(currforecasts[0])
                return "Finished"
                
            }
            return "Watering: " + timeLeft

        } else if (plantIndex == "Plant 2") {
            timeLeft = Math.ceil((this.state.plantTwoEndTime - currentTime) / 1000)

            if (timeLeft == 0) {
                currforecasts[1].date = this.getFormattedTimeStr()
                this.setState({ plantTwo: false, plantTwoEndTime: null, forecasts: currforecasts, plant2Alerted: false, plant2NeedsWatering: false })
                this.putData(currforecasts[1])
                return "Finished"
            }
            return "Watering: " + timeLeft

        } else if (plantIndex == "Plant 3") {
            timeLeft = Math.ceil((this.state.plantThreeEndTime - currentTime) / 1000)

            if (timeLeft == 0) {
                currforecasts[2].date = this.getFormattedTimeStr()
                this.setState({ plantThree: false, plantTHreeEndTime: null, forecasts: currforecasts, plant3Alerted: false, plant3NeedsWatering: false })
                this.putData(currforecasts[2])
                return "Finished"
            }
            return "Watering: " + timeLeft

        } else if (plantIndex == "Plant 4") {
            timeLeft = Math.ceil((this.state.plantFourEndTime - currentTime) / 1000)

            if (timeLeft == 0) {
                currforecasts[3].date = this.getFormattedTimeStr()
                this.setState({ plantFour: false, plantFourEndTime: null, forecasts: currforecasts, plant4Alerted: false, plant4NeedsWatering: false })
                this.putData(currforecasts[3])
                return "Finished"
            }
            return "Watering: " + timeLeft

        } else if (plantIndex == "Plant 5") {
            timeLeft = Math.ceil((this.state.plantFiveEndTime - currentTime) / 1000)

            if (timeLeft == 0) {
                currforecasts[4].date = this.getFormattedTimeStr()
                this.setState({ plantFive: false, plantFiveEndTime: null, forecasts: currforecasts, plant5Alerted: false, plant5NeedsWatering: false })
                this.putData(currforecasts[4])
                return "Finished"
            }
            return "Watering: " + timeLeft

        }

        return null
    }

    cancelWatering = (plantIndex) => {
        if (plantIndex == "Plant 1") {
            this.setState({plantOne: false, plantOneEndTime: null })

        } else if (plantIndex == "Plant 2") {
            this.setState({  plantTwo: false, plantTwoEndTime: null })

        } else if (plantIndex == "Plant 3") {
            this.setState({ plantThree: false, plantThreeEndTime: null })

        } else if (plantIndex == "Plant 4") {
            this.setState({ plantFour: false, plantFourEndTime: null })

        } else if (plantIndex == "Plant 5") {
            this.setState({ plantFive: false, plantFiveEndTime: null })

        }
    }

    renderForecastsTable = () => {
        let forecasts = this.state.forecasts
        let times = this.getWateredTimes();
        return (
            <div>

                <table className='table table-striped' aria-labelledby="tabelLabel" align ="center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Last Watered (C)</th>
                            <th>Is Alive? (F)</th>
                            <th>Time since watering (F)</th>
                            <th>Click to Water</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecasts.map(forecast =>
                            <tr key={forecast.name}>
                                <td align="center">{forecast.name}</td>
                                <div style={{ paddingLeft: "15px", paddingRight: "10px" }}> <td align="center">{forecast.date}</td> </div>
                                <td align="center">{forecast.isAlive + ""}</td>
                                <div style={{ paddingLeft: "15px" }}> <td>{times[forecast.name]}</td> </div>


                                <td align="center">{this.state.watering == true && this.currentPlantWatering(forecast.name) ? (

                                    <div style={{ display: "flex", justifyContent: "center", marginLeft: "3vw", marginRight: "3vw" }}>
                                        <div onClick={() => this.cancelWatering(forecast.name)} style={styles.cancelWaterButton} > Cancel Watering </div>
                                    </div>

                                )
                                    :(
                                        <div style = {{ display: "flex", justifyContent: "center", marginLeft: "3vw", marginRight: "3vw" }}>
                                        <div onClick={() => this.waterPlant(forecast.name)} style={styles.waterButton} >Water </div>
                                        </div>
                                     )
                                }</td>
                                

                                {this.state.watering == true && this.currentPlantWatering(forecast.name) == true ? (
                                    <td>{this.getPlantCounter(forecast.name)}</td>
                                ) : (null)}

                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    async getData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        let newArr = Array.from(data);
        newArr.splice(-1);
        console.log(newArr)

        this.setState({ forecasts: newArr, loading: false });
    }

    // Test method to add an optional 6th plant, not useful
    async sendData() {        
        fetch('weatherforecast', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ Name: "Plant 6", isAlive: true, date: new Date() })
        }).then(r => r.json()).then(res => {
            if (res) {
                this.setState({ message: 'New Employee is Created Successfully' });
            }
        });
    }

    async putData(newPlant) {
        fetch('weatherforecast', {
            method: 'PATCH',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ Name: newPlant.name, isAlive: newPlant.isAlive, date: newPlant.date })
        }).then(r => r.json()).then(res => {
            if (res) {
                this.setState({ updatedData: true });
            }
        });
    }

    render() {

        return (
            <div>

                <div>

                    {this.state.updatedData ? (
                        this.getData()
                    ) : null}

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "7vh", marginRight: "5vw", marginBottom: "3vh" }}>
                        <Label style={styles.titlelabel}>Watering Status</Label>
                    </div>
                   
                    {this.state.loading === true ? (
                        <div>
                            {/*<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  marginRight: "5vw" }}>*/}
                            {/*    <div>*/}
                            {/*        <Button theme="pink" display="inline" onClick={this.populateWeatherData}>*/}
                            {/*            Click here to render watering data*/}
                            {/*        </Button>*/}
                            {/*    </div>                            */}
                            {/*</div>*/}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "2vh", marginRight: "5vw" }}>Loading data... If this takes too long, make sure backend is started and refresh</div>
                        </div>

                        ) : (
                            <div style={{ paddingTop: "1vh" }}>
                                {this.renderForecastsTable()}
                            </div>
                        )
                    }
                </div>


                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "8vh", marginRight: "5vw", marginBottom: "3vh" }}>
                    <Label style={styles.secondTitlelabel}>Visual Representation</Label>
                </div>

                <Row style={{ display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{marginRight: "5vw"}} >
                        <Label style={styles.label}>Plant 1</Label>

                        {this.state.plant1NeedsWatering ? (
                            <div>
                                <Row style={styles.inputRow}>

                                    <div style={styles.calendarIconContainer}>
                                        <img style={{ height: "auto", width: "10.5vw" }} src={deadplant} />
                                    </div>
                                </Row>
                            </div>
                        ): (
                            <Row style = {styles.inputRow}>
                                <div style={styles.calendarIconContainer}>
                                    <img style={{ height: "auto", width: "10vw" }} src={aliveplant} />
                                </div>
                            </Row>
                        )}
                        
                    </div>


                    <div style={{ marginRight: "5vw" }}>
                        <Label style={styles.label}>Plant 2</Label>

                        {this.state.plant2NeedsWatering ? (
                            <div>
                                <Row style={styles.inputRow}>

                                    <div style={styles.calendarIconContainer}>
                                        <img style={{ height: "auto", width: "10.5vw" }} src={deadplant} />
                                    </div>
                                </Row>
                            </div>
                          ) : (
                            <Row style={styles.inputRow}>
                                <div style={styles.calendarIconContainer}>
                                    <img style={{ height: "auto", width: "10vw" }} src={aliveplant} />
                                </div>
                            </Row>
                        )}

                    </div>

                    <div style={{ marginRight: "5vw" }}>
                        <Label style={styles.label}>Plant 3</Label>
                        {this.state.plant3NeedsWatering ? (
                            <div>
                                <Row style={styles.inputRow}>

                                    <div style={styles.calendarIconContainer}>
                                        <img style={{ height: "auto", width: "10.5vw" }} src={deadplant} />
                                    </div>
                                </Row>
                            </div>
                        ) : (
                            <Row style={styles.inputRow}>
                                <div style={styles.calendarIconContainer}>
                                    <img style={{ height: "auto", width: "10vw" }} src={aliveplant} />
                                </div>
                            </Row>
                        )}
                    </div>

                    <div style={{ marginRight: "5vw" }}>
                        <Label style={styles.label}>Plant 4</Label>
                        {this.state.plant4NeedsWatering ? (
                            <div>
                                <Row style={styles.inputRow}>

                                    <div style={styles.calendarIconContainer}>
                                        <img style={{ height: "auto", width: "10.5vw" }} src={deadplant} />
                                    </div>
                                </Row>
                            </div>
                        ) : (
                            <Row style={styles.inputRow}>
                                <div style={styles.calendarIconContainer}>
                                    <img style={{ height: "auto", width: "10vw" }} src={aliveplant} />
                                </div>
                            </Row>
                        )}
                    </div>

                    <div>
                        <Label style={styles.label}>Plant 5</Label>
                        {this.state.plant5NeedsWatering ? (
                            <div>
                                <Row style={styles.inputRow}>

                                    <div style={styles.calendarIconContainer}>
                                        <img style={{ height: "auto", width: "10.5vw" }} src={deadplant} />
                                    </div>
                                </Row>
                            </div>
                        ) : (
                            <Row style={styles.inputRow}>
                                <div style={styles.calendarIconContainer}>
                                    <img style={{ height: "auto", width: "10vw" }} src={aliveplant} />
                                </div>
                            </Row>
                        )}
                    </div>

                </Row>


                <Dialog isOpen={this.state.plant1Alerted && this.state.plant1Dialog} onClose={(e) => this.setState({ plant1Dialog: false })}>
                    Plant 1 hasn't been watered in a while!
                </Dialog>
                <Dialog isOpen={this.state.plant2Alerted && this.state.plant2Dialog} onClose={(e) => this.setState({ plant2Dialog: false })}>
                    Plant 2 hasn't been watered in a while!
                </Dialog>
                <Dialog isOpen={this.state.plant3Alerted && this.state.plant3Dialog} onClose={(e) => this.setState({ plant3Dialog: false })}>
                    Plant 3 hasn't been watered in a while!
                </Dialog>
                <Dialog isOpen={this.state.plant4Alerted && this.state.plant4Dialog} onClose={(e) => this.setState({ plant4Dialog: false })}>
                    Plant 4 hasn't been watered in a while!
                </Dialog>
                <Dialog isOpen={this.state.plant5Alerted && this.state.plant5Dialog} onClose={(e) => this.setState({ plant5Dialog: false })}>
                    Plant 5 hasn't been watered in a while!
                </Dialog>               

                

            </div>
        );
    }

    
}