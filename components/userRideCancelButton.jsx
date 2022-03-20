import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import {
  Header,
  Segment,
  Icon,
  Form,
  Message,
  Button,
} from "semantic-ui-react";

import RidePlatform from "../ethereum/userRidePlatform";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class UserRideCancelButton extends Component {
  state = {
    errorMsg: "",
    loading: false,
  };
  render() {
    return (
      <Segment inverted color="grey">
        <Form error={!!this.state.errorMsg}>
          <Message error header="oops!" content={this.state.errorMsg} />
          <Button
            secondary
            loading={this.state.loading}
            content="Cancel ride"
            onClick={this.onCancelRide}
          />
        </Form>
      </Segment>
    );
  }

  onCancelRide = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMsg: "" });
    try {
      const rideP = RidePlatform(this.props.address);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      await rideP.methods.cancelRideReq().send({
        from: account,
      });

      Router.push(`/ride/user/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMsg: err.message });
      console.log(err.message);
    }

    this.setState({ loading: false });
  };
}

export default UserRideCancelButton;
