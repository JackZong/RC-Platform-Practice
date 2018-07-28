import React from 'react'
import SDK from 'ringcentral'
import RingCentralClient, {SERVER_SANDBOX} from 'ringcentral-client'
import './login.css'
import { Grid, Row, Col, FormGroup, FormControl, Button, Panel,ControlLabel } from 'react-bootstrap'
const Login = () => {
    const handleSubmit = (e) => {
      e.preventDefault()
        let appkey = document.getElementById('appkey').value
        let secret = document.getElementById('secret').value
        var rcsdk = new SDK({
            server: SERVER_SANDBOX,
            appKey: 'S-LQPkR2Qlmv9lOV_i6QKg',
            appSecret: 'xYj_jVc5Sf2WxSGAwFOCVwn37wWR8DTfiW3FYx5cC8ew',
            redirect_uri: 'http://127.0.0.1:3000/call'
        })
        var platform = rcsdk.platform();
        var loginUrl = platform.loginUrl({implicit: false,display:'page',brandId:'1210',redirectUri: 'http://127.0.0.1:3000/call'}); // implicit parameter is optional, default false
        platform.loginWindow({
            url: loginUrl
        }).then((res) => {
        //  console.log(res)
        }).catch( err => {

        })
    }
    return (
        <Grid>
            <Row className='row'>
                <Col md={4}></Col>
                <Col md={4}>
                    <Panel>
                    <Panel.Body>
                    <form>
                        <FormGroup>
                            <ControlLabel>AppKey</ControlLabel>
                            <FormControl
                                type='text'
                                placeholder='Enter appkey'
                                id='appkey'
                            />
                            <ControlLabel>AppScrect</ControlLabel>
                            <FormControl
                                type='text'
                                placeholder='Enter appScrect'
                                id='secret'
                            />
                            <ControlLabel>Server</ControlLabel>
                            <FormControl
                              type='text'
                              id= 'server'
                              placeholder='Enter the server addr'/>
                        </FormGroup>
                        <Button type='submit' bsStyle='primary' onClick={handleSubmit}>Authorization Code</Button>
                    </form>
                    </Panel.Body>
                    </Panel>
                </Col>
                <Col md={4}>
                </Col>
            </Row>

        </Grid>
    )
}
export default Login