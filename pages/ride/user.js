import React , {Component} from 'react';
import {Link ,Label,Card ,Grid,Divider, Header ,Icon ,Container, Form , Button, Message, Segment , Input, Dropdown , Option} from 'semantic-ui-react' ;
import 'semantic-ui-css/semantic.min.css';

import UserDriveReqList from '../../components/userDriveReqList' ;
import UserRideStatus from '../../components/userRideStatus';
import UserRideCancelButton from '../../components/userRideCancelButton' ;
import UserRideReqForm from '../../components/userRideReqForm';

import RidePlatform from '../../ethereum/userRidePlatform' ;
import {Router} from '../../routes' ;
import web3 from '../../ethereum/web3' ;

class Ride extends Component{

   
    static async getInitialProps(props){
        
        return {address : props.query.address } ;
    }


    render(){

       
        return (
            <Container>  
                <UserRideStatus address = {this.props.address} >

                </UserRideStatus>     
            
            <Segment placeholder inverted color = 'yellow'>                

                <Grid columns={2} stackable textAlign='center'>
                    <Divider vertical></Divider>

                        <Grid.Row verticalAlign='middle'>
                                <Grid.Column>
                                    <UserRideReqForm address = {this.props.address}>

                                    </UserRideReqForm>
                                </Grid.Column>

                                <Grid.Column>
                                     <UserDriveReqList address = {this.props.address}>
                                        </UserDriveReqList>                                  

                                </Grid.Column>
                            
                        </Grid.Row>

                </Grid>

            </Segment>

                <UserRideCancelButton address = {this.props.address}>

                </UserRideCancelButton>
                    

            </Container>

        );
    }

    
}

export default Ride ;