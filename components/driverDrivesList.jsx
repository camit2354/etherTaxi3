import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";
import {
  Header,
  Segment,
  Icon,
  Form,
  Message,
  Button,
  Card,
  List,
  Label,
  Link,
} from "semantic-ui-react";

import RideReqCard from "../components/rideReqCard";
import mainServer from "../ethereum/mainServer";
import UserRidePlatform from "../ethereum/userRidePlatform";
class DriverDrivesList extends Component {
  state = {
    ridePlatformInstances: [],
  };

  async componentDidMount() {
    const ridePlatformInstances = await mainServer.methods
      .getRidePlatformInstances()
      .call();

    let ridePArray = [];
    for (let address of ridePlatformInstances) {
      const rideP = UserRidePlatform(address);
      const isDriverAvailable = await rideP.methods
        .isDriverAvailable(this.props.driver)
        .call();

      if (isDriverAvailable) {
        ridePArray.push(address);
      }
    }
    this.setState({ ridePlatformInstances: ridePArray });
  }

  render() {
    let items;
    const { ridePlatformInstances } = this.state;

    items = ridePlatformInstances.map((address) => {
      return <RideReqCard address={address}></RideReqCard>;
    });

    return (
      <Segment placeholder color="green">
        <Header icon>
          <Icon name="refresh" />
          <Header.Content>my drive requests ...</Header.Content>
        </Header>

        <List animated verticalAlign="middle" items={items} />
      </Segment>
    );
  }
}

export default DriverDrivesList;
