import React , {Component} from 'react';
import { Grid ,Divider ,Label ,Card ,Header ,Icon ,Container, Form , Button, Message, Segment , Input} from 'semantic-ui-react' ;
import DriveReqForm from '../../components/driveReqForm';
import CancelDriveButton from '../../components/cancelDriveButton';
import 'semantic-ui-css/semantic.min.css';

import RidePlatform from '../../ethereum/userRidePlatform';
import { Router} from '../../routes' ;
import web3 from '../../ethereum/web3';

class Ride extends Component{

  state = {
    myDriveRequest : 'false' ,
    myCharge : 0 ,
    status : '',
    driverSelected : '',
    account : ''
   
    
  }

  static async getInitialProps(props){
      const rideP = RidePlatform(props.query.address) ;
     
      const location = await rideP.methods.getLocation().call() ;
      const status = await rideP.methods.getRideStatus().call() ;
      const userId = await rideP.methods.userAddressId().call() ;     
     

      return {ridePlatformAddress : props.query.address ,startPoint:location[0] , endPoint : location[1] , status , userId  } ;

  }

  async componentDidMount()
  {
    const accounts = await web3.eth.getAccounts() ;
    const account = accounts[0] ;
    
    const rideP = RidePlatform(this.props.ridePlatformAddress);

      let myDriveRequest = await rideP.methods.isDriverAvailable(account).call() ;
      let driverSelected = await rideP.methods.driverSelected().call();
      const status = await rideP.methods.getRideStatus().call() ;

      if(myDriveRequest)
      {
          myDriveRequest = 'true' ;
      }
      else 
      {
        myDriveRequest = 'false' ;
      }

      const myCharge = await rideP.methods.driverCharge(account).call() ;

      this.setState({myDriveRequest  , myCharge , account , status , driverSelected}) ;
      
  }

  renderDriveReqStatus(){
    const {myDriveRequest , myCharge , status } = this.state ;
   

    if(status == 'rideReqCreated')
    {

      if(myDriveRequest == 'true')
      {
          return (<div>
            Drive Req created - price : {myCharge}
          </div>);
      }
      else
      {
        return (<div>
            No drive Req created ...
          </div>);
      }

    }
    else 
    {
      return (<div>
        Driver selected ...
      </div>);
    }
      
  }

  renderRideReq (){

   

    return (
    
    <Segment placeholder inverted color = 'grey'>

          <Header icon>
                <Icon name='chess king' />
                   ride request      
            </Header>
            <Label>{this.props.startPoint} - {this.props.endPoint}</Label>
            <Label>status :{this.state.status}</Label>
            <Label>userId : {this.props.userId}</Label>
            <Label>driverSelected : {this.state.driverSelected}</Label>
                    
           

    </Segment>

    );
  }


    render(){

      if(this.state.status == 'idle')
      {
        return (<Container>
          <Segment  placeholder inverted color = 'grey'>
            <Header icon>
            <Icon name = 'history'/>Ride completed !

            </Header>

          </Segment>
        </Container>);
      }
        return (
            <Container>
              <Segment raised inverted >             
              <Header icon>
                <Icon name = 'history'/>
                {this.renderDriveReqStatus()}
                </Header>
                </Segment>

              <Segment placeholder inverted color = 'green'> 
                           
                    <Grid columns={2} stackable textAlign='center'>
                      <Divider vertical>/</Divider>

                      <Grid.Row verticalAlign='middle'>
                              <Grid.Column>
                                  {this.renderRideReq()}                            

                              </Grid.Column>

                              <Grid.Column>
                                     
                                 <DriveReqForm ridePlatformAddress = {this.props.ridePlatformAddress}/>
                                    
                              </Grid.Column>
                      </Grid.Row>
                    </Grid>       
       
                    </Segment>

                   
                      <CancelDriveButton address = {this.props.ridePlatformAddress} />
                   
        </Container>

        );
    }

    


}

export default Ride ;