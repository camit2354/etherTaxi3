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
} from "semantic-ui-react";

import DriveReqCard from "../components/driveReqCard";
import RidePlatform from "../ethereum/userRidePlatform";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class UserDriveReqList extends Component {
  state = {
    status: "idle",
    drivers: [],
    driverSelected: "",
    loading: false,
    errorMsg: "",
    account: "",
  };

  async componentDidMount() {
    const rideP = RidePlatform(this.props.address);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const status = await rideP.methods.getRideStatus().call();
    const driverSelected = await rideP.methods.driverSelected().call();
    const drivers = await rideP.methods.getDrivers().call();

    this.setState({ account, status, driverSelected, drivers });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMsg: "" });

    if (this.state.status == "driverOnPath") {
      try {
        const rideP = RidePlatform(this.props.address);

        await rideP.methods.getInCab().send({
          from: this.state.account,
        });

        Router.push(`/ride/user/${this.props.address}`);
      } catch (err) {
        this.setState({ errorMsg: err.message });
      }
    } else {
      try {
        const rideP = RidePlatform(this.props.address);

        await rideP.methods.makePayment().send({
          from: this.state.account,
        });

        Router.push(`/ride/user/${this.props.address}`);
      } catch (err) {
        this.setState({ errorMsg: err.message });
      }
    }

    this.setState({ loading: false });
  };

  render() {
    const { status, driverSelected, drivers } = this.state;

    if (status == "idle") {
      return (
        <Segment>
          <Header icon>
            <Icon name="history" />
          </Header>
        </Segment>
      );
    } else if (status == "rideReqCreated") {
      let items;

      items = drivers.map((address) => {
        return (
          <DriveReqCard
            address={this.props.address}
            driverAddress={address}
          ></DriveReqCard>
        );
      });

      return (
        <Segment placeholder color="green">
          <Header icon>
            <Icon name="diamond" />
            <Header.Content>Drive requests ...</Header.Content>
          </Header>

          <List animated verticalAlign="middle" items={items} />
        </Segment>
      );
    } else if (status == "driveReqSelected") {
      return (
        <Segment>
          <Header icon>
            <Icon name="chess board" />
            <Header.Content>{status}</Header.Content>
          </Header>
        </Segment>
      );
    } else if (status == "driverOnPath") {
      return (
        <Segment>
          <Header icon>
            <Icon name="chess board" />
            <Header.Content>{status}</Header.Content>
          </Header>

          <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
            <Message error header="oops!" content={this.state.errorMsg} />
            <Button animated loading={this.state.loading} primary>
              <Button.Content visible>
                <Icon name="car" />
                get in cab
              </Button.Content>

              <Button.Content hidden>
                <Icon name="arrow alternate circle right" />
              </Button.Content>
            </Button>
          </Form>
        </Segment>
      );
    } else if (status == "rideOn") {
      return (
        <Segment>
          <Header icon>
            <Icon name="chess board" />
            <Header.Content>{status}</Header.Content>
          </Header>

          <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
            <Message error header="oops!" content={this.state.errorMsg} />
            <Button animated loading={this.state.loading} primary>
              <Button.Content visible>
                <Icon name="car" />
                make payment
              </Button.Content>

              <Button.Content hidden>
                <Icon name="arrow alternate circle right" />
              </Button.Content>
            </Button>
          </Form>
        </Segment>
      );
    }
  }
}

export default UserDriveReqList;
