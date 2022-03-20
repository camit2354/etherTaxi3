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

class CnacelDriveButton extends Component {
  state = {
    errorMsg: "",
    loading: false,
  };
  render() {
    return (
      <Segment inverted color="black">
        <Form error={!!this.state.errorMsg}>
          <Message error header="oops!" content={this.state.errorMsg} />
          <a>
            <Button
              animated
              negative
              loading={this.state.loading}
              onClick={this.onSubmit}
            >
              <Button.Content visible>Cancel Drive</Button.Content>

              <Button.Content hidden>
                <Icon name="arrow circle right" />
              </Button.Content>
            </Button>
          </a>
        </Form>
      </Segment>
    );
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMsg: "" });

    try {
      const rideP = RidePlatform(this.props.address);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      await rideP.methods.cancelDriveReq().send({
        from: account,
      });

      Router.push(`/profile/driver/${account}`);
    } catch (err) {
      this.setState({ errorMsg: err.message });
      console.log(err.message);
    }

    this.setState({ loading: false });
  };
}

export default CnacelDriveButton;
