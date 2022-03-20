import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import {
  Header,
  Segment,
  Icon,
  Card,
  Button,
  Message,
  Form,
  Image,
} from "semantic-ui-react";

import RidePlatform from "../ethereum/userRidePlatform";
import web3 from "../ethereum/web3";
import mainServer from "../ethereum/mainServer";
import DriverProfile from "../ethereum/driverProfile";
import { Router } from "../routes";
class DriveReqCard extends Component {
  state = {
    loading: false,
    errorMsg: "",
    price: 0,
    firstName: "",
    lastName: "",
    contactNo: "",
  };

  async componentDidMount() {
    const rideP = RidePlatform(this.props.address);

    const price = await rideP.methods
      .driverCharge(this.props.driverAddress)
      .call();

    const driverContractAddress = await mainServer.methods
      .driverProfile(this.props.driverAddress)
      .call();
    const driverP = DriverProfile(driverContractAddress);

    const firstName = await driverP.methods.firstName().call();
    const lastName = await driverP.methods.lastName().call();
    const contactNo = await driverP.methods.contactNo().call();

    this.setState({ price, firstName, lastName, contactNo });
  }

  onSubmit = async (event) => {
    this.setState({ loading: true, errorMsg: "" });

    try {
      const rideP = RidePlatform(this.props.address);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      await rideP.methods.chooseDriveReq(this.props.driverAddress).send({
        gas: 5000000,
        from: account,
        value: this.state.price + 1000,
      });

      Router.push(`/ride/user/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    const { price, firstName, lastName, contactNo, loading, errorMsg } =
      this.state;
    return (
      <Form onSubmit={this.onSubmit} error={errorMsg}>
        <Card fluid>
          <Card.Content>
            {firstName} {lastName}
            <Card.Description>charge : {price}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Message error header="oops!" content={errorMsg} />
            <Button
              loading={loading}
              type="submit"
              primary
              icon="chess rook"
              content="select"
            />
          </Card.Content>
        </Card>
      </Form>
    );
  }
}

export default DriveReqCard;
