import React, { Component } from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Search,
  Segment,
  Label,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import web3 from "../ethereum/web3";
import { Link } from "../routes";
import mainServer from "../ethereum/mainServer";

class DriverLogin extends Component {
  state = {
    myaccount: "",
    isRegistered: false,
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const driverP = await mainServer.methods.driverProfile(accounts[0]).call();
    const emptyAddress = /^0x0+$/.test(driverP);
    let isRegistered = false;

    if (!emptyAddress) {
      isRegistered = true;
    }

    this.setState({ myaccount: accounts[0], isRegistered });
  }

  renderUtil() {
    if (!this.state.isRegistered) {
      return (
        <div>
          <Label> Not a user !</Label>
          <Link route={`/register/driver/${this.state.myaccount}`}>
            <a>
              <Button primary animated>
                <Button.Content visible>driver register </Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow circle right" />
                </Button.Content>
              </Button>
            </a>
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          <Label>Already a user !</Label>
          <Link route={`/profile/driver/${this.state.myaccount}`}>
            <a>
              <Button primary animated>
                <Button.Content visible> driver login </Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow circle right" />
                </Button.Content>
              </Button>
            </a>
          </Link>
        </div>
      );
    }
  }

  render() {
    const { myaccount } = this.state;
    return (
      <Segment placeholder inverted color="brown">
        <Header icon>
          <Icon name="uber" />
          {myaccount}
        </Header>

        {this.renderUtil()}
      </Segment>
    );
  }
}

export default DriverLogin;
