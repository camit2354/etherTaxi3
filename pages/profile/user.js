import React, { Component } from "react";
import {Button, Card,Image, Icon , Container , Header, Segment , Label } from "semantic-ui-react" ;
import 'semantic-ui-css/semantic.min.css';

import web3 from '../../ethereum/web3' ;
import mainServer from '../../ethereum/mainServer';
import UserProfile from '../../ethereum/userProfile' ;
import {Link , Router} from '../../routes' ;

class User extends Component {

  static async getInitialProps(props) {
    const userContractAddress = await mainServer.methods.userProfile(props.query.address).call();
    const emptyAddress = /^0x0+$/.test(userContractAddress);

    if(!emptyAddress)
    {
      const userProfile = UserProfile(userContractAddress) ;
      const ridePlatform = await userProfile.methods.rideContractInstanceAddressId().call() ;
      
      const summary = await userProfile.methods.getUserProfileSummary().call() ;
      return { address : props.query.address ,loginStatus : 'success',ridePlatform : ridePlatform ,profileId : userProfile , fname : summary[0] , lname : summary[1] , mobNo : summary[2]} ;

    }
    else 
    {
      
      return {address : props.query.address ,loginStatus : 'failure'}
    }
    

  }

  

  render() {

    const {loginStatus} = this.props ;

    if(loginStatus == 'success')
    {
    
    return (
    <Container>
     
       <Segment placeholder>

       <Header icon>
        <Icon name='user' />
        {this.props.fname }  {this.props.lname}
         <div>
         {this.props.ridePlatform}
           </div>       
        </Header>
        
       

        <Link route = {`/ride/user/${this.props.ridePlatform}` }>
          <a>

              <Button primary animated >
              <Button.Content visible> ride </Button.Content>
              <Button.Content hidden>
                <Icon name='car' />
              </Button.Content>
              </Button>

          </a>

        </Link>
        


       </Segment>


    </Container>

      );
    }
    else{
      Router.push(`/register/user/${this.props.address}`);
      return null ;
    }
      
  }
}

export default User;
