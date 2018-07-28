import React from 'react'
import SDK from 'ringcentral'
import { Grid, Row, Col, Image, Panel, Table, Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import './call.css'
import RingcentralClient,{ SERVER_SANDBOX } from 'ringcentral-client'
var rcsdk = new SDK({
    server: SERVER_SANDBOX,
    appKey: 'S-LQPkR2Qlmv9lOV_i6QKg',
    appSecret: 'xYj_jVc5Sf2WxSGAwFOCVwn37wWR8DTfiW3FYx5cC8ew',
    redirect_uri: 'http://localhost:3000/call'
})
var client = new RingcentralClient(rcsdk)
class Call extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            access_token: null,
            refresh_token: null,
            token_type: null,
            scope: null,
            name: null,
            phone: null,
            email: null,
            account_id: null,
            smsModalShow: false,
            profile: null,
            records: null,
            recordShow: false,
            subRes: null,
            callTime: null
        }
    }
    componentDidMount(){
       // SDK.handleLoginRedirect()
        var loginOptions = rcsdk.platform().parseLoginRedirect(window.location.hash || window.location.search);
        loginOptions.redirectUri ='http://127.0.0.1:3000/call'
        rcsdk.platform().login(loginOptions).then((body) => {
            let data = body._json
            this.setState({
                access_token: data.access_token,
                token_type: data.token_type,
                refresh_token: data.refresh_token,
                scope: data.scope
            })
        });
        rcsdk.platform().send({
            method:'GET',
            url:'/account/~/extension/~'
        }).then((res) => {
            console.log(res.json(),'res')
            let data = res.json()
            this.setState({
                name: data.name,
                account_id: data.account.id,
                phone: data.contact.businessPhone,
                email: data.contact.email,
                profile: data.profileImage.uri
            })

        }).catch( err => {
            console.log(err)
        })
        this.doSubscriptions()
       // this.doSms()
       this.getRecentCalls()
    }
    doSubscriptions = () => {
        console.log('do sub')
        let sub = rcsdk.createSubscription();
        let self = this
        sub.on(sub.events.notification, (msg) => {
            console.log(msg,'subing')
            self.setState({
                subRes: msg.body,
                callTime: msg.timestamp
            })
            this.activeCall()
        })
        sub.setEventFilters(['/account/~/extension/~/presence']).register().then(res => console.log(res.json(),'io')).catch(err => console.log(err,'sub'))
    }
    doSms = () => {
        let to = document.getElementById('textTo').value
        let text = document.getElementById('msgText').value
        let self = this
      //  console.log(this.to)
       //  debugger
        rcsdk.platform()
            .post('/account/~/extension/~/sms', {
                from: {phoneNumber:'+13127248993'}, // Your sms-enabled phone number
                to: [
                    {phoneNumber: to} // Second party's phone number
                ],
                text: text
            })
            .then(function(response) {
                alert('Success: ' + response.json().id);
                self.hideSmsModal()
            })
            .catch(function(e) {
                alert('Error: ' + e.message);
            });
        // or another method
        // client.account().extension().sms().post({
        //     to: [{ phoneNumber: '+13127248993'}],
        //     from: { phoneNumber: '+13127248993'},
        //     text: 'test from ringout client'
        // }).then( msg => {
        //     console.log(msg,'msm')
        // }).catch( err => {
        //     console.log(err,'msm')
        // })

    }
    getRecentCalls = () => {
        let self = this
        rcsdk.platform()
            .get('/account/~/extension/~/call-log', {query: {page: 1, perPage: 10}})
            .then(function(response) {
               let calls = response.json().records;
                console.log(calls,'calls')
                self.setState({
                    records: calls
                })
            })
            .catch(function(e) {
               // alert('Recent Calls Error: ' + e.message);
            });

    }
    hideSmsModal = () => {
        this.setState({
            smsModalShow: !this.state.smsModalShow
        })
    }
    showRecord = () => {
        this.setState({
            recordShow: true
        })
    }
    hideRecord = () => {
        this.setState({
          recordShow: false
        })
    }
    ringout = () => {

       // debugger
        // client.account().extension().ringout().post({
        //     from: { phoneNumber: '+13127248993'},
        //     to: { phoneNumber: '+13127248993' },
        //     callerId: { phoneNumber: '+13127248993'}
        // }).then( ringout => {
        //     console.log('ringout success', ringout)
        // }, e => {
        //     console.log('fail to ringout ', e)
        // })

    }
    activeCall = () => {
        client.account().extension().activeCalls().list({
            page: 1,
            direction: 'Inbound'
        }).then(results => {
            console.log('active calls', results.records)
        }, e => {
            console.err('fail to get active calls', e)
        })
    }
    logout = () => {
        console.log('log')
        rcsdk.platform().logout().then( res => {
          console.log(res,'logout')
        }).catch( err => {
          console.log(err)
        })
    }
 render(){
        let { access_token, refresh_token, token_type, scope, name, phone, email, account_id, smsModalShow, records,
            recordShow, subRes, callTime } = this.state
     console.log(subRes)
        let recordsTr
     if(records) {
          recordsTr = records.map((record, index, arr) => {
              return (<tr> <td>{record.direction}</td> <td>{record.from.phoneNumber}</td> <td>{record.type}</td> <td>{record.startTime}</td></tr>)
          })
     }

     return (
            <div>
            <Grid>
                <Row>
                    <Col md={12}>
                        <Panel>
                            <Panel.Body>
                                <Table striped bordered condensed hover>
                                    <thead>
                                    <tr>
                                        <th colSpan='2' className='thd'>Access Info</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Access token</td>
                                        <td>{access_token}</td>
                                    </tr>
                                    <tr>
                                        <td>Token type</td>
                                        <td>{token_type}</td>
                                    </tr>
                                    <tr>
                                        <td>scope</td>
                                        <td>{scope}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                                <Table striped bordered condensed hover>
                                    <thead>
                                    <tr>
                                        <th colSpan='2' className='thd'>User Info</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>{name}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone</td>
                                        <td>{phone}</td>
                                    </tr>
                                    <tr>
                                        <td>email</td>
                                        <td>{email}</td>
                                    </tr>
                                    <tr>
                                        <td>Account ID</td>
                                        <td>{account_id}</td>
                                    </tr>
                                    <tr>
                                        <td>Actions</td>
                                        <td>
                                            <Button onClick={this.hideSmsModal}>Send Message(text)</Button>
                                            <Button onClick={this.ringout}>Ringout</Button>
                                            <Button onClick={this.showRecord}>Call log</Button>
                                            <Button onClick={this.activeCall}>Active call</Button>
                                            <Button onClick={this.logout}>Logout</Button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                                <Table bordered striped condensed hover>
                                    <thead>
                                    <tr>
                                        <th colSpan='2' className='thd'>Subscription</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                          <td>telephonyStatus</td>
                                          <td>{subRes && subRes.telephonyStatus}</td>
                                      </tr>
                                    <tr>
                                        <td>userStatus</td>
                                        <td>{ subRes && subRes.userStatus}</td>
                                    </tr>
                                    <tr>
                                        <td>time</td>
                                        <td>{callTime}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                                <Table bordered striped condensed hover>
                                    <thead>
                                    <tr>
                                        <th colSpan='2' className='thd'>Active Call List</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </Table>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>

                <Modal show={smsModalShow} backdrop={true} onHide={this.hideSmsModal}>
                    <Modal.Header>
                        <Modal.Title>
                         Message (Text)
                        </Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <form>
                                <FormGroup>
                                    <ControlLabel>To</ControlLabel>
                                    <FormControl
                                      type='text'
                                      ref={(textTo) => { this.textTo = textTo}}
                                      id='textTo'/>
                                    <ControlLabel>Content</ControlLabel>
                                    <FormControl
                                        componentClass='textarea'
                                    ref='msgText'
                                    id='msgText'/>
                                </FormGroup>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.hideSmsModal}>Cancel</Button>
                            <Button onClick={this.doSms}>Send</Button>
                        </Modal.Footer>

                </Modal>
                <Modal backdrop={true} show={recordShow} onHide={this.hideRecord}>
                    <Modal.Header>
                        <Modal.Title>
                            Call logs
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table striped bordered condensed hover>
                            <thead>
                              <tr>
                                  <td>Direction</td>
                                  <td>to</td>
                                  <td>type</td>
                                  <td>time</td>
                              </tr>
                            </thead>
                            <tbody>
                            {recordsTr}
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }

}
export default Call