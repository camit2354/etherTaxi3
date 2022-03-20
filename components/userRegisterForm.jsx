import React, { Component } from "react";
import {
  Header,
  Icon,
  Container,
  Form,
  Button,
  Message,
  Segment,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import mainServer from "../ethereum/mainServer";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class UserRegisterForm extends Component {
  state = {
    fname: "",
    lname: "",
    mobNo: "",
    errorMsg: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMsg: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await mainServer.methods
        .userRegister(this.state.fname, this.state.lname, this.state.mobNo)
        .send({
          from: accounts[0],
        });

      Router.pushRoute("/home");
    } catch (err) {
      this.setState({ errorMsg: err.message });
    }

    this.setState({ loading: false });
  };
  render() {
    return (
      <Container>
        <Segment placeholder>
          <Header icon>
            <Icon name="user" />
            User Register
          </Header>

          <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
            <Form.Field>
              <label>FirstName</label>
              <input
                value={this.state.fname}
                onChange={(event) =>
                  this.setState({ fname: event.target.value })
                }
              />
            </Form.Field>

            <Form.Field>
              <label>LastName</label>
              <input
                value={this.state.lname}
                onChange={(event) =>
                  this.setState({ lname: event.target.value })
                }
              />
            </Form.Field>

            <Form.Field>
              <label>ContactNo</label>
              <input
                value={this.state.mobNo}
                onChange={(event) =>
                  this.setState({ mobNo: event.target.value })
                }
              />
            </Form.Field>
            <Message error header="oops!" content={this.state.errorMsg} />
            <Button
              primary
              type="submit"
              loading={this.state.loading}
              content="Register"
              icon="add circle"
            />
          </Form>
        </Segment>
      </Container>
    );
  }
}

export default UserRegisterForm;
