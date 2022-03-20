import React, { Component } from "react";
import {
  Grid,
  Divider,
  Label,
  Card,
  Header,
  Icon,
  Container,
  Form,
  Button,
  Message,
  Segment,
  Input,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import RidePlatform from "../ethereum/userRidePlatform";
import { Router } from "../routes";
import web3 from "../ethereum/web3";

class DriveReqForm extends Component {
  state = {
    charge: 0,
    loading: false,
    errorMsg: "",
    account: "",
    driverSelected: "",
    status: "",
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const rideP = RidePlatform(this.props.ridePlatformAddress);

    const driverSelected = await rideP.methods.driverSelected().call();
    const status = await rideP.methods.getRideStatus().call();

    this.setState({ account, driverSelected, status });
  }
  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMsg: "" });

    if (this.state.status == "rideReqCreated") {
      try {
        const rideP = RidePlatform(this.props.ridePlatformAddress);

        await rideP.methods.createDriveReq(this.state.charge).send({
          from: this.state.account,
        });

        Router.push(`/ride/driver/${this.props.ridePlatformAddress}`);
      } catch (err) {
        this.setState({ errorMsg: err.message });
      }
    } else {
      try {
        const rideP = RidePlatform(this.props.ridePlatformAddress);

        await rideP.methods.drive().send({
          from: this.state.account,
        });

        Router.push(`/ride/driver/${this.props.ridePlatformAddress}`);
      } catch (err) {
        this.setState({ errorMsg: err.message });
      }
    }

    this.setState({ loading: false });
  };

  renderDriveReqForm() {
    return (
      <Segment placeholder inverted color="grey">
        <Header icon>
          <Icon name="car" />
          Drive request
        </Header>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
          <Form.Field>
            <label>price</label>
            <Input
              icon="money"
              label="Wei"
              labelPosition="right"
              value={this.state.charge}
              onChange={(event) =>
                this.setState({ charge: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="oops!" content={this.state.errorMsg} />
          <Button animated loading={this.state.loading} primary>
            <Button.Content visible>
              <Icon name="money" />
              Enter
            </Button.Content>

            <Button.Content hidden>
              <Icon name="arrow alternate circle right" />
            </Button.Content>
          </Button>
        </Form>
      </Segment>
    );
  }

  renderPickupForm() {
    if (this.state.account == this.state.driverSelected) {
      return (
        <Segment placeholder inverted color="grey">
          <Header icon>
            <Icon name="history" /> Your drive selected
          </Header>

          <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
            <Message error header="oops!" content={this.state.errorMsg} />
            <Button animated loading={this.state.loading} primary>
              <Button.Content visible>
                <Icon name="car" />
                drive
              </Button.Content>

              <Button.Content hidden>
                <Icon name="arrow alternate circle right" />
              </Button.Content>
            </Button>
          </Form>
        </Segment>
      );
    } else {
      return (
        <Segment placeholder inverted color="grey">
          <Header icon>
            <Icon name="history" /> Another driver selected
          </Header>
        </Segment>
      );
    }
  }

  render() {
    if (this.state.status == "rideReqCreated") {
      return <Segment>{this.renderDriveReqForm()}</Segment>;
    } else {
      return <Segment> {this.renderPickupForm()}</Segment>;
    }
  }
}

export default DriveReqForm;
