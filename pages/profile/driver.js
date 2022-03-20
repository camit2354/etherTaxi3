import React, { Component } from "react";
import {Card,Menu, Grid , Divider ,Label , Button , Icon , Container, Segment , Header} from "semantic-ui-react" ;

import RideReqList from '../../components/rideReqList';
import DriverDrivesList from '../../components/driverDrivesList' ;
import 'semantic-ui-css/semantic.min.css';

import mainServer from '../../ethereum/mainServer' ;
import DriverProfile from '../../ethereum/driverProfile' ;
import {Link ,Router} from '../../routes' ;

class Driver extends Component {
  
  state = {
    activeItem : 'driveReq'
  }

  handleItemClick = (e, { name }) =>{
    this.setState({ activeItem: name })
    }


  static async getInitialProps(props) {
    const driverContractAddress = await mainServer.methods.driverProfile(props.query.address).call();
    const emptyAddress = /^0x0+$/.test(driverContractAddress);
    
    if(!emptyAddress)
    {
      const driverProfile = DriverProfile(driverContractAddress) ;    
      const summary = await driverProfile.methods.getDriverProfileSummary().call() ;     
      return {address : props.query.address ,loginStatus : 'success',summary} ;  

    }
    else 
    {
     
      return {address : props.query.address ,loginStatus : 'failure'} ;
    }
      
   
  }

  renderItem(){

    const {activeItem} = this.state ;
    if(activeItem == 'rideReq')
    {
      return (<RideReqList driver = {this.props.address}/>);

    }
    else 
    {
      return (<DriverDrivesList driver = {this.props.address}/>) ;
    }

  }


  render() {

    const {loginStatus} = this.props ;
    const {activeItem} = this.state ;

    if(loginStatus == 'success')
    {
    
    return (<Container> 
      
      <Segment placeholder inverted color = 'grey'>

      <Grid columns={2} stackable textAlign='center'>
          <Divider vertical></Divider>

          <Grid.Row verticalAlign='middle'>
                  <Grid.Column>
                    <Header icon>
                    <Icon name='uber' />
                    {this.props.summary[0] }  {this.props.summary[1]}        
                    </Header>
                  </Grid.Column>

                  <Grid.Column>

                      <Menu attached='top' tabular>
                        <Menu.Item
                            name='rideReq'
                            active={activeItem === 'rideReq'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='driveReq'
                            active={activeItem === 'driveReq'}
                            onClick={this.handleItemClick}
                        />
                    </Menu>

                    <Segment>
                      {this.renderItem()}
                    </Segment>
                  
                  </Grid.Column>
              
          </Grid.Row>
    
    </Grid>
    </Segment>
      
    </Container>
      );
    }
    else 
    {
      Router.push(`/register/driver/${this.props.address}`) ;
      return null ;
    }
  }

  
}

export default Driver;