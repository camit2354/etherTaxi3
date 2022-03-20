import React , {Component} from 'react';
import { Header , Icon ,Container, Form , Button, Message, Segment} from 'semantic-ui-react' ;
import DriverRegisterForm from '../../components/driverRegisterForm';
import 'semantic-ui-css/semantic.min.css';
import mainServer from '../../ethereum/mainServer';
import web3 from '../../ethereum/web3' ;
import { Router } from '../../routes' ;

class NewDriver extends Component{

    static async getInitialProps(props){
        const driverContractAddress = await mainServer.methods.driverProfile(props.query.address).call();
        const emptyAddress = /^0x0+$/.test(driverContractAddress);

        if(!emptyAddress)
        {
            return {address : props.query.address ,driverAlreadyRegistered : 'true'}
        }
        else
        {
            return {address : props.query.address ,driverAlreadyRegistered : 'false'}
        }

        
    }
    render(){

        const {driverAlreadyRegistered , address} = this.props ;

        if(driverAlreadyRegistered == 'false')
        {
            return(
            
                <DriverRegisterForm/>
             );

        }
        else 
        {
            Router.push(`/profile/user/${address}`) ;
            return null ;
        }
        
    }

}

export default NewDriver ;