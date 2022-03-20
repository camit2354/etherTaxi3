import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import { Header, Segment, Icon } from "semantic-ui-react";

import RidePlatform from "../ethereum/userRidePlatform";
import web3 from "../ethereum/web3";

class UserRideStatus extends Component {
  state = {
    status: "idle",
    startPoint: "",
    endPoint: "",
    driverSelected: "",
  };

  async componentDidMount() {
    const rideP = RidePlatform(this.props.address);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const location = await rideP.methods.getLocation().call();
    const status = await rideP.methods.getRideStatus().call();
    const driverSelected = await rideP.methods.driverSelected().call();

    this.setState({
      startPoint: location[0],
      endPoint: location[1],
      status,
      driverSelected,
    });
  }

  render() {
    const { status, driverSelected, startPoint, endPoint } = this.state;
    if (status == "idle") {
      return (
        <Segment raised inverted>
          <Header icon>
            <Icon name="history" />
            {status}
          </Header>
        </Segment>
      );
    } else if (status == "rideReqCreated") {
      return (
        <Segment raised inverted>
          <Header icon>
            <Icon name="diamond" />
            {status}
            <div>
              {startPoint} - {endPoint}
            </div>
          </Header>
        </Segment>
      );
    } else {
      return (
        <Segment raised inverted>
          <Header icon>
            <Icon name="diamond" />
            {status}
            <div>
              {startPoint} - {endPoint}
            </div>
            <div>{driverSelected}</div>
          </Header>
        </Segment>
      );
    }
  }
}

export default UserRideStatus;
