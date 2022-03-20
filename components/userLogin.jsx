import React, { Component } from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Menu,
  Header,
  Icon,
  Search,
  Segment,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import web3 from "../ethereum/web3";
import { Link } from "../routes";
import mainServer from "../ethereum/mainServer";

class UserLogin extends Component {
  state = {
    myaccount: "",
    isRegistered: false,
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const userP = await mainServer.methods.userProfile(accounts[0]).call();
    const emptyAddress = /^0x0+$/.test(userP);
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
          <Link route={`/register/user/${this.state.myaccount}`}>
            <a>
              <Button primary animated>
                <Button.Content visible> user register </Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow circle right" />
                </Button.Content>
              </Button>
            </a>
          </Link>
          <Header>
            <label>not a user !</label>
          </Header>
        </div>
      );
    } else {
      return (
        <div>
          <Link route={`/profile/user/${this.state.myaccount}`}>
            <a>
              <Button primary animated>
                <Button.Content visible> user login </Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow circle right" />
                </Button.Content>
              </Button>
            </a>
          </Link>
          <Header>
            <label>Already a user !</label>
          </Header>
        </div>
      );
    }
  }
  render() {
    const { myaccount } = this.state;
    return (
      <Segment placeholder inverted color="grey">
        <Header icon>
          <Icon name="user" />
          {myaccount}
        </Header>
        {this.renderUtil()}
      </Segment>
    );
  }
}

export default UserLogin;
