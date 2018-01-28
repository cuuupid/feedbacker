import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import Camera from 'react-native-camera';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      looks: "Calibrating...",
      token: "", text: "", frameId: 1, set: false
    } // index by 1 because !frameId == !1 == 0 = true for first while 0 --> false
  }
  componentDidMount() {
    // hacking thru cDM because i can't be bothered to polyfill :0 soz
    if(this.state.set)
      this.timer = setInterval(() => this.notTakePicture(), 5 * 1000);
  }
  render() {
    return (
      <View style={styles.container}> 
        {
          (this.state.set && 
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            captureTarget={Camera.constants.CaptureTarget.memory}
            aspect={Camera.constants.Aspect.fill}>
            <Text style={styles.capture} onPress={() => this.notTakePicture()}>fam :3 we got dis</Text>
            <Text style={styles.capture}>{this.state.looks}</Text>
          </Camera>) ||
          <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
            <TextInput style={{width: 350}} placeholder={"event name"} value={this.state.text} onChangeText={(t) => { this.setState({text: t}) }} />
            <Button title={"Begin"} style={{width: 200, marginBottom: 200}} onPress={() => {
              this.timer = setInterval(() => this.notTakePicture(), 10 * 1000);
              this.setState({
                looks: this.state.looks,
                token: this.state.text, text: this.state.text, set: true
              })
            }}><Text>Begin</Text></Button>
          </View>
        }
      </View>
    );
  }
  notTakePicture() {
    console.log("Attempting to take picture")
    this.camera.capture({metadata: {}})
      .then((data) => {
        console.log(data)
        fetch('http://192.81.214.158:1337/emotion', {
          method: 'POST',
          body: JSON.stringify({data: data.data, whoami: 'iameveryone'}),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((s) => s.json()).then((d) => {
          console.log(d)
          let num = d.size
          let applause = d.applause
          delete d.size
          delete d.applause
          if (num > 0) {
            if (d.top2.length > 1)
              this.state.looks = num + " ppl, " + d.top2[0] + " & " + d.top2[1]
            else
              this.state.looks = num + " ppl, " + d.top2[0]
            delete d.top2
            let z = { size: num, emotions: d, applause: applause}
            fetch('http://192.81.214.158:6666/realtime', {
              method: 'POST',
              body: JSON.stringify({
                token: this.state.token,
                frameId: this.state.frameId,
                scores: z
              }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }).then((s) => console.log(s)).catch((a)=>console.log(a))
          }
          else {
            this.state.looks = "Don't see anyone :/"
          }
          this.setState({looks: this.state.looks, frameId: this.state.frameId + 1})
        })
      })
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
