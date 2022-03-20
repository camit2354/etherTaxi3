import React , {Component} from 'react'
import {
    Menu,
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Search,
  Segment,
} from 'semantic-ui-react'

import UserLogin from '../components/userLogin';
import DriverLogin from '../components/driverLogin';

import 'semantic-ui-css/semantic.min.css';

import web3 from '../ethereum/web3' ;
import {Link} from '../routes' ;
import mainServer from "../ethereum/mainServer";


class Home extends Component{

   state = {
       activeItem : 'user'
   }

   handleItemClick = (e, { name }) =>{
    this.setState({ activeItem: name })
    }

    renderLoginPage(){
        const {activeItem} = this.state ;
        if(activeItem == 'user')
        {
            return (
                <UserLogin/>
            );
        }
        else 
        {
            return(
                <DriverLogin/>
            );
        }
    }

    render(){

        const {activeItem} = this.state ;
        return (           

            <Container>
                <Menu attached='top' tabular>
                    <Menu.Item
                        name='user'
                        active={activeItem === 'user'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='driver'
                        active={activeItem === 'driver'}
                        onClick={this.handleItemClick}
                    />
                </Menu>
                <Segment placeholder>
                    {this.renderLoginPage()}
                </Segment>
                   
            </Container> 
        ) ;
        }
    }

    export default Home ;


