import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import {
  Form,
  Input,
  Message,
  Button,
  Header,
  Segment,
  Icon,
} from "semantic-ui-react";

import RidePlatform from "../ethereum/userRidePlatform";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class UserRideReqForm extends Component {
  state = {
    errorMsg: "",
    loading: false,
    startPoint: "",
    endPoint: "",
  };

  async componentDidMount() {
    const rideP = RidePlatform(this.props.address);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const location = await rideP.methods.getLocation().call();

    this.setState({ startPoint: location[0], endPoint: location[1] });
  }

  render() {
    const { errorMsg, loading, startPoint, endPoint } = this.state;

    return (
      <Segment color="green">
        <Header icon>
          <Icon name="location arrow" />
          Location
        </Header>

        <Form onSubmit={this.onSubmit} error={!!errorMsg}>
          <Form.Field>
            <label>start location</label>
            <Input
              icon="search"
              placeholder="Search ... "
              value={startPoint}
              onChange={(event) =>
                this.setState({ startPoint: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>end location</label>
            <Input
              icon="search"
              placeholder="Search ... "
              value={endPoint}
              onChange={(event) =>
                this.setState({ endPoint: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="oops!" content={errorMsg} />
          <Button
            loading={loading}
            primary
            type="submit"
            content="Enter"
            icon="car"
          />
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

      await rideP.methods
        .createRideReq(this.state.startPoint, this.state.endPoint)
        .send({
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

export default UserRideReqForm;
