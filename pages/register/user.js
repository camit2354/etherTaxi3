import React , {Component} from 'react';
import { Header ,Icon ,Container, Form , Button, Message, Segment} from 'semantic-ui-react' ;
import UserRegisterForm from '../../components/userRegisterForm';

import 'semantic-ui-css/semantic.min.css';
import mainServer from '../../ethereum/mainServer';
import web3 from '../../ethereum/web3' ;
import {Router} from '../../routes' ;

class NewUser extends Component{

    static async getInitialProps(props){
        const userContractAddress = await mainServer.methods.userProfile(props.query.address).call();
        const emptyAddress = /^0x0+$/.test(userContractAddress);

        if(!emptyAddress)
        {
            return {address : props.query.address ,userAlreadyRegistered : 'true'} ;
        }
        else
        {
            return {address : props.query.address ,userAlreadyRegistered : 'false'} ;
        }

        
    }

    render(){

        const {userAlreadyRegistered , address} = this.props ;

        if(userAlreadyRegistered == 'false')
        {

            return(            
                <UserRegisterForm/>
             );

        }
        else
        {
            Router.push(`/profile/user/${address}`);
            return null ;
        }
        
    }

}

export default NewUser ;