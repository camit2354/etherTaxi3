import React, { Component } from "react";
import { Button, Card, Icon, Container, Segment } from "semantic-ui-react";

import UserRidePlatform from "../ethereum/userRidePlatform";
import { Link } from "../routes";

class RideReqCard extends Component {
  state = {
    status: "",
    startLocation: "",
    endLocation: "",
    userId: "",
  };

  async componentDidMount() {
    const rideP = UserRidePlatform(this.props.address);
    const userId = await rideP.methods.userAddressId().call();
    const location = await rideP.methods.getLocation().call();
    const status = await rideP.methods.getRideStatus().call();

    this.setState({
      status,
      userId,
      startLocation: location[0],
      endLocation: location[1],
    });
  }

  render() {
    const { userId, status, startLocation, endLocation } = this.state;

    return (
      <Container>
        <Card fluid>
          <Card.Content>
            {startLocation} - {endLocation}
            <Card.Description>{userId}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            {status}
            <Link route={`/ride/driver/${this.props.address}`}>
              <a>
                <Button animated primary>
                  <Button.Content visible>
                    <Icon name="car" />
                  </Button.Content>

                  <Button.Content hidden>
                    <Icon name="arrow alternate circle right outline" />
                  </Button.Content>
                </Button>
              </a>
            </Link>
          </Card.Content>
        </Card>
      </Container>
    );
  }
}

export default RideReqCard;
